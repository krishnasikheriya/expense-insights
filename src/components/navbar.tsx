"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">
          <span className="text-primary">Expense</span>Insights
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/expenses" 
            className={`text-sm font-medium transition-colors ${pathname === "/expenses" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            Expenses
          </Link>
          <Link 
            href="/categories" 
            className={`text-sm font-medium transition-colors ${pathname === "/categories" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            Categories
          </Link>
          
        </div>

        <div>
          <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>Sign Out</Button>
        </div>
      </div>
    </nav>
  );
}
