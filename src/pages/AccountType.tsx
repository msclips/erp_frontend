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
import { useAccountTypes, useCreateAccountType, useUpdateAccountType, useDeleteAccountType } from "@/hooks/useApi";
import AccountTypeForm from "@/components/AccountTypeForm";
import type { AccountType } from "@/services/api";


export default function AccountTypes() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAccountType, setEditingAccountType] = useState<AccountType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // list (note: our hook returns plain array via select)
  const { data, isLoading, error } = useAccountTypes();

  const createAccountType = useCreateAccountType();
  const updateAccountType = useUpdateAccountType();
  const deleteAccountType = useDeleteAccountType();
  const accountTypes: AccountType[] = data?.list ?? [];

  // derived stats like your Vendor page
  const total = data?.total ?? 0;

  // filter
  const filteredAccountTypes = useMemo(() => {
    const list = Array.isArray(accountTypes) ? accountTypes : [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (at) =>
        (at.name ?? '').toLowerCase().includes(q) ||
        String(at.id).includes(searchTerm)
    );
  }, [accountTypes, searchTerm]);

  // handlers
  const handleCreateAccountType = async (payload: Omit<AccountType, "id">) => {
    await createAccountType.mutateAsync(payload);
    setShowCreateModal(false);
  };

  const handleEditAccountType = async (payload: AccountType) => {
    if (editingAccountType) {
      await updateAccountType.mutateAsync({ id: editingAccountType.id, name: payload.name });
      setEditingAccountType(null);
    }
  };

  const handleDelete = (at: AccountType) => {
    deleteAccountType.mutate(at.id);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingAccountType(null);
  };


  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader
          title="Account Type Management"
          subtitle="Manage account types used in your chart of accounts"
          showCreateButton
          onCreateClick={() => setShowCreateModal(true)}
          createButtonText="Add New Account Type"
        />

        {/* Stats (mirrors Vendors page style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Account Types</p>
              <p className="text-3xl font-bold text-primary">{total}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-green-600">{filteredAccountTypes.length}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-blue-600">{filteredAccountTypes.length}</p>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <div className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search account types..."
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
            <h3 className="text-lg font-semibold mb-4">All Account Types</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-8">
                Failed to load account types. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Type ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccountTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No account types found matching your search.' : 'No account types added yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccountTypes.map((at) => (
                      <TableRow key={at.id}>
                        <TableCell className="font-medium">{at.id}</TableCell>
                        <TableCell>{at.name}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingAccountType(at)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(at)}
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
        {(showCreateModal || editingAccountType) && (
          <AccountTypeForm
            isOpen={showCreateModal || !!editingAccountType}
            onClose={closeModal}
            onSubmit={editingAccountType ? handleEditAccountType : handleCreateAccountType}
            initialData={editingAccountType ?? undefined}
            mode={editingAccountType ? 'edit' : 'create'}
          />
        )}
      </div>
    </Layout>
  );
}
