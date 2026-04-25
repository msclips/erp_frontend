// src/components/ChartOfAccountForm.tsx
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccountTypeAutocomplete } from '@/hooks/useApi';
import type { ChartOfAccount, AccountType } from '@/services/api';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<ChartOfAccount, 'id'> | ChartOfAccount) => Promise<void> | void;
  initialData?: ChartOfAccount | null;
  mode?: 'create' | 'edit';
};

export default function ChartOfAccountForm({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: Props) {
  const [name, setName] = React.useState(initialData?.name ?? '');
  const [accountTypeId, setAccountTypeId] = React.useState(initialData?.account_type_id?.toString() ?? '');
  const [submitting, setSubmitting] = React.useState(false);

  // Only fetch account types when modal is open
  const { data: accountTypes, isLoading: loadingAccountTypes, error: accountTypesError, refetch } = useAccountTypeAutocomplete();

  React.useEffect(() => {
    setName(initialData?.name ?? '');
    setAccountTypeId(initialData?.account_type_id?.toString() ?? '');
  }, [initialData, isOpen]);

  // Trigger API call when modal opens
  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'edit' && initialData) {
        await onSubmit({ ...initialData, name, account_type_id: parseInt(accountTypeId) });
      } else {
        await onSubmit({ name, account_type_id: parseInt(accountTypeId) } as Omit<ChartOfAccount, 'id'>);
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
          <DialogTitle>{mode === 'edit' ? 'Edit Chart of Account' : 'Add New Chart of Account'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chartofaccount-name">Account Name</Label>
            <Input
              id="chartofaccount-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cash, Accounts Receivable"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chartofaccount-accounttype">Account Type</Label>
            <Select value={accountTypeId} onValueChange={setAccountTypeId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {loadingAccountTypes ? (
                  <SelectItem value="loading" disabled>Loading account types...</SelectItem>
                ) : accountTypesError ? (
                  <SelectItem value="error" disabled>Error loading account types</SelectItem>
                ) : accountTypes && accountTypes.length > 0 ? (
                  accountTypes.map((accountType: AccountType) => (
                    <SelectItem key={accountType.id} value={accountType.id.toString()}>
                      {accountType.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>No account types available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {accountTypesError && (
              <p className="text-red-500 text-sm">Failed to load account types. Please try again.</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !accountTypeId}>
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Chart of Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
