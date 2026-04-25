import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
    MoreHorizontal,
    Edit,
    Eye,
    Send,
    Trash
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuotes, useDeleteQuote } from "@/hooks/useApi";

const getStatusColor = (status: string) => {
    switch (status) {
        case "accepted":
            return "bg-success text-success-foreground";
        case "sent":
            return "bg-info text-info-foreground";
        case "draft":
            return "bg-muted text-muted-foreground";
        case "expired":
            return "bg-destructive text-destructive-foreground";
        default:
            return "bg-secondary text-secondary-foreground";
    }
};

const Quotes = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const { data: quotesData, isLoading } = useQuotes(page);
    const { mutate: deleteQuote } = useDeleteQuote();
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
    });

    const quotes = quotesData?.list ?? [];

    const stats = useMemo(() => {
        return {
            draft: quotes.filter((q: any) => q.status === 'draft').length,
            sent: quotes.filter((q: any) => q.status === 'sent').length,
            accepted: quotes.filter((q: any) => q.status === 'accepted').length,
            draftTotal: quotes.filter((q: any) => q.status === 'draft').reduce((sum: number, q: any) => sum + (parseFloat(q.total) || 0), 0),
        };
    }, [quotes]);

    const filteredQuotes = useMemo(() => {
        return quotes.filter((quote: any) => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const quoteNo = quote.quotation_no || "";
                const customerName = quote.customer?.display_name || "";
                if (
                    !quoteNo.toLowerCase().includes(searchLower) &&
                    !customerName.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            if (filters.status !== "all" && quote.status !== filters.status) {
                return false;
            }

            return true;
        });
    }, [quotes, filters]);

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this quote?")) {
            deleteQuote(id);
        }
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
        });
    };

    return (
        <Layout currentPath="/sales/quotes">
            <DashboardHeader
                title="Quotes"
                subtitle="Create estimates and send them to your customers for approval"
                showCreateButton
                createButtonText="New Quote"
                onCreateClick={() => navigate("/sales/quotes/create")}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Draft Quotes
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.draft}</div>
                        <p className="text-xs text-muted-foreground">₹{stats.draftTotal.toLocaleString()} total</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Sent & Pending
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.sent}</div>
                        <p className="text-xs text-info">Awaiting acceptance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Converted
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.accepted}</div>
                        <p className="text-xs text-success">To Sales Orders</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Quotes ({filteredQuotes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search quotes..."
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
                            <option value="sent">Sent</option>
                            <option value="accepted">Accepted</option>
                            <option value="expired">Expired</option>
                        </select>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quote Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Expiry</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Loading quotes...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredQuotes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No quotes found matching your filters
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredQuotes.map((quote: any) => (
                                        <TableRow key={quote.id}>
                                            <TableCell className="font-medium text-primary hover:underline cursor-pointer" onClick={() => navigate(`/sales/quotes/edit/${quote.id}`)}>
                                                {quote.quotation_no}
                                            </TableCell>
                                            <TableCell>{quote.customer?.display_name || 'N/A'}</TableCell>
                                            <TableCell>{quote.quotation_date}</TableCell>
                                            <TableCell>{quote.expiry_date}</TableCell>
                                            <TableCell className="font-medium">
                                                ₹{(parseFloat(quote.total) || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(quote.status)}>
                                                    {quote.status}
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
                                                        <DropdownMenuItem onClick={() => navigate(`/sales/quotes/edit/${quote.id}`)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View / Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(quote.id)}>
                                                            <Trash className="mr-2 h-4 w-4 text-destructive" />
                                                            Delete
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
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Quotes;
