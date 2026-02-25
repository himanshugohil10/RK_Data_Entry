import { type Customer } from "@/lib/actions/customers";
import { getMeasurementCompleteness } from "@/lib/measurementUtils";
import { format } from "date-fns";
import { MeasurementIndicator } from "@/components/customers/MeasurementIndicator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRound, ArrowRight } from "lucide-react";

export function RecentCustomers({ customers }: { customers: Customer[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Recently Added</h2>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground text-sm">
                    <Link href="/customers">
                        View all <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </Button>
            </div>

            {customers.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-8 md:p-10 text-center shadow-sm">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto mb-3">
                        <UserRound className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-bold text-foreground">No customers yet</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                        Start by adding your first customer entry
                    </p>
                    <Button asChild size="sm" className="rounded-lg">
                        <Link href="/customers/new">Add First Customer</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Mobile View: List Cards */}
                    <div className="grid grid-cols-1 gap-3 md:hidden">
                        {customers.map((customer) => (
                            <Link
                                key={customer.id}
                                href={`/customers/${customer.id}/edit`}
                                className="bg-card rounded-xl border border-border p-4 shadow-sm active:scale-[0.98] transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-foreground truncate">{customer.name}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="truncate">{customer.phone}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0" />
                                            <span className="truncate">{format(new Date(customer.date), "dd MMM")}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4 shrink-0 px-2 py-1 rounded bg-muted text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                        {customer.selected_garments?.[0] || "—"}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop View: Clean Table */}
                    <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Customer</th>
                                    <th className="text-left px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Contact</th>
                                    <th className="text-left px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order Date</th>
                                    <th className="text-left px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Garments</th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {customers.map((customer) => {
                                    return (
                                        <tr key={customer.id} className="group hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{customer.name}</p>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground font-medium">{customer.phone}</td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {format(new Date(customer.date), "dd MMM yyyy")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {customer.selected_garments?.map((g, i) => (
                                                        <span key={i} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold uppercase">{g}</span>
                                                    )) || "—"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                                    <Link href={`/customers/${customer.id}/edit`}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
