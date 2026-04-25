import { useParams, useNavigate } from "react-router-dom";
import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";
import { useSalesOrder, useUpdateSalesOrder } from "@/hooks/useApi";
import { useMemo } from "react";

export default function EditOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading } = useSalesOrder(id ? parseInt(id) : undefined);
    const { mutate: updateOrder } = useUpdateSalesOrder();

    const initialData = useMemo(() => {
        if (!order) return null;

        return {
            customerId: order.customer_id,
            number: order.sales_order_no,
            reference: order.reference,
            date: order.sales_order_date,
            expiryDate: order.expected_shipment_date,
            salesperson: order.salesperson_id ? 'me' : '',
            subject: order.subject,
            notes: order.customer_notes,
            terms: order.terms_conditions,
            discount: parseFloat(order.discount) || 0,
            discountType: order.discount_type === 1 ? '%' : 'amount',
            adjustment: parseFloat(order.adjustment) || 0,
            status: order.status,
            items: (order.details || []).map((detail: any) => ({
                id: detail.id.toString(),
                itemId: detail.item_id,
                details: detail.item?.name || detail.description,
                quantity: parseFloat(detail.quantity) || 0,
                rate: parseFloat(detail.rate) || 0,
                amount: parseFloat(detail.amount) || 0
            }))
        };
    }, [order]);

    const handleSave = (data: any) => {
        const payload = {
            id: parseInt(id!),
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
                id: isNaN(parseInt(item.id)) ? undefined : parseInt(item.id),
                item_id: item.itemId,
                description: item.details,
                quantity: parseFloat(item.quantity) || 0,
                rate: parseFloat(item.rate) || 0,
                amount: parseFloat(item.amount) || 0
            }))
        };

        updateOrder(payload, {
            onSuccess: () => {
                navigate("/sales/orders");
            }
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading Sales Order...</div>;
    }

    if (!order && !isLoading) {
        return <div className="p-8 text-center text-destructive">Sales Order not found.</div>;
    }

    return (
        <SalesTransactionForm
            title="Sales Order"
            type="order"
            backPath="/sales/orders"
            initialData={initialData}
            onSave={handleSave}
            isEdit
        />
    );
}
