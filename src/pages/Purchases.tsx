
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePurchaseOrders, useDeletePurchaseOrder } from "@/hooks/useApi";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import CreatePurchaseOrderModal from "@/components/CreatePurchaseOrderModal";
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
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Eye,
  Edit,
  MoreHorizontal,
  Mail,
  CheckCircle,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Remove static data - now fetched from MongoDB

const getStatusColor = (status: string) => {
  switch (status) {
    case "received":
      return "bg-success text-success-foreground";
    case "shipped":
      return "bg-info text-info-foreground";
    case "ordered":
      return "bg-warning text-warning-foreground";
    case "pending":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const Purchases = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, error } = usePurchaseOrders(page, limit);
  const deletePurchaseOrderMutation = useDeletePurchaseOrder();
  const purchaseOrders = data?.list || [];
  const total = data?.total || 0;

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
  });

  // Filter orders based on active filters
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((order) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        // Check if purchase_order_no exists before calling toLowerCase
        const poNo = order.purchase_order_no ? order.purchase_order_no.toLowerCase() : '';
        const idStr = String(order.id).toLowerCase();

        if (
          !idStr.includes(searchLower) &&
          !poNo.includes(searchLower)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filters, purchaseOrders]);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleEditOrder = (order: any) => {
    // Navigate to edit page with order data
    navigate(`/ purchases / edit / ${order.id} `, {
      state: { order }
    });
  };

  const handleTrackDelivery = (order: any) => {
    toast({
      title: "Tracking Delivery",
      description: `Tracking delivery for order ${order.id}`,
    });
  };

  const handleMarkReceived = (order: any) => {
    toast({
      title: "Order Received",
      description: `Marked order ${order.id} as received`,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this purchase order?')) {
      deletePurchaseOrderMutation.mutate(id);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
    });
  };
  return (
    <Layout currentPath="/purchases">
      <DashboardHeader
        title="Purchase Management"
        subtitle="Manage purchase orders, vendors, and incoming goods"
        showCreateButton
        createButtonText="New Purchase Order"
        onCreateClick={() => navigate("/purchases/create")}
      />

      {/* Purchase Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Purchases
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$51,401.50</div>
            <p className="text-xs text-success">-8.2% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders This Month
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89</div>
            <p className="text-xs text-info">15 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">34</div>
            <p className="text-xs text-warning">5 delayed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$577.80</div>
            <p className="text-xs text-success">+3.1% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={(search) => setFilters({ ...filters, search })}
            onClearFilters={() => setFilters({ search: "" })}
            activeFilters={filters}
          />

          <div className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading purchase orders...</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Error loading purchase orders. Please check your backend connection.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No orders found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.purchase_order_no}</TableCell>
                          <TableCell>{order.purchase_order_date}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil(total / limit)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(total / limit)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <OrderDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        order={selectedOrder}
        type="purchase"
      />
    </Layout>
  );
};

export default Purchases;