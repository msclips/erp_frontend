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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash, Package, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItems, useDeleteItem } from "@/hooks/useApi";
import type { Item } from "@/services/api";

const ItemList = () => {
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

    const getTypeIcon = (type: string) => {
        return type === 'service' ? <Wrench className="w-4 h-4" /> : <Package className="w-4 h-4" />;
    };

    const getTypeBadge = (type: string) => {
        return type === 'service' ? (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Wrench className="w-3 h-3 mr-1" />
                Service
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Package className="w-3 h-3 mr-1" />
                Item
            </Badge>
        );
    };

    const getTaxStatusBadge = (status: string) => {
        switch (status) {
            case 'taxable':
                return <Badge variant="default" className="bg-green-100 text-green-800">Taxable</Badge>;
            case 'exempt':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Exempt</Badge>;
            case 'non-gst':
                return <Badge variant="outline" className="bg-gray-100 text-gray-800">Non-GST</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Layout currentPath="/item">
            <DashboardHeader
                title="Items & Services Management"
                showCreateButton
                createButtonText="New Item/Service"
                onCreateClick={() => navigate("/item")}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Items & Services List</CardTitle>
                </CardHeader>
                <CardContent>
                    <FilterBar
                        onSearchChange={(search) => setFilters({ ...filters, search })}
                        onClearFilters={clearFilters}
                        activeFilters={filters}
                        additionalFilters={
                            <div className="flex gap-4">
                                <select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                    <option value="">All Types</option>
                                    <option value="item">Items</option>
                                    <option value="service">Services</option>
                                </select>
                                <select
                                    value={filters.taxStatus}
                                    onChange={(e) => setFilters({ ...filters, taxStatus: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                    <option value="">All Tax Status</option>
                                    <option value="taxable">Taxable</option>
                                    <option value="exempt">Exempt</option>
                                    <option value="non-gst">Non-GST</option>
                                </select>
                            </div>
                        }
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
                                        <TableHead>Tax Status</TableHead>
                                        <TableHead>GST Rate</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
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
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                            <Package className="w-3 h-3 mr-1" />
                                                            Item
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                            <Wrench className="w-3 h-3 mr-1" />
                                                            Service
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.unit?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    ₹{item.selling_price.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.tax_status === 1 ? (
                                                        <Badge variant="default" className="bg-green-100 text-green-800">Taxable</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Exempt</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.gst_rate && item.gst_rate > 0 ? `${item.gst_rate}%` : 'N/A'}
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

export default ItemList;
