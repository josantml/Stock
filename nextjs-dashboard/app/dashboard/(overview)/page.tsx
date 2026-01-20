import { Card } from "../../ui/dashboard/cards";
import LatestInvoices from "../../ui/dashboard/latest-invoices";
import RevenueChart from "../../ui/dashboard/revenue-chart";
import { lusitana } from "../../ui/fonts";
//import { fetchRevenue } from "../../lib/data";
//import { fetchLatestInvoices } from "../../lib/data";
//import { fetchCardData } from "../../lib/data";
import CardWrapper from "../../ui/dashboard/cards";
import { Suspense } from "react";
import { RevenueChartSkeleton } from "@/app/ui/skeletons";
import { LatestInvoicesSkeleton } from "@/app/ui/skeletons";
import { CardSkeleton } from "@/app/ui/skeletons";



export default async function Page() {
    //const revenue = await fetchRevenue();
    //const latestInvoices = await fetchLatestInvoices();
    {/*const numberOfCustomers = (await fetchCardData()).numberOfCustomers
    const totalPaidInvoices = (await fetchCardData()).totalPaidInvoices
    const totalPendingInvoices = (await fetchCardData()).totalPendingInvoices
    const numberOfInvoices = (await fetchCardData()).numberOfInvoices*/}
    return(
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard Page
            </h1>
            <h3 className={`${lusitana.className} text-xl mb-4`}>Resume Count</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 bg-blue-200 p-4 rounded-lg">
                {/*<Card title="Collected" value={totalPaidInvoices} type="collected"/>
                <Card title="Pending" value={totalPendingInvoices} type="pending" />
                <Card title="Total Invoices" value={numberOfInvoices} type="invoices"/>
                <Card title="Total Customers" value={numberOfCustomers} type="customers"/>*/}
               
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                
                {/*<RevenueChart revenue={revenue} />*/}
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                {/*<LatestInvoices latestInvoices={latestInvoices} />*/}
                <Suspense fallback={<LatestInvoicesSkeleton/>}>
                    <LatestInvoices/>
                </Suspense>
                 <Suspense fallback={<CardSkeleton />}>
                    <CardWrapper/>
                </Suspense>
                
            </div>
        </main>
        
    )
}

