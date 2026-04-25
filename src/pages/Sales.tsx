import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSalesOrders } from "@/hooks/useApi";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import CreateSalesOrderModal from "@/components/CreateSalesOrderModal";
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
  Mail
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

const Sales = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: salesOrders = [], isLoading, error } = useSalesOrders();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    amountRange: { min: undefined as number | undefined, max: undefined as number | undefined },
  });

  // Filter orders based on active filters
  const filteredOrders = useMemo(() => {
    return salesOrders.filter((order) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !order.id.toLowerCase().includes(searchLower) &&
          !order.customer.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "all" && order.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from) {
        const orderDate = new Date(order.date);
        if (orderDate < filters.dateRange.from) {
          return false;
        }
      }
      if (filters.dateRange.to) {
        const orderDate = new Date(order.date);
        if (orderDate > filters.dateRange.to) {
          return false;
        }
      }

      // Amount range filter
      if (filters.amountRange.min && order.amount < filters.amountRange.min) {
        return false;
      }
      if (filters.amountRange.max && order.amount > filters.amountRange.max) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleEditOrder = (order: any) => {
    // Navigate to edit page with order data
    navigate(`/sales/edit/${order.id}`, { 
      state: { order } 
    });
  };

  const handleTrackShipment = (order: any) => {
    toast({
      title: "Tracking Shipment",
      description: `Tracking shipment for order ${order.id}`,
    });
  };

  const handleSendUpdate = (order: any) => {
    toast({
      title: "Update Sent",
      description: `Email update sent for order ${order.id}`,
    });
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
    <Layout currentPath="/sales">
      <DashboardHeader
        title="Sales Management"
        subtitle="Track sales orders, shipments, and performance metrics"
        showCreateButton
        createButtonText="New Sales Order"
        onCreateClick={() => navigate("/sales/create")}
      />

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$64,401.50</div>
            <p className="text-xs text-success">+18.2% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders This Month
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">127</div>
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
            <div className="text-2xl font-bold text-foreground">23</div>
            <p className="text-xs text-warning">8 overdue</p>
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
            <div className="text-2xl font-bold text-foreground">$507.10</div>
            <p className="text-xs text-success">+5.3% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={(search) => setFilters({ ...filters, search })}
            // onStatusFilter={(status) => setFilters({ ...filters, status })}
            // onDateRangeFilter={(dateRange) => setFilters({ ...filters, dateRange: { from: dateRange.from, to: dateRange.to } })}
            // onAmountRangeFilter={(amountRange) => setFilters({ ...filters, amountRange: { min: amountRange.min, max: amountRange.max } })}
            onClearFilters={clearFilters}
            // type="sales"
            activeFilters={filters}
          />
          
          <div className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">Loading sales orders...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading sales orders. Please check your backend connection.
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell className="font-medium">
                    ${order.amount.toLocaleString()}
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
                        <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTrackShipment(order)}>
                          <Truck className="mr-2 h-4 w-4" />
                          Track Shipment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendUpdate(order)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Update
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

      {/* Modals */}
      <OrderDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        order={selectedOrder}
        type="sales"
      />
    </Layout>
  );
};

export default Sales;