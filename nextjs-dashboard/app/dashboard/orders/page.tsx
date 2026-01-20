import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";
import { fetchOrders } from "@/app/lib/data";


export const metadata = {
    title: 'Orders',
};


export default async function Page(){ 
    const orders = await fetchOrders();

    return(
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Ordenes</h1>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full rounded-md bg-white">
                    <thead className="bg-gray-50 text-left text-sm font-medium">
                        <tr>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-sm">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-4 py-3">{order.customer_name}</td>
                                <td className="px-4 py-3">{order.customer_email}</td>
                                <td className="px-4 py-3">{order.items_count}</td>
                                <td className="px-4 py-3">{order.total}</td>
                                <td className="px-4 py-3">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <Link href={`/dashboard/orders/${order.id}/detail`} className="text-blue-600 hover:underline">
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}