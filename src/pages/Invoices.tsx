import { useState, useMemo } from "react";
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
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockInvoices = [
  {
    id: "INV-001",
    customer: "Acme Corporation",
    amount: 15750.00,
    dueDate: "2024-02-15",
    issueDate: "2024-01-15",
    status: "paid",
    paymentDate: "2024-02-10",
    items: [
      { description: "Web Development Services", quantity: 1, rate: 12000.00 },
      { description: "UI/UX Design", quantity: 1, rate: 3750.00 }
    ]
  },
  {
    id: "INV-002",
    customer: "TechStart Ltd",
    amount: 8420.50,
    dueDate: "2024-02-20",
    issueDate: "2024-01-20",
    status: "overdue",
    paymentDate: null,
    items: [
      { description: "Software License", quantity: 5, rate: 1684.10 }
    ]
  },
  {
    id: "INV-003",
    customer: "Global Dynamics",
    amount: 22100.75,
    dueDate: "2024-02-25",
    issueDate: "2024-01-25",
    status: "pending",
    paymentDate: null,
    items: [
      { description: "Consulting Services", quantity: 40, rate: 552.52 }
    ]
  },
  {
    id: "INV-004",
    customer: "Innovation Hub",
    amount: 5680.25,
    dueDate: "2024-03-01",
    issueDate: "2024-02-01",
    status: "draft",
    paymentDate: null,
    items: [
      { description: "Training Program", quantity: 1, rate: 5680.25 }
    ]
  }
];

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
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
  });

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !invoice.id.toLowerCase().includes(searchLower) &&
          !invoice.customer.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (filters.status !== "all" && invoice.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleViewInvoice = (invoice: any) => {
    toast({
      title: "View Invoice",
      description: `Opening invoice ${invoice.id}`,
    });
  };

  const handleEditInvoice = (invoice: any) => {
    toast({
      title: "Edit Invoice",
      description: `Editing invoice ${invoice.id}`,
    });
  };

  const handleDownloadInvoice = (invoice: any) => {
    toast({
      title: "Download Invoice",
      description: `Downloading PDF for ${invoice.id}`,
    });
  };

  const handleSendInvoice = (invoice: any) => {
    toast({
      title: "Send Invoice",
      description: `Sending invoice ${invoice.id} to ${invoice.customer}`,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      dateRange: { from: undefined, to: undefined },
    });
  };

  const totalInvoices = mockInvoices.length;
  const paidInvoices = mockInvoices.filter(inv => inv.status === "paid").length;
  const pendingAmount = mockInvoices
    .filter(inv => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueInvoices = mockInvoices.filter(inv => inv.status === "overdue").length;

  return (
    <Layout currentPath="/invoices">
      <DashboardHeader
        title="Invoice Management"
        subtitle="Create, track, and manage customer invoices"
        showCreateButton
        createButtonText="Create Invoice"
        onCreateClick={() => toast({ title: "Create Invoice", description: "Opening invoice creator..." })}
      />

      {/* Invoice Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalInvoices}</div>
            <p className="text-xs text-success">+8 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid Invoices
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{paidInvoices}</div>
            <p className="text-xs text-success">{((paidInvoices / totalInvoices) * 100).toFixed(1)}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Amount
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${pendingAmount.toLocaleString()}</div>
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
            <div className="text-2xl font-bold text-foreground">{overdueInvoices}</div>
            <p className="text-xs text-destructive">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
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
                      No invoices found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell className="font-medium">
                        ${invoice.amount.toLocaleString()}
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
                            <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Invoice
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

export default Invoices;