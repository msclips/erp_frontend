import { useState } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  PieChart, 
  LineChart,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Filter,
  RefreshCw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reportTypes = [
  {
    id: "financial",
    title: "Financial Reports",
    description: "Revenue, expenses, profit & loss statements",
    icon: DollarSign,
    reports: [
      { name: "Profit & Loss", description: "Monthly P&L statement", lastGenerated: "2024-01-15" },
      { name: "Cash Flow", description: "Cash flow analysis", lastGenerated: "2024-01-14" },
      { name: "Revenue Summary", description: "Revenue breakdown by source", lastGenerated: "2024-01-13" },
      { name: "Expense Analysis", description: "Expense categorization and trends", lastGenerated: "2024-01-12" }
    ]
  },
  {
    id: "sales",
    title: "Sales Reports",
    description: "Sales performance and customer analytics",
    icon: TrendingUp,
    reports: [
      { name: "Sales Performance", description: "Monthly sales metrics", lastGenerated: "2024-01-15" },
      { name: "Customer Analysis", description: "Customer behavior and trends", lastGenerated: "2024-01-14" },
      { name: "Product Performance", description: "Best and worst performing products", lastGenerated: "2024-01-13" },
      { name: "Sales Forecast", description: "Projected sales for next quarter", lastGenerated: "2024-01-10" }
    ]
  },
  {
    id: "inventory",
    title: "Inventory Reports",
    description: "Stock levels, purchase orders, and supplier data",
    icon: Package,
    reports: [
      { name: "Inventory Status", description: "Current stock levels", lastGenerated: "2024-01-15" },
      { name: "Purchase Orders", description: "PO summary and status", lastGenerated: "2024-01-14" },
      { name: "Supplier Performance", description: "Vendor delivery and quality metrics", lastGenerated: "2024-01-12" },
      { name: "Stock Valuation", description: "Current inventory value", lastGenerated: "2024-01-11" }
    ]
  },
  {
    id: "customer",
    title: "Customer Reports",
    description: "Customer insights and relationship analytics",
    icon: Users,
    reports: [
      { name: "Customer Lifetime Value", description: "CLV analysis and segmentation", lastGenerated: "2024-01-14" },
      { name: "Customer Acquisition", description: "New customer trends", lastGenerated: "2024-01-13" },
      { name: "Customer Retention", description: "Retention rates and churn analysis", lastGenerated: "2024-01-12" },
      { name: "Customer Satisfaction", description: "Feedback and ratings summary", lastGenerated: "2024-01-10" }
    ]
  }
];

const Charts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-md">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Revenue vs Expenses Chart</p>
              <p className="text-sm">Interactive chart would be rendered here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-md">
            <div className="text-center text-muted-foreground">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p>Expense Distribution Chart</p>
              <p className="text-sm">Interactive pie chart would be rendered here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Sales Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-md">
            <div className="text-center text-muted-foreground">
              <LineChart className="h-12 w-12 mx-auto mb-2" />
              <p>Sales Trend Line Chart</p>
              <p className="text-sm">Time series chart would be rendered here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Customer Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-md">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Customer Growth Chart</p>
              <p className="text-sm">Customer acquisition chart would be rendered here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Reports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleGenerateReport = (reportName: string) => {
    toast({
      title: "Generating Report",
      description: `Generating ${reportName} report...`,
    });
  };

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${reportName} as PDF...`,
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Refreshing Data",
      description: "Updating all report data...",
    });
  };

  return (
    <Layout currentPath="/reports">
      <DashboardHeader
        title="Reports & Analytics"
        subtitle="Generate insights and track business performance"
        showCreateButton
        createButtonText="Custom Report"
        onCreateClick={() => toast({ title: "Custom Report", description: "Opening report builder..." })}
      />

      {/* Report Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Time Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleRefreshData} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <Charts />

      {/* Available Reports */}
      <div className="space-y-6">
        {reportTypes
          .filter(category => selectedCategory === "all" || category.id === selectedCategory)
          .map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.reports.map((report, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.lastGenerated}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleGenerateReport(report.name)}
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        Generate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(report.name)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Reports;