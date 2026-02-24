import { CustomerForm } from "@/components/customers/CustomerForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewCustomerPage() {
    return (
        <div className="max-w-4xl space-y-6">
            {/* Back */}
            <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    <Link href="/customers">
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Link>
                </Button>
            </div>

            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">New Customer Entry</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    Fill in the details below. Measurements are optional but highlighted if empty.
                </p>
            </div>

            {/* Form card */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <CustomerForm mode="new" />
            </div>
        </div>
    );
}
