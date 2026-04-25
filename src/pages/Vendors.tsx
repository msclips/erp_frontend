import React, { useState, useMemo } from "react";
import { Plus, Search, Pencil, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VendorForm from "@/components/VendorForm";
import { useVendors, useCreateVendor, useUpdateVendor } from "@/hooks/useApi";
import type { Vendor } from "@/services/api";

export default function Vendors() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, error } = useVendors();
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  
  console.log('🔥 Vendors page - Raw data:', data);
  
  // Handle both possible data structures: data?.vendors (from hook) or data?.data?.vendors or data?.data?.data
  const vendors = data?.vendors || data?.data?.vendors || data?.data?.data || [];
  
  console.log('🔥 Vendors page - Extracted vendors:', vendors);

  // Filter vendors based on search term
  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;
    
    return vendors.filter((vendor) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        vendor.company_name?.toLowerCase().includes(searchLower) ||
        vendor.first_name?.toLowerCase().includes(searchLower) ||
        vendor.last_name?.toLowerCase().includes(searchLower) ||
        vendor.email?.toLowerCase().includes(searchLower) ||
        vendor.phone?.toString().includes(searchTerm) ||
        vendor.vendor_id?.toLowerCase().includes(searchLower)
      );
    });
  }, [vendors, searchTerm]);

  const handleCreateVendor = async (vendorData: Vendor) => {
    await createVendor.mutateAsync(vendorData);
    setShowCreateModal(false);
  };

  const handleEditVendor = async (vendorData: any) => {
    console.log('🔥 handleEditVendor - Received vendorData:', vendorData);
    if (editingVendor) {
      // Pass the entire payload with ID included
      await updateVendor.mutateAsync(vendorData);
      setEditingVendor(null);
    }
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingVendor(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader
          title="Vendor Management"
          subtitle="Manage vendor information and relationships"
          showCreateButton
          onCreateClick={() => setShowCreateModal(true)}
          createButtonText="Add New Vendor"
        />

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
              <p className="text-3xl font-bold text-primary">{data?.data?.total || 0}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active Vendors</p>
              <p className="text-3xl font-bold text-green-600">{vendors.length}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-blue-600">{vendors.length}</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Vendors Table */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">All Vendors</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-8">
                Failed to load vendors. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No vendors found matching your search.' : 'No vendors added yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.vendor_id || `V-${vendor.id}`}</TableCell>
                        <TableCell>{vendor.company_name}</TableCell>
                        <TableCell>{`${vendor.first_name} ${vendor.last_name}`}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>{vendor.phone}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditModal(vendor)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
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

        {/* Vendor Form Modal */}
        {(showCreateModal || editingVendor) && (
          <VendorForm
            isOpen={showCreateModal || !!editingVendor}
            onClose={closeModal}
            onSubmit={editingVendor ? handleEditVendor : handleCreateVendor}
            initialData={editingVendor}
            mode={editingVendor ? 'edit' : 'create'}
          />
        )}
      </div>
    </Layout>
  );
}