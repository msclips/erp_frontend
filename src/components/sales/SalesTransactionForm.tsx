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
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, ChevronDown, ArrowLeft, MoreHorizontal } from "lucide-react";
import { SalesItemTable, SalesItemRow } from "./SalesItemTable";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useCustomerAutocomplete, usePaymentTermAutocomplete } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface SalesTransactionFormProps {
    title: string;
    type: "quote" | "order" | "invoice" | "challan" | "recurring" | "credit_note";
    backPath: string;
    onSave: (data: any) => void;
    initialData?: any;
    isEdit?: boolean;
}

export function SalesTransactionForm({ title, type, backPath, onSave, initialData, isEdit }: SalesTransactionFormProps) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { data: customers = [], isLoading: customersLoading } = useCustomerAutocomplete();
    const [selectedCustomer, setSelectedCustomer] = useState(initialData?.customerId?.toString() || "");
    const [items, setItems] = useState<SalesItemRow[]>(initialData?.items || [
        { id: "1", details: "", quantity: 1.0, rate: 0.0, amount: 0.0 },
    ]);

    const [formData, setFormData] = useState({
        number: initialData?.number || "",
        reference: initialData?.reference || "",
        date: initialData?.date || new Date().toISOString().split('T')[0],
        expiryDate: initialData?.expiryDate || "",
        salesperson: initialData?.salesperson || "",
        subject: initialData?.subject || "",
        notes: initialData?.notes || "",
        terms: initialData?.terms || "",
        adjustment: initialData?.adjustment || 0,
        discount: initialData?.discount || 0,
        discountType: (initialData?.discountType as "%" | "amount") || "%",
    });

    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);

    const calculateTotal = () => {
        let total = subTotal;
        if (formData.discountType === "%") {
            total -= total * (formData.discount / 100);
        } else {
            total -= formData.discount;
        }
        total += formData.adjustment;
        return total;
    };

    const handleSave = (status: "draft" | "sent") => {
        if (!selectedCustomer) {
            toast({ title: "Error", description: "Please select a customer", variant: "destructive" });
            return;
        }
        onSave({ ...formData, customerId: selectedCustomer, items, status, total: calculateTotal() });
    };

    return (
        <Layout currentPath={backPath}>
            <div className="p-6 max-w-5xl mx-auto bg-white min-h-screen">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate(backPath)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold italic">{isEdit ? "Edit" : "New"} {title}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-6 mb-12">
                    <Label className="font-medium pt-2 text-red-500">Customer Name*</Label>
                    <div className="flex gap-2 max-w-md">
                        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                            <SelectTrigger>
                                <SelectValue placeholder={customersLoading ? "Loading..." : "Select a Customer"} />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>{c.display_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Label className="font-medium pt-2 text-red-500">{title}#*</Label>
                    <div className="flex gap-4 max-w-md items-center">
                        <Input
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            placeholder="Auto-generated"
                            className="bg-gray-50"
                        />
                        <span className="text-xs text-blue-600 cursor-pointer">Manual Override</span>
                    </div>

                    <Label className="font-medium pt-2">Reference#</Label>
                    <Input
                        className="max-w-md"
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    />

                    <Label className="font-medium pt-2">{title} Date*</Label>
                    <div className="flex gap-4 max-w-md items-center">
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        {(type === "quote" || type === "order") && (
                            <>
                                <Label className="min-w-[80px]">{type === "quote" ? "Expiry Date" : "Exp. Shipment Date"}</Label>
                                <Input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
                            </>
                        )}
                        {type === "invoice" && (
                            <>
                                <Label className="min-w-[80px]">Due Date</Label>
                                <Input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
                            </>
                        )}
                    </div>

                    <Label className="font-medium pt-2">Salesperson</Label>
                    <Select value={formData.salesperson} onValueChange={(v) => setFormData({ ...formData, salesperson: v })}>
                        <SelectTrigger className="max-w-md">
                            <SelectValue placeholder="Select Salesperson" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="me">Current User</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label className="font-medium pt-2">Subject</Label>
                    <Textarea
                        placeholder="Briefly explain what this project is about"
                        className="max-w-2xl h-20"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                </div>

                <Separator className="my-8" />

                <div className="mb-8">
                    <SalesItemTable items={items} setItems={setItems} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Customer Notes</Label>
                            <Textarea 
                                placeholder="Will be displayed on {title}" 
                                className="h-24" 
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Terms & Conditions</Label>
                            <Textarea 
                                placeholder="Business boilerplate..." 
                                className="h-24" 
                                value={formData.terms}
                                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50/50 p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                            <span>Sub Total</span>
                            <span>{subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm">Discount</span>
                            <div className="flex gap-2 items-center w-48">
                                <Input
                                    type="number"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                                    className="text-right h-8"
                                />
                                <div className="flex border rounded overflow-hidden">
                                    <button onClick={() => setFormData({ ...formData, discountType: "%" })} className={`px-2 py-0.5 text-xs ${formData.discountType === "%" ? "bg-gray-200" : "bg-white"}`}>%</button>
                                    <button onClick={() => setFormData({ ...formData, discountType: "amount" })} className={`px-2 py-0.5 text-xs ${formData.discountType === "amount" ? "bg-gray-200" : "bg-white"}`}>₹</button>
                                </div>
                            </div>
                            <span className="w-20 text-right text-sm">{(formData.discountType === "%" ? (subTotal * formData.discount / 100) : formData.discount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm">Adjustment</span>
                            <Input
                                type="number"
                                value={formData.adjustment}
                                onChange={(e) => setFormData({ ...formData, adjustment: parseFloat(e.target.value) || 0 })}
                                className="w-24 text-right h-8"
                            />
                            <span className="w-20 text-right text-sm">{formData.adjustment.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-lg">Total (₹)</span>
                            <span className="font-bold text-lg">{calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-start gap-4 z-10 md:pl-72 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <Button className="bg-blue-600 hover:bg-blue-700 px-6" onClick={() => handleSave("sent")}>
                        Save and Send
                    </Button>
                    <Button variant="outline" className="px-6" onClick={() => handleSave("draft")}>
                        Save as Draft
                    </Button>
                    <Button variant="ghost" onClick={() => navigate(backPath)}>Cancel</Button>
                </div>
                <div className="h-24"></div>
            </div>
        </Layout>
    );
}
