import { SalesTransactionForm } from "@/components/sales/SalesTransactionForm";

export default function CreateCreditNote() {
    const handleSave = (data: any) => {
        console.log("Saving Credit Note:", data);
    };

    return (
        <SalesTransactionForm
            title="Credit Note"
            type="credit_note"
            backPath="/sales/credit-notes"
            onSave={handleSave}
        />
    );
}
