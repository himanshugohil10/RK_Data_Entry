"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import {
    customerSchema,
    type CustomerFormData,
    SHIRT_FIELDS,
    PANT_FIELDS,
    GARMENTS,
} from "@/lib/validations/customer";
import { createCustomer, updateCustomer, type Customer } from "@/lib/actions/customers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Save, RotateCcw, Copy, Edit, Printer } from "lucide-react";
import { generateCustomerBill } from "@/lib/pdfUtils";
import { cn } from "@/lib/utils";
import { FRACTIONS, parseFractionalMeasurement, decimalToFraction } from "@/lib/measurementUtils";

interface CustomerFormProps {
    mode: "new" | "edit" | "view";
    initialData?: Customer;
    isDuplicate?: boolean;
}

function FractionalMeasurementInput({
    label,
    fieldKey,
    value,
    setValue,
    error,
    hasWarning,
    disabled = false,
}: {
    label: string;
    fieldKey: string;
    value: any;
    setValue: (key: any, val: any, options?: any) => void;
    error?: string;
    hasWarning: boolean;
    disabled?: boolean;
}) {
    const { natural, fraction } = parseFractionalMeasurement(value);

    return (
        <div className="space-y-1.5">
            <Label
                className={cn("text-xs font-medium", hasWarning ? "text-amber-600" : "text-muted-foreground")}
            >
                {label}
                {hasWarning && <span className="ml-1 text-amber-500">∙</span>}
            </Label>

            <div className="flex flex-col gap-1.5">
                <div className="relative">
                    <Input
                        type="number"
                        value={natural}
                        onChange={(e) => {
                            const n = e.target.value;
                            setValue(fieldKey, fraction === "0" ? n : `${n} ${fraction}`, { shouldDirty: true });
                        }}
                        disabled={disabled}
                        placeholder="—"
                        className={cn(
                            "h-10 text-sm font-medium pr-12 disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                            hasWarning && !disabled
                                ? "border-amber-300 bg-amber-50/50 focus:border-amber-400 placeholder:text-amber-300"
                                : ""
                        )}
                    />
                    {fraction !== "0" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-primary pointer-events-none">
                            {fraction}
                        </div>
                    )}
                </div>

                {!disabled && (
                    <div className="grid grid-cols-4 gap-1">
                        {FRACTIONS.map((f) => (
                            <Button
                                key={f}
                                type="button"
                                variant={fraction === f ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "h-7 text-[10px] px-0 font-bold transition-all",
                                    fraction === f ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]" : "text-muted-foreground hover:bg-muted"
                                )}
                                onClick={() => {
                                    const n = natural || "0";
                                    setValue(fieldKey, f === "0" ? n : `${n} ${f}`, { shouldDirty: true });
                                }}
                            >
                                {f === "0" ? "None" : f}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

export function CustomerForm({ mode: initialMode, initialData, isDuplicate }: CustomerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [addAnother, setAddAnother] = useState(false);
    const [mode, setMode] = useState<"new" | "edit" | "view">(initialMode);

    const today = format(new Date(), "yyyy-MM-dd");

    const defaultValues: Partial<CustomerFormData> = (mode === "edit" || mode === "view") && initialData
        ? {
            name: isDuplicate ? `${initialData.name} (Copy)` : initialData.name,
            phone: initialData.phone,
            date: isDuplicate ? today : initialData.date,
            trial_date: isDuplicate ? today : initialData.trial_date,
            delivery_date: isDuplicate ? today : initialData.delivery_date,
            dob: initialData.dob ?? "",
            notes: initialData.notes ?? "",
            selected_garments: initialData.selected_garments ?? [],
            // Measurements
            shirt_length: decimalToFraction(initialData.shirt_length),
            shirt_shoulder: decimalToFraction(initialData.shirt_shoulder),
            shirt_astin: decimalToFraction(initialData.shirt_astin),
            shirt_cuff: decimalToFraction(initialData.shirt_cuff),
            shirt_chest: decimalToFraction(initialData.shirt_chest),
            shirt_waist: decimalToFraction(initialData.shirt_waist),
            shirt_seat: decimalToFraction(initialData.shirt_seat),
            shirt_collar: decimalToFraction(initialData.shirt_collar),
            pant_length: decimalToFraction(initialData.pant_length),
            pant_knee: decimalToFraction(initialData.pant_knee),
            pant_fork: decimalToFraction(initialData.pant_fork),
            pant_waist: decimalToFraction(initialData.pant_waist),
            pant_hip: decimalToFraction(initialData.pant_hip),
            pant_thigh: decimalToFraction(initialData.pant_thigh),
            pant_bottom: decimalToFraction(initialData.pant_bottom),
            coat_length: decimalToFraction(initialData.coat_length),
            coat_shoulder: decimalToFraction(initialData.coat_shoulder),
            coat_astin: decimalToFraction(initialData.coat_astin),
            coat_cuff: decimalToFraction(initialData.coat_cuff),
            coat_chest: decimalToFraction(initialData.coat_chest),
            coat_waist: decimalToFraction(initialData.coat_waist),
            coat_seat: decimalToFraction(initialData.coat_seat),
            coat_collar: decimalToFraction(initialData.coat_collar),
            kurta_length: decimalToFraction(initialData.kurta_length),
            kurta_shoulder: decimalToFraction(initialData.kurta_shoulder),
            kurta_astin: decimalToFraction(initialData.kurta_astin),
            kurta_cuff: decimalToFraction(initialData.kurta_cuff),
            kurta_chest: decimalToFraction(initialData.kurta_chest),
            kurta_waist: decimalToFraction(initialData.kurta_waist),
            kurta_seat: decimalToFraction(initialData.kurta_seat),
            kurta_collar: decimalToFraction(initialData.kurta_collar),
            pyjama_length: decimalToFraction(initialData.pyjama_length),
            pyjama_knee: decimalToFraction(initialData.pyjama_knee),
            pyjama_fork: decimalToFraction(initialData.pyjama_fork),
            pyjama_waist: decimalToFraction(initialData.pyjama_waist),
            pyjama_hip: decimalToFraction(initialData.pyjama_hip),
            pyjama_thigh: decimalToFraction(initialData.pyjama_thigh),
            pyjama_bottom: decimalToFraction(initialData.pyjama_bottom),
            modi_length: decimalToFraction(initialData.modi_length),
            modi_shoulder: decimalToFraction(initialData.modi_shoulder),
            modi_astin: decimalToFraction(initialData.modi_astin),
            modi_cuff: decimalToFraction(initialData.modi_cuff),
            modi_chest: decimalToFraction(initialData.modi_chest),
            modi_waist: decimalToFraction(initialData.modi_waist),
            modi_seat: decimalToFraction(initialData.modi_seat),
            modi_collar: decimalToFraction(initialData.modi_collar),
            safari_length: decimalToFraction(initialData.safari_length),
            safari_shoulder: decimalToFraction(initialData.safari_shoulder),
            safari_astin: decimalToFraction(initialData.safari_astin),
            safari_cuff: decimalToFraction(initialData.safari_cuff),
            safari_chest: decimalToFraction(initialData.safari_chest),
            safari_waist: decimalToFraction(initialData.safari_waist),
            safari_seat: decimalToFraction(initialData.safari_seat),
            safari_collar: decimalToFraction(initialData.safari_collar),
            jodhpuri_length: decimalToFraction(initialData.jodhpuri_length),
            jodhpuri_shoulder: decimalToFraction(initialData.jodhpuri_shoulder),
            jodhpuri_astin: decimalToFraction(initialData.jodhpuri_astin),
            jodhpuri_cuff: decimalToFraction(initialData.jodhpuri_cuff),
            jodhpuri_chest: decimalToFraction(initialData.jodhpuri_chest),
            jodhpuri_waist: decimalToFraction(initialData.jodhpuri_waist),
            jodhpuri_seat: decimalToFraction(initialData.jodhpuri_seat),
            jodhpuri_collar: decimalToFraction(initialData.jodhpuri_collar),
        }
        : { date: today, trial_date: today, delivery_date: today, dob: "", selected_garments: [] };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues,
    });

    const isReadOnly = mode === "view";
    const watchedValues = watch();
    const selectedGarments = watchedValues.selected_garments || [];

    const toggleGarment = (id: string) => {
        if (isReadOnly) return;
        const current = [...selectedGarments];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setValue("selected_garments", current, { shouldDirty: true });
    };

    const handleSave = async (data: CustomerFormData) => {
        setLoading(true);
        try {
            let result;
            if (mode === "edit" && initialData && !isDuplicate) {
                result = await updateCustomer(initialData.id, data);
            } else {
                result = await createCustomer(data);
            }

            if (!result.success) {
                toast.error(result.error ?? "Something went wrong");
                return;
            }

            toast.success(
                mode === "edit" && !isDuplicate
                    ? "Customer updated successfully"
                    : "Customer saved successfully"
            );

            if (addAnother) {
                reset({ date: today, trial_date: today, delivery_date: today, dob: "", selected_garments: [] });
                setMode("new");
                setAddAnother(false);
            } else {
                if (mode === "new" || isDuplicate) {
                    reset({ date: today, trial_date: today, delivery_date: today, dob: "", selected_garments: [] });
                    router.refresh();
                } else {
                    router.push("/customers");
                    router.refresh();
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            {/* Basic Details */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                        Basic Details
                    </h3>
                    {isReadOnly && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2"
                            onClick={() => setMode("edit")}
                        >
                            <Edit className="w-4 h-4" />
                            Edit Details
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Customer Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="E.g. Rajesh Kumar"
                            {...register("name")}
                            disabled={isReadOnly}
                            className={cn(
                                "disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                                errors.name ? "border-destructive" : ""
                            )}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium">
                            Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="9876543210"
                            maxLength={10}
                            {...register("phone")}
                            disabled={isReadOnly}
                            className={cn(
                                "disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                                errors.phone ? "border-destructive" : ""
                            )}
                        />
                        {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="date" className="text-sm font-medium">
                            Measurement Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            {...register("date")}
                            disabled={isReadOnly}
                            className={cn(
                                "disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                                errors.date ? "border-destructive" : ""
                            )}
                        />
                        {errors.date && (
                            <p className="text-xs text-destructive">{errors.date.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="trial_date" className="text-sm font-medium">
                            Trial Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="trial_date"
                            type="date"
                            {...register("trial_date")}
                            disabled={isReadOnly}
                            className={cn(
                                "disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                                errors.trial_date ? "border-destructive" : ""
                            )}
                        />
                        {errors.trial_date && (
                            <p className="text-xs text-destructive">{errors.trial_date.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="delivery_date" className="text-sm font-medium">
                            Delivery Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="delivery_date"
                            type="date"
                            {...register("delivery_date")}
                            disabled={isReadOnly}
                            className={cn(
                                "disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                                errors.delivery_date ? "border-destructive" : ""
                            )}
                        />
                        {errors.delivery_date && (
                            <p className="text-xs text-destructive">{errors.delivery_date.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="dob" className="text-sm font-medium">
                            Date of Birth <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="dob"
                            type="date"
                            {...register("dob")}
                            disabled={isReadOnly}
                            className={cn(
                                "disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                                errors.dob ? "border-destructive" : ""
                            )}
                        />
                        {errors.dob && (
                            <p className="text-xs text-destructive">{errors.dob.message}</p>
                        )}
                    </div>
                </div>
            </section>

            <Separator />

            {/* Garment Selection */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Select Garments
                </h3>
                <div className="flex flex-wrap gap-2">
                    {GARMENTS.map((g) => {
                        const isSelected = selectedGarments.includes(g.id);
                        return (
                            <Button
                                key={g.id}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                disabled={isReadOnly}
                                className={cn(
                                    "h-10 px-4 transition-all duration-200",
                                    isSelected ? "ring-2 ring-primary/20" : "",
                                    isReadOnly && "disabled:opacity-100 hover:bg-transparent cursor-default"
                                )}
                                onClick={() => toggleGarment(g.id)}
                            >
                                {g.label}
                            </Button>
                        );
                    })}
                </div>
                {errors.selected_garments && (
                    <p className="text-xs text-destructive">{errors.selected_garments.message}</p>
                )}
            </section>

            {selectedGarments.length > 0 && <Separator />}

            {/* Dynamic Measurement Fields */}
            {GARMENTS.map((g) => {
                if (!selectedGarments.includes(g.id)) return null;

                const emptyFields = g.fields.filter(
                    (f) => !watchedValues[f.key as keyof CustomerFormData] && watchedValues[f.key as keyof CustomerFormData] !== 0
                );

                return (
                    <section key={g.id} className="space-y-4 pb-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                {g.label} Measurements
                                <span className="ml-2 text-xs font-normal text-muted-foreground normal-case tracking-normal">
                                    (points)
                                </span>
                            </h3>
                            {emptyFields.length > 0 && emptyFields.length < g.fields.length && !isReadOnly && (
                                <span className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {emptyFields.length} empty
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {g.fields.map((f) => (
                                <FractionalMeasurementInput
                                    key={f.key}
                                    label={f.label}
                                    fieldKey={f.key}
                                    value={watchedValues[f.key as keyof CustomerFormData]}
                                    setValue={setValue}
                                    disabled={isReadOnly}
                                    error={errors[f.key as keyof CustomerFormData]?.message}
                                    hasWarning={emptyFields.some((e) => e.key === f.key)}
                                />
                            ))}
                        </div>
                    </section>
                );
            })}

            <Separator className="my-2" />

            {/* Notes */}
            <section className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                    Notes{" "}
                    <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                    id="notes"
                    placeholder="E.g. Special fitting requirements, fabric preferences, delivery notes…"
                    rows={3}
                    {...register("notes")}
                    disabled={isReadOnly}
                    className="resize-none disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent"
                />
                {errors.notes && (
                    <p className="text-xs text-destructive">{errors.notes?.message}</p>
                )}
            </section>


            {/* Action buttons */}
            {!isReadOnly && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="gap-2 min-w-28"
                        onClick={() => setAddAnother(false)}
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving…" : mode === "edit" && !isDuplicate ? "Update" : "Save"}
                    </Button>

                    {(mode === "new" || isDuplicate) && (
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={loading}
                            className="gap-2"
                            onClick={() => setAddAnother(true)}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Save & Add Another
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => generateCustomerBill(watchedValues)}
                    >
                        <Printer className="w-4 h-4" />
                        Generate Bill
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => {
                            if (mode === "edit" && initialData) {
                                setMode("view");
                                reset(defaultValues);
                            } else {
                                router.back();
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {isReadOnly && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                        type="button"
                        className="gap-2 min-w-28"
                        onClick={() => setMode("edit")}
                    >
                        <Edit className="w-4 h-4" />
                        Edit Record
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="gap-2"
                    >
                        <Link href={`/customers/${initialData?.id}/edit?duplicate=true`}>
                            <Copy className="w-4 h-4" />
                            Duplicate Record
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        className="gap-2"
                        onClick={() => generateCustomerBill(watchedValues)}
                    >
                        <Printer className="w-4 h-4" />
                        Print / Generate Bill
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => router.push("/customers")}
                    >
                        Back to List
                    </Button>
                </div>
            )}
        </form>
    );
}
