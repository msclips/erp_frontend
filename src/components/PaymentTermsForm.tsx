// src/components/PaymentTermsForm.tsx
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PaymentTerms } from '@/services/api';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<PaymentTerms, 'id'> | PaymentTerms) => Promise<void> | void;
  initialData?: PaymentTerms | null;
  mode?: 'create' | 'edit';
};

export default function PaymentTermsForm({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: Props) {
  const [term, setTerm] = React.useState(initialData?.term ?? '');
  const [condition, setCondition] = React.useState(initialData?.condition ?? '');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setTerm(initialData?.term ?? '');
    setCondition(initialData?.condition ?? '');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'edit' && initialData) {
        await onSubmit({ ...initialData, term, condition });
      } else {
        await onSubmit({ term, condition } as Omit<PaymentTerms, 'id'>);
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
          <DialogTitle>{mode === 'edit' ? 'Edit Payment Term' : 'Add New Payment Term'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentterm-term">Term</Label>
            <Input
              id="paymentterm-term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g., Net 30, Due on Receipt"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentterm-condition">Condition</Label>
            <Input
              id="paymentterm-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., 30 days, Immediate"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Payment Term'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

