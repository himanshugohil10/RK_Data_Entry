import { getDashboardStats, getRecentCustomers } from "@/lib/actions/customers";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentCustomers } from "@/components/dashboard/RecentCustomers";
import { CombinedInbox } from "@/components/dashboard/CombinedInbox";
import { Users, CalendarDays, TrendingUp, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
    const [stats, recentCustomers] = await Promise.all([
        getDashboardStats(),
        getRecentCustomers(5),
    ]);

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
                        Overview of your tailoring shop
                    </p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 gap-2 w-full sm:w-auto">
                    <Link href="/customers/new">
                        <PlusCircle className="w-4 h-4" />
                        Add Customer
                    </Link>
                </Button>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
                {/* Left Side: Stats and Recent */}
                <div className="xl:col-span-8 flex flex-col gap-6 md:gap-8 order-2 xl:order-1">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        <StatsCard
                            label="Total"
                            value={stats.total}
                            icon={<Users className="w-4 h-4 md:w-5 h-5" />}
                            color="blue"
                            filter="all"
                        />
                        <StatsCard
                            label="Today"
                            value={stats.today}
                            icon={<CalendarDays className="w-4 h-4 md:w-5 h-5" />}
                            color="green"
                            filter="today"
                        />
                        <StatsCard
                            label="Month"
                            value={stats.thisMonth}
                            icon={<TrendingUp className="w-4 h-4 md:w-5 h-5" />}
                            color="purple"
                            filter="month"
                        />
                        <StatsCard
                            label="Year"
                            value={stats.thisYear}
                            icon={<TrendingUp className="w-4 h-4 md:w-5 h-5" />}
                            color="amber"
                            filter="year"
                        />
                    </div>

                    {/* Recent customers */}
                    <RecentCustomers customers={recentCustomers} />
                </div>

                {/* Right Side: Combined Inbox */}
                <div className="xl:col-span-4 order-1 xl:order-2">
                    <CombinedInbox />
                </div>
            </div>
        </div>
    );
}
