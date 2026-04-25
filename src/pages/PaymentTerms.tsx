import React, { useState, useMemo } from "react";
import { Plus, Search, Pencil, Loader2, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { usePaymentTerms, useCreatePaymentTerm, useUpdatePaymentTerm, useDeletePaymentTerm } from "@/hooks/useApi";
import PaymentTermsForm from "@/components/PaymentTermsForm";
import type { PaymentTerms } from "@/services/api";

export default function PaymentTerms() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPaymentTerm, setEditingPaymentTerm] = useState<PaymentTerms | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // list (note: our hook returns plain array via select)
  const { data, isLoading, error } = usePaymentTerms();

  const createPaymentTerm = useCreatePaymentTerm();
  const updatePaymentTerm = useUpdatePaymentTerm();
  const deletePaymentTerm = useDeletePaymentTerm();
  const paymentTerms: PaymentTerms[] = data?.list ?? [];

  // derived stats like your Vendor page
  const total = data?.total ?? 0;

  // filter
  const filteredPaymentTerms = useMemo(() => {
    const list = Array.isArray(paymentTerms) ? paymentTerms : [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (pt) =>
        (pt.term ?? '').toLowerCase().includes(q) ||
        (pt.condition ?? '').toLowerCase().includes(q) ||
        String(pt.id).includes(searchTerm)
    );
  }, [paymentTerms, searchTerm]);

  // handlers
  const handleCreatePaymentTerm = async (payload: Omit<PaymentTerms, "id">) => {
    await createPaymentTerm.mutateAsync(payload);
    setShowCreateModal(false);
  };

  const handleEditPaymentTerm = async (payload: PaymentTerms) => {
    if (editingPaymentTerm) {
      await updatePaymentTerm.mutateAsync({ id: editingPaymentTerm.id, term: payload.term, condition: payload.condition });
      setEditingPaymentTerm(null);
    }
  };

  const handleDelete = (pt: PaymentTerms) => {
    deletePaymentTerm.mutate(pt.id);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingPaymentTerm(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader
          title="Payment Terms Management"
          subtitle="Manage payment terms for your invoices and orders"
          showCreateButton
          onCreateClick={() => setShowCreateModal(true)}
          createButtonText="Add New Payment Term"
        />

        {/* Stats (mirrors Vendors page style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Payment Terms</p>
              <p className="text-3xl font-bold text-primary">{total}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-green-600">{filteredPaymentTerms.length}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-blue-600">{filteredPaymentTerms.length}</p>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <div className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search payment terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">All Payment Terms</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-8">
                Failed to load payment terms. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Term ID</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaymentTerms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No payment terms found matching your search.' : 'No payment terms added yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPaymentTerms.map((pt) => (
                      <TableRow key={pt.id}>
                        <TableCell className="font-medium">{pt.id}</TableCell>
                        <TableCell>{pt.term}</TableCell>
                        <TableCell>{pt.condition}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPaymentTerm(pt)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(pt)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Modal */}
        {(showCreateModal || editingPaymentTerm) && (
          <PaymentTermsForm
            isOpen={showCreateModal || !!editingPaymentTerm}
            onClose={closeModal}
            onSubmit={editingPaymentTerm ? handleEditPaymentTerm : handleCreatePaymentTerm}
            initialData={editingPaymentTerm ?? undefined}
            mode={editingPaymentTerm ? 'edit' : 'create'}
          />
        )}
      </div>
    </Layout>
  );
}

