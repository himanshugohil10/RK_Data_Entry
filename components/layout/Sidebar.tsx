"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/customers", label: "All Customers", icon: Users },
    { href: "/customers/new", label: "Add Customer", icon: PlusCircle },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sidebar-primary/20 ring-1 ring-sidebar-primary/30">
                    <Scissors className="w-5 h-5 text-sidebar-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-sidebar-foreground leading-none">Royal King</p>
                    <p className="text-xs text-sidebar-foreground/50 mt-0.5 leading-none">Tailoring</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive =
                        href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-primary"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-sidebar-border">
                <p className="text-xs text-sidebar-foreground/30 leading-relaxed">
                    © {new Date().getFullYear()} Royal King
                </p>
            </div>
        </aside>
    );
}
