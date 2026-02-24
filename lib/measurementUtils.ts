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
        return val !== null && val !== undefined;
    });
    return { filled: filled.length, total: keys.length };
}
