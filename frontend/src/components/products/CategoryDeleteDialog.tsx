import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CategoryDeleteDialogProps {
  open: boolean;
  mode: 'confirm' | 'blocked';
  categoryName: string;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export function CategoryDeleteDialog({
  open,
  mode,
  categoryName,
  deleting = false,
  onOpenChange,
  onConfirm,
}: CategoryDeleteDialogProps) {
  const isBlocked = mode === 'blocked';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isBlocked ? 'Não é possível excluir' : 'Excluir categoria?'}
          </DialogTitle>
          <DialogDescription>
            {isBlocked
              ? 'Essa categoria não pode ser deletada pois há produtos associados.'
              : `Tem certeza que deseja excluir "${categoryName}"? Esta ação não pode ser desfeita.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {isBlocked ? (
            <Button type="button" onClick={() => onOpenChange(false)}>
              Entendi
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={deleting}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                onClick={onConfirm}
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
