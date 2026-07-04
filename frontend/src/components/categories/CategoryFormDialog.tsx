import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialName?: string;
  submitting?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
}

export function CategoryFormDialog({
  open,
  mode,
  initialName = '',
  submitting = false,
  error = null,
  onOpenChange,
  onSubmit,
}: CategoryFormDialogProps) {
  const [name, setName] = useState(initialName);
  const isEditing = mode === 'edit';

  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar categoria' : 'Nova categoria'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Atualize o nome da categoria abaixo.'
                : 'Informe o nome da nova categoria.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="category-name" className="mb-2 block">
              Nome
            </Label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Eletrônicos"
              autoFocus
            />
            {error && (
              <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting
                ? 'Salvando...'
                : isEditing
                  ? 'Salvar'
                  : 'Criar categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
