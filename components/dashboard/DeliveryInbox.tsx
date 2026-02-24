"use client";

import { useEffect, useState } from "react";
import { getDeliveriesToday, toggleDeliveryStatus, type Customer } from "@/lib/actions/customers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, CheckCircle2, Circle, CalendarClock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DeliveryInbox() {
    const [deliveries, setDeliveries] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "delivered" | "not_delivered">("not_delivered");
    const [toggling, setToggling] = useState<string | null>(null);
    const router = useRouter();

    const fetchDeliveries = async () => {
        setLoading(true);
        const data = await getDeliveriesToday(filter);
        setDeliveries(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDeliveries();
    }, [filter]);

    const handleToggleStatus = async (e: React.MouseEvent, id: string, currentStatus: boolean | null) => {
        e.stopPropagation(); // Prevent row click
        setToggling(id);
        const result = await toggleDeliveryStatus(id, !currentStatus);
        if (result.success) {
            await fetchDeliveries();
        }
        setToggling(null);
    };

    if (loading && deliveries.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-primary" />
                        Today's Deliveries
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="space-y-4 pb-4">
                <div className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-primary" />
                        Today's Deliveries
                        <div className="ml-2 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                            {deliveries.length}
                        </div>
                    </CardTitle>
                    <span className="text-xs text-muted-foreground font-medium">
                        {format(new Date(), "dd MMMM")}
                    </span>
                </div>

                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-full">
                    <Button
                        variant={filter === "all" ? "default" : "ghost"}
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "not_delivered" ? "default" : "ghost"}
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={() => setFilter("not_delivered")}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === "delivered" ? "default" : "ghost"}
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={() => setFilter("delivered")}
                    >
                        Delivered
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {deliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <CalendarClock className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No records found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deliveries.map((customer) => (
                            <div
                                key={customer.id}
                                onClick={() => router.push(`/customers/${customer.id}`)}
                                className={cn(
                                    "group relative flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer transition-all duration-200",
                                    "hover:border-primary/50 hover:bg-primary/5",
                                    customer.is_delivered && "bg-muted/30 opacity-75"
                                )}
                            >
                                <div className="space-y-1">
                                    <p className={cn(
                                        "text-sm font-bold text-foreground transition-colors",
                                        "group-hover:text-primary",
                                        customer.is_delivered && "line-through text-muted-foreground"
                                    )}>
                                        {customer.name}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {customer.phone}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-semibold uppercase">
                                            {customer.selected_garments?.[0] || "Order"}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleToggleStatus(e, customer.id, customer.is_delivered || false)}
                                    disabled={toggling === customer.id}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        customer.is_delivered
                                            ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                                            : "text-muted-foreground hover:text-primary hover:bg-white border border-transparent hover:border-border"
                                    )}
                                    title={customer.is_delivered ? "Mark as Not Delivered" : "Mark as Delivered"}
                                >
                                    {toggling === customer.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : customer.is_delivered ? (
                                        <CheckCircle2 className="w-5 h-5 fill-emerald-50" />
                                    ) : (
                                        <Circle className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
