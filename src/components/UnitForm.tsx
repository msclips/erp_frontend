// src/components/UnitForm.tsx
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Unit } from '@/services/api';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Unit, 'id'> | Unit) => Promise<void> | void;
  initialData?: Unit | null;
  mode?: 'create' | 'edit';
};

export default function UnitForm({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: Props) {
  const [name, setName] = React.useState(initialData?.name ?? '');
  const [description, setDescription] = React.useState(initialData?.description ?? '');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setName(initialData?.name ?? '');
    setDescription(initialData?.description ?? '');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'edit' && initialData) {
        await onSubmit({ ...initialData, name, description });
      } else {
        await onSubmit({ name, description } as Omit<Unit, 'id'>);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Unit' : 'Add New Unit'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit-name">Name</Label>
            <Input
              id="unit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., PCS, KG, LTR"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit-desc">Description</Label>
            <Input
              id="unit-desc"
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
