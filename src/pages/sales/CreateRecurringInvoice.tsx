import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";

export default function CreateRecurringInvoice() {
    const handleSave = (data: any) => {
        console.log("Saving Recurring Invoice:", data);
    };

    return (
        <SalesTransactionForm
            title="Recurring Invoice"
            type="recurring"
            backPath="/sales/recurring-invoices"
            onSave={handleSave}
        />
    );
}
