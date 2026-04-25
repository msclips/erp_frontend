import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  ShoppingCart,
  Package,
  Menu,
  X,
  Building2,
  LogOut,
  Percent,
  ChevronDown,
  Plus,
  Circle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Unit", href: "/units", icon: Users },
  { name: "AccountType", href: "/account-types", icon: Users },
  { name: "Payment Terms", href: "/payment-terms", icon: FileText },
  { name: "Chart of Accounts", href: "/chart-of-accounts", icon: BarChart3 },
  { name: "Item", href: "/item", icon: Percent },
  { name: "Contacts", href: "/contacts", icon: Users },
  {
    name: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    subItems: [
      { name: "Customers", href: "/sales/customers" },
      { name: "Quotes", href: "/sales/quotes" },
      { name: "Sales Orders", href: "/sales/orders" },
      { name: "Invoices", href: "/sales/invoices" },
      { name: "Recurring Invoices", href: "/sales/recurring-invoices" },
      { name: "Delivery Challans", href: "/sales/delivery-challans" },
      { name: "Payments Received", href: "/sales/payments-received" },
      { name: "Credit Notes", href: "/sales/credit-notes" },
    ],
  },
  { name: "Purchases", href: "/purchases", icon: Package },
  { name: "Vendors", href: "/vendors", icon: Building2 },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  currentPath?: string;
}

export default function Sidebar({ currentPath = "/" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Initialize with Sales expanded if current path is a sales sub-route
    const salesSubActive = navigation.find(n => n.name === "Sales")?.subItems?.some(sub => currentPath === sub.href);
    return salesSubActive ? ["Sales"] : [];
  });

  const toggleSection = (name: string) => {
    setExpandedSections(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                FinanceHub
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedSections.includes(item.name);
              const isCurrentMain = currentPath === item.href;

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center group">
                    <Link to={item.href} className="flex-1">
                      <Button
                        variant={isCurrentMain ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-11",
                          isCurrentMain
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                        onClick={() => {
                          setIsOpen(false);
                          if (hasSubItems && !isExpanded) toggleSection(item.name);
                        }}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.name}</span>
                        {hasSubItems && (
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              isExpanded ? "transform rotate-180" : ""
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSection(item.name);
                            }}
                          />
                        )}
                      </Button>
                    </Link>
                    {item.href !== "/dashboard" && item.href !== "/settings" && (
                      <Link to={`${item.href}/create`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>

                  {hasSubItems && isExpanded && (
                    <div className="ml-9 space-y-1 border-l pl-2">
                      {item.subItems?.map((sub) => {
                        const isSubActive = currentPath === sub.href;
                        return (
                          <div key={sub.name} className="flex items-center group/sub">
                            <Link to={sub.href} className="flex-1">
                              <Button
                                variant={isSubActive ? "default" : "ghost"}
                                className={cn(
                                  "w-full justify-start gap-3 h-9 text-sm",
                                  isSubActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                {sub.name}
                              </Button>
                            </Link>
                            <Link to={`${sub.href}/create`} className="opacity-0 group-hover/sub:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7 ml-1">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}