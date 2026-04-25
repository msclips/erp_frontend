import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";
import { useCreateInvoice } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function CreateInvoice() {
    const navigate = useNavigate();
    const { mutate: createInvoice } = useCreateInvoice();

    const handleSave = (data: any) => {
        const payload = {
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
                item_id: parseInt(item.itemId || item.id),
                description: item.details,
                quantity: parseFloat(item.quantity) || 0,
                rate: parseFloat(item.rate) || 0,
                amount: parseFloat(item.amount) || 0
            }))
        };

        createInvoice(payload, {
            onSuccess: () => {
                navigate("/sales/invoices");
            }
        });
    };

    return (
        <SalesTransactionForm
            title="Invoice"
            type="invoice"
            backPath="/sales/invoices"
            onSave={handleSave}
        />
    );
}
