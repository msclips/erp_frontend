import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Wrench, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateItem, useUnitAutocomplete, useGstTaxStatus, useGstRates } from "@/hooks/useApi";
import { config } from "@/config/env";

interface Unit {
    id: string;
    name: string;
    description?: string;
}

interface GstStatus {
    id: string;
    name: string;
}

interface GstRates {
    id: string;
    name: string;
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
    tax_status?: string;
    gst_rate?: string;
}

export default function CreateItem() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const createItem = useCreateItem();
    const [isServiceMode, setIsServiceMode] = useState(false);
    
    // Use new hooks for data fetching
    const { data: unitOptions = [], isLoading: unitsLoading, error: unitsError } = useUnitAutocomplete();
    const { data: gstStatusOptions = [], isLoading: gstStatusLoading, error: gstStatusError } = useGstTaxStatus();
    const { data: gstRateOptions = [], isLoading: gstRateLoading, error: gstRateError } = useGstRates();

    const [formData, setFormData] = useState({
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
        tax_status: "", // 1 for taxable, 0 for exempt
        gst_rate: "",
        service_rate: "",
        warranty_period: "",
    });

    // Debug logging
    console.log('🔥 CreateItem - Unit Options:', unitOptions, 'Loading:', unitsLoading, 'Error:', unitsError);
    console.log('🔥 CreateItem - GST Status Options:', gstStatusOptions, 'Loading:', gstStatusLoading, 'Error:', gstStatusError);
    console.log('🔥 CreateItem - GST Rate Options:', gstRateOptions, 'Loading:', gstRateLoading, 'Error:', gstRateError);
    console.log('🔥 CreateItem - Current formData.unit_id:', formData.unit_id);
    const token = localStorage.getItem('token');
    console.log('🔥 CreateItem - Token in localStorage:', token);
    console.log('🔥 CreateItem - Token length:', token?.length || 0);
    console.log('🔥 CreateItem - Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');

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

    const generateCode = () => {
        if (!formData.name) return;
        const prefix = isServiceMode ? "SRV" : "ITM";
        const code = prefix + Date.now().toString().slice(-6);
        setFormData(prev => ({ ...prev, code }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            sac_code: "",
            unit_id: "",
            type: isServiceMode ? 2 : 1,
            purchase_price: "",
            selling_price: "",
            mrp: "",
            opening_stock: "",
            opening_stock_value: "",
            minimum_stock_level: "",
            description: "",
            tax_status: "",
            gst_rate: "",
            service_rate: "",
            warranty_period: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('🔥 CreateItem - Form submission started');
        console.log('🔥 CreateItem - Form data:', formData);

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
        if (!formData.tax_status) {
            toast({ title: "Validation", description: "Tax Status is required", variant: "destructive" });
            return;
        }
        if (!formData.gst_rate) {
            toast({ title: "Validation", description: "GST Rate is required", variant: "destructive" });
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

        console.log('🔥 CreateItem - All validations passed, proceeding with API call');

        try {
            const payload = {
                name: formData.name,
                unit_id: parseInt(formData.unit_id), // Convert to number
                type: formData.type,
                code: formData.code,
                sac_code: formData.sac_code,
                purchase_price: parseFloat(formData.purchase_price) || 0,
                selling_price: selling,
                mrp: mrp || 0,
                opening_stock: parseInt(formData.opening_stock) || 0,
                opening_stock_value: parseFloat(formData.opening_stock_value) || 0,
                minimum_stock_level: parseInt(formData.minimum_stock_level) || 0,
                description: formData.description,
                tax_status: parseInt(formData.tax_status),
                gst_rate: parseFloat(formData.gst_rate),
                service_rate: parseFloat(formData.service_rate) || 0,
                warranty_period: formData.warranty_period,
            };

            console.log('🔥 CreateItem - Submitting payload:', payload);
            console.log('🔥 CreateItem - Payload JSON:', JSON.stringify(payload, null, 2));
            console.log('🔥 CreateItem - Is Service Mode:', isServiceMode);
            console.log('🔥 CreateItem - API Endpoint: /item/store');

            const result = await createItem.mutateAsync(payload);
            console.log('🔥 CreateItem - API Response:', result);
            
            // Only reset form and navigate if the mutation was successful
            resetForm();
            navigate("/item");
        } catch (error: any) {
            console.error('🔥 CreateItem - Error:', error);
            console.error('🔥 CreateItem - Error message:', error.message);
            console.error('🔥 CreateItem - Error stack:', error.stack);
            // Error handling is done by the hook, but we can add additional logging here
        }
    };

    const handleBack = () => {
        navigate("/item");
    };

    // Temporary function to set token for testing (remove this in production)
    const setTestToken = () => {
        const testToken = prompt('Enter your token from Postman:');
        if (testToken) {
            localStorage.setItem('token', testToken);
            console.log('🔥 Test token set:', testToken);
            toast({
                title: 'Test Token Set',
                description: 'Token has been set for testing',
            });
        }
    };

    // Test API connection function
    const testApiConnection = async () => {
        try {
            console.log('🔥 Testing API connection...');
            const response = await fetch('/api/item/datatable?page=1&limit=1', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('🔥 Test response status:', response.status);
            console.log('🔥 Test response ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('🔥 Test response data:', data);
                toast({
                    title: 'API Test Success',
                    description: 'API connection is working',
                });
            } else {
                const errorText = await response.text();
                console.log('🔥 Test error response:', errorText);
                toast({
                    title: 'API Test Failed',
                    description: `Status: ${response.status}, Error: ${errorText}`,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('🔥 Test API error:', error);
            toast({
                title: 'API Test Error',
                description: error.message || 'Network error',
                variant: 'destructive',
            });
        }
    };

    return (
        <Layout currentPath="/item">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {isServiceMode ? "Create New Service" : "Create New Item"}
                        </h1>
                        <p className="text-muted-foreground mt-1">Indian Accounting System - Item & Service Master</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={setTestToken}
                        >
                            Set Test Token
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={testApiConnection}
                        >
                            Test API
                        </Button>
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
                                        onBlur={generateCode}
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

                                <div className="space-y-2">
                                    <Label htmlFor="unit_id" className="text-sm font-semibold">
                                        Unit of Measurement *
                                    </Label>
                                    <Select
                                        value={formData.unit_id}
                                        onValueChange={(value) => {
                                            console.log('🔥 Unit selected:', value);
                                            handleInputChange("unit_id", value);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unitsLoading ? (
                                                <SelectItem value="loading" disabled>Loading units...</SelectItem>
                                            ) : unitsError ? (
                                                <SelectItem value="error" disabled>Error loading units</SelectItem>
                                            ) : (
                                                unitOptions.map((unit) => (
                                                <SelectItem key={unit.id} value={String(unit.id)}>
                                                    {unit.name}
                                                </SelectItem>
                                                ))
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
                                            <Select value={formData.tax_status}
                                                onValueChange={(value) => handleInputChange("tax_status", value)}
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
                                            <Select value={formData.gst_rate}
                                                    onValueChange={(value) => handleInputChange("gst_rate", value)}
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

                            {/* Additional Fields */}
                            <Card className="bg-gray-50 border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-800">Additional Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="service_rate" className="text-sm font-semibold">
                                                Service Rate
                                            </Label>
                                            <Input
                                                id="service_rate"
                                                type="number"
                                                value={formData.service_rate}
                                                onChange={(e) => handleInputChange("service_rate", e.target.value)}
                                                placeholder="Enter service rate"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="warranty_period" className="text-sm font-semibold">
                                                Warranty Period
                                            </Label>
                                            <Input
                                                id="warranty_period"
                                                value={formData.warranty_period}
                                                onChange={(e) => handleInputChange("warranty_period", e.target.value)}
                                                placeholder="e.g., 1 year, 6 months, 30 days"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Reset
                                </Button>
                                <Button type="submit" disabled={createItem.isPending}>
                                    {createItem.isPending ? "Creating..." : `Create ${isServiceMode ? "Service" : "Item"}`}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
