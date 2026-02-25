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
        <header className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">
                {/* Mobile: Logo + hamburger */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-1.5 hover:bg-muted rounded-md transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5 text-foreground" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                            <Scissors className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-foreground tracking-tight">Royal King</span>
                    </div>
                </div>

                {/* Desktop: user email */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{user.email}</span>
                    <div className="h-4 w-px bg-border" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Button>
                </div>

                {/* Mobile Logout Button (Icon only) */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="md:hidden h-9 w-9 text-muted-foreground"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>

            {/* Mobile nav */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute inset-x-0 top-full border-b border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-border/50 px-4 py-3 bg-muted/30">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Signed in as</p>
                        <p className="text-xs font-semibold text-foreground truncate">{user.email}</p>
                    </div>
                    <nav className="p-2 space-y-1">
                        {navItems.map(({ href, label }) => {
                            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
