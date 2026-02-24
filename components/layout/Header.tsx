"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Scissors, Menu } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/customers", label: "Customers" },
    { href: "/customers/new", label: "Add Customer" },
];

export function Header({ user }: { user: User }) {
    const router = useRouter();
    const supabase = createClient();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Signed out successfully");
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 h-14">
                {/* Mobile: Logo + hamburger */}
                <div className="flex items-center gap-3 md:hidden">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Scissors className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Royal King</span>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="ml-2 text-muted-foreground"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Desktop: user email */}
                <div className="hidden md:flex items-center">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>

                {/* Logout */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                </Button>
            </div>

            {/* Mobile nav */}
            {mobileMenuOpen && (
                <nav className="md:hidden border-t border-border bg-card px-4 pb-3 space-y-1">
                    {navItems.map(({ href, label }) => {
                        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-accent text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </header>
    );
}
