import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FIELD_LIMITS } from '@/lib/field-limits';
import type { Category } from '@/types/category';

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
}

export interface ProductFormFieldErrors {
  name?: string;
  description?: string;
  price?: string;
  categoryId?: string;
  imageUrl?: string;
}

interface ProductFormFieldsProps {
  form: ProductFormValues;
  errors: ProductFormFieldErrors;
  categories: Category[];
  submitting: boolean;
  isEditing: boolean;
  onChange: (field: keyof ProductFormValues, value: string) => void;
}

const selectClassName =
  'flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export function ProductFormFields({
  form,
  errors,
  categories,
  submitting,
  isEditing,
  onChange,
}: ProductFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="mb-2 block">
          Nome do produto
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: Fone Sonic Pro Z1"
          maxLength={FIELD_LIMITS.productName}
          value={form.name}
          onChange={(event) => onChange('name', event.target.value)}
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="mb-2 block">
          Descrição
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descreva o produto..."
          maxLength={FIELD_LIMITS.productDescription}
          value={form.description}
          onChange={(event) => onChange('description', event.target.value)}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Um resumo claro do produto (até {FIELD_LIMITS.productDescription} caracteres).
        </p>
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="categoryId" className="mb-2 block">
            Categoria
          </Label>
          <div className="relative">
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={(event) => onChange('categoryId', event.target.value)}
              className={cn(selectClassName, 'pr-9')}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
          {errors.categoryId && (
            <p className="mt-1.5 text-sm text-red-600">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price" className="mb-2 block">
            Preço (R$)
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0.01"
            max={FIELD_LIMITS.productPriceMax}
            step="0.01"
            placeholder="0"
            value={form.price}
            onChange={(event) => onChange('price', event.target.value)}
          />
          {errors.price && (
            <p className="mt-1.5 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl" className="mb-2 block">
          URL da imagem
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          maxLength={FIELD_LIMITS.productImageUrl}
          value={form.imageUrl}
          onChange={(event) => onChange('imageUrl', event.target.value)}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Opcional. Deixe em branco para usar a imagem padrão.
        </p>
        {errors.imageUrl && (
          <p className="mt-1.5 text-sm text-red-600">{errors.imageUrl}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <Button asChild variant="ghost" type="button">
          <Link to="/">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? 'Salvando...'
            : isEditing
              ? 'Salvar'
              : 'Criar produto'}
        </Button>
      </div>
    </div>
  );
}
