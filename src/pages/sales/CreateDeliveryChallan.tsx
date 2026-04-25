import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";

export default function CreateDeliveryChallan() {
    const handleSave = (data: any) => {
        console.log("Saving Delivery Challan:", data);
    };

    return (
        <SalesTransactionForm
            title="Delivery Challan"
            type="challan"
            backPath="/sales/delivery-challans"
            onSave={handleSave}
        />
    );
}
