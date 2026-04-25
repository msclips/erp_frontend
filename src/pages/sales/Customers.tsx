import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, useDeleteCustomer } from "@/hooks/useApi";
import {
    Users,
    UserPlus,
    Building2,
    Mail,
    Phone,
    MoreHorizontal,
    Edit,
    Trash2,
    Star
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data removed in favor of API integration

const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-success text-success-foreground";
        case "inactive":
            return "bg-muted text-muted-foreground";
        default:
            return "bg-secondary text-secondary-foreground";
    }
};

const Customers = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
    });

    const { data: rawData, isLoading, error } = useCustomers(page, limit);
    const deleteCustomerMutation = useDeleteCustomer();

    console.log('🔥 Customers page - Raw data:', rawData);

    const customers = rawData?.list ?? [];
    const total = rawData?.total ?? 0;

    console.log('🔥 Customers page - Extracted customers:', customers);

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer: any) => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (
                    !customer.display_name.toLowerCase().includes(searchLower) &&
                    !(customer.company_name?.toLowerCase().includes(searchLower)) &&
                    !(customer.email?.toLowerCase().includes(searchLower))
                ) {
                    return false;
                }
            }

            if (filters.status !== "all") {
                // Assuming status maps to something in the API or just filtering if API provides it
                const customerStatus = customer.status || 'active';
                if (customerStatus !== filters.status) return false;
            }

            return true;
        });
    }, [customers, filters]);

    const handleEditCustomer = (customer: any) => {
        navigate(`/sales/customers/edit/${customer.id}`);
    };

    const handleDeleteCustomer = async (customer: any) => {
        if (window.confirm(`Are you sure you want to delete ${customer.display_name}?`)) {
            try {
                await deleteCustomerMutation.mutateAsync(customer.id);
            } catch (err) {
                // Error handled by mutation toast
            }
        }
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
        });
    };

    return (
        <Layout currentPath="/sales/customers">
            <DashboardHeader
                title="Customers"
                subtitle="Manage your business customers and their transaction history"
                showCreateButton
                createButtonText="New Customer"
                onCreateClick={() => navigate("/sales/customers/create")}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{total}</div>
                        <p className="text-xs text-success">Total records</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Receivables
                        </CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">$12,450.00</div>
                        <p className="text-xs text-info">Across 8 customers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Unused Credits
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">$1,200.00</div>
                        <p className="text-xs text-warning">To be applied</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            High Value
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <p className="text-xs text-success">VIP Tier</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customers ({total})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search customers..."
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact Info</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total Value</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            Loading customers...
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-destructive">
                                            {(error as any).message || "Failed to load customers"}
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No customers found matching your filters
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer: any) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={customer.avatar} />
                                                        <AvatarFallback>
                                                            {(customer.display_name || 'C').split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div
                                                            className="font-medium text-primary hover:underline cursor-pointer"
                                                            onClick={() => navigate(`/sales/customers/${customer.id}`)}
                                                        >
                                                            {customer.display_name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">CUS-{String(customer.id).padStart(3, '0')}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{customer.company_name || '-'}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Mail className="h-3 w-3" />
                                                        {customer.email || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Phone className="h-3 w-3" />
                                                        {customer.phone || 'N/A'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(customer.status || 'active')}>
                                                    {customer.status || 'active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${(customer.total_value || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Customer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteCustomer(customer)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Customer
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

export default Customers;
