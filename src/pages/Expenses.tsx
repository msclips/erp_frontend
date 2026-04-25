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
  Receipt, 
  DollarSign, 
  TrendingDown,
  Calendar,
  Tag,
  CreditCard,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Camera
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockExpenses = [
  {
    id: "EXP-001",
    description: "Office Supplies",
    category: "Office",
    amount: 245.80,
    date: "2024-01-15",
    vendor: "OfficeMax",
    paymentMethod: "Credit Card",
    status: "approved",
    receipt: true,
    notes: "Monthly office supply restocking"
  },
  {
    id: "EXP-002",
    description: "Software License",
    category: "Technology",
    amount: 1299.00,
    date: "2024-01-14",
    vendor: "Adobe Inc",
    paymentMethod: "Bank Transfer",
    status: "approved",
    receipt: true,
    notes: "Annual Creative Suite license renewal"
  },
  {
    id: "EXP-003",
    description: "Business Lunch",
    category: "Meals",
    amount: 125.50,
    date: "2024-01-13",
    vendor: "The Bistro",
    paymentMethod: "Cash",
    status: "pending",
    receipt: false,
    notes: "Client meeting with Acme Corp"
  },
  {
    id: "EXP-004",
    description: "Travel - Flight",
    category: "Travel",
    amount: 450.75,
    date: "2024-01-12",
    vendor: "Delta Airlines",
    paymentMethod: "Credit Card",
    status: "approved",
    receipt: true,
    notes: "Business trip to NYC conference"
  },
  {
    id: "EXP-005",
    description: "Internet Service",
    category: "Utilities",
    amount: 89.99,
    date: "2024-01-11",
    vendor: "Comcast",
    paymentMethod: "Auto-pay",
    status: "approved",
    receipt: true,
    notes: "Monthly internet service"
  }
];

const expenseCategories = [
  "Office",
  "Technology", 
  "Travel",
  "Meals",
  "Utilities",
  "Marketing",
  "Professional Services",
  "Equipment",
  "Insurance",
  "Other"
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-success text-success-foreground";
    case "pending":
      return "bg-warning text-warning-foreground";
    case "rejected":
      return "bg-destructive text-destructive-foreground";
    case "draft":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    "Office": "bg-blue-100 text-blue-800",
    "Technology": "bg-purple-100 text-purple-800",
    "Travel": "bg-green-100 text-green-800",
    "Meals": "bg-orange-100 text-orange-800",
    "Utilities": "bg-gray-100 text-gray-800",
    "Marketing": "bg-pink-100 text-pink-800",
    "Professional Services": "bg-indigo-100 text-indigo-800",
    "Equipment": "bg-yellow-100 text-yellow-800",
    "Insurance": "bg-red-100 text-red-800",
    "Other": "bg-slate-100 text-slate-800"
  };
  return colors[category as keyof typeof colors] || "bg-secondary text-secondary-foreground";
};

const Expenses = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
  });

  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter((expense) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !expense.id.toLowerCase().includes(searchLower) &&
          !expense.description.toLowerCase().includes(searchLower) &&
          !expense.vendor.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (filters.category !== "all" && expense.category !== filters.category) {
        return false;
      }

      if (filters.status !== "all" && expense.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleEditExpense = (expense: any) => {
    toast({
      title: "Edit Expense",
      description: `Editing ${expense.description}`,
    });
  };

  const handleDeleteExpense = (expense: any) => {
    toast({
      title: "Delete Expense",
      description: `Deleted ${expense.description}`,
      variant: "destructive",
    });
  };

  const handleViewReceipt = (expense: any) => {
    toast({
      title: "View Receipt",
      description: `Opening receipt for ${expense.description}`,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      status: "all",
      dateRange: { from: undefined, to: undefined },
    });
  };

  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = mockExpenses
    .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = mockExpenses.filter(exp => exp.status === "pending").length;
  const avgExpenseAmount = totalExpenses / mockExpenses.length;

  return (
    <Layout currentPath="/expenses">
      <DashboardHeader
        title="Expense Management"
        subtitle="Track and manage business expenses and receipts"
        showCreateButton
        createButtonText="Add Expense"
        onCreateClick={() => toast({ title: "Add Expense", description: "Opening expense form..." })}
      />

      {/* Expense Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-success">-5.2% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${monthlyExpenses.toLocaleString()}</div>
            <p className="text-xs text-info">{mockExpenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingExpenses}</div>
            <p className="text-xs text-warning">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Expense
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${avgExpenseAmount.toFixed(0)}</div>
            <p className="text-xs text-success">Within budget</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="px-3 py-2 border border-border rounded-md bg-background"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="all">All Categories</option>
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-border rounded-md bg-background"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No expenses found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">{expense.vendor}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3" />
                          <span className="text-sm">{expense.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {expense.receipt ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewReceipt(expense)}
                          >
                            <FileText className="h-4 w-4 text-success" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toast({ title: "Upload Receipt", description: "Opening camera/file picker..." })}
                          >
                            <Camera className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditExpense(expense)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Expense
                            </DropdownMenuItem>
                            {expense.receipt && (
                              <DropdownMenuItem onClick={() => handleViewReceipt(expense)}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Receipt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDeleteExpense(expense)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Expense
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

export default Expenses;