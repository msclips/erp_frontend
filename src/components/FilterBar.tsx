import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterBarProps {
    onSearchChange: (search: string) => void;
    onClearFilters: () => void;
    activeFilters: {
        search: string;
    };
}

export default function FilterBar({
                                      onSearchChange,
                                      onClearFilters,
                                      activeFilters,
                                  }: FilterBarProps) {
    return (
        <div className="flex items-center gap-2">
            {/* Search input */}
            <div className="flex-1">
                <Input
                    placeholder="Search"
                    value={activeFilters.search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Clear button */}
            {activeFilters.search && (
                <Button variant="ghost" size="icon" onClick={onClearFilters}>
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
