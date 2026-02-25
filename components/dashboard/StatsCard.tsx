import { cn } from "@/lib/utils";

type Color = "blue" | "green" | "purple" | "amber";

const colorMap: Record<Color, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    purple: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

const iconColorMap: Record<Color, string> = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    purple: "text-violet-600",
    amber: "text-amber-600",
};

import Link from "next/link";

interface StatsCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: Color;
    filter: "all" | "today" | "month" | "year";
}

export function StatsCard({ label, value, icon, color, filter }: StatsCardProps) {
    return (
        <Link
            href={`/customers?filter=${filter}`}
            className="group block"
        >
            <div className="bg-card rounded-xl border border-border p-3 md:p-5 flex items-center gap-3 md:gap-4 shadow-sm group-hover:shadow-md group-hover:border-primary/50 transition-all active:scale-[0.98]">
                <div className={cn("flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl ring-1 shrink-0", colorMap[color])}>
                    <span className={cn("scale-90 md:scale-100", iconColorMap[color])}>{icon}</span>
                </div>
                <div className="min-w-0">
                    <p className="text-xl md:text-2xl font-bold text-foreground tabular-nums group-hover:text-primary transition-colors leading-none">{value}</p>
                    <p className="text-[10px] md:text-sm text-muted-foreground mt-1 font-medium uppercase tracking-tight md:tracking-normal md:capitalize md:font-normal">{label}</p>
                </div>
            </div>
        </Link>
    );
}
