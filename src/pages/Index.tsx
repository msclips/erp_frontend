import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import MetricCard from "@/components/MetricCard";
import RevenueChart from "@/components/RevenueChart";
import RecentActivity from "@/components/RecentActivity";
import QuickStats from "@/components/QuickStats";
import {
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Index = () => {
  return (
    <Layout currentPath="/">
      <DashboardHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your business today."
        showCreateButton
        createButtonText="Quick Invoice"
        onCreateClick={() => console.log("Create invoice")}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value="$67,420"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          description="vs last month"
        />
        <MetricCard
          title="Outstanding Invoices"
          value="$23,580"
          change="12 invoices"
          changeType="neutral"
          icon={FileText}
          description="pending payment"
        />
        <MetricCard
          title="Active Clients"
          value="142"
          change="+8"
          changeType="positive"
          icon={Users}
          description="this month"
        />
        <MetricCard
          title="Monthly Expenses"
          value="$18,340"
          change="-4.2%"
          changeType="positive"
          icon={TrendingUp}
          description="vs last month"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="space-y-6">
          <RecentActivity />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickStats />
        
        {/* Quick Actions Card */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <FileText className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">New Invoice</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <Users className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">Add Contact</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <DollarSign className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">Record Payment</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
