import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useCreateChartOfAccount, useAccountTypeAutocomplete } from "@/hooks/useApi";

export default function CreateChartOfAccount() {
    const navigate = useNavigate();
    const createChartOfAccount = useCreateChartOfAccount();
    const { data: accountTypes, isLoading: loadingAccountTypes, error: accountTypesError } = useAccountTypeAutocomplete();
    
    const [formData, setFormData] = useState({
        name: "",
        account_type_id: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        account_type_id: "",
    });

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "Account name is required";
        }

        if (!formData.account_type_id || formData.account_type_id.trim() === "") {
            newErrors.account_type_id = "Account type is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createChartOfAccount.mutateAsync({
                name: formData.name,
                account_type_id: parseInt(formData.account_type_id)
            });
            handleBack();
        } catch (error) {
            console.error("Error creating chart of account:", error);
        }
    };

    const handleBack = () => {
        navigate("/chart-of-accounts");
    };

    return (
        <Layout currentPath="/chart-of-accounts">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create Chart of Account</h1>
                        <p className="text-muted-foreground mt-1">Add a new account to your chart of accounts</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Account Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        placeholder="Enter account name"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm error_text">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="account_type_id">Account Type</Label>
                                    <Select value={formData.account_type_id} onValueChange={(value) => setFormData({ ...formData, account_type_id: value })} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingAccountTypes ? (
                                                <SelectItem value="loading" disabled>Loading account types...</SelectItem>
                                            ) : accountTypesError ? (
                                                <SelectItem value="error" disabled>Error loading account types</SelectItem>
                                            ) : accountTypes && accountTypes.length > 0 ? (
                                                accountTypes.map((accountType: any) => (
                                                    <SelectItem key={accountType.id} value={accountType.id.toString()}>
                                                        {accountType.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-data" disabled>No account types available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_type_id && <p className="text-red-500 text-sm error_text">{errors.account_type_id}</p>}
                                    {accountTypesError && (
                                        <p className="text-red-500 text-sm">Failed to load account types. Please try again.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createChartOfAccount.isPending || !formData.account_type_id}>
                                    {createChartOfAccount.isPending ? 'Creating...' : 'Create Chart of Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
