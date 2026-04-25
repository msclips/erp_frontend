import React, { useState, useEffect } from "react";
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
import { Plus, Trash2, GripVertical, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useItemAutocomplete, useChartOfAccountAutocomplete } from "@/hooks/useApi";

export interface ItemRow {
  id: string;
  itemId?: number; // Store the actual item ID from backend
  details: string;
  accountId: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface ItemTableProps {
  items: ItemRow[];
  setItems: React.Dispatch<React.SetStateAction<ItemRow[]>>;
}

export function ItemTable({ items, setItems }: ItemTableProps) {
  const { data: availableItems = [] } = useItemAutocomplete();
  const { data: chartOfAccounts = [] } = useChartOfAccountAutocomplete();

  const handleAddItem = () => {
    const newItem: ItemRow = {
      id: Math.random().toString(36).substr(2, 9),
      details: "",
      accountId: "",
      quantity: 1.0,
      rate: 0.0,
      amount: 0.0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ItemRow, value: any) => {
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Item Table</h3>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
          <span className="mr-2">✓</span> Bulk Actions
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead className="w-[40%]">ITEM DETAILS</TableHead>
              <TableHead className="w-[20%]">ACCOUNT</TableHead>
              <TableHead className="w-[15%] text-right">QUANTITY</TableHead>
              <TableHead className="w-[15%] text-right">RATE</TableHead>
              <TableHead className="w-[10%] text-right">AMOUNT</TableHead>
              <TableHead className="w-[30px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move opacity-0 group-hover:opacity-100" />
                </TableCell>
                <TableCell>
                  <Select
                    value={item.details}
                    onValueChange={(value) => {
                      // Find the selected item to get its ID and other details
                      const selectedItem = availableItems.find(
                        (i: any) => i.name === value
                      );

                      // Update details (name)
                      handleUpdateItem(item.id, "details", value);

                      if (selectedItem) {
                        // Update itemId
                        handleUpdateItem(item.id, "itemId", selectedItem.id);

                        // Update rate
                        handleUpdateItem(
                          item.id,
                          "rate",
                          selectedItem.purchase_price || 0
                        );
                        // Trigger amount calculation
                        const quantity = item.quantity || 0;
                        const rate = selectedItem.purchase_price || 0;
                        handleUpdateItem(item.id, "amount", quantity * rate);
                      }
                    }}
                  >
                    <SelectTrigger className="border-0 focus:ring-0 px-0 h-auto text-gray-500">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableItems.map((i: any) => (
                        <SelectItem key={i.id} value={i.name}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={item.accountId}
                    onValueChange={(value) =>
                      handleUpdateItem(item.id, "accountId", value)
                    }
                  >
                    <SelectTrigger className="border-0 focus:ring-0 px-0 h-auto text-gray-500">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartOfAccounts.map((account: any) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="text-right border-0 focus-visible:ring-0 px-0 h-auto"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleUpdateItem(
                        item.id,
                        "rate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="text-right border-0 focus-visible:ring-0 px-0 h-auto"
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleAddItem}
          className="text-blue-600 border-gray-200 bg-gray-50 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Row
        </Button>
        <Button
          variant="outline"
          className="text-blue-600 border-gray-200 bg-gray-50 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Items in Bulk
        </Button>
      </div>
    </div>
  );
}
