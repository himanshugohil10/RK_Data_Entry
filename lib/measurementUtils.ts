import type { Customer } from "@/lib/actions/customers";

const SHIRT_KEYS = ["length", "shoulder", "astin", "cuff", "chest", "waist", "seat", "collar"] as const;
const PANT_KEYS = ["length", "knee", "fork", "waist", "hip", "thigh", "bottom"] as const;

/**
 * Count how many measurement fields are filled for a customer.
 * This is a pure utility — safe to use in both client and server components.
 */
export function getMeasurementCompleteness(
    customer: Partial<Customer>,
    prefix: "shirt" | "pant"
) {
    const keys = prefix === "shirt" ? SHIRT_KEYS : PANT_KEYS;
    const filled = keys.filter((k) => {
        const val = customer[`${prefix}_${k}` as keyof Customer];
        return val !== null && val !== undefined && val !== "";
    });
    return { filled: filled.length, total: keys.length };
}

export const FRACTIONS = ["0", "1/4", "1/2", "3/4"] as const;

export function decimalToFraction(val: number | string | null | undefined): string {
    if (val === null || val === undefined || val === "") return "";

    // If it's already a fractional string, return it
    if (typeof val === "string" && val.includes("/")) return val;

    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num)) return val.toString();

    const natural = Math.floor(num);
    const fraction = num - natural;

    // Use a small epsilon for float comparison
    if (fraction < 0.01) return natural.toString();
    if (Math.abs(fraction - 0.25) < 0.01) return `${natural} 1/4`;
    if (Math.abs(fraction - 0.5) < 0.01) return `${natural} 1/2`;
    if (Math.abs(fraction - 0.75) < 0.01) return `${natural} 3/4`;

    // If it's a decimal we don't recognize as a standard fraction, just show it
    return (Math.round(num * 100) / 100).toString();
}

export function parseFractionalMeasurement(val: string | number | null | undefined) {
    if (val === null || val === undefined || val === "") return { natural: "", fraction: "0" };

    const str = val.toString().trim();
    const parts = str.split(" ");

    if (parts.length === 2) {
        return { natural: parts[0], fraction: parts[1] };
    }

    if (FRACTIONS.includes(parts[0] as any)) {
        return { natural: "0", fraction: parts[0] };
    }

    return { natural: parts[0], fraction: "0" };
}

export function fractionToDecimal(val: string | number | null | undefined): number | null {
    if (val === null || val === undefined || val === "") return null;
    if (typeof val === "number") return val;

    const str = val.trim();
    const parts = str.split(" ");

    if (parts.length === 1) {
        // Could be "3" or "1/4"
        if (parts[0].includes("/")) {
            const [num, den] = parts[0].split("/").map(Number);
            return num / den;
        }
        const n = parseFloat(parts[0]);
        return isNaN(n) ? null : n;
    }

    if (parts.length === 2) {
        // "3 1/4"
        const natural = parseFloat(parts[0]);
        const [num, den] = (parts[1] || "").split("/").map(Number);
        if (den) return natural + (num / den);
        return natural;
    }

    return parseFloat(str) || null;
}
