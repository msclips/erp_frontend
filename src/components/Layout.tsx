import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export default function Layout({ children, currentPath }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 md:ml-0">
          {children}
        </div>
      </main>
    </div>
  );
}