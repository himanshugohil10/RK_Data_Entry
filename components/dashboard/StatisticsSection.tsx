"use client";

import { useEffect, useState } from "react";
import { getStatistics } from "@/lib/actions/customers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { TrendingUp, Users, Package, Calendar } from "lucide-react";
import { format, subDays, startOfMonth, startOfYear, isSameDay, parseISO } from "date-fns";

type RangeType = "day" | "month" | "year" | "custom";

export function StatisticsSection() {
    const [range, setRange] = useState<RangeType>("month");
    const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [data, setData] = useState<any[]>([]);
    const [stats, setStats] = useState({ count: 0, orderCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const res = await getStatistics(range, startDate, endDate);

            // Process data for chart
            const chartData: any[] = [];
            const items = res.items || [];

            if (range === "day") {
                // Last 24 hours or just today
                chartData.push({ name: format(new Date(), "MMM dd"), value: items.filter((i: any) => isSameDay(parseISO(i.date), new Date())).length });
            } else if (range === "month" || (range === "custom" && items.length > 0)) {
                // Group by day for the last X days
                const days: Record<string, number> = {};
                items.forEach((item: any) => {
                    const d = format(parseISO(item.date), "MMM dd");
                    days[d] = (days[d] || 0) + 1;
                });
                Object.keys(days).forEach(key => chartData.push({ name: key, value: days[key] }));
            } else if (range === "year") {
                // Group by month
                const months: Record<string, number> = {};
                items.forEach((item: any) => {
                    const m = format(parseISO(item.date), "MMM");
                    months[m] = (months[m] || 0) + 1;
                });
                ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach(m => {
                    chartData.push({ name: m, value: months[m] || 0 });
                });
            }

            setData(chartData);
            setStats({ count: res.count, orderCount: items.length }); // Simplified for now
            setLoading(false);
        };
        fetchStats();
    }, [range, startDate, endDate]);

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {(["day", "month", "year", "custom"] as RangeType[]).map((r) => (
                        <Button
                            key={r}
                            variant={range === r ? "default" : "outline"}
                            size="sm"
                            className="capitalize h-8"
                            onClick={() => setRange(r)}
                        >
                            {r}
                        </Button>
                    ))}
                </div>
                {range === "custom" && (
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-8 text-xs"
                        />
                        <span className="text-muted-foreground">—</span>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Customers</p>
                                <h4 className="text-2xl font-bold text-foreground">{stats.count}</h4>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entries</p>
                                <h4 className="text-2xl font-bold text-foreground">{stats.orderCount}</h4>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Growth</p>
                                <h4 className="text-2xl font-bold text-foreground">+12%</h4>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Activity Patterns
                    </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full w-full bg-muted animate-pulse rounded-lg" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
