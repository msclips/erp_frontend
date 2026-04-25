import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, ArrowLeft } from "lucide-react";
import { 
    useCustomerAutocomplete, 
    useCustomerInvoices, 
    usePaymentReceived, 
    useUpdatePaymentReceived 
} from "@/hooks/useApi";

export default function EditPayment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { data: customers = [] } = useCustomerAutocomplete();
    const { data: payment, isLoading: isLoadingPayment } = usePaymentReceived(id ? parseInt(id) : undefined);
    const { mutate: updatePayment } = useUpdatePaymentReceived();

    const [formData, setFormData] = useState({
        customerId: "",
        amountReceived: 0,
        paymentDate: "",
        paymentMode: "cash",
        depositTo: "undeposited",
        reference: "",
        taxDeducted: false,
        notes: ""
    });

    const [appliedAmounts, setAppliedAmounts] = useState<{ [key: string]: number }>({});

    const { data: invoices = [], isLoading: isLoadingInvoices } = useCustomerInvoices(
        formData.customerId ? parseInt(formData.customerId) : undefined
    );

    useEffect(() => {
        if (payment) {
            setFormData({
                customerId: payment.customer_id?.toString() || "",
                amountReceived: Number(payment.amount_received || 0),
                paymentDate: payment.payment_date || "",
                paymentMode: payment.payment_mode || "cash",
                depositTo: payment.deposit_to || "undeposited",
                reference: payment.reference || "",
                taxDeducted: !!payment.tax_deducted,
                notes: payment.notes || ""
            });

            if (payment.details) {
                const applied: { [key: string]: number } = {};
                payment.details.forEach((d: any) => {
                    applied[d.invoice_id] = Number(d.amount_applied || 0);
                });
                setAppliedAmounts(applied);
            }
        }
    }, [payment]);

    const handleSave = () => {
        if (!formData.customerId || !formData.amountReceived) {
            toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        const payload = {
            id: parseInt(id!),
            customer_id: parseInt(formData.customerId),
            amount_received: parseFloat(formData.amountReceived.toString()) || 0,
            payment_date: formData.paymentDate,
            payment_mode: formData.paymentMode,
            deposit_to: formData.depositTo,
            reference: formData.reference,
            tax_deducted: formData.taxDeducted,
            notes: formData.notes,
            details: Object.entries(appliedAmounts)
                .filter(([_, amount]) => amount > 0)
                .map(([invoiceId, amount]) => {
                    const existingDetail = payment?.details?.find((d: any) => d.invoice_id.toString() === invoiceId);
                    return {
                        id: existingDetail?.id,
                        invoice_id: parseInt(invoiceId),
                        amount_applied: parseFloat(amount.toString()) || 0
                    };
                })
        };

        updatePayment(payload, {
            onSuccess: () => {
                navigate("/sales/payments-received");
            }
        });
    };

    const handleAutoApply = () => {
        let remaining = formData.amountReceived;
        const newApplied: { [key: string]: number } = {};
        
        invoices.forEach((inv: any) => {
            if (remaining <= 0) return;
            // For editing, we need to consider the current applied amount as available
            const currentApplied = appliedAmounts[inv.id] || 0;
            const unpaid = Number(inv.total) - Number(inv.amount_paid || 0) + currentApplied;
            const apply = Math.min(remaining, unpaid);
            newApplied[inv.id] = apply;
            remaining -= apply;
        });

        setAppliedAmounts(newApplied);
    };

    if (isLoadingPayment) return <div className="p-8 text-center">Loading payment details...</div>;

    return (
        <Layout currentPath="/sales/payments-received">
            <div className="p-6 max-w-4xl mx-auto bg-white min-h-screen">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate("/sales/payments-received")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-green-600" />
                        <h1 className="text-2xl font-semibold italic">Edit Payment: {payment?.payment_no}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-6 mb-12">
                    <Label className="font-medium pt-2 text-red-500">Customer Name*</Label>
                    <Select value={formData.customerId} onValueChange={(val) => setFormData({ ...formData, customerId: val })}>
                        <SelectTrigger className="max-w-md">
                            <SelectValue placeholder="Select a Customer" />
                        </SelectTrigger>
                        <SelectContent>
                            {customers.map((c: any) => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.display_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Label className="font-medium pt-2 text-red-500">Amount Received*</Label>
                    <div className="flex items-center gap-2 max-w-md">
                        <span className="text-gray-500">₹</span>
                        <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            value={formData.amountReceived || ''}
                            onChange={(e) => setFormData({ ...formData, amountReceived: parseFloat(e.target.value) || 0 })}
                        />
                        <span className="text-xs text-gray-400">INR</span>
                    </div>

                    <Label className="font-medium pt-2 text-red-500">Payment Date*</Label>
                    <Input 
                        type="date" 
                        className="max-w-md" 
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    />

                    <Label className="font-medium pt-2 text-red-500">Payment Mode*</Label>
                    <Select value={formData.paymentMode} onValueChange={(val) => setFormData({ ...formData, paymentMode: val })}>
                        <SelectTrigger className="max-w-md">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label className="font-medium pt-2 text-red-500">Deposit To*</Label>
                    <Select value={formData.depositTo} onValueChange={(val) => setFormData({ ...formData, depositTo: val })}>
                        <SelectTrigger className="max-w-md">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="undeposited">Undeposited Funds</SelectItem>
                            <SelectItem value="petty">Petty Cash</SelectItem>
                            <SelectItem value="bank">Main Bank Account</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label className="font-medium pt-2">Reference#</Label>
                    <Input 
                        className="max-w-md" 
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    />

                    <Label className="font-medium pt-2">Tax Deducted?</Label>
                    <div className="flex items-center gap-4 pt-2">
                        <input 
                            type="radio" 
                            name="tax" 
                            id="no-tax" 
                            checked={!formData.taxDeducted} 
                            onChange={() => setFormData({ ...formData, taxDeducted: false })}
                        /> 
                        <label htmlFor="no-tax">No</label>
                        <input 
                            type="radio" 
                            name="tax" 
                            id="yes-tax" 
                            checked={formData.taxDeducted} 
                            onChange={() => setFormData({ ...formData, taxDeducted: true })}
                        /> 
                        <label htmlFor="yes-tax">Yes, TDS (Income Tax)</label>
                    </div>

                    <Label className="font-medium pt-2">Notes</Label>
                    <Textarea 
                        className="max-w-xl h-24" 
                        placeholder="Internal notes..." 
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Applied Invoices</h2>
                        <Button variant="outline" size="sm" onClick={handleAutoApply} disabled={!formData.amountReceived || invoices.length === 0}>
                            Auto-apply Payment
                        </Button>
                    </div>
                    
                    {isLoadingInvoices ? (
                        <div className="text-center py-8 text-muted-foreground">Loading invoices...</div>
                    ) : invoices.length === 0 ? (
                        <div className="bg-gray-50 border p-8 text-center text-gray-500">
                            No unpaid invoices found for this customer.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Invoice#</TableHead>
                                    <TableHead className="text-right">Invoice Amount</TableHead>
                                    <TableHead className="text-right">Amount Due</TableHead>
                                    <TableHead className="text-right">Amount Applied</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((inv: any) => {
                                    const currentApplied = appliedAmounts[inv.id] || 0;
                                    const unpaid = Number(inv.total) - Number(inv.amount_paid || 0) + currentApplied;
                                    return (
                                        <TableRow key={inv.id}>
                                            <TableCell>{inv.invoice_date}</TableCell>
                                            <TableCell className="text-primary">{inv.invoice_no}</TableCell>
                                            <TableCell className="text-right">₹{Number(inv.total).toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-red-500">₹{unpaid.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Input 
                                                    type="number" 
                                                    className="w-32 ml-auto text-right" 
                                                    value={appliedAmounts[inv.id] || ''}
                                                    onChange={(e) => setAppliedAmounts({
                                                        ...appliedAmounts,
                                                        [inv.id]: Math.min(parseFloat(e.target.value) || 0, unpaid)
                                                    })}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-start gap-4 z-10 md:pl-72 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <Button className="bg-blue-600 hover:bg-blue-700 px-8" onClick={handleSave}>Update Payment</Button>
                    <Button variant="outline" className="px-8" onClick={() => navigate("/sales/payments-received")}>Cancel</Button>
                </div>
                <div className="h-24"></div>
            </div>
        </Layout>
    );
}
