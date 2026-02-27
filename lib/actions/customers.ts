"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customer";

export type Customer = {
    id: string;
    name: string;
    phone: string;
    date: string;
    trial_date: string;
    delivery_date: string;
    dob?: string | null;
    notes?: string | null;
    selected_garments?: string[] | null;
    shirt_length?: number | string | null;
    shirt_shoulder?: number | string | null;
    shirt_astin?: number | string | null;
    shirt_cuff?: number | string | null;
    shirt_chest?: number | string | null;
    shirt_waist?: number | string | null;
    shirt_seat?: number | string | null;
    shirt_collar?: number | string | null;
    pant_length?: number | string | null;
    pant_knee?: number | string | null;
    pant_fork?: number | string | null;
    pant_waist?: number | string | null;
    pant_hip?: number | string | null;
    pant_thigh?: number | string | null;
    pant_bottom?: number | string | null;
    coat_length?: number | string | null;
    coat_shoulder?: number | string | null;
    coat_astin?: number | string | null;
    coat_cuff?: number | string | null;
    coat_chest?: number | string | null;
    coat_waist?: number | string | null;
    coat_seat?: number | string | null;
    coat_collar?: number | string | null;
    kurta_length?: number | string | null;
    kurta_shoulder?: number | string | null;
    kurta_astin?: number | string | null;
    kurta_cuff?: number | string | null;
    kurta_chest?: number | string | null;
    kurta_waist?: number | string | null;
    kurta_seat?: number | string | null;
    kurta_collar?: number | string | null;
    pyjama_length?: number | string | null;
    pyjama_knee?: number | string | null;
    pyjama_fork?: number | string | null;
    pyjama_waist?: number | string | null;
    pyjama_hip?: number | string | null;
    pyjama_thigh?: number | string | null;
    pyjama_bottom?: number | string | null;
    modi_length?: number | string | null;
    modi_shoulder?: number | string | null;
    modi_astin?: number | string | null;
    modi_cuff?: number | string | null;
    modi_chest?: number | string | null;
    modi_waist?: number | string | null;
    modi_seat?: number | string | null;
    modi_collar?: number | string | null;
    safari_length?: number | string | null;
    safari_shoulder?: number | string | null;
    safari_astin?: number | string | null;
    safari_cuff?: number | string | null;
    safari_chest?: number | string | null;
    safari_waist?: number | string | null;
    safari_seat?: number | string | null;
    safari_collar?: number | string | null;
    jodhpuri_length?: number | string | null;
    jodhpuri_shoulder?: number | string | null;
    jodhpuri_astin?: number | string | null;
    jodhpuri_cuff?: number | string | null;
    jodhpuri_chest?: number | string | null;
    jodhpuri_waist?: number | string | null;
    jodhpuri_seat?: number | string | null;
    jodhpuri_collar?: number | string | null;
    recorded_by?: string | null;
    is_delivered?: boolean | null;
    is_trialed?: boolean | null;
    created_at: string;
    updated_at: string;
};

export type ActionResult = {
    success: boolean;
    error?: string;
    data?: Customer;
};



/**
 * Get all customers with optional search and sort
 */
export async function getCustomers(
    search = "",
    phone = "",
    sortOrder: "asc" | "desc" = "desc",
    page = 1,
    pageSize = 10,
    filter: "all" | "today" | "month" | "year" | "custom" = "all",
    startDate?: string,
    endDate?: string
) {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = (supabase as any)
        .from("customers")
        .select("*", { count: "exact" })
        .order("date", { ascending: sortOrder === "asc" })
        .order("delivery_date", { ascending: sortOrder === "asc" })
        .order("created_at", { ascending: false })
        .range(from, to);

    if (search.trim()) {
        query = query.ilike("name", `%${search.trim()}%`);
    }

    if (phone.trim()) {
        query = query.ilike("phone", `%${phone.trim()}%`);
    }

    if (filter === "today") {
        const today = new Date().toISOString().split("T")[0];
        query = query.eq("date", today);
    } else if (filter === "month") {
        const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
        query = query.gte("date", firstOfMonth);
    } else if (filter === "year") {
        const firstOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
        query = query.gte("date", firstOfYear);
    } else if (filter === "custom" && startDate && endDate) {
        query = query.gte("date", startDate).lte("date", endDate);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error("getCustomers error:", error);
        return { customers: [], count: 0 };
    }

    return { customers: (data as any as Customer[]) ?? [], count: count ?? 0, search, phone };
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(id: string): Promise<Customer | null> {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data as any as Customer;
}

/**
 * Get recently added customers (for dashboard)
 */
export async function getRecentCustomers(limit = 5): Promise<Customer[]> {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return [];
    return (data as any as Customer[]) ?? [];
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
    const supabase = await createClient();

    const today = new Date().toISOString().split("T")[0];
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0];
    const firstOfYear = new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];

    const [{ count: total }, { count: todayCount }, { count: monthCount }, { count: yearCount }] = await Promise.all([
        (supabase as any).from("customers").select("*", { count: "exact", head: true }),
        (supabase as any).from("customers").select("*", { count: "exact", head: true }).eq("date", today),
        (supabase as any)
            .from("customers")
            .select("*", { count: "exact", head: true })
            .gte("date", firstOfMonth),
        (supabase as any)
            .from("customers")
            .select("*", { count: "exact", head: true })
            .gte("date", firstOfYear),
    ]);

    return {
        total: total ?? 0,
        today: todayCount ?? 0,
        thisMonth: monthCount ?? 0,
        thisYear: yearCount ?? 0,
    };
}

/**
 * Get deliveries due today with optional filter
 */
export async function getDeliveriesToday(filter: "all" | "delivered" | "not_delivered" = "all"): Promise<Customer[]> {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    let query = (supabase as any)
        .from("customers")
        .select("*")
        .eq("delivery_date", today)
        .order("name", { ascending: true });

    if (filter === "delivered") {
        query = query.eq("is_delivered", true);
    } else if (filter === "not_delivered") {
        query = query.or("is_delivered.eq.false,is_delivered.is.null");
    }

    const { data, error } = await query;

    if (error) {
        console.error("getDeliveriesToday error:", error);
        return [];
    }

    return (data as any as Customer[]) ?? [];
}

/**
 * Get trials due today
 */
export async function getTrialsToday(filter: "all" | "trialed" | "not_trialed" = "not_trialed"): Promise<Customer[]> {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    let query = (supabase as any)
        .from("customers")
        .select("*")
        .eq("trial_date", today)
        .order("name", { ascending: true });

    if (filter === "trialed") {
        query = query.eq("is_trialed", true);
    } else if (filter === "not_trialed") {
        query = query.or("is_trialed.eq.false,is_trialed.is.null");
    }

    const { data, error } = await query;

    if (error) {
        console.error("getTrialsToday error:", error);
        return [];
    }

    return (data as any as Customer[]) ?? [];
}


/**
 * Toggle delivery status
 */
export async function toggleDeliveryStatus(id: string, isDelivered: boolean) {
    const supabase = await createClient();
    const { error } = await (supabase as any)
        .from("customers")
        .update({ is_delivered: isDelivered })
        .eq("id", id);

    if (error) {
        console.error("toggleDeliveryStatus error:", error);
        return { success: false, error: "Failed to update delivery status" };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    return { success: true };
}

/**
 * Toggle trial status
 */
export async function toggleTrialStatus(id: string, isTrialed: boolean) {
    const supabase = await createClient();
    const { error } = await (supabase as any)
        .from("customers")
        .update({ is_trialed: isTrialed })
        .eq("id", id);

    if (error) {
        console.error("toggleTrialStatus error:", error);
        return { success: false, error: "Failed to update trial status" };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    return { success: true };
}

/**
 * Get statistics for dashboard
 */
export async function getStatistics(range: "day" | "month" | "year" | "custom", startDate?: string, endDate?: string) {
    const supabase = await createClient();

    let query = (supabase as any).from("customers").select("id, date, delivery_date, name");

    if (range === "day") {
        query = query.eq("date", new Date().toISOString().split("T")[0]);
    } else if (range === "month") {
        const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
        query = query.gte("date", firstOfMonth);
    } else if (range === "year") {
        const firstOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
        query = query.gte("date", firstOfYear);
    } else if (range === "custom" && startDate && endDate) {
        query = query.gte("date", startDate).lte("date", endDate);
    }

    const { data, error } = await query;

    if (error) {
        console.error("getStatistics error:", error);
        return { count: 0, items: [] };
    }

    return {
        count: data?.length ?? 0,
        items: (data as any) ?? []
    };
}

/**
 * Create a new customer
 */
export async function createCustomer(formData: CustomerFormData): Promise<ActionResult> {
    const parsed = customerSchema.safeParse(formData);
    if (!parsed.success) {
        console.error("createCustomer validation error:", parsed.error.format());
        return { success: false, error: parsed.error.errors[0].message };
    }

    const supabase = await createClient();

    // Check for duplicates and auto-increment name
    let finalName = parsed.data.name;
    const baseName = finalName.includes(" Size ") ? finalName.split(" Size ")[0] : finalName;

    const { data: similar } = await (supabase as any)
        .from("customers")
        .select("name")
        .ilike("name", `${baseName}%`)
        .eq("date", parsed.data.date);

    if (similar && similar.some((s: any) => s.name.toLowerCase() === finalName.toLowerCase())) {
        let maxNum = 1;
        similar.forEach((s: any) => {
            const name = s.name;
            if (name.startsWith(`${baseName} Size `)) {
                const parts = name.split(" Size ");
                const num = parseInt(parts[parts.length - 1]);
                if (!isNaN(num) && num > maxNum) {
                    maxNum = num;
                }
            } else if (name.toLowerCase() === baseName.toLowerCase()) {
                if (maxNum < 1) maxNum = 1;
            }
        });
        finalName = `${baseName} Size ${maxNum + 1}`;
    }

    // Get current user for recorded_by
    const { data: { user } } = await supabase.auth.getUser();
    const recorded_by = user?.email ?? null;

    const { data, error } = await (supabase as any)
        .from("customers")
        .insert([{ ...parsed.data, name: finalName, recorded_by }])
        .select()
        .single();

    if (error) {
        console.error("createCustomer error:", error);
        return { success: false, error: "Failed to save customer. Please try again." };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    return { success: true, data: data as any as Customer };
}

/**
 * Update an existing customer
 */
export async function updateCustomer(
    id: string,
    formData: CustomerFormData
): Promise<ActionResult> {
    const parsed = customerSchema.safeParse(formData);
    if (!parsed.success) {
        console.error("updateCustomer validation error:", parsed.error.format());
        return { success: false, error: parsed.error.errors[0].message };
    }

    const supabase = await createClient();

    // Check for duplicates and auto-increment name
    let finalName = parsed.data.name;
    const baseName = finalName.includes(" Size ") ? finalName.split(" Size ")[0] : finalName;

    const { data: similar } = await (supabase as any)
        .from("customers")
        .select("id, name")
        .ilike("name", `${baseName}%`)
        .eq("date", parsed.data.date)
        .neq("id", id);

    if (similar && similar.some((s: any) => s.name.toLowerCase() === finalName.toLowerCase())) {
        let maxNum = 1;
        similar.forEach((s: any) => {
            const name = s.name;
            if (name.startsWith(`${baseName} Size `)) {
                const parts = name.split(" Size ");
                const num = parseInt(parts[parts.length - 1]);
                if (!isNaN(num) && num > maxNum) {
                    maxNum = num;
                }
            } else if (name.toLowerCase() === baseName.toLowerCase()) {
                if (maxNum < 1) maxNum = 1;
            }
        });
        finalName = `${baseName} Size ${maxNum + 1}`;
    }

    const { data, error } = await (supabase as any)
        .from("customers")
        .update({ ...parsed.data, name: finalName, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("updateCustomer error:", error);
        return { success: false, error: "Failed to update customer. Please try again." };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    revalidatePath(`/customers/${id}/edit`);
    return { success: true, data: data as any as Customer };
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { error } = await (supabase as any).from("customers").delete().eq("id", id);

    if (error) {
        console.error("deleteCustomer error:", error);
        return { success: false, error: "Failed to delete customer." };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    return { success: true };
}
