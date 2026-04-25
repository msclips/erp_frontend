import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreatePaymentTerm } from "@/hooks/useApi";

export default function CreatePaymentTerms() {
    const navigate = useNavigate();
    const createPaymentTerm = useCreatePaymentTerm();
    const [formData, setFormData] = useState({
        term: "",
        condition: "",
    });
    const [errors, setErrors] = useState({
        term: "",
        condition: "",
    });

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.term || formData.term.trim() === "") {
            newErrors.term = "Term is required";
        }

        if (!formData.condition || formData.condition.trim() === "") {
            newErrors.condition = "Condition is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createPaymentTerm.mutateAsync(formData);
            handleBack();
        } catch (error) {
            console.error("Error creating payment term:", error);
        }
    };

    const handleBack = () => {
        navigate("/payment-terms");
    };

    return (
        <Layout currentPath="/payment-terms">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create Payment Term</h1>
                        <p className="text-muted-foreground mt-1">Add a new payment term for your invoices and orders</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="term">Term</Label>
                                    <Input
                                        id="term"
                                        type="text"
                                        value={formData.term}
                                        placeholder="Enter payment term"
                                        onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                        required
                                    />
                                    {errors.term && <p className="text-red-500 text-sm error_text">{errors.term}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="condition">Condition</Label>
                                    <Input
                                        id="condition"
                                        type="text"
                                        value={formData.condition}
                                        placeholder="Enter condition"
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        required
                                    />
                                    {errors.condition && <p className="text-red-500 text-sm error_text">{errors.condition}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createPaymentTerm.isPending}>
                                    {createPaymentTerm.isPending ? 'Creating...' : 'Create Payment Term'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

