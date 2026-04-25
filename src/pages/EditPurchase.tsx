import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditPurchase() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const orderData = location.state?.order;

  const [formData, setFormData] = useState({
    vendor: "",
    items: "",
    amount: "",
    dueDate: "",
    priority: "normal",
    notes: "",
    status: "pending",
  });

  // Pre-fill form data when component mounts
  useEffect(() => {
    if (orderData) {
      setFormData({
        vendor: getVendorValue(orderData.vendor),
        items: orderData.items?.toString() || "",
        amount: orderData.amount?.toString() || "",
        dueDate: orderData.dueDate || "",
        priority: "normal", // Default since not in original data
        notes: "", // Default since not in original data
        status: orderData.status || "pending",
      });
    }
  }, [orderData]);

  // Helper function to map vendor names to values
  const getVendorValue = (vendorName: string) => {
    const vendorMap: { [key: string]: string } = {
      "Tech Supplies Co": "tech-supplies",
      "Office Equipment Ltd": "office-equipment", 
      "Industrial Materials Inc": "industrial",
      "Digital Solutions": "digital",
      "Global Logistics": "logistics"
    };
    return vendorMap[vendorName] || "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating purchase order:", { ...formData, id: orderData?.id });
    
    toast({
      title: "Purchase Order Updated",
      description: `Purchase order ${orderData?.id} has been updated successfully`,
    });
    
    // Redirect back to purchases page
    navigate("/purchases");
  };

  const handleBack = () => {
    navigate("/purchases");
  };

  if (!orderData) {
    return (
      <Layout currentPath="/purchases">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Not Found</h1>
              <p className="text-muted-foreground mt-1">No order data available for editing</p>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Please select an order from the purchases page to edit.
              </p>
              <div className="flex justify-center mt-4">
                <Button onClick={handleBack}>Go Back to Purchases</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPath="/purchases">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Purchase Order</h1>
            <p className="text-muted-foreground mt-1">Order ID: {orderData.id}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select
                    value={formData.vendor}
                    onValueChange={(value) => setFormData({ ...formData, vendor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech-supplies">Tech Supplies Co</SelectItem>
                      <SelectItem value="office-equipment">Office Equipment Ltd</SelectItem>
                      <SelectItem value="industrial">Industrial Materials Inc</SelectItem>
                      <SelectItem value="digital">Digital Solutions</SelectItem>
                      <SelectItem value="logistics">Global Logistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="items">Number of Items</Label>
                  <Input
                    id="items"
                    type="number"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    placeholder="e.g. 15"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Total Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Expected Delivery</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or special requirements..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}