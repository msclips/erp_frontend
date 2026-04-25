import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useItemAutocomplete } from "@/hooks/useApi";

export interface SalesItemRow {
    id: string;
    itemId?: number;
    details: string;
    quantity: number;
    rate: number;
    tax?: number;
    amount: number;
}

interface SalesItemTableProps {
    items: SalesItemRow[];
    setItems: React.Dispatch<React.SetStateAction<SalesItemRow[]>>;
}

export function SalesItemTable({ items, setItems }: SalesItemTableProps) {
    const { data: availableItems = [] } = useItemAutocomplete();

    const handleAddItem = () => {
        const newItem: SalesItemRow = {
            id: Math.random().toString(36).substr(2, 9),
            details: "",
            quantity: 1.0,
            rate: 0.0,
            amount: 0.0,
        };
        setItems([...items, newItem]);
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const handleUpdateItem = (id: string, field: keyof SalesItemRow, value: any) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === "quantity" || field === "rate") {
                        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    return (
        <div className="space-y-4">
            <div className="border rounded-md">
                <Table>
                    <TableHeader className="bg-gray-50 uppercase text-[11px] font-bold text-gray-600">
                        <TableRow>
                            <TableHead className="w-[30px]"></TableHead>
                            <TableHead className="w-[50%]">Item Details</TableHead>
                            <TableHead className="w-[15%] text-right font-bold">Quantity</TableHead>
                            <TableHead className="w-[15%] text-right font-bold">Rate</TableHead>
                            <TableHead className="w-[15%] text-right font-bold">Amount</TableHead>
                            <TableHead className="w-[30px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id} className="group border-b">
                                <TableCell>
                                    <GripVertical className="h-4 w-4 text-gray-300 cursor-move opacity-0 group-hover:opacity-100" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Select
                                            value={item.details}
                                            onValueChange={(value) => {
                                                const selectedItem = availableItems.find((i: any) => i.name === value);
                                                handleUpdateItem(item.id, "details", value);
                                                if (selectedItem) {
                                                    handleUpdateItem(item.id, "itemId", selectedItem.id);
                                                    handleUpdateItem(item.id, "rate", selectedItem.selling_price || 0);
                                                    handleUpdateItem(item.id, "amount", (item.quantity || 1) * (selectedItem.selling_price || 0));
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="border-0 focus:ring-0 px-0 h-auto text-foreground font-medium">
                                                <SelectValue placeholder="Select or type an item" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableItems.map((i: any) => (
                                                    <SelectItem key={i.id} value={i.name}>
                                                        {i.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                        className="text-right border-0 focus-visible:ring-0 px-0 h-auto"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={item.rate}
                                        onChange={(e) => handleUpdateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                                        className="text-right border-0 focus-visible:ring-0 px-0 h-auto"
                                    />
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {item.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    className="text-blue-600 border-dashed border-2 hover:bg-blue-50 h-9"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Row
                </Button>
            </div>
        </div>
    );
}
