import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";
import { useCreateQuote } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function CreateQuote() {
    const { mutate: createQuote } = useCreateQuote();
    const navigate = useNavigate();

    const handleSave = (data: any) => {
        const payload = {
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
            discount_type: data.discountType === '%' ? 1 : 2, // Assuming 1 for %, 2 for Fixed based on common patterns, or check API
            adjustment: parseFloat(data.adjustment) || 0,
            total: parseFloat(data.total) || 0,
            status: data.status,
            items: data.items.map((item: any) => ({
                item_id: item.itemId,
                description: item.details,
                quantity: parseFloat(item.quantity) || 0,
                rate: parseFloat(item.rate) || 0,
                amount: parseFloat(item.amount) || 0
            }))
        };

        createQuote(payload, {
            onSuccess: () => {
                navigate("/sales/quotes");
            }
        });
    };

    return (
        <SalesTransactionForm
            title="Quote"
            type="quote"
            backPath="/sales/quotes"
            onSave={handleSave}
        />
    );
}
