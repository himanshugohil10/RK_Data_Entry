import { z } from "zod";

const indianPhoneRegex = /^[6-9]\d{9}$/;

const measurementField = z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).positive("Must be positive").optional()
);

export const customerSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(indianPhoneRegex, "Enter a valid 10-digit Indian mobile number (starts with 6-9)"),
    date: z.string().min(1, "Date is required"),
    trial_date: z.string().min(1, "Trial Date is required"),
    delivery_date: z.string().min(1, "Delivery Date is required"),
    dob: z.string().optional().nullable().or(z.literal("")).transform(v => v === "" ? null : v),
    notes: z.string().max(500, "Notes too long").optional().nullable().or(z.literal("")).transform(v => v === "" ? null : v),
    selected_garments: z.array(z.string()).default([]),
    // Shirt
    shirt_length: measurementField,
    shirt_shoulder: measurementField,
    shirt_astin: measurementField,
    shirt_cuff: measurementField,
    shirt_chest: measurementField,
    shirt_waist: measurementField,
    shirt_seat: measurementField,
    shirt_collar: measurementField,
    // Pant
    pant_length: measurementField,
    pant_knee: measurementField,
    pant_fork: measurementField,
    pant_waist: measurementField,
    pant_hip: measurementField,
    pant_thigh: measurementField,
    pant_bottom: measurementField,
    // Coat
    coat_length: measurementField,
    coat_shoulder: measurementField,
    coat_astin: measurementField,
    coat_cuff: measurementField,
    coat_chest: measurementField,
    coat_waist: measurementField,
    coat_seat: measurementField,
    coat_collar: measurementField,
    // Kurta
    kurta_length: measurementField,
    kurta_shoulder: measurementField,
    kurta_astin: measurementField,
    kurta_cuff: measurementField,
    kurta_chest: measurementField,
    kurta_waist: measurementField,
    kurta_seat: measurementField,
    kurta_collar: measurementField,
    // Pyjama
    pyjama_length: measurementField,
    pyjama_knee: measurementField,
    pyjama_fork: measurementField,
    pyjama_waist: measurementField,
    pyjama_hip: measurementField,
    pyjama_thigh: measurementField,
    pyjama_bottom: measurementField,
    // Modi Jacket
    modi_length: measurementField,
    modi_shoulder: measurementField,
    modi_astin: measurementField,
    modi_cuff: measurementField,
    modi_chest: measurementField,
    modi_waist: measurementField,
    modi_seat: measurementField,
    modi_collar: measurementField,
    // Safari
    safari_length: measurementField,
    safari_shoulder: measurementField,
    safari_astin: measurementField,
    safari_cuff: measurementField,
    safari_chest: measurementField,
    safari_waist: measurementField,
    safari_seat: measurementField,
    safari_collar: measurementField,
    // Jodhpuri
    jodhpuri_length: measurementField,
    jodhpuri_shoulder: measurementField,
    jodhpuri_astin: measurementField,
    jodhpuri_cuff: measurementField,
    jodhpuri_chest: measurementField,
    jodhpuri_waist: measurementField,
    jodhpuri_seat: measurementField,
    jodhpuri_collar: measurementField,
    recorded_by: z.string().optional().nullable().or(z.literal("")).transform(v => v === "" ? null : v),
}).refine((data) => {
    if (!data.date || !data.delivery_date || !data.trial_date) return true;
    const mDate = new Date(data.date);
    const tDate = new Date(data.trial_date);
    const dDate = new Date(data.delivery_date);
    return tDate >= mDate && dDate >= tDate;
}, {
    message: "Trial date must be between measurement and delivery dates",
    path: ["trial_date"],
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const SHIRT_FIELDS = [
    { key: "shirt_length", label: "Length (pts)" },
    { key: "shirt_shoulder", label: "Shoulder" },
    { key: "shirt_astin", label: "Astin" },
    { key: "shirt_cuff", label: "Cuff" },
    { key: "shirt_chest", label: "Chest" },
    { key: "shirt_waist", label: "Waist" },
    { key: "shirt_seat", label: "Seat" },
    { key: "shirt_collar", label: "Collar" },
] as const;

export const PANT_FIELDS = [
    { key: "pant_length", label: "Length (pts)" },
    { key: "pant_knee", label: "Knee" },
    { key: "pant_fork", label: "Fork" },
    { key: "pant_waist", label: "Waist" },
    { key: "pant_hip", label: "Hip" },
    { key: "pant_thigh", label: "Thigh" },
    { key: "pant_bottom", label: "Bottom" },
] as const;

export const COAT_FIELDS = SHIRT_FIELDS.map(f => ({ ...f, key: f.key.replace("shirt_", "coat_") }));
export const KURTA_FIELDS = SHIRT_FIELDS.map(f => ({ ...f, key: f.key.replace("shirt_", "kurta_") }));
export const PYJAMA_FIELDS = PANT_FIELDS.map(f => ({ ...f, key: f.key.replace("pant_", "pyjama_") }));
export const MODI_FIELDS = SHIRT_FIELDS.map(f => ({ ...f, key: f.key.replace("shirt_", "modi_") }));
export const SAFARI_FIELDS = SHIRT_FIELDS.map(f => ({ ...f, key: f.key.replace("shirt_", "safari_") }));
export const JODHPURI_FIELDS = SHIRT_FIELDS.map(f => ({ ...f, key: f.key.replace("shirt_", "jodhpuri_") }));

export const GARMENTS = [
    { id: "Shirt", label: "Shirt", fields: SHIRT_FIELDS },
    { id: "Pant", label: "Pant", fields: PANT_FIELDS },
    { id: "Coat", label: "Coat", fields: COAT_FIELDS },
    { id: "Kurta", label: "Kurta", fields: KURTA_FIELDS },
    { id: "Pyjama", label: "Pyjama", fields: PYJAMA_FIELDS },
    { id: "Modi Jacket", label: "Modi Jacket", fields: MODI_FIELDS },
    { id: "Safari", label: "Safari", fields: SAFARI_FIELDS },
    { id: "Jodhpuri", label: "Jodhpuri", fields: JODHPURI_FIELDS },
] as const;

