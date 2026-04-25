import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Wrench, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUpdateItem, useUnitAutocomplete, useGstTaxStatus, useGstRates } from "@/hooks/useApi";
import { config } from "@/config/env";

interface Unit {
    id: string;
    name: string;
    description?: string;
}


interface GstStatus {
    id: number;
    name: string;
}

interface GstRates {
    id: number;
    name: string;
}

interface ItemData {
    id: string;
    code: string;
    name: string;
    type: number; // 1 for GOODS, 2 for SERVICE
    unit_id?: number | string; // API returns this as top-level field
    unit?: {
        id: string | number;
        name: string;
        description?: string;
    };
    selling_price: number;
    purchase_price?: number;
    mrp?: number;
    opening_stock?: number;
    opening_stock_value?: number;
    minimum_stock_level?: number;
    tax_status?: number;
    gst_rate?: number;
    description?: string;
    sac_code?: string;
}

interface Material {
    id?: string;
    name: string;
    code: string;
    sac_code?: string;
    unit_id?: string;
    type: number;
    purchase_price?: number;
    selling_price: number;
    mrp?: number;
    opening_stock?: number;
    opening_stock_value?: number;
    minimum_stock_level?: number;
    description?: string;
    tax_status?: number;
    gst_rate?: number;
}

export default function EditItem() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const updateItem = useUpdateItem();
    const itemData = location.state?.item as ItemData;
    console.log('itemData')
    console.log(itemData)
    const [isServiceMode, setIsServiceMode] = useState(false);
    
    // Use new hooks for data fetching
    const { data: unitOptions = [], isLoading: unitsLoading, error: unitsError } = useUnitAutocomplete();
    const { data: gstStatusOptions = [], isLoading: gstStatusLoading, error: gstStatusError } = useGstTaxStatus();
    const { data: gstRateOptions = [], isLoading: gstRateLoading, error: gstRateError } = useGstRates();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        code: "",
        sac_code: "",
        unit_id: "",
        type: 1, // 1 for GOODS, 2 for SERVICE
        purchase_price: "",
        selling_price: "",
        mrp: "",
        opening_stock: "",
        opening_stock_value: "",
        minimum_stock_level: "",
        description: "",
        tax_status: 1, // 1 for taxable, 0 for exempt
        gst_rate: "18",
    });

    useEffect(() => {
        if (!formData.unit_id || unitOptions.length === 0) return;

        const selected = unitOptions.find(u => u.id === formData.unit_id);
        if (selected && !formData.description) {
            setFormData(prev => ({
                ...prev,
                description: selected.description || "",
            }));
        }
    }, [unitOptions, formData.unit_id]);
    // Pre-fill form data when component mounts
    useEffect(() => {
        if (itemData) {
            console.log('🔥 EditItem - Loading itemData:', itemData);
            setIsServiceMode(itemData.type === 2);
            
            // Get unit_id from the itemData - it could be in itemData.unit_id or itemData.unit.id
            const unitId = (itemData as any).unit_id || itemData.unit?.id || "";
            console.log('🔥 EditItem - Unit ID found:', unitId);
            
            setFormData({
                id: itemData.id || "",
                name: itemData.name || "",
                code: itemData.code || "",
                sac_code: itemData.sac_code || "",
                unit_id: unitId?.toString() || "",
                type: itemData.type || 1,
                purchase_price: itemData.purchase_price?.toString() || "",
                selling_price: itemData.selling_price?.toString() || "",
                mrp: itemData.mrp?.toString() || "",
                opening_stock: itemData.opening_stock?.toString() || "",
                opening_stock_value: itemData.opening_stock_value?.toString() || "",
                minimum_stock_level: itemData.minimum_stock_level?.toString() || "",
                description: itemData.description || "",
                tax_status: itemData.tax_status || 1,
                gst_rate: itemData.gst_rate?.toString() || "18",
            });
            console.log('🔥 EditItem - Form data set with unit_id:', unitId?.toString() || "");
        }
    }, [itemData]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const switchToItem = () => {
        setIsServiceMode(false);
        setFormData(prev => ({ ...prev, type: 1 }));
    };

    const switchToService = () => {
        setIsServiceMode(true);
        setFormData(prev => ({ ...prev, type: 2 }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validations
        if (!formData.code.trim()) {
            toast({ title: "Validation", description: "Item code is required", variant: "destructive" });
            return;
        }
        if (!formData.name.trim()) {
            toast({ title: "Validation", description: `${isServiceMode ? "Service" : "Item"} name is required`, variant: "destructive" });
            return;
        }
        if (!formData.unit_id) {
            toast({ title: "Validation", description: "Unit is required", variant: "destructive" });
            return;
        }
        const selling = parseFloat(formData.selling_price || "0");
        if (Number.isNaN(selling) || selling < 0) {
            toast({ title: "Validation", description: "Selling price must be a valid non-negative number", variant: "destructive" });
            return;
        }
        const mrp = parseFloat(formData.mrp || "0");
        if (!isServiceMode && mrp > 0 && selling > mrp) {
            toast({ title: "Validation", description: "Selling price cannot be higher than MRP", variant: "destructive" });
            return;
        }

        try {
            const payload = {
                id: parseInt(formData.id),
                name: formData.name,
                code: formData.code,
                sac_code: formData.sac_code || "", // Send empty string instead of undefined
                unit_id: formData.unit_id ? parseInt(formData.unit_id) : undefined,
                type: formData.type,
                purchase_price: parseFloat(formData.purchase_price) || undefined,
                selling_price: selling,
                mrp: mrp || undefined,
                opening_stock: parseInt(formData.opening_stock) || undefined,
                opening_stock_value: parseFloat(formData.opening_stock_value) || undefined,
                minimum_stock_level: parseInt(formData.minimum_stock_level) || undefined,
                description: formData.description || undefined,
                tax_status: formData.tax_status,
                gst_rate: formData.tax_status === 0 ? 0 : parseFloat(formData.gst_rate || "0") || undefined,
            };

            console.log('🔥 EditItem - Submitting payload:', payload);
            console.log('🔥 EditItem - Payload JSON:', JSON.stringify(payload, null, 2));

            await updateItem.mutateAsync(payload);
            navigate("/item");
        } catch (error: any) {
            console.error('🔥 EditItem - Error:', error);
            // Error handling is done by the hook
        }
    };

    const handleBack = () => {
        navigate("/item");
    };

    if (!itemData) {
        return (
            <Layout currentPath="/item">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Item Not Found</h1>
                            <p className="text-muted-foreground mt-1">No item data available for editing</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout currentPath="/item">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Edit {isServiceMode ? "Service" : "Item"}
                        </h1>
                        <p className="text-muted-foreground mt-1">Update item details</p>
                    </div>
                </div>

                {/* Toggle Buttons */}
                <div className="flex gap-4 justify-center mb-6">
                    <Button
                        variant={!isServiceMode ? "default" : "outline"}
                        onClick={switchToItem}
                    >
                        <Package className="w-4 h-4 mr-2" />
                        Item
                    </Button>
                    <Button
                        variant={isServiceMode ? "default" : "outline"}
                        onClick={switchToService}
                    >
                        <Wrench className="w-4 h-4 mr-2" />
                        Service
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="text-sm font-semibold">
                                        {isServiceMode ? "Service Code" : "Item Code"} *
                                    </Label>
                                    <Input
                                        id="code"
                                        value={formData.code}
                                        onChange={(e) => handleInputChange("code", e.target.value)}
                                        placeholder={isServiceMode ? "e.g., SRV001" : "e.g., ITM001"}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold">
                                        {isServiceMode ? "Service Name" : "Item Name"} *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder={`Enter ${isServiceMode ? "service" : "item"} name`}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sac_code" className="text-sm font-semibold">
                                        {isServiceMode ? "SAC Code" : "HSN/SAC Code"}
                                    </Label>
                                    <Input
                                        id="sac_code"
                                        value={formData.sac_code}
                                        onChange={(e) => handleInputChange("sac_code", e.target.value)}
                                        placeholder="e.g., 1234567890"
                                    />
                                </div>

                                {/* <div className="space-y-2">
                                    <Label htmlFor="unit_id" className="text-sm font-semibold">
                                        Unit of Measurement *
                                    </Label>
                                    <Select
                                        value={formData.unit_id?.toString()}
                                        onValueChange={(value) => handleInputChange("unit_id", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unitOptions.map((unit) => (
                                                console.log('unit'),
                                                console.log(unit.id),
                                                <SelectItem key={unit.id} value={unit.id}>
                                                    {unit.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                   
                                </div> */}
                                <div className="space-y-2">
                                    <Label htmlFor="unit_id" className="text-sm font-semibold">
                                        Unit of Measurement *
                                    </Label>

                                    <Select
                                        value={String(formData.unit_id || "")}
                                        onValueChange={(value) => {
                                            console.log('🔥 EditItem - Unit changed to:', value);
                                            // find unit
                                            const selected = unitOptions.find(u => String(u.id) === value);
                                            setFormData(prev => ({
                                                ...prev,
                                                unit_id: value,
                                                // choose one behavior:
                                                // 1) Always overwrite:
                                                // description: selected?.description || "",
                                                // 2) Only fill if empty:
                                                description: prev.description || selected?.description || ""
                                            }));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit">
                                                {formData.unit_id ? unitOptions.find(u => String(u.id) === String(formData.unit_id))?.name : "Select unit"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unitsLoading ? (
                                                <SelectItem value="loading" disabled>Loading units...</SelectItem>
                                            ) : unitsError ? (
                                                <SelectItem value="error" disabled>Error loading units</SelectItem>
                                            ) : (
                                                unitOptions.map((unit) => {
                                                    // Ensure IDs are compared as strings
                                                    const unitIdStr = String(unit.id);
                                                    const formDataUnitIdStr = String(formData.unit_id);
                                                    const isSelected = unitIdStr === formDataUnitIdStr;
                                                    
                                                    console.log('🔥 EditItem - Rendering unit:', unitIdStr, unit.name, 'Current value:', formDataUnitIdStr, 'Match:', isSelected);
                                                    return (
                                                        <SelectItem key={unit.id} value={unitIdStr}>
                                                            {unit.name}
                                                        </SelectItem>
                                                    );
                                                })
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {!isServiceMode && (
                                    <div className="space-y-2">
                                        <Label htmlFor="purchase_price" className="text-sm font-semibold">
                                            Purchase Price
                                        </Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                            <Input
                                                id="purchase_price"
                                                type="number"
                                                value={formData.purchase_price}
                                                onChange={(e) => handleInputChange("purchase_price", e.target.value)}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="selling_price" className="text-sm font-semibold">
                                        {isServiceMode ? "Service Rate" : "Selling Price"} *
                                    </Label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                        <Input
                                            id="selling_price"
                                            type="number"
                                            value={formData.selling_price}
                                            onChange={(e) => handleInputChange("selling_price", e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            required
                                            className="pl-8"
                                        />
                                    </div>
                                </div>

                                {!isServiceMode && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="mrp" className="text-sm font-semibold">
                                                MRP
                                            </Label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                <Input
                                                    id="mrp"
                                                    type="number"
                                                    value={formData.mrp}
                                                    onChange={(e) => handleInputChange("mrp", e.target.value)}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    className="pl-8"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="opening_stock" className="text-sm font-semibold">
                                                Opening Stock
                                            </Label>
                                            <Input
                                                id="opening_stock"
                                                type="number"
                                                value={formData.opening_stock}
                                                onChange={(e) => handleInputChange("opening_stock", e.target.value)}
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="opening_stock_value" className="text-sm font-semibold">
                                                Opening Stock Value
                                            </Label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                <Input
                                                    id="opening_stock_value"
                                                    type="number"
                                                    value={formData.opening_stock_value}
                                                    onChange={(e) => handleInputChange("opening_stock_value", e.target.value)}
                                                    placeholder="0"
                                                    min="0"
                                                    className="pl-8"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="minimum_stock_level" className="text-sm font-semibold">
                                                Minimum Stock Level
                                            </Label>
                                            <Input
                                                id="minimum_stock_level"
                                                type="number"
                                                value={formData.minimum_stock_level}
                                                onChange={(e) => handleInputChange("minimum_stock_level", e.target.value)}
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-semibold">
                                    {isServiceMode ? "Service Description" : "Description"}
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder={`Enter ${isServiceMode ? "service" : "item"} description...`}
                                    rows={4}
                                />
                            </div>

                            {/* GST Configuration */}
                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-lg text-blue-800">GST Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="tax_status" className="text-sm font-semibold">
                                                Tax Status *
                                            </Label>
                                            <Select
                                                value={formData.tax_status.toString()}
                                                onValueChange={(value) => handleInputChange("tax_status", parseInt(value))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Tax Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gstStatusLoading ? (
                                                        <SelectItem value="loading" disabled>Loading tax status...</SelectItem>
                                                    ) : gstStatusError ? (
                                                        <SelectItem value="error" disabled>Error loading tax status</SelectItem>
                                                    ) : (
                                                        gstStatusOptions.map((gstStatus) => (
                                                            <SelectItem key={gstStatus.id} value={String(gstStatus.id)}>
                                                                {gstStatus.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gst_rate" className="text-sm font-semibold">
                                                GST Rate *
                                            </Label>
                                            <Select
                                                value={formData.gst_rate}
                                                onValueChange={(value) => handleInputChange("gst_rate", value)}
                                                disabled={formData.tax_status === 2} // 2 is Exempt
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select GST Rate" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gstRateLoading ? (
                                                        <SelectItem value="loading" disabled>Loading GST rates...</SelectItem>
                                                    ) : gstRateError ? (
                                                        <SelectItem value="error" disabled>Error loading GST rates</SelectItem>
                                                    ) : (
                                                        gstRateOptions.map((gstRate) => (
                                                            <SelectItem key={gstRate.id} value={String(gstRate.id)}>
                                                                {gstRate.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="bg-blue-100 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> Most {isServiceMode ? "services" : "items"} attract 18% GST.
                                            Please verify the correct rate for your specific {isServiceMode ? "service" : "item"} category.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updateItem.isPending}>
                                    {updateItem.isPending ? "Updating..." : `Update ${isServiceMode ? "Service" : "Item"}`}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
