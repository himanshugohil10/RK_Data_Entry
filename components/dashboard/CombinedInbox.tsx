"use client";

import { useEffect, useState } from "react";
import {
    getTrialsToday,
    getDeliveriesToday,
    toggleDeliveryStatus,
    toggleTrialStatus,
    type Customer
} from "@/lib/actions/customers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Phone,
    CheckCircle2,
    Check,
    Circle,
    CalendarClock,
    Loader2,
    Sparkles,
    Filter,
    ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type InboxItem = Customer & { type: "trial" | "delivery" };

export function CombinedInbox() {
    const [items, setItems] = useState<InboxItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "trial" | "delivery">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "delivered">("pending");
    const [toggling, setToggling] = useState<string | null>(null);
    const router = useRouter();

    const fetchItems = async () => {
        setLoading(true);
        const [trials, deliveries] = await Promise.all([
            getTrialsToday("all"),
            getDeliveriesToday("all")
        ]);

        const combined: InboxItem[] = [
            ...trials.map(t => ({ ...t, type: "trial" as const })),
            ...deliveries.map(d => ({ ...d, type: "delivery" as const }))
        ].sort((a, b) => {
            // Sort by type then by status
            if (a.type !== b.type) return a.type === "trial" ? -1 : 1;
            return 0;
        });

        setItems(combined);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleToggleStatus = async (e: React.MouseEvent, item: InboxItem) => {
        e.stopPropagation();
        setToggling(item.id);
        const currentStatus = item.type === "trial" ? item.is_trialed : item.is_delivered;
        const result = item.type === "trial"
            ? await toggleTrialStatus(item.id, !currentStatus)
            : await toggleDeliveryStatus(item.id, !currentStatus);

        if (result.success) {
            await fetchItems();
        }
        setToggling(null);
    };

    const filteredItems = items.filter(item => {
        const typeMatch = filter === "all" || item.type === filter;
        const isDone = item.type === "trial" ? item.is_trialed : item.is_delivered;
        const statusMatch = statusFilter === "all" ||
            (statusFilter === "pending" && !isDone) ||
            (statusFilter === "delivered" && isDone);
        return typeMatch && statusMatch;
    });

    if (loading && items.length === 0) {
        return (
            <Card className="h-full border-border/50 shadow-sm">
                <CardHeader className="p-4 md:p-6 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-primary" />
                        Today's Inbox
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-2">
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-xl" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full border-border shadow-md overflow-hidden flex flex-col">
            <CardHeader className="p-4 md:p-5 border-b bg-muted/20 space-y-4">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            Today's Inbox
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                                {filteredItems.length}
                            </Badge>
                        </CardTitle>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                            {format(new Date(), "EEEE, dd MMM")}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase">Filter Type</div>
                                <DropdownMenuItem onClick={() => setFilter("all")} className={cn(filter === "all" && "bg-accent")}>All Types</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter("trial")} className={cn(filter === "trial" && "bg-accent text-amber-600")}>Trials Only</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter("delivery")} className={cn(filter === "delivery" && "bg-accent text-primary")}>Deliveries Only</DropdownMenuItem>

                                <div className="px-2 py-1.5 mt-1 border-t text-[10px] font-bold text-muted-foreground uppercase">Filter Status</div>
                                <DropdownMenuItem onClick={() => setStatusFilter("all")} className={cn(statusFilter === "all" && "bg-accent")}>All Status</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("pending")} className={cn(statusFilter === "pending" && "bg-accent")}>Pending Only</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("delivered")} className={cn(statusFilter === "delivered" && "bg-accent")}>Done Only</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-[10px] px-3 font-semibold rounded-full shrink-0"
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "trial" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "h-7 text-[10px] px-3 font-semibold rounded-full shrink-0 transition-colors",
                            filter === "trial" ? "bg-amber-500 hover:bg-amber-600 border-amber-500" : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        )}
                        onClick={() => setFilter("trial")}
                    >
                        Trials
                    </Button>
                    <Button
                        variant={filter === "delivery" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-[10px] px-3 font-semibold rounded-full shrink-0"
                        onClick={() => setFilter("delivery")}
                    >
                        Deliveries
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px] md:max-h-none">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
                            <CalendarClock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Nothing to show</p>
                            <p className="text-xs text-muted-foreground">Adjust your filters to see more tasks</p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {filteredItems.map((item) => {
                            const isDone = item.type === "trial" ? item.is_trialed : item.is_delivered;
                            return (
                                <div
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => router.push(`/customers/${item.id}`)}
                                    className={cn(
                                        "group relative flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-muted/30",
                                        isDone && "bg-muted/10 opacity-75"
                                    )}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className={cn(
                                            "mt-1 w-2 h-2 rounded-full shrink-0",
                                            item.type === "trial" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(30,58,138,0.3)]"
                                        )} />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className={cn(
                                                    "text-sm font-bold truncate transition-colors group-hover:text-primary",
                                                    isDone && "line-through text-muted-foreground"
                                                )}>
                                                    {item.name}
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[9px] h-3.5 px-1 font-bold uppercase tracking-tight rounded-sm",
                                                        item.type === "trial" ? "border-amber-200 text-amber-700 bg-amber-50" : "border-blue-200 text-blue-700 bg-blue-50"
                                                    )}
                                                >
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Phone className="w-3 h-3 text-muted-foreground/70" />
                                                    {item.phone}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase truncate max-w-[80px]">
                                                    {item.selected_garments?.[0] || "Order"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => handleToggleStatus(e, item)}
                                            disabled={toggling === item.id}
                                            className={cn(
                                                "h-8 px-3 rounded-full transition-all duration-300 gap-1.5 font-bold text-[10px] uppercase tracking-wider",
                                                isDone
                                                    ? (item.type === "trial"
                                                        ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20"
                                                        : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20")
                                                    : (item.type === "trial"
                                                        ? "bg-amber-500/5 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-500/10 hover:border-amber-500"
                                                        : "bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/10 hover:border-primary shadow-sm")
                                            )}
                                        >
                                            {toggling === item.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : isDone ? (
                                                <>
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span>{item.type === "trial" ? "Done" : "Delivered"}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    <span>{item.type === "trial" ? "Trial" : "Deliver"}</span>
                                                </>
                                            )}
                                        </Button>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
