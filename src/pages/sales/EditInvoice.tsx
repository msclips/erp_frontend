import { useParams, useNavigate } from "react-router-dom";
import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";
import { useInvoice, useUpdateInvoice } from "@/hooks/useApi";
import { useMemo } from "react";

export default function EditInvoice() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: invoice, isLoading } = useInvoice(id ? parseInt(id) : undefined);
    const { mutate: updateInvoice } = useUpdateInvoice();

    const initialData = useMemo(() => {
        if (!invoice) return null;

        return {
            customerId: invoice.customer_id,
            number: invoice.invoice_no,
            reference: invoice.reference,
            date: invoice.invoice_date,
            expiryDate: invoice.due_date,
            salesperson: invoice.salesperson_id ? 'me' : '',
            subject: invoice.subject,
            notes: invoice.customer_notes,
            terms: invoice.terms_conditions,
            discount: parseFloat(invoice.discount) || 0,
            discountType: invoice.discount_type === 1 ? '%' : 'amount',
            adjustment: parseFloat(invoice.adjustment) || 0,
            status: invoice.status,
            items: (invoice.details || []).map((detail: any) => ({
                id: detail.id.toString(),
                itemId: detail.item_id,
                details: detail.item?.name || detail.description,
                quantity: parseFloat(detail.quantity) || 0,
                rate: parseFloat(detail.rate) || 0,
                amount: parseFloat(detail.amount) || 0
            }))
        };
    }, [invoice]);

    const handleSave = (data: any) => {
        const payload = {
            id: parseInt(id!),
            customer_id: parseInt(data.customerId),
            invoice_no: data.number,
            reference: data.reference,
            invoice_date: data.date,
            due_date: data.expiryDate,
            salesperson_id: data.salesperson === 'me' ? 1 : null,
            subject: data.subject,
            customer_notes: data.notes,
            terms_conditions: data.terms,
            sub_total: data.items.reduce((sum: number, item: any) => sum + (parseFloat(item.amount) || 0), 0),
            discount: parseFloat(data.discount) || 0,
            discount_type: data.discountType === '%' ? 1 : 2,
            adjustment: parseFloat(data.adjustment) || 0,
            total: parseFloat(data.total) || 0,
            status: data.status,
            items: data.items.map((item: any) => ({
                id: isNaN(parseInt(item.id)) ? undefined : parseInt(item.id),
                item_id: parseInt(item.itemId || item.id),
                description: item.details,
                quantity: parseFloat(item.quantity) || 0,
                rate: parseFloat(item.rate) || 0,
                amount: parseFloat(item.amount) || 0
            }))
        };

        updateInvoice(payload, {
            onSuccess: () => {
                navigate("/sales/invoices");
            }
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading Invoice...</div>;
    }

    if (!invoice && !isLoading) {
        return <div className="p-8 text-center text-destructive">Invoice not found.</div>;
    }

    return (
        <SalesTransactionForm
            title="Invoice"
            type="invoice"
            backPath="/sales/invoices"
            initialData={initialData}
            onSave={handleSave}
            isEdit
        />
    );
}
