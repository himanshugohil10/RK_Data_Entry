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
import { AlertTriangle, Save, RotateCcw, Copy, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerFormProps {
    mode: "new" | "edit" | "view";
    initialData?: Customer;
    isDuplicate?: boolean;
}

function MeasurementInput({
    label,
    fieldKey,
    register,
    error,
    hasWarning,
    disabled = false,
}: {
    label: string;
    fieldKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any;
    error?: string;
    hasWarning: boolean;
    disabled?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <Label
                htmlFor={fieldKey}
                className={cn("text-xs font-medium", hasWarning ? "text-amber-600" : "text-muted-foreground")}
            >
                {label}
                {hasWarning && <span className="ml-1 text-amber-500">∙</span>}
            </Label>
            <Input
                type="number"
                step="any"
                min="0"
                placeholder="—"
                {...register(fieldKey)}
                disabled={disabled}
                className={cn(
                    "h-9 text-sm disabled:opacity-100 disabled:bg-muted/30 disabled:border-transparent",
                    hasWarning && !disabled
                        ? "border-amber-300 bg-amber-50/50 focus:border-amber-400 placeholder:text-amber-300"
                        : ""
                )}
            />
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
            shirt_length: initialData.shirt_length ?? undefined,
            shirt_shoulder: initialData.shirt_shoulder ?? undefined,
            shirt_astin: initialData.shirt_astin ?? undefined,
            shirt_cuff: initialData.shirt_cuff ?? undefined,
            shirt_chest: initialData.shirt_chest ?? undefined,
            shirt_waist: initialData.shirt_waist ?? undefined,
            shirt_seat: initialData.shirt_seat ?? undefined,
            shirt_collar: initialData.shirt_collar ?? undefined,
            pant_length: initialData.pant_length ?? undefined,
            pant_knee: initialData.pant_knee ?? undefined,
            pant_fork: initialData.pant_fork ?? undefined,
            pant_waist: initialData.pant_waist ?? undefined,
            pant_hip: initialData.pant_hip ?? undefined,
            pant_thigh: initialData.pant_thigh ?? undefined,
            pant_bottom: initialData.pant_bottom ?? undefined,
            coat_length: initialData.coat_length ?? undefined,
            coat_shoulder: initialData.coat_shoulder ?? undefined,
            coat_astin: initialData.coat_astin ?? undefined,
            coat_cuff: initialData.coat_cuff ?? undefined,
            coat_chest: initialData.coat_chest ?? undefined,
            coat_waist: initialData.coat_waist ?? undefined,
            coat_seat: initialData.coat_seat ?? undefined,
            coat_collar: initialData.coat_collar ?? undefined,
            kurta_length: initialData.kurta_length ?? undefined,
            kurta_shoulder: initialData.kurta_shoulder ?? undefined,
            kurta_astin: initialData.kurta_astin ?? undefined,
            kurta_cuff: initialData.kurta_cuff ?? undefined,
            kurta_chest: initialData.kurta_chest ?? undefined,
            kurta_waist: initialData.kurta_waist ?? undefined,
            kurta_seat: initialData.kurta_seat ?? undefined,
            kurta_collar: initialData.kurta_collar ?? undefined,
            pyjama_length: initialData.pyjama_length ?? undefined,
            pyjama_knee: initialData.pyjama_knee ?? undefined,
            pyjama_fork: initialData.pyjama_fork ?? undefined,
            pyjama_waist: initialData.pyjama_waist ?? undefined,
            pyjama_hip: initialData.pyjama_hip ?? undefined,
            pyjama_thigh: initialData.pyjama_thigh ?? undefined,
            pyjama_bottom: initialData.pyjama_bottom ?? undefined,
            modi_length: initialData.modi_length ?? undefined,
            modi_shoulder: initialData.modi_shoulder ?? undefined,
            modi_astin: initialData.modi_astin ?? undefined,
            modi_cuff: initialData.modi_cuff ?? undefined,
            modi_chest: initialData.modi_chest ?? undefined,
            modi_waist: initialData.modi_waist ?? undefined,
            modi_seat: initialData.modi_seat ?? undefined,
            modi_collar: initialData.modi_collar ?? undefined,
            safari_length: initialData.safari_length ?? undefined,
            safari_shoulder: initialData.safari_shoulder ?? undefined,
            safari_astin: initialData.safari_astin ?? undefined,
            safari_cuff: initialData.safari_cuff ?? undefined,
            safari_chest: initialData.safari_chest ?? undefined,
            safari_waist: initialData.safari_waist ?? undefined,
            safari_seat: initialData.safari_seat ?? undefined,
            safari_collar: initialData.safari_collar ?? undefined,
            jodhpuri_length: initialData.jodhpuri_length ?? undefined,
            jodhpuri_shoulder: initialData.jodhpuri_shoulder ?? undefined,
            jodhpuri_astin: initialData.jodhpuri_astin ?? undefined,
            jodhpuri_cuff: initialData.jodhpuri_cuff ?? undefined,
            jodhpuri_chest: initialData.jodhpuri_chest ?? undefined,
            jodhpuri_waist: initialData.jodhpuri_waist ?? undefined,
            jodhpuri_seat: initialData.jodhpuri_seat ?? undefined,
            jodhpuri_collar: initialData.jodhpuri_collar ?? undefined,
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
                                <MeasurementInput
                                    key={f.key}
                                    label={f.label}
                                    fieldKey={f.key}
                                    register={register}
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
