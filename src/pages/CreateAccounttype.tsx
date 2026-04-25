import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateAccountType } from "@/hooks/useApi";

export default function CreateAccountType() {
    const navigate = useNavigate();
    const createAccountType = useCreateAccountType();
    const [formData, setFormData] = useState({
        name: "",
    });
    const [errors, setErrors] = useState({
        name: "",
    });

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "Account Type is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createAccountType.mutateAsync(formData);
            handleBack();
        } catch (error) {
            console.error("Error creating account type:", error);
        }
    };

    const handleBack = () => {
        navigate("/account-types");
    };

    return (
        <Layout currentPath="/account-types">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create Account Type</h1>
                        <p className="text-muted-foreground mt-1">Add a new account type to your chart of accounts</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Account Type</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        placeholder="Enter Account Type name"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm error_text">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createAccountType.isPending}>
                                    {createAccountType.isPending ? 'Creating...' : 'Create Account Type'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}