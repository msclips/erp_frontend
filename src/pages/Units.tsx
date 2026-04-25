// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import Layout from "@/components/Layout";
// import DashboardHeader from "@/components/DashboardHeader";
// import FilterBar from "@/components/FilterBar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import { useVendors, useCreateVendor, useUpdateVendor } from "@/hooks/useApi";
// import type { Vendor } from "@/services/api";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow
// } from "@/components/ui/table";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {MoreHorizontal,Edit,Trash} from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { config } from "@/config/env";

// interface Unit {
//     id: string;
//     name: string;
//     description: string;
// }


// const Units = () => {
//     const { toast } = useToast();
//     const navigate = useNavigate();
//     const [units, setUnits] = useState<Unit[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Filters
//     const [filters, setFilters] = useState({
//         search: "",
//     });

//     // Fetch Units
//     useEffect(() => {
//         const fetchUnits = async () => {
//             try {
//                 const res = await fetch(`${config.api.baseUrl}/unit/list`, {
//                     method: "get",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // if protected
//                     },
//                 });

//                 if (!res.ok) throw new Error("Failed to fetch units");

//                 const result = await res.json();
//                 setUnits(result.data || result); // Adjust depending on your backend response
//             } catch (err: any) {
//                 setError(err.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchUnits();
//     }, []);

//     // Apply Filters
//     const filteredUnits = useMemo(() => {
//         return units.filter((unit) => {
//             // search
//             if (filters.search) {
//                 const searchLower = filters.search.toLowerCase();
//                 if (
//                     !unit.name.toLowerCase().includes(searchLower)
//                 ) {
//                     return false;
//                 }
//             }
//             return true;
//         });
//     }, [filters, units]);

//     const clearFilters = () => {
//         setFilters({
//             search: "",
//         });
//     };

//     const handleEditUnit = (unit: Unit) => {
//         navigate(`/units/edit/${unit.id}`, { state: { unit } });
//     };
//     const handleDeleteUnit = async (unit: Unit) => {
//         try {
//             const res = await fetch(`${config.api.baseUrl}/unit/delete/${unit.id}`, {
//                 method: "DELETE",
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//                 },
//             });

//             const result = await res.json();

//             if (result.status === true) {
//                 toast({
//                     title: result.message,
//                 });

//                 setUnits((prevUnits) => prevUnits.filter((u) => u.id !== unit.id));
//             } else {
//                 toast({
//                     title: "Error",
//                     description: result.message || "Failed to delete unit.",
//                     variant: "destructive",
//                 });
//             }
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error.message || "Something went wrong.",
//                 variant: "destructive",
//             });
//         }
//     };


//     return (
//         <Layout currentPath="/units">
//             <DashboardHeader
//                 title="Units Management"
//                 showCreateButton
//                 createButtonText="New Unit"
//                 onCreateClick={() => navigate("/units/create")}
//             />

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Units List</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <FilterBar
//                         onSearchChange={(search) => setFilters({ ...filters, search })}
//                         // onStatusFilter={(status) => setFilters({ ...filters, status })}
//                         onClearFilters={clearFilters}
//                         // type="units"
//                         activeFilters={filters}
//                     />

//                     <div className="mt-6">
//                         {isLoading ? (
//                             <div className="text-center py-8">Loading units...</div>
//                         ) : error ? (
//                             <div className="text-center py-8 text-destructive">
//                                 {error}
//                             </div>
//                         ) : (
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>Name</TableHead>
//                                         <TableHead>Description</TableHead>
//                                         <TableHead className="w-[50px]"></TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {filteredUnits.length === 0 ? (
//                                         <TableRow>
//                                             <TableCell
//                                                 colSpan={4}
//                                                 className="text-center py-8 text-muted-foreground"
//                                             >
//                                                 No units found
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : (
//                                         filteredUnits.map((unit) => (
//                                             <TableRow key={unit.id}>
//                                                 <TableCell className="font-medium">{unit.name}</TableCell>
//                                                 <TableCell className="font-medium">{unit.description}</TableCell>
//                                                 <TableCell>
//                                                     <DropdownMenu>
//                                                         <DropdownMenuTrigger asChild>
//                                                             <Button variant="ghost" size="icon">
//                                                                 <MoreHorizontal className="h-4 w-4" />
//                                                             </Button>
//                                                         </DropdownMenuTrigger>
//                                                         <DropdownMenuContent align="end">
//                                                             <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
//                                                                 <Edit className="mr-2 h-4 w-4" />
//                                                                 Edit Unit
//                                                             </DropdownMenuItem>
//                                                             <DropdownMenuItem onClick={() => handleDeleteUnit(unit)}>
//                                                                 <Trash className="mr-2 h-4 w-4 text-red-500" />
//                                                                 Delete Unit
//                                                             </DropdownMenuItem>
//                                                         </DropdownMenuContent>
//                                                     </DropdownMenu>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         )}
//                     </div>
//                 </CardContent>
//             </Card>
//         </Layout>
//     );
// };
// src/pages/Units.tsx




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
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from "@/hooks/useApi";
import UnitForm from "@/components/UnitForm";
import type { Unit } from "@/services/api";

export default function Units() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // list (note: our hook returns plain array via select)
const { data, isLoading, error } = useUnits();


  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();
  const units: Unit[] = data?.list ?? [];

  // derived stats like your Vendor page
const total = data?.total ?? 0;

  // filter
const filteredUnits = useMemo(() => {
  const list = Array.isArray(units) ? units : [];
  if (!searchTerm) return list;
  const q = searchTerm.toLowerCase();
  return list.filter(
    (u) =>
      (u.name ?? '').toLowerCase().includes(q) ||
      (u.description ?? '').toLowerCase().includes(q) ||
      String(u.id).includes(searchTerm)
  );
}, [units, searchTerm]);

  // handlers
  const handleCreateUnit = async (payload: Omit<Unit, "id">) => {
    await createUnit.mutateAsync(payload);
    setShowCreateModal(false);
  };

  const handleEditUnit = async (payload: Unit) => {
    if (editingUnit) {
      await updateUnit.mutateAsync({ id: editingUnit.id, name: payload.name, description: payload.description });
      setEditingUnit(null);
    }
  };

  const handleDelete = (u: Unit) => {
    deleteUnit.mutate(u.id);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingUnit(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader
          title="Unit Management"
          subtitle="Manage measurement units used across your documents"
          showCreateButton
          onCreateClick={() => setShowCreateModal(true)}
          createButtonText="Add New Unit"
        />

        {/* Stats (mirrors Vendors page style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              <p className="text-3xl font-bold text-primary">{total}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-green-600">{filteredUnits.length}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-blue-600">{filteredUnits.length}</p>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <div className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search units..."
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
            <h3 className="text-lg font-semibold mb-4">All Units</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-8">
                Failed to load units. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No units found matching your search.' : 'No units added yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUnits.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.id}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.description}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUnit(u)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(u)}
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
        {(showCreateModal || editingUnit) && (
          <UnitForm
            isOpen={showCreateModal || !!editingUnit}
            onClose={closeModal}
            onSubmit={editingUnit ? handleEditUnit : handleCreateUnit}
            initialData={editingUnit ?? undefined}
            mode={editingUnit ? 'edit' : 'create'}
          />
        )}
      </div>
    </Layout>
  );
}
