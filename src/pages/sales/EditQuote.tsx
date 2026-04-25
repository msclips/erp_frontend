import { useParams, useNavigate } from "react-router-dom";
import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";
import { useQuote, useUpdateQuote } from "@/hooks/useApi";
import { useMemo } from "react";

export default function EditQuote() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: quote, isLoading } = useQuote(id ? parseInt(id) : undefined);
    const { mutate: updateQuote } = useUpdateQuote();

    const initialData = useMemo(() => {
        if (!quote) return null;

        return {
            customerId: quote.customer_id,
            number: quote.quotation_no,
            reference: quote.reference,
            date: quote.quotation_date,
            expiryDate: quote.expiry_date,
            salesperson: quote.salesperson_id ? 'me' : '',
            subject: quote.subject,
            notes: quote.customer_notes,
            terms: quote.terms_conditions,
            discount: parseFloat(quote.discount) || 0,
            discountType: quote.discount_type === 1 ? '%' : 'amount',
            adjustment: parseFloat(quote.adjustment) || 0,
            status: quote.status,
            items: (quote.details || []).map((detail: any) => ({
                id: detail.id.toString(),
                itemId: detail.item_id,
                details: detail.item?.name || detail.description, // Try to get item name
                quantity: parseFloat(detail.quantity) || 0,
                rate: parseFloat(detail.rate) || 0,
                amount: parseFloat(detail.amount) || 0
            }))
        };
    }, [quote]);

    const handleSave = (data: any) => {
        const payload = {
            id: parseInt(id!),
            customer_id: parseInt(data.customerId),
            quotation_no: data.number,
            reference: data.reference,
            quotation_date: data.date,
            expiry_date: data.expiryDate,
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
                id: isNaN(parseInt(item.id)) ? undefined : parseInt(item.id), // Only send numeric IDs for existing items
                item_id: item.itemId,
                description: item.details,
                quantity: parseFloat(item.quantity) || 0,
                rate: parseFloat(item.rate) || 0,
                amount: parseFloat(item.amount) || 0
            }))
        };

        updateQuote(payload, {
            onSuccess: () => {
                navigate("/sales/quotes");
            }
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading Quotation...</div>;
    }

    if (!quote && !isLoading) {
        return <div className="p-8 text-center text-destructive">Quotation not found.</div>;
    }

    return (
        <SalesTransactionForm
            title="Edit Quote"
            type="quote"
            backPath="/sales/quotes"
            initialData={initialData}
            onSave={handleSave}
            isEdit
        />
    );
}
