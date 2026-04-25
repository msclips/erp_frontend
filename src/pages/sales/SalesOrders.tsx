import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSalesOrders, useDeleteSalesOrder } from "@/hooks/useApi";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import FilterBar from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Package,
    Eye,
    Edit,
    MoreHorizontal,
    Truck,
    Mail,
    Trash2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusColor = (status: string) => {
    switch (status) {
        case "delivered":
            return "bg-success text-success-foreground";
        case "shipped":
            return "bg-info text-info-foreground";
        case "processing":
            return "bg-warning text-warning-foreground";
        case "pending":
            return "bg-muted text-muted-foreground";
        default:
            return "bg-secondary text-secondary-foreground";
    }
};

const SalesOrders = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { mutate: deleteOrder } = useDeleteSalesOrder();
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useSalesOrders(page);
    const salesOrders = data?.list || [];
    const totalPages = Math.ceil((data?.total || 0) / 10);
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
        amountRange: { min: undefined as number | undefined, max: undefined as number | undefined },
    });

    const stats = useMemo(() => {
        return {
            totalSales: salesOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0),
            activeOrders: salesOrders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length,
            pendingShipments: salesOrders.filter((o: any) => o.status === 'processing' || o.status === 'pending').length,
            avgOrderValue: salesOrders.length ? salesOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0) / salesOrders.length : 0
        };
    }, [salesOrders]);

    const filteredOrders = useMemo(() => {
        return salesOrders.filter((order: any) => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const orderNo = order.sales_order_no || "";
                const customerName = order.customer?.display_name || "";
                if (
                    !orderNo.toLowerCase().includes(searchLower) &&
                    !customerName.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            if (filters.status !== "all" && order.status !== filters.status) {
                return false;
            }

            return true;
        });
    }, [salesOrders, filters]);

    const handleViewOrder = (order: any) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleDeleteOrder = (id: number) => {
        if (window.confirm("Are you sure you want to delete this sales order?")) {
            deleteOrder(id);
        }
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
            dateRange: { from: undefined, to: undefined },
            amountRange: { min: undefined, max: undefined },
        });
    };

    return (
        <Layout currentPath="/sales/orders">
            <DashboardHeader
                title="Sales Orders"
                subtitle="Track and manage confirmed sales orders"
                showCreateButton
                createButtonText="New Sales Order"
                onCreateClick={() => navigate("/sales/orders/create")}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Sales
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ₹{stats.totalSales.toLocaleString()}
                        </div>
                        <p className="text-xs text-success">+18.2% vs last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.activeOrders}</div>
                        <p className="text-xs text-success">+12 new orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Shipments
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.pendingShipments}</div>
                        <p className="text-xs text-warning">Awaiting action</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg Order Value
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ₹{stats.avgOrderValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-success">+5.3% vs last month</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <select
                            className="px-3 py-2 border border-border rounded-md bg-background"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>

                    <div className="mt-6">
                        {isLoading ? (
                            <div className="text-center py-8">Loading sales orders...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-destructive">
                                Error loading sales orders.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order#</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No orders found matching your filters
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order: any) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium text-primary hover:underline cursor-pointer" onClick={() => handleViewOrder(order)}>
                                                    {order.sales_order_no}
                                                </TableCell>
                                                <TableCell>{order.customer?.display_name || 'N/A'}</TableCell>
                                                <TableCell>{order.sales_order_date}</TableCell>
                                                <TableCell className="font-medium">
                                                    ₹{Number(order.total).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => navigate(`/sales/orders/edit/${order.id}`)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Order
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Order
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
                        
                        {/* Pagination controls */}
                        {!isLoading && !error && filteredOrders.length > 0 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data?.total || 0)} of {data?.total || 0} entries
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page >= totalPages || totalPages === 0}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <OrderDetailsModal
                open={showDetailsModal}
                onOpenChange={setShowDetailsModal}
                order={selectedOrder}
                type="sales"
            />
        </Layout>
    );
};

export default SalesOrders;
