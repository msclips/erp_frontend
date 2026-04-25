import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateCustomer } from "@/hooks/useApi";

export default function CreateCustomer() {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const [formData, setFormData] = useState({
        customer_type: 1, // 1 for Business, 2 for Individual
        display_name: "",
        company_name: "",
        email: "",
        phone: "",
        mobile: "",
        website: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "India",
        remarks: "",
        first_name: "", // Primary Contact Person First Name
        last_name: ""   // Primary Contact Person Last Name
    });

    const createCustomerMutation = useCreateCustomer();

    const handleSave = async () => {
        if (!formData.display_name) {
            toast({ title: "Error", description: "Display name is required", variant: "destructive" });
            return;
        }

        try {
            // Mapping UI field to API expected field name if necessary
            const apiData = {
                display_name: formData.display_name,
                customer_type: Number(formData.customer_type),
                company_name: formData.company_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zip_code,
                country: formData.country,
                remarks: formData.remarks,
                contact_person: formData.first_name || formData.last_name ? [
                    {
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        email: formData.email, // Defaults to main email if not separate
                        work_phone: formData.phone
                    }
                ] : []
            };

            await createCustomerMutation.mutateAsync(apiData);
            navigate("/sales/customers");
        } catch (err) {
            // Mutation handles errors via toast
        }
    };

    return (
        <Layout currentPath="/sales/customers">
            <div className="p-6 max-w-5xl mx-auto bg-white min-h-screen">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate("/sales/customers")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <User className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-semibold italic">New Customer</h1>
                    </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-6 mb-12">
                    <Label className="font-medium pt-2">Customer Type</Label>
                    <RadioGroup
                        defaultValue="business"
                        onValueChange={(val) => setFormData({ ...formData, customer_type: val === "business" ? 1 : 2 })}
                        className="flex gap-6 pt-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="business" id="business" />
                            <Label htmlFor="business">Business</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="individual" id="individual" />
                            <Label htmlFor="individual">Individual</Label>
                        </div>
                    </RadioGroup>

                    <Label className="font-medium pt-2 text-red-500">Display Name*</Label>
                    <Input
                        className="max-w-md"
                        required
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        placeholder="e.g. Acme Corp"
                    />

                    <Label className="font-medium pt-2">Primary Contact</Label>
                    <div className="flex gap-4">
                        <Input
                            placeholder="First Name"
                            className="max-w-[200px]"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                        <Input
                            placeholder="Last Name"
                            className="max-w-[200px]"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                    </div>

                    <Label className="font-medium pt-2">Company Name</Label>
                    <Input
                        className="max-w-md"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    />

                    <Label className="font-medium pt-2">Email Address</Label>
                    <Input
                        type="email"
                        className="max-w-md"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Label className="font-medium pt-2">Phone Numbers</Label>
                    <div className="flex gap-4 max-w-md">
                        <Input
                            placeholder="Work Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            placeholder="Mobile"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </div>

                    <Label className="font-medium pt-2">Website</Label>
                    <Input
                        placeholder="www.example.com"
                        className="max-w-md"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </div>

                <Tabs defaultValue="address" className="w-full">
                    <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-8">
                        <TabsTrigger value="address" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3">Address Information</TabsTrigger>
                        <TabsTrigger value="remarks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3">Remarks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="address">
                        <div className="max-w-2xl space-y-4 pt-4">
                            <div className="space-y-3">
                                <Label>Street Address</Label>
                                <Input 
                                    placeholder="e.g. 123 Main St" 
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input 
                                            placeholder="City" 
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input 
                                            placeholder="State" 
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Zip Code</Label>
                                        <Input 
                                            placeholder="Zip Code" 
                                            value={formData.zip_code}
                                            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Country</Label>
                                        <Input 
                                            placeholder="Country" 
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="remarks">
                        <div className="max-w-2xl pt-4">
                            <Label className="mb-2 block text-muted-foreground uppercase text-xs font-bold">Notes for Internal Use</Label>
                            <Textarea 
                                rows={8} 
                                placeholder="Enter any additional information about this customer..." 
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-start gap-4 z-10 md:pl-72 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 px-8" 
                        onClick={handleSave}
                        disabled={createCustomerMutation.isPending}
                    >
                        {createCustomerMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : "Save Customer"}
                    </Button>
                    <Button variant="outline" className="px-8" onClick={() => navigate("/sales/customers")}>Cancel</Button>
                </div>
                <div className="h-24"></div>
            </div>
        </Layout>
    );
}
