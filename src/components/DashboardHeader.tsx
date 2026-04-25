import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonText?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
  showCreateButton = false,
  onCreateClick,
  createButtonText = "Create",
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Create button */}
        {showCreateButton && (
          <Button onClick={onCreateClick} className="gap-2">
            <Plus className="w-4 h-4" />
            {createButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}