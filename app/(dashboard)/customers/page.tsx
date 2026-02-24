import { getCustomers } from "@/lib/actions/customers";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface CustomersPageProps {
    searchParams: Promise<{
        q?: string;
        p?: string;
        sort?: string;
        page?: string;
        filter?: "all" | "today" | "month" | "year" | "custom";
        start?: string;
        end?: string;
    }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
    const params = await searchParams;
    const search = params.q ?? "";
    const phone = params.p ?? "";
    const sortOrder = params.sort === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(params.page ?? "1", 10));
    const filter = params.filter ?? "all";
    const startDate = params.start;
    const endDate = params.end;
    const pageSize = 10;

    const { customers, count } = await getCustomers(
        search,
        phone,
        sortOrder,
        page,
        pageSize,
        filter,
        startDate,
        endDate
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Customer Records</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        {count} customer{count !== 1 ? "s" : ""} in total
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/customers/new">
                        <PlusCircle className="w-4 h-4" />
                        Add Customer
                    </Link>
                </Button>
            </div>

            <CustomerTable
                initialCustomers={customers}
                initialCount={count}
                initialSearch={search}
                initialPhone={phone}
                initialSort={sortOrder}
                initialFilter={filter}
                initialStart={startDate}
                initialEnd={endDate}
                page={page}
                pageSize={pageSize}
            />
        </div>
    );
}
