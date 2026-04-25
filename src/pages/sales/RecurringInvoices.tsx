import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Calendar, Play } from "lucide-react";

export default function RecurringInvoices() {
    const navigate = useNavigate();
    return (
        <Layout currentPath="/sales/recurring-invoices">
            <DashboardHeader
                title="Recurring Invoices"
                subtitle="Automate your billing for subscription-based services"
                showCreateButton
                createButtonText="New Recurring Invoice"
                onCreateClick={() => navigate("/sales/recurring-invoices/create")}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Profiles</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-success">Generating invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Next Run</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Oct 1</div>
                        <p className="text-xs text-info">15 invoices to create</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                        <Play className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">Healthy</div>
                        <p className="text-xs text-muted-foreground">All schedules running</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>All Recurring Invoices</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Profile Name</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Last Run</TableHead>
                                <TableHead>Next Run</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No recurring invoice profiles found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Layout>
    );
}
