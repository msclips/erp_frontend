import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Package, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItems, useDeleteItem } from "@/hooks/useApi";
import type { Item } from "@/services/api";

const Item = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    
    // Filters
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        taxStatus: "",
    });

    // Fetch Items using new hooks
    const { data, isLoading, error } = useItems();
    const deleteItem = useDeleteItem();
    const items: Item[] = data?.list ?? [];

    // Apply Filters
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // search
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (
                    !item.name.toLowerCase().includes(searchLower) &&
                    !item.code.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            // type filter
            if (filters.type) {
                const itemType = item.type === 1 ? 'item' : 'service';
                if (itemType !== filters.type) {
                    return false;
                }
            }

            // tax status filter
            if (filters.taxStatus && item.tax_status !== undefined) {
                const taxStatus = item.tax_status === 1 ? 'taxable' : 'exempt';
                if (taxStatus !== filters.taxStatus) {
                    return false;
                }
            }

            return true;
        });
    }, [filters, items]);

    const clearFilters = () => {
        setFilters({
            search: "",
            type: "",
            taxStatus: "",
        });
    };

    const handleEditItem = (item: Item) => {
        navigate(`/item/edit/${item.id}`, { state: { item } });
    };

    const handleDeleteItem = async (item: Item) => {
        if (!confirm(`Are you sure you want to delete ${item.name}?`)) {
            return;
        }
        deleteItem.mutate(item.id);
    };


    return (
        <Layout currentPath="/item">
            <DashboardHeader
                title="Items & Services Management"
                showCreateButton
                createButtonText="New Item/Service"
                onCreateClick={() => navigate("/item/create")}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Items & Services List </CardTitle>
                </CardHeader>
                <CardContent>
                    <FilterBar
                        onSearchChange={(search) => setFilters({ ...filters, search })}
                        onClearFilters={clearFilters}
                        activeFilters={filters}
                    />
                    


                    <div className="mt-6">
                        {isLoading ? (
                            <div className="text-center py-8">Loading items...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-destructive">
                                Failed to fetch items. Please try again.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No items found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {item.code}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.type === 1 ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                            <Package className="w-3 h-3 mr-1" />
                                                            Item
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                            <Wrench className="w-3 h-3 mr-1" />
                                                            Service
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.unit?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    ₹{parseFloat(String(item.selling_price || 0)).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.type === 1 && item.opening_stock !== undefined ? (
                                                        <span className={item.opening_stock <= (item.minimum_stock_level || 0) ? 'text-red-600 font-semibold' : ''}>
                                                            {item.opening_stock}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit {item.type === 2 ? 'Service' : 'Item'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDeleteItem(item)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete {item.type === 2 ? 'Service' : 'Item'}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Item;
