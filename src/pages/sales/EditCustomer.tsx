import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomer, useUpdateCustomer } from "@/hooks/useApi";

export default function EditCustomer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const { data: customerData, isLoading: isFetching, error: fetchError } = useCustomer(Number(id));
    const updateCustomerMutation = useUpdateCustomer();

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
        first_name: "",
        last_name: ""
    });

    useEffect(() => {
        if (customerData) {
            console.log('🔥 Initializing form with customer data:', customerData);
            
            // Extract primary contact person if available
            const primaryContact = customerData.contact_person?.[0] || {};
            
            // Normalize customer_type to numeric 1 (Business) or 2 (Individual)
            let numericType = 1;
            const rawType = customerData.customer_type;
            if (rawType === 2 || rawType === "2" || (typeof rawType === 'string' && rawType.toLowerCase() === 'individual')) {
                numericType = 2;
            }

            setFormData({
                customer_type: numericType,
                display_name: customerData.display_name || "",
                company_name: customerData.company_name || "",
                email: customerData.email || "",
                phone: customerData.phone || "",
                mobile: customerData.mobile || "",
                website: customerData.website || "",
                address: customerData.address || "",
                city: customerData.city || "",
                state: customerData.state || "",
                zip_code: customerData.zip_code || "",
                country: customerData.country || "India",
                remarks: customerData.remarks || "",
                first_name: primaryContact.first_name || "",
                last_name: primaryContact.last_name || ""
            });
        }
    }, [customerData]);

    const handleSave = async () => {
        if (!formData.display_name) {
            toast({ title: "Error", description: "Display name is required", variant: "destructive" });
            return;
        }

        try {
            const apiData = {
                id: Number(id),
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
                        email: formData.email,
                        work_phone: formData.phone
                    }
                ] : []
            };

            await updateCustomerMutation.mutateAsync(apiData);
            navigate("/sales/customers");
        } catch (err) {
            // Mutation handles errors via toast
            console.error('🔥 Update failed:', err);
        }
    };

    if (isFetching) {
        return (
            <Layout currentPath="/sales/customers">
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 font-medium">Fetching customer details...</span>
                </div>
            </Layout>
        );
    }

    if (fetchError) {
        return (
            <Layout currentPath="/sales/customers">
                <div className="p-12 text-center max-w-md mx-auto">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <ArrowLeft className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Error loading customer</h2>
                    <p className="mt-2 text-muted-foreground">{(fetchError as any).message || "The requested customer could not be found or the server is unreachable."}</p>
                    <Button variant="outline" className="mt-6 w-full" onClick={() => navigate("/sales/customers")}>
                        Return to List
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout currentPath="/sales/customers">
            <div className="p-6 max-w-5xl mx-auto bg-white min-h-screen">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate("/sales/customers")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <User className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-semibold italic text-foreground">Edit Customer</h1>
                    </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-6 mb-12">
                    <Label className="font-medium pt-2 text-muted-foreground">Customer Type</Label>
                    <RadioGroup
                        value={formData.customer_type === 1 ? "business" : "individual"}
                        onValueChange={(val) => setFormData({ ...formData, customer_type: val === "business" ? 1 : 2 })}
                        className="flex gap-6 pt-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="business" id="business" />
                            <Label htmlFor="business" className="cursor-pointer">Business</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="individual" id="individual" />
                            <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
                        </div>
                    </RadioGroup>

                    <Label className="font-medium pt-2 text-red-500">Display Name*</Label>
                    <Input
                        className="max-w-md border-blue-100 focus:border-blue-400 transition-colors"
                        required
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        placeholder="Customer Display Name"
                    />

                    <Label className="font-medium pt-2 text-muted-foreground">Primary Contact</Label>
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

                    <Label className="font-medium pt-2 text-muted-foreground">Company Name</Label>
                    <Input
                        className="max-w-md"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="Company Name"
                    />

                    <Label className="font-medium pt-2 text-muted-foreground">Email Address</Label>
                    <Input
                        type="email"
                        className="max-w-md"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="customer@email.com"
                    />

                    <Label className="font-medium pt-2 text-muted-foreground">Phone Numbers</Label>
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

                    <Label className="font-medium pt-2 text-muted-foreground">Website</Label>
                    <Input
                        placeholder="www.example.com"
                        className="max-w-md"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </div>

                <Tabs defaultValue="address" className="w-full mt-10">
                    <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-8">
                        <TabsTrigger value="address" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-6 py-3 font-semibold text-muted-foreground">Address Information</TabsTrigger>
                        <TabsTrigger value="remarks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-6 py-3 font-semibold text-muted-foreground">Remarks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="address">
                        <div className="max-w-2xl space-y-6 pt-2">
                            <div className="space-y-3">
                                <Label className="text-muted-foreground font-bold text-xs uppercase">Street Address</Label>
                                <Input 
                                    placeholder="e.g. 123 Main St" 
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-bold text-xs uppercase">City</Label>
                                        <Input 
                                            placeholder="City" 
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-bold text-xs uppercase">State</Label>
                                        <Input 
                                            placeholder="State" 
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-bold text-xs uppercase">Zip Code</Label>
                                        <Input 
                                            placeholder="Zip Code" 
                                            value={formData.zip_code}
                                            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-bold text-xs uppercase">Country</Label>
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
                        <div className="max-w-2xl pt-2">
                            <Label className="mb-2 block text-muted-foreground uppercase text-xs font-bold">Notes for Internal Use</Label>
                            <Textarea 
                                rows={8} 
                                placeholder="Enter any additional information about this customer..." 
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                className="resize-none"
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-start gap-4 z-10 md:pl-72 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 px-8 font-semibold shadow-md transition-all active:scale-95" 
                        onClick={handleSave}
                        disabled={updateCustomerMutation.isPending}
                    >
                        {updateCustomerMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : "Update Customer"}
                    </Button>
                    <Button variant="outline" className="px-8 font-medium" onClick={() => navigate("/sales/customers")}>Cancel</Button>
                </div>
                <div className="h-24"></div>
            </div>
        </Layout>
    );
}
