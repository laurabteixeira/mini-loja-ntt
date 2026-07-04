import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createCategory, listCategories } from '../../services/categories';
import { ApiError } from '../../services/api';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '../../services/products';
import type { Category } from '../../types/category';

interface FormState {
  name: string;
  description: string;
  price: string;
  categoryId: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  categoryId?: string;
}

const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
};

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Nome é obrigatório.';
  }

  if (!values.description.trim()) {
    errors.description = 'Descrição é obrigatória.';
  }

  const price = Number(values.price);
  if (!values.price.trim() || Number.isNaN(price) || price <= 0) {
    errors.price = 'Informe um preço válido maior que zero.';
  }

  if (!values.categoryId) {
    errors.categoryId = 'Selecione uma categoria.';
  }

  return errors;
}

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id ? Number(id) : null;
  const isEditing = productId !== null && !Number.isNaN(productId);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

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

  function handleChange(
    field: keyof FormState,
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  }

  async function handleCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) {
      return;
    }

    setCreatingCategory(true);
    setSubmitError(null);

    try {
      const category = await createCategory(name);
      setCategories((current) => [...current, category]);
      setForm((current) => ({ ...current, categoryId: String(category.id) }));
      setNewCategoryName('');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível criar a categoria.';
      setSubmitError(message);
    } finally {
      setCreatingCategory(false);
    }
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

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      categoryId: Number(form.categoryId),
    };

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
    return (
      <section>
        <p className="text-gray-600" role="status">
          Carregando formulário...
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Voltar para produtos
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-semibold">
        {isEditing ? `Editar produto #${productId}` : 'Novo produto'}
      </h1>

      {submitError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-md border border-gray-200 bg-white p-6"
        noValidate
      >
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={(event) =>
              handleChange('description', event.target.value)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Preço
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(event) => handleChange('price', event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="mb-1 block text-sm font-medium"
          >
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={(event) =>
              handleChange('categoryId', event.target.value)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
          )}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Nova categoria"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={creatingCategory || !newCategoryName.trim()}
              onClick={() => void handleCreateCategory()}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creatingCategory ? 'Criando...' : 'Criar categoria'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar produto'}
          </button>
          <Link
            to="/"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
