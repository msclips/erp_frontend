import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/config/env";


export default function CreatePurchase() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        description:"",
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${config.api.baseUrl}/unit/store`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.status !== false) {
                toast({
                    title: "Unit Created",
                    description: "Unit has been created successfully",
                });

                navigate("/units");
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to create unit",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error creating unit:", error);
            toast({
                title: "Error",
                description: "Something went wrong while creating unit",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        navigate("/units");
    };

    return (
        <Layout currentPath="/units">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create Unit</h1>
                        {/*<p className="text-muted-foreground mt-1">Add a new purchase order to the system</p>*/}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        {/*<CardTitle>Purchase Order Details</CardTitle>*/}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <Label htmlFor="name">Unit</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        placeholder="Enter Unit name"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        value={formData.description}
                                        placeholder="Enter Unit Description"
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Unit</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}