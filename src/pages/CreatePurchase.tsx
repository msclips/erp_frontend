import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Settings, Paperclip, ChevronDown, ArrowLeft } from "lucide-react";
import { ItemTable, ItemRow } from "@/components/purchase-order/ItemTable";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useVendorAutocomplete, usePaymentTermAutocomplete, useCreatePurchaseOrder } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

export default function CreatePurchase() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createPurchaseOrder, isPending: isSaving } = useCreatePurchaseOrder();
  const { data: vendors = [], isLoading: vendorsLoading, error: vendorsError } = useVendorAutocomplete();
  const [selectedVendor, setSelectedVendor] = useState("");
  const { data: paymentTerms = [], isLoading: paymentTermsLoading, refetch: fetchPaymentTerms } = usePaymentTermAutocomplete(false);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState("");
  const [items, setItems] = useState<ItemRow[]>([
    {
      id: "1",
      details: "",
      accountId: "",
      quantity: 1.0,
      rate: 0.0,
      amount: 0.0,
    },
  ]);

  const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"%" | "amount">("%");
  const [adjustment, setAdjustment] = useState(0);
  const [tds, setTds] = useState(0);

  // New state for form fields
  const [reference, setReference] = useState("");
  const [orderDate, setOrderDate] = useState("2025-11-23");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [shipmentPreference, setShipmentPreference] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  const handleSave = () => {
    if (!selectedVendor) {
      toast({
        title: "Error",
        description: "Please select a vendor",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress) {
      toast({
        title: "Error",
        description: "Delivery Address is required",
        variant: "destructive",
      });
      return;
    }

    // Validate if items have IDs selected
    const invalidItems = items.some(item => !item.itemId && item.details);
    if (invalidItems) {
      toast({
        title: "Error",
        description: "Please select valid items from the list",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      vendor_id: parseInt(selectedVendor),
      payment_terms_id: parseInt(selectedPaymentTerm),
      delivery_address: deliveryAddress,
      reference: reference,
      shipment_preference: shipmentPreference,
      purchase_order_date: orderDate,
      delivery_date: deliveryDate,
      customer_notes: notes,
      terms_condition: terms,
      purchase_order_detail: items
        .filter(item => item.itemId) // Only include items with IDs
        .map(item => ({
          item_id: item.itemId, // Use the ID from the item object
          chart_of_account_id: parseInt(item.accountId),
          rate: item.rate,
          quantity: item.quantity,
          amount: item.amount
        })),
    };

    createPurchaseOrder(payload as any, {
      onSuccess: () => {
        navigate("/purchases");
      },
    });
  };

  const calculateTotal = () => {
    let total = subTotal;
    if (discountType === "%") {
      total -= total * (discount / 100);
    } else {
      total -= discount;
    }
    total += adjustment;
    return total;
  };

  const handleBack = () => {
    navigate("/purchases");
  };

  return (
    <Layout currentPath="/purchases" >
      <div className="p-6 max-w-[1200px] mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">New Purchase Order</h1>
          </div>
        </div>

        {/* Vendor Section  */}
        <div className="grid grid-cols-[200px_1fr] gap-4 mb-8 items-center">
          <Label className="text-red-500 font-medium">Vendor Name*</Label>
          <div className="flex gap-2 max-w-xl">
            <Select
              value={selectedVendor}
              onValueChange={setSelectedVendor}
              disabled={vendorsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={vendorsLoading ? "Loading vendors..." : "Select a Vendor"} />
              </SelectTrigger>
              <SelectContent>
                {vendorsError ? (
                  <SelectItem value="error-state" disabled>Error loading vendors</SelectItem>
                ) : vendors.length === 0 ? (
                  <SelectItem value="no-vendors" disabled>No vendors found</SelectItem>
                ) : (
                  vendors.map((vendor: any) => (
                    <SelectItem key={vendor.id} value={vendor.id.toString()}>
                      {vendor.display_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button size="icon" className="bg-blue-500 hover:bg-blue-600 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </Button>
          </div>
        </div>



        {/* Order Details Form  */}
        <div className="grid grid-cols-[200px_1fr] gap-y-6 gap-x-4 mb-12 max-w-4xl">

          <Label className="font-medium self-center">Reference#</Label>
          <Input
            className="max-w-md"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <Label className="font-medium self-center">Date</Label>
          <Input
            type='date'
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="max-w-md"
          />

          <Label className="font-medium self-center">Delivery Date</Label>
          <div className="grid grid-cols-[1fr_max-content_1fr] gap-4 items-center max-w-4xl">
            <Input
              type='date'
              placeholder="dd/MM/yyyy"
              className="max-w-md"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />

            <Label className="font-medium self-center">Delivery Address</Label>
            <Input
              className="max-w-md"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter Delivery Address"
            />

            <Label className="font-medium">Payment Terms</Label>
            <Select
              value={selectedPaymentTerm}
              onValueChange={setSelectedPaymentTerm}
              onOpenChange={(open) => {
                if (open) fetchPaymentTerms();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={paymentTermsLoading ? "Loading..." : "Select Payment Term"} />
              </SelectTrigger>
              <SelectContent>
                {paymentTerms.map((term: any) => (
                  <SelectItem key={term.id} value={term.id.toString()}>
                    {term.term}
                  </SelectItem>
                ))}


              </SelectContent>
            </Select>
          </div>

          <Label className="font-medium self-center">Shipment Preference</Label>
          <Input
            className="max-w-md"
            value={shipmentPreference}
            onChange={(e) => setShipmentPreference(e.target.value)}
          />


        </div>

        <Separator className="my-8" />

        {/* Item Table */}
        <div className="mb-8">
          <ItemTable items={items} setItems={setItems} />
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Will be displayed on purchase order"
                className="resize-none h-24"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <Textarea
                placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                className="resize-none h-24"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column - Totals */}
          <div className="bg-gray-50/50 p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Sub Total</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="font-medium">Discount</span>
              <div className="flex gap-2 items-center w-48">
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
                <div className="flex border rounded-md overflow-hidden shrink-0">
                  <button
                    className={`px-2 py-1 text-sm ${discountType === "%" ? "bg-gray-100" : "bg-white"
                      }`}
                    onClick={() => setDiscountType("%")}
                  >
                    %
                  </button>
                  <div className="w-px bg-gray-200"></div>
                  <button
                    className={`px-2 py-1 text-sm ${discountType === "amount" ? "bg-gray-100" : "bg-white"
                      }`}
                    onClick={() => setDiscountType("amount")}
                  >
                    ₹
                  </button>
                </div>
              </div>
              <span className="w-20 text-right">
                {discountType === "%"
                  ? ((subTotal * discount) / 100).toFixed(2)
                  : discount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <RadioGroup defaultValue="tds" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tds" id="tds" />
                  <Label htmlFor="tds">TDS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tcs" id="tcs" />
                  <Label htmlFor="tcs">TCS</Label>
                </div>
              </RadioGroup>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Tax" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax1">Tax 1</SelectItem>
                </SelectContent>
              </Select>
              <span className="w-20 text-right text-gray-500">- 0.00</span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Adjustment</span>
                <Input
                  value={adjustment}
                  onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
                  className="w-24 text-right"
                />
              </div>
              <span className="w-20 text-right">{adjustment.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="mt-8">
          <Label className="mb-2 block">Attach File(s) to Purchase Order</Label>
          <div className="border-2 border-dashed rounded-lg p-4 w-full max-w-md hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <ChevronDown className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              You can upload a maximum of 10 files, 10MB each
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-4 z-10 md:pl-64">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save and Send"}
          </Button>
          <Button variant="ghost" onClick={handleBack}>Cancel</Button>
        </div>
        <div className="h-20"></div>
      </div>
    </Layout >
  );
}