"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customer";

export type Customer = {
    id: string;
    name: string;
    phone: string;
    date: string;
    delivery_date: string;
    notes?: string | null;
    selected_garments?: string[] | null;
    shirt_length?: number | null;
    shirt_shoulder?: number | null;
    shirt_astin?: number | null;
    shirt_cuff?: number | null;
    shirt_chest?: number | null;
    shirt_waist?: number | null;
    shirt_seat?: number | null;
    shirt_collar?: number | null;
    pant_length?: number | null;
    pant_knee?: number | null;
    pant_fork?: number | null;
    pant_waist?: number | null;
    pant_hip?: number | null;
    pant_thigh?: number | null;
    pant_bottom?: number | null;
    coat_length?: number | null;
    coat_shoulder?: number | null;
    coat_astin?: number | null;
    coat_cuff?: number | null;
    coat_chest?: number | null;
    coat_waist?: number | null;
    coat_seat?: number | null;
    coat_collar?: number | null;
    kurta_length?: number | null;
    kurta_shoulder?: number | null;
    kurta_astin?: number | null;
    kurta_cuff?: number | null;
    kurta_chest?: number | null;
    kurta_waist?: number | null;
    kurta_seat?: number | null;
    kurta_collar?: number | null;
    pyjama_length?: number | null;
    pyjama_knee?: number | null;
    pyjama_fork?: number | null;
    pyjama_waist?: number | null;
    pyjama_hip?: number | null;
    pyjama_thigh?: number | null;
    pyjama_bottom?: number | null;
    modi_length?: number | null;
    modi_shoulder?: number | null;
    modi_astin?: number | null;
    modi_cuff?: number | null;
    modi_chest?: number | null;
    modi_waist?: number | null;
    modi_seat?: number | null;
    modi_collar?: number | null;
    safari_length?: number | null;
    safari_shoulder?: number | null;
    safari_astin?: number | null;
    safari_cuff?: number | null;
    safari_chest?: number | null;
    safari_waist?: number | null;
    safari_seat?: number | null;
    safari_collar?: number | null;
    jodhpuri_length?: number | null;
    jodhpuri_shoulder?: number | null;
    jodhpuri_astin?: number | null;
    jodhpuri_cuff?: number | null;
    jodhpuri_chest?: number | null;
    jodhpuri_waist?: number | null;
    jodhpuri_seat?: number | null;
    jodhpuri_collar?: number | null;
    recorded_by?: string | null;
    is_delivered?: boolean | null;
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

    let query = supabase
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

    return { customers: (data as Customer[]) ?? [], count: count ?? 0, search, phone };
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(id: string): Promise<Customer | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data as Customer;
}

/**
 * Get recently added customers (for dashboard)
 */
export async function getRecentCustomers(limit = 5): Promise<Customer[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return [];
    return (data as Customer[]) ?? [];
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
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("customers").select("*", { count: "exact", head: true }).eq("date", today),
        supabase
            .from("customers")
            .select("*", { count: "exact", head: true })
            .gte("date", firstOfMonth),
        supabase
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
 * Get deliveries due today
 */
/**
 * Get deliveries due today with optional filter
 */
export async function getDeliveriesToday(filter: "all" | "delivered" | "not_delivered" = "all"): Promise<Customer[]> {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    let query = supabase
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

    return (data as Customer[]) ?? [];
}

/**
 * Toggle delivery status
 */
export async function toggleDeliveryStatus(id: string, isDelivered: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
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
 * Get statistics for dashboard
 */
export async function getStatistics(range: "day" | "month" | "year" | "custom", startDate?: string, endDate?: string) {
    const supabase = await createClient();

    let query = supabase.from("customers").select("id, date, delivery_date, name");

    if (range === "day") {
        const today = new Date().toISOString().split("T")[0];
        query = query.eq("date", today);
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
        items: data ?? []
    };
}

/**
 * Create a new customer
 */
export async function createCustomer(formData: CustomerFormData): Promise<ActionResult> {
    const parsed = customerSchema.safeParse(formData);
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message };
    }

    const supabase = await createClient();

    // Get current user for recorded_by
    const { data: { user } } = await supabase.auth.getUser();
    const recorded_by = user?.email ?? null;

    const { data, error } = await supabase
        .from("customers")
        .insert([{ ...parsed.data, recorded_by }])
        .select()
        .single();

    if (error) {
        console.error("createCustomer error:", error);
        return { success: false, error: "Failed to save customer. Please try again." };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    return { success: true, data: data as Customer };
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
        return { success: false, error: parsed.error.errors[0].message };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .update({ ...parsed.data, updated_at: new Date().toISOString() })
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
    return { success: true, data: data as Customer };
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
        console.error("deleteCustomer error:", error);
        return { success: false, error: "Failed to delete customer." };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    return { success: true };
}
