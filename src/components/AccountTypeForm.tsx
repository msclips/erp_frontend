// src/components/AccountTypeForm.tsx
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AccountType } from '@/services/api';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<AccountType, 'id'> | AccountType) => Promise<void> | void;
  initialData?: AccountType | null;
  mode?: 'create' | 'edit';
};

export default function AccountTypeForm({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: Props) {
  const [name, setName] = React.useState(initialData?.name ?? '');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setName(initialData?.name ?? '');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'edit' && initialData) {
        await onSubmit({ ...initialData, name });
      } else {
        await onSubmit({ name } as Omit<AccountType, 'id'>);
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
          <DialogTitle>{mode === 'edit' ? 'Edit Account Type' : 'Add New Account Type'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accounttype-name">Name</Label>
            <Input
              id="accounttype-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Asset, Liability, Equity"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Account Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
