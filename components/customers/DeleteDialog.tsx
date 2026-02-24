"use client";

import { type Customer } from "@/lib/actions/customers";

interface DeleteDialogProps {
    customer: Customer | null;
    onConfirm: (id: string) => void;
    onCancel: () => void;
}

export function DeleteDialog({ customer, onConfirm, onCancel }: DeleteDialogProps) {
    if (!customer) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Modal */}
            <div className="relative bg-card rounded-xl border border-border shadow-2xl p-6 max-w-sm w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mx-auto mb-4">
                    <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h2 className="text-base font-semibold text-foreground text-center mb-1">
                    Delete Customer
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-foreground">{customer.name}</span>?
                    This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        className="flex-1 h-9 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-accent transition-colors"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 h-9 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
                        onClick={() => onConfirm(customer.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
