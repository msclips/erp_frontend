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
import { useChartOfAccounts, useCreateChartOfAccount, useUpdateChartOfAccount, useDeleteChartOfAccount } from "@/hooks/useApi";
import ChartOfAccountForm from "@/components/ChartOfAccountForm";
import type { ChartOfAccount } from "@/services/api";

export default function ChartOfAccount() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChartOfAccount, setEditingChartOfAccount] = useState<ChartOfAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // list (note: our hook returns plain array via select)
  const { data, isLoading, error } = useChartOfAccounts();

  const createChartOfAccount = useCreateChartOfAccount();
  const updateChartOfAccount = useUpdateChartOfAccount();
  const deleteChartOfAccount = useDeleteChartOfAccount();
  const chartOfAccounts: ChartOfAccount[] = data?.list ?? [];

  // derived stats like your Vendor page
  const total = data?.total ?? 0;

  // filter
  const filteredChartOfAccounts = useMemo(() => {
    const list = Array.isArray(chartOfAccounts) ? chartOfAccounts : [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (coa) =>
        (coa.name ?? '').toLowerCase().includes(q) ||
        (coa.account_type?.name ?? '').toLowerCase().includes(q) ||
        String(coa.id).includes(searchTerm)
    );
  }, [chartOfAccounts, searchTerm]);

  // handlers
  const handleCreateChartOfAccount = async (payload: Omit<ChartOfAccount, "id">) => {
    await createChartOfAccount.mutateAsync(payload);
    setShowCreateModal(false);
  };

  const handleEditChartOfAccount = async (payload: ChartOfAccount) => {
    if (editingChartOfAccount) {
      await updateChartOfAccount.mutateAsync({ 
        id: editingChartOfAccount.id, 
        name: payload.name, 
        account_type_id: payload.account_type_id 
      });
      setEditingChartOfAccount(null);
    }
  };

  const handleDelete = (coa: ChartOfAccount) => {
    deleteChartOfAccount.mutate(coa.id);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingChartOfAccount(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader
          title="Chart of Accounts Management"
          subtitle="Manage your chart of accounts for financial reporting"
          showCreateButton
          onCreateClick={() => setShowCreateModal(true)}
          createButtonText="Add New Account"
        />

        {/* Stats (mirrors Vendors page style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Accounts</p>
              <p className="text-3xl font-bold text-primary">{total}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-green-600">{filteredChartOfAccounts.length}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-blue-600">{filteredChartOfAccounts.length}</p>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <div className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search chart of accounts..."
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
            <h3 className="text-lg font-semibold mb-4">All Chart of Accounts</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-8">
                Failed to load chart of accounts. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account ID</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChartOfAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No accounts found matching your search.' : 'No accounts added yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredChartOfAccounts.map((coa) => (
                      <TableRow key={coa.id}>
                        <TableCell className="font-medium">{coa.id}</TableCell>
                        <TableCell>{coa.name}</TableCell>
                        <TableCell>{coa.account_type?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingChartOfAccount(coa)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(coa)}
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
        {(showCreateModal || editingChartOfAccount) && (
          <ChartOfAccountForm
            isOpen={showCreateModal || !!editingChartOfAccount}
            onClose={closeModal}
            onSubmit={editingChartOfAccount ? handleEditChartOfAccount : handleCreateChartOfAccount}
            initialData={editingChartOfAccount ?? undefined}
            mode={editingChartOfAccount ? 'edit' : 'create'}
          />
        )}
      </div>
    </Layout>
  );
}

