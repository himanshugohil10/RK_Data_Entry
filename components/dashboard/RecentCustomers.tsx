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
                <div className="bg-card rounded-xl border border-border p-10 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto mb-3">
                        <UserRound className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No customers yet</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                        Start by adding your first customer entry
                    </p>
                    <Button asChild size="sm">
                        <Link href="/customers/new">Add First Customer</Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => {
                                return (
                                    <tr key={customer.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3 font-medium text-foreground">{customer.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{customer.phone}</td>
                                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                                            {format(new Date(customer.date), "dd MMM yyyy")}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {customer.selected_garments?.join(", ") || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                                                <Link href={`/customers/${customer.id}/edit`}>Edit</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
