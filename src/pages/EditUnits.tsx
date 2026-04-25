import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/config/env";


export default function EditUnits() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const unitData = location.state?.unit;

    const [formData, setFormData] = useState({
        id:"",
        name: "",
        description :"",
    });

    // Pre-fill form data when component mounts
    useEffect(() => {
        if (unitData) {
            setFormData({
                name: unitData.name?.toString() || "",
                description: unitData.description?.toString() || "",
                id: unitData.id?.toString() || "",
            });
        }
    }, [unitData]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const payload = {
                id: parseInt(formData.id),
                name: formData.name,
                description: formData.description
            };

            const res = await fetch(`${config.api.baseUrl}/unit/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.status !== false) {
                toast({
                    title: "Unit Updated",
                    description: "Unit has been Updated successfully",
                });

                navigate("/units");
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to update unit",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error updating unit:", error);
            toast({
                title: "Error",
                description: "Something went wrong while updating unit",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        navigate("/units");
    };

    if (!unitData) {
        return (
            <Layout currentPath="/purchases">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Unit Not Found</h1>
                            <p className="text-muted-foreground mt-1">No order data available for editing</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout currentPath="/purchases">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Edit Unit</h1>
                        {/*<p className="text-muted-foreground mt-1">Order ID: {unitData.id}</p>*/}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        {/*<CardTitle>Purchase Order Details</CardTitle>*/}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                id="id"
                                type="hidden"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                required
                            />
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Unit</Label>
                                    <Input
                                        id="name"
                                        type="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="test"
                                        required
                                    />
                                </div>
                            </div> */}

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="test"
                                        required
                                        className="text-right"
                                    />
                                </div>
                            
                            </div> */}

                            {/* --- Fields row --- */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
  {/* Unit (left) */}
  <div className="w-full">
    <Label htmlFor="name">Unit</Label>
    <Input
      id="name"
      type="text"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      placeholder="Unit"
      required
    />
  </div>

  {/* Description (right) */}
  <div className="w-full">
    <Label htmlFor="description">Description</Label>
    <Input
      id="description"
      type="text"
      value={formData.description}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
      placeholder="Description"
      required
    />
  </div>
</div>


                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}