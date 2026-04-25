import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices, useDeleteInvoice } from "@/hooks/useApi";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
    FileText,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    Download,
    Send,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusColor = (status: string) => {
    switch (status) {
        case "paid":
            return "bg-success text-success-foreground";
        case "pending":
            return "bg-warning text-warning-foreground";
        case "overdue":
            return "bg-destructive text-destructive-foreground";
        case "draft":
            return "bg-muted text-muted-foreground";
        default:
            return "bg-secondary text-secondary-foreground";
    }
};

const Invoices = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useInvoices(page);
    const { mutate: deleteInvoice } = useDeleteInvoice();
    const invoices = data?.list || [];
    const totalPages = Math.ceil((data?.total || 0) / 10);

    const [filters, setFilters] = useState({
        search: "",
        status: "all",
    });

    const filteredInvoices = useMemo(() => {
        return invoices.filter((invoice: any) => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (
                    !invoice.invoice_no?.toLowerCase().includes(searchLower) &&
                    !invoice.customer?.display_name?.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            if (filters.status !== "all" && invoice.status !== filters.status) {
                return false;
            }

            return true;
        });
    }, [filters, invoices]);

    const handleDeleteInvoice = (id: number) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            deleteInvoice(id);
        }
    };

    return (
        <Layout currentPath="/sales/invoices">
            <DashboardHeader
                title="Invoices"
                subtitle="Manage customer billing and track payment statuses"
                showCreateButton
                createButtonText="New Invoice"
                onCreateClick={() => navigate("/sales/invoices/create")}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Invoiced
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ₹{invoices.reduce((sum: number, i: any) => sum + Number(i.total || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-success">+12% this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Paid Amount
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ₹{invoices.filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + Number(i.total || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-success">
                            {invoices.length ? Math.round((invoices.filter((i: any) => i.status === 'paid').length / invoices.length) * 100) : 0}% recovery rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ₹{invoices.filter((i: any) => i.status === 'pending').reduce((sum: number, i: any) => sum + Number(i.total || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-warning">Awaiting payment</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Overdue
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ₹{invoices.filter((i: any) => i.status === 'overdue').reduce((sum: number, i: any) => sum + Number(i.total || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-destructive">Require attention</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Invoices ({filteredInvoices.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <select
                            className="px-3 py-2 border border-border rounded-md bg-background"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    <div className="mt-6">
                        {isLoading ? (
                            <div className="text-center py-8">Loading invoices...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-destructive">Error loading invoices.</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No invoices found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredInvoices.map((invoice: any) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium text-primary hover:underline cursor-pointer">
                                                    {invoice.invoice_no}
                                                </TableCell>
                                                <TableCell>{invoice.customer?.display_name || 'N/A'}</TableCell>
                                                <TableCell>{invoice.invoice_date}</TableCell>
                                                <TableCell>{invoice.due_date}</TableCell>
                                                <TableCell className="font-medium">
                                                    ₹{Number(invoice.total).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(invoice.status)}>
                                                        {invoice.status}
                                                    </Badge>
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
                                                                View Invoice
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => navigate(`/sales/invoices/edit/${invoice.id}`)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Invoice
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Invoice
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Send className="mr-2 h-4 w-4" />
                                                                Send to Customer
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
                        
                        {/* Pagination controls */}
                        {!isLoading && !error && filteredInvoices.length > 0 && (
                            <div className="flex items-center justify-between mt-4">
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
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Invoices;
