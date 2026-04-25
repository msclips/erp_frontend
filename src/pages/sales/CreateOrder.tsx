import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";
import { useCreateSalesOrder } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function CreateOrder() {
    const { mutate: createOrder } = useCreateSalesOrder();
    const navigate = useNavigate();

    const handleSave = (data: any) => {
        const payload = {
            customer_id: parseInt(data.customerId),
            sales_order_no: data.number,
            reference: data.reference,
            sales_order_date: data.date,
            expected_shipment_date: data.expiryDate,
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
                item_id: item.itemId,
                description: item.details,
                quantity: parseFloat(item.quantity) || 0,
                rate: parseFloat(item.rate) || 0,
                amount: parseFloat(item.amount) || 0
            }))
        };

        createOrder(payload, {
            onSuccess: () => {
                navigate("/sales/orders");
            }
        });
    };

    return (
        <SalesTransactionForm
            title="Sales Order"
            type="order"
            backPath="/sales/orders"
            onSave={handleSave}
        />
    );
}
