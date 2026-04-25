import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
  {
    id: 1,
    type: "invoice",
    description: "Invoice #INV-001 sent to Acme Corp",
    amount: "$2,500.00",
    time: "2 hours ago",
    status: "sent",
  },
  {
    id: 2,
    type: "payment",
    description: "Payment received from TechStart Ltd",
    amount: "$1,750.00",
    time: "4 hours ago",
    status: "received",
  },
  {
    id: 3,
    type: "expense",
    description: "Office supplies expense recorded",
    amount: "$89.50",
    time: "6 hours ago",
    status: "recorded",
  },
  {
    id: 4,
    type: "contact",
    description: "New contact added: Sarah Johnson",
    amount: "",
    time: "1 day ago",
    status: "added",
  },
];

export default function RecentActivity() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-info text-info-foreground";
      case "received":
        return "bg-success text-success-foreground";
      case "recorded":
        return "bg-warning text-warning-foreground";
      case "added":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return "📄";
      case "payment":
        return "💰";
      case "expense":
        return "🧾";
      case "contact":
        return "👤";
      default:
        return "📋";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getTypeIcon(activity.type)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {activity.amount && (
                  <p className="text-sm font-medium text-foreground">
                    {activity.amount}
                  </p>
                )}
                <Badge
                  variant="secondary"
                  className={getStatusColor(activity.status)}
                >
                  {activity.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}