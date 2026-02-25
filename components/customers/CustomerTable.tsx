"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { type Customer, deleteCustomer } from "@/lib/actions/customers";
import { DeleteDialog } from "@/components/customers/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Edit,
    Trash2,
    Copy,
    ChevronLeft,
    ChevronRight,
    UserRound,
} from "lucide-react";

interface CustomerTableProps {
    initialCustomers: Customer[];
    initialCount: number;
    initialSearch: string;
    initialPhone: string;
    initialSort: "asc" | "desc";
    initialFilter?: "all" | "today" | "month" | "year" | "custom";
    initialStart?: string;
    initialEnd?: string;
    page: number;
    pageSize: number;
}

export function CustomerTable({
    initialCustomers,
    initialCount,
    initialSearch,
    initialPhone,
    initialSort,
    initialFilter = "all",
    initialStart = "",
    initialEnd = "",
    page,
    pageSize,
}: CustomerTableProps) {
    const router = useRouter();
    const [customers, setCustomers] = useState(initialCustomers);
    const [count, setCount] = useState(initialCount);
    const [search, setSearch] = useState(initialSearch);
    const [phone, setPhone] = useState(initialPhone);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSort);
    const [filter, setFilter] = useState(initialFilter);
    const [startDate, setStartDate] = useState(initialStart);
    const [endDate, setEndDate] = useState(initialEnd);
    const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
    const searchRef = useRef<NodeJS.Timeout | null>(null);
    const phoneRef = useRef<NodeJS.Timeout | null>(null);

    const updateUrl = useCallback(
        (newSearch: string, newPhone: string, newSort: "asc" | "desc", newPage: number, newFilter = filter, newStart = startDate, newEnd = endDate) => {
            const params = new URLSearchParams();
            if (newSearch) params.set("q", newSearch);
            if (newPhone) params.set("p", newPhone);
            if (newSort !== "desc") params.set("sort", newSort);
            if (newPage > 1) params.set("page", String(newPage));
            if (newFilter !== "all") params.set("filter", newFilter);
            if (newFilter === "custom") {
                if (newStart) params.set("start", newStart);
                if (newEnd) params.set("end", newEnd);
            }
            router.push(`/customers?${params.toString()}`, { scroll: false });
        },
        [router, filter, startDate, endDate]
    );

    const handleSearch = (val: string) => {
        setSearch(val);
        if (searchRef.current) clearTimeout(searchRef.current);
        searchRef.current = setTimeout(() => {
            updateUrl(val, phone, sortOrder, 1);
        }, 350);
    };

    const handlePhoneSearch = (val: string) => {
        setPhone(val);
        if (phoneRef.current) clearTimeout(phoneRef.current);
        phoneRef.current = setTimeout(() => {
            updateUrl(search, val, sortOrder, 1);
        }, 350);
    };

    const handleSort = () => {
        const next = sortOrder === "desc" ? "asc" : "desc";
        setSortOrder(next);
        updateUrl(search, phone, next, page);
    };

    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
        updateUrl(search, phone, sortOrder, 1, newFilter);
    };

    const handleCustomFilterApply = () => {
        if (startDate && endDate) {
            updateUrl(search, phone, sortOrder, 1, "custom", startDate, endDate);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteCustomer(id);
        if (result.success) {
            setCustomers((prev) => prev.filter((c) => c.id !== id));
            setCount((prev) => prev - 1);
            toast.success("Customer deleted");
        } else {
            toast.error(result.error ?? "Failed to delete");
        }
        setDeleteTarget(null);
    };

    const handleRowClick = (id: string) => {
        router.push(`/customers/${id}`);
    };

    // Sync on navigation (server updates)
    useEffect(() => {
        setCustomers(initialCustomers);
        setCount(initialCount);
    }, [initialCustomers, initialCount]);

    const totalPages = Math.ceil(count / pageSize);

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-full sm:w-fit overflow-x-auto">
                {(["all", "today", "month", "year", "custom"] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-4 text-xs capitalize whitespace-nowrap"
                        onClick={() => handleFilterChange(f)}
                    >
                        {f}
                    </Button>
                ))}
            </div>

            {/* Custom Date Filter */}
            {filter === "custom" && (
                <div className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="grid w-full gap-1.5">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Start Date</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="grid w-full gap-1.5">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">End Date</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <Button onClick={handleCustomFilterApply} className="h-9 whitespace-nowrap">
                        Apply Filter
                    </Button>
                </div>
            )}

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <div className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Name…"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9 h-10 md:h-9 rounded-xl md:rounded-lg"
                        />
                    </div>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Phone…"
                            value={phone}
                            onChange={(e) => handlePhoneSearch(e.target.value)}
                            className="pl-9 h-10 md:h-9 rounded-xl md:rounded-lg"
                        />
                    </div>
                </div>
                <Button variant="outline" onClick={handleSort} className="gap-2 w-full sm:w-auto h-10 md:h-9 rounded-xl md:rounded-lg shrink-0">
                    {sortOrder === "desc" ? (
                        <ArrowDown className="w-4 h-4" />
                    ) : (
                        <ArrowUp className="w-4 h-4" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-tight">{sortOrder === "desc" ? "Newest" : "Oldest"}</span>
                </Button>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                {customers.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted mx-auto mb-4">
                            <UserRound className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            {search || filter !== "all" ? "No records found" : "No customers yet"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-5">
                            {search || filter !== "all"
                                ? `Try adjusting your search or filters`
                                : "Start adding customer measurements to see them here"}
                        </p>
                        {!search && filter === "all" && (
                            <Button asChild size="sm">
                                <Link href="/customers/new">Add First Customer</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {/* Mobile View: List */}
                        <div className="md:hidden divide-y divide-border/50">
                            {customers.map((customer, i) => {
                                const rowNum = (page - 1) * pageSize + i + 1;
                                return (
                                    <div
                                        key={customer.id}
                                        onClick={() => handleRowClick(customer.id)}
                                        className="p-4 active:bg-muted transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-[10px] tabular-nums text-muted-foreground/50 font-bold">{rowNum}.</span>
                                                <p className="font-bold text-foreground truncate">{customer.name}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <Link href={`/customers/${customer.id}/edit`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => setDeleteTarget(customer)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mb-2">
                                            <span>{customer.phone}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0" />
                                            <span>{format(new Date(customer.date), "dd MMM")}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {customer.selected_garments?.map((g, idx) => (
                                                <span key={idx} className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-bold uppercase tracking-tight">{g}</span>
                                            )) || <span className="text-[9px] text-muted-foreground">No garments</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/40">
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">#</th>
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Name</th>
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px] hidden sm:table-cell">Phone</th>
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px] hidden md:table-cell whitespace-nowrap">
                                            <button onClick={handleSort} className="flex items-center gap-1 hover:text-foreground transition-colors uppercase">
                                                Measurement
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px] hidden md:table-cell whitespace-nowrap">
                                            Trial
                                        </th>
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Order</th>
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px] hidden lg:table-cell">Recorder</th>
                                        <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px] hidden xl:table-cell">DOB</th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, i) => {
                                        const rowNum = (page - 1) * pageSize + i + 1;
                                        return (
                                            <tr
                                                key={customer.id}
                                                onClick={() => handleRowClick(customer.id)}
                                                className="border-b border-border/60 last:border-0 hover:bg-muted/10 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-4 py-3 text-muted-foreground text-xs tabular-nums">{rowNum}</td>
                                                <td className="px-4 py-3 font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {customer.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs font-medium">{customer.phone}</td>
                                                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell whitespace-nowrap text-xs font-medium">
                                                    {format(new Date(customer.date), "dd MMM yyyy")}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell whitespace-nowrap text-xs font-medium">
                                                    {customer.trial_date ? format(new Date(customer.trial_date), "dd MMM yyyy") : "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {customer.selected_garments?.map((g, idx) => (
                                                            <span key={idx} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold uppercase">{g}</span>
                                                        )) || "—"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs font-medium whitespace-nowrap" title={customer.recorded_by ?? "Unknown"}>
                                                    {customer.recorded_by ?? "—"}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell text-xs font-medium whitespace-nowrap">
                                                    {customer.dob ? format(new Date(customer.dob), "dd MMM") : "—"}
                                                </td>
                                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                                                            <Link href={`/customers/${customer.id}/edit`}>
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/5"
                                                            title="Delete"
                                                            onClick={() => setDeleteTarget(customer)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, count)} of {count} customers
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => updateUrl(search, phone, sortOrder, page - 1)}
                            className="gap-1 h-8"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => updateUrl(search, phone, sortOrder, page + 1)}
                            className="gap-1 h-8"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete dialog */}
            <DeleteDialog
                customer={deleteTarget}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
