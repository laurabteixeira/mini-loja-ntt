import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ProductFormFields,
  type ProductFormFieldErrors,
  type ProductFormValues,
} from '@/components/products/ProductFormFields';
import { ProductFormPreview } from '@/components/products/ProductFormPreview';
import { ProductFormSkeleton } from '@/components/products/ProductFormSkeleton';
import { Card } from '@/components/ui/card';
import { CATEGORIES_CHANGED_EVENT } from '@/lib/category-events';
import { listCategories } from '@/services/categories';
import { ApiError } from '@/services/api';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '@/services/products';
import type { Category } from '@/types/category';

import { FIELD_LIMITS } from '@/lib/field-limits';

const emptyForm: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  imageUrl: '',
};

function validateForm(values: ProductFormValues): ProductFormFieldErrors {
  const errors: ProductFormFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Nome é obrigatório.';
  } else if (values.name.trim().length > FIELD_LIMITS.productName) {
    errors.name = `O nome deve ter no máximo ${FIELD_LIMITS.productName} caracteres.`;
  }

  if (!values.description.trim()) {
    errors.description = 'Descrição é obrigatória.';
  } else if (values.description.trim().length > FIELD_LIMITS.productDescription) {
    errors.description = `A descrição deve ter no máximo ${FIELD_LIMITS.productDescription} caracteres.`;
  }

  const price = Number(values.price);
  if (!values.price.trim() || Number.isNaN(price) || price <= 0) {
    errors.price = 'Informe um preço válido maior que zero.';
  } else if (price > FIELD_LIMITS.productPriceMax) {
    errors.price = `O preço não pode exceder R$ ${FIELD_LIMITS.productPriceMax.toLocaleString('pt-BR')}.`;
  }

  if (!values.categoryId) {
    errors.categoryId = 'Selecione uma categoria.';
  }

  const imageUrl = values.imageUrl.trim();
  if (imageUrl) {
    if (imageUrl.length > FIELD_LIMITS.productImageUrl) {
      errors.imageUrl = `A URL deve ter no máximo ${FIELD_LIMITS.productImageUrl} caracteres.`;
    } else {
      try {
        new URL(imageUrl);
      } catch {
        errors.imageUrl = 'Informe uma URL válida.';
      }
    }
  }

  return errors;
}

function buildPayload(form: ProductFormValues) {
  const imageUrl = form.imageUrl.trim();

  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    categoryId: Number(form.categoryId),
    ...(imageUrl ? { imageUrl } : {}),
  };
}

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id ? Number(id) : null;
  const isEditing = productId !== null && !Number.isNaN(productId);

  const [form, setForm] = useState<ProductFormValues>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<ProductFormFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const categoriesResponse = await listCategories();
        if (cancelled) {
          return;
        }

        setCategories(categoriesResponse);

        if (isEditing && productId) {
          const product = await getProduct(productId);
          if (cancelled) {
            return;
          }

          setForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            categoryId: String(product.categoryId),
            imageUrl: product.imageUrl ?? '',
          });
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof ApiError
            ? err.message
            : 'Não foi possível carregar os dados do formulário.';
        setSubmitError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [isEditing, productId]);

  useEffect(() => {
    async function reloadCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
        setForm((current) => {
          if (!current.categoryId) {
            return current;
          }

          const exists = data.some(
            (category) => String(category.id) === current.categoryId,
          );

          return exists ? current : { ...current, categoryId: '' };
        });
      } catch {
        setCategories([]);
      }
    }

    function handleCategoriesChanged() {
      void reloadCategories();
    }

    window.addEventListener(CATEGORIES_CHANGED_EVENT, handleCategoriesChanged);

    return () => {
      window.removeEventListener(
        CATEGORIES_CHANGED_EVENT,
        handleCategoriesChanged,
      );
    };
  }, []);

  function handleChange(field: keyof ProductFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload = buildPayload(form);

    try {
      const product =
        isEditing && productId
          ? await updateProduct(productId, payload)
          : await createProduct(payload);

      navigate(`/products/${product.id}`);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível salvar o produto.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <ProductFormSkeleton />;
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
          {isEditing ? 'Editar produto' : 'Novo produto'}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {isEditing
            ? 'Atualize as informações abaixo para manter o catálogo em dia.'
            : 'Preencha as informações abaixo para adicionar um item ao catálogo.'}
        </p>
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <ProductFormFields
              form={form}
              errors={errors}
              categories={categories}
              submitting={submitting}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </Card>

          <ProductFormPreview
            name={form.name}
            description={form.description}
            imageUrl={form.imageUrl}
          />
        </div>
      </form>
    </section>
  );
}
