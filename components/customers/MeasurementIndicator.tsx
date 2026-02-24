import { cn } from "@/lib/utils";

interface MeasurementIndicatorProps {
    filled: number;
    total: number;
    className?: string;
}

export function MeasurementIndicator({ filled, total, className }: MeasurementIndicatorProps) {
    const pct = total === 0 ? 0 : filled / total;
    const color =
        pct === 0
            ? "bg-muted text-muted-foreground"
            : pct === 1
                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-amber-100 text-amber-700 ring-1 ring-amber-200";

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                color,
                className
            )}
            title={`${filled} of ${total} measurements filled`}
        >
            {filled}/{total}
        </span>
    );
}
