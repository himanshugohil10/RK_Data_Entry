"use client";

import { useEffect, useState } from "react";
import { Phone, CalendarClock, Sparkles, Check, CheckCircle2, Loader2 } from "lucide-react";
import { getTrialsToday, toggleTrialStatus, type Customer } from "@/lib/actions/customers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TrialInbox() {
    const [trials, setTrials] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "trialed" | "not_trialed">("not_trialed");
    const [toggling, setToggling] = useState<string | null>(null);
    const router = useRouter();

    const fetchTrials = async () => {
        setLoading(true);
        const data = await getTrialsToday(filter);
        setTrials(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTrials();
    }, [filter]);

    const handleToggleStatus = async (e: React.MouseEvent, id: string, currentStatus: boolean | null) => {
        e.stopPropagation();
        setToggling(id);
        const result = await toggleTrialStatus(id, !currentStatus);
        if (result.success) {
            await fetchTrials();
        }
        setToggling(null);
    };

    if (loading && trials.length === 0) {
        return (
            <Card className="h-full border-amber-200/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Today's Trials
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full border-amber-200/50 shadow-lg shadow-amber-500/5">
            <CardHeader className="pb-4">
                <div className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Today's Trials
                        <div className="ml-1.5 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full border border-amber-200 uppercase tracking-wider">
                            {trials.length}
                        </div>
                    </CardTitle>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded-md">
                        {format(new Date(), "dd MMM")}
                    </span>
                </div>

                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-full">
                    <Button
                        variant={filter === "all" ? "outline" : "ghost"}
                        size="sm"
                        className={cn("flex-1 h-7 text-[10px] uppercase font-bold tracking-tighter", filter === "all" && "bg-white shadow-sm")}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "not_trialed" ? "outline" : "ghost"}
                        size="sm"
                        className={cn("flex-1 h-7 text-[10px] uppercase font-bold tracking-tighter", filter === "not_trialed" && "bg-white shadow-sm")}
                        onClick={() => setFilter("not_trialed")}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === "trialed" ? "outline" : "ghost"}
                        size="sm"
                        className={cn("flex-1 h-7 text-[10px] uppercase font-bold tracking-tighter", filter === "trialed" && "bg-white shadow-sm")}
                        onClick={() => setFilter("trialed")}
                    >
                        Done
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {trials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-200">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No trials scheduled for today</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {trials.map((customer) => (
                            <div
                                key={customer.id}
                                onClick={() => router.push(`/customers/${customer.id}`)}
                                className={cn(
                                    "group relative flex items-center justify-between p-3.5 rounded-xl border border-border cursor-pointer transition-all duration-300",
                                    "hover:border-amber-400/50 hover:bg-amber-50/30 hover:shadow-md hover:shadow-amber-500/5"
                                )}
                            >
                                <div className="space-y-1.5 min-w-0 flex-1 pr-4">
                                    <p className={cn(
                                        "text-sm font-bold text-foreground transition-colors group-hover:text-amber-600 truncate",
                                        customer.is_trialed && "line-through text-muted-foreground"
                                    )}>
                                        {customer.name}
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3 text-amber-400" />
                                            {customer.phone}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded-md bg-muted text-[9px] font-bold uppercase tracking-tighter truncate max-w-[80px]">
                                            {customer.selected_garments?.[0] || "Trial"}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => handleToggleStatus(e, customer.id, customer.is_trialed || false)}
                                    disabled={toggling === customer.id}
                                    className={cn(
                                        "h-8 px-3 rounded-full transition-all duration-300 gap-1.5 font-bold text-[10px] uppercase tracking-wider shrink-0",
                                        customer.is_trialed
                                            ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20"
                                            : "bg-amber-500/5 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-500/10 hover:border-amber-500 shadow-sm"
                                    )}
                                >
                                    {toggling === customer.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : customer.is_trialed ? (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Done</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Mark Done</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
