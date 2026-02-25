"use client";

import { useEffect, useState } from "react";
import { getTrialsToday, type Customer } from "@/lib/actions/customers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, CalendarClock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TrialInbox() {
    const [trials, setTrials] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchTrials = async () => {
        setLoading(true);
        const data = await getTrialsToday();
        setTrials(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTrials();
    }, []);

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
                                <div className="space-y-1.5">
                                    <p className="text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">
                                        {customer.name}
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3 text-amber-400" />
                                            {customer.phone}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded-md bg-muted text-[9px] font-bold uppercase tracking-tighter">
                                            {customer.selected_garments?.[0] || "Trial"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2 text-amber-500 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                                    <CalendarClock className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
