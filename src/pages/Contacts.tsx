import { useState, useMemo } from "react";
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
import { 
  Users, 
  UserPlus, 
  Building2, 
  Mail,
  Phone,
  MapPin,
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

const mockContacts = [
  {
    id: "CON-001",
    name: "John Doe",
    company: "Acme Corporation",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    type: "customer",
    status: "active",
    lastContact: "2024-01-15",
    totalOrders: 12,
    totalValue: 45750.00,
    avatar: ""
  },
  {
    id: "CON-002",
    name: "Sarah Wilson",
    company: "TechStart Ltd",
    email: "sarah@techstart.com",
    phone: "+1 (555) 234-5678",
    type: "customer",
    status: "active",
    lastContact: "2024-01-14",
    totalOrders: 8,
    totalValue: 28420.50,
    avatar: ""
  },
  {
    id: "CON-003",
    name: "Mike Johnson",
    company: "Global Dynamics",
    email: "mike@globaldynamics.com",
    phone: "+1 (555) 345-6789",
    type: "vendor",
    status: "active",
    lastContact: "2024-01-13",
    totalOrders: 15,
    totalValue: 62100.75,
    avatar: ""
  },
  {
    id: "CON-004",
    name: "Emily Chen",
    company: "Innovation Hub",
    email: "emily@innovationhub.com",
    phone: "+1 (555) 456-7890",
    type: "customer",
    status: "inactive",
    lastContact: "2024-01-10",
    totalOrders: 3,
    totalValue: 8680.25,
    avatar: ""
  }
];

const getContactTypeColor = (type: string) => {
  switch (type) {
    case "customer":
      return "bg-primary text-primary-foreground";
    case "vendor":
      return "bg-secondary text-secondary-foreground";
    case "supplier":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

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

const Contacts = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
  });

  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !contact.name.toLowerCase().includes(searchLower) &&
          !contact.company.toLowerCase().includes(searchLower) &&
          !contact.email.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (filters.status !== "all" && contact.status !== filters.status) {
        return false;
      }

      if (filters.type !== "all" && contact.type !== filters.type) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleEditContact = (contact: any) => {
    toast({
      title: "Edit Contact",
      description: `Editing ${contact.name}`,
    });
  };

  const handleDeleteContact = (contact: any) => {
    toast({
      title: "Delete Contact",
      description: `Deleted ${contact.name}`,
      variant: "destructive",
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      type: "all",
      dateRange: { from: undefined, to: undefined },
    });
  };

  return (
    <Layout currentPath="/contacts">
      <DashboardHeader
        title="Contact Management"
        subtitle="Manage customers, vendors, and business relationships"
        showCreateButton
        createButtonText="Add Contact"
        onCreateClick={() => toast({ title: "Add Contact", description: "Opening contact form..." })}
      />

      {/* Contact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">147</div>
            <p className="text-xs text-success">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89</div>
            <p className="text-xs text-info">8 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendors
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">34</div>
            <p className="text-xs text-warning">5 pending verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Value Clients
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">23</div>
            <p className="text-xs text-success">Worth $500K+</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            {/* Custom filter bar for contacts */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="px-3 py-2 border border-border rounded-md bg-background"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="customer">Customers</option>
                <option value="vendor">Vendors</option>
                <option value="supplier">Suppliers</option>
              </select>
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
          </div>
          
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No contacts found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">{contact.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getContactTypeColor(contact.type)}>
                          {contact.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{contact.lastContact}</TableCell>
                      <TableCell className="font-medium">
                        ${contact.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteContact(contact)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Contact
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

export default Contacts;