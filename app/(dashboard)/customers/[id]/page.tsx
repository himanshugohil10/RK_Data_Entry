import { getCustomerById } from "@/lib/actions/customers";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/customers/CustomerForm";

interface CustomerDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
    const { id } = await params;
    const customer = await getCustomerById(id);
    if (!customer) notFound();

    return (
        <div className="max-w-4xl space-y-6">
            {/* Back & Actions */}
            <div className="flex items-center justify-between">
                <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    <Link href="/customers">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Customers
                    </Link>
                </Button>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-foreground mb-6">Customer Record</h1>
                <CustomerForm mode="view" initialData={customer} />
            </div>
        </div>
    );
}
