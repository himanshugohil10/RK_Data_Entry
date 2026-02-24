import { getCustomerById } from "@/lib/actions/customers";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditCustomerPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ duplicate?: string }>;
}

export default async function EditCustomerPage({ params, searchParams }: EditCustomerPageProps) {
    const { id } = await params;
    const sp = await searchParams;
    const isDuplicate = sp.duplicate === "true";

    const customer = await getCustomerById(id);
    if (!customer) notFound();

    return (
        <div className="max-w-4xl space-y-6">
            {/* Back */}
            <div>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    <Link href="/customers">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Customers
                    </Link>
                </Button>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    {isDuplicate ? "Duplicate Entry" : "Edit Customer"}
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    {isDuplicate
                        ? `Creating a copy of ${customer.name}'s record`
                        : `Editing record for ${customer.name}`}
                </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <CustomerForm
                    mode="edit"
                    initialData={customer}
                    isDuplicate={isDuplicate}
                />
            </div>
        </div>
    );
}
