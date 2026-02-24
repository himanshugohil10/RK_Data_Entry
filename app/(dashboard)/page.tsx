import { getDashboardStats, getRecentCustomers } from "@/lib/actions/customers";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentCustomers } from "@/components/dashboard/RecentCustomers";
import { DeliveryInbox } from "@/components/dashboard/DeliveryInbox";
import { StatisticsSection } from "@/components/dashboard/StatisticsSection";
import { Users, CalendarDays, TrendingUp, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
    const [stats, recentCustomers] = await Promise.all([
        getDashboardStats(),
        getRecentCustomers(5),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Welcome back — here&apos;s an overview of your shop
                    </p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 gap-2">
                    <Link href="/customers/new">
                        <PlusCircle className="w-4 h-4" />
                        Add Customer
                    </Link>
                </Button>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Stats and Recent */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            label="Total Customers"
                            value={stats.total}
                            icon={<Users className="w-5 h-5" />}
                            color="blue"
                            filter="all"
                        />
                        <StatsCard
                            label="Today's Entries"
                            value={stats.today}
                            icon={<CalendarDays className="w-5 h-5" />}
                            color="green"
                            filter="today"
                        />
                        <StatsCard
                            label="Monthly Entries"
                            value={stats.thisMonth}
                            icon={<TrendingUp className="w-5 h-5" />}
                            color="purple"
                            filter="month"
                        />
                        <StatsCard
                            label="Yearly Entries"
                            value={stats.thisYear}
                            icon={<TrendingUp className="w-5 h-5" />}
                            color="amber"
                            filter="year"
                        />
                    </div>


                    {/* Recent customers */}
                    <RecentCustomers customers={recentCustomers} />
                </div>

                {/* Right Side: Delivery Inbox */}
                <div className="lg:col-span-1">
                    <DeliveryInbox />
                </div>
            </div>
        </div>
    );
}
