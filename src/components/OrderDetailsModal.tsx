import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  DollarSign,
  Phone,
  Mail,
  Building
} from "lucide-react";

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  type: "sales" | "purchase";
}

export default function OrderDetailsModal({ 
  open, 
  onOpenChange, 
  order, 
  type 
}: OrderDetailsModalProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "received":
        return "bg-success text-success-foreground";
      case "shipped":
        return "bg-info text-info-foreground";
      case "processing":
      case "ordered":
        return "bg-warning text-warning-foreground";
      case "pending":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const clientName = type === "sales" ? order.customer : order.vendor;
  const orderType = type === "sales" ? "Sales Order" : "Purchase Order";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {orderType} Details - {order.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                ${order.amount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{order.items} items</p>
            </div>
          </div>

          <Separator />

          {/* Client Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              {type === "sales" ? "Customer" : "Vendor"} Information
            </h3>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="font-medium">{clientName}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {clientName.toLowerCase().replace(/\s+/g, '')}@company.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                123 Business District, City, State 12345
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Order Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Order Date:</span>
                <span className="text-sm font-medium">{order.date}</span>
              </div>
              {order.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expected Delivery:</span>
                  <span className="text-sm font-medium">{order.dueDate}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Updated:</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Summary
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span>Total Items:</span>
                <span className="font-medium">{order.items}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal:</span>
                <span className="font-medium">${(order.amount * 0.9).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Tax:</span>
                <span className="font-medium">${(order.amount * 0.1).toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${order.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {(order.status === "shipped" || order.status === "delivered" || order.status === "received") && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Tracking Information
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm mb-2">
                  <span className="font-medium">Tracking Number:</span> TRK-{order.id}-001
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Carrier:</span> Express Logistics
                </p>
                <p className="text-sm">
                  <span className="font-medium">Estimated Delivery:</span> 
                  {order.dueDate || "2-3 business days"}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Send Update
            </Button>
            <Button variant="outline" className="flex-1">
              <Package className="w-4 h-4 mr-2" />
              Edit Order
            </Button>
            {(order.status === "shipped" || order.status === "delivered") && (
              <Button variant="outline" className="flex-1">
                <Truck className="w-4 h-4 mr-2" />
                Track Package
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}