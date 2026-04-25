import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Outstanding Invoices",
    count: 12,
    total: 45,
    percentage: 27,
    color: "bg-warning",
  },
  {
    title: "Overdue Payments",
    count: 3,
    total: 45,
    percentage: 7,
    color: "bg-destructive",
  },
  {
    title: "This Month's Expenses",
    count: 89,
    total: 120,
    percentage: 74,
    color: "bg-info",
  },
  {
    title: "Active Clients",
    count: 24,
    total: 30,
    percentage: 80,
    color: "bg-success",
  },
];

export default function QuickStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {stat.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.count}/{stat.total}
                </span>
              </div>
              <Progress value={stat.percentage} className="h-2" />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{stat.percentage}% complete</span>
                <span>{stat.total - stat.count} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}