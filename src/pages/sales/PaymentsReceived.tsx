import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    DollarSign, 
    CheckCircle, 
    CreditCard, 
    MoreHorizontal, 
    Edit, 
    Trash2,
    Eye
} from "lucide-react";
import { usePaymentsReceived, useDeletePaymentReceived } from "@/hooks/useApi";

export default function PaymentsReceived() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data, isLoading } = usePaymentsReceived(page);
    const { mutate: deletePayment } = useDeletePaymentReceived();
    const payments = data?.list || [];
    const totalPages = Math.ceil((data?.total || 0) / 10);

    const filteredPayments = React.useMemo(() => {
        if (!search) return payments;
        const lowerSearch = search.toLowerCase();
        return payments.filter((p: any) => 
            p.payment_no?.toLowerCase().includes(lowerSearch) ||
            p.customer?.display_name?.toLowerCase().includes(lowerSearch) ||
            p.reference?.toLowerCase().includes(lowerSearch)
        );
    }, [payments, search]);

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this payment record?")) {
            deletePayment(id);
        }
    };

    return (
        <Layout currentPath="/sales/payments-received">
            <DashboardHeader
                title="Payments Received"
                subtitle="View and record payments from your customers"
                showCreateButton
                createButtonText="Record Payment"
                onCreateClick={() => navigate("/sales/payments-received/create")}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Received</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{payments.reduce((sum: number, p: any) => sum + Number(p.amount_received || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-success">+8% this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Payments Count</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments.length}</div>
                        <p className="text-xs text-warning">Total transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cleared Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {payments.filter((p: any) => p.payment_date === new Date().toISOString().split('T')[0]).length}
                        </div>
                        <p className="text-xs text-success">Today's collection</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>All Payments Received</CardTitle></CardHeader>
                <CardContent>
                    <div className="mb-6 flex gap-4">
                        <Input 
                            placeholder="Search payments by number, customer or reference..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                
                    {isLoading ? (
                        <div className="text-center py-8">Loading payments...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Payment#</TableHead>
                                    <TableHead>Reference#</TableHead>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead className="text-right">Amount Received</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No payments found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment: any) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.payment_date}</TableCell>
                                            <TableCell className="font-medium text-primary cursor-pointer hover:underline">
                                                {payment.payment_no}
                                            </TableCell>
                                            <TableCell>{payment.reference || '-'}</TableCell>
                                            <TableCell>{payment.customer?.display_name || 'N/A'}</TableCell>
                                            <TableCell className="capitalize">{payment.payment_mode}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₹{Number(payment.amount_received).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Payment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigate(`/sales/payments-received/edit/${payment.id}`)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Payment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(payment.id)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Payment
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                    
                    {!isLoading && filteredPayments.length > 0 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data?.total || 0)} of {data?.total || 0} entries
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= totalPages || totalPages === 0}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Layout>
    );
}
