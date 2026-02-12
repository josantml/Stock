import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";
import { fetchOrders } from "@/app/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export const metadata = {
    title: 'Mis Ordenes',
};


export default async function Page(){ 
    const session = await auth();

    if(!session || session.user?.role !== 'client'){
        redirect('/login');
    }

    if(!session.user.email){
        redirect('/login');
    }

    const myOrders = await fetchOrders(session.user.email);

    

    return(
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Mis Ordenes</h1>
            </div>

            {myOrders.length === 0 ? (
                <p className="text-gray-500 mt-4">No has realizado compras aún.</p>
                ) : (
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full rounded-md bg-white">
                            <thead className="bg-gray-50 text-left text-sm font-medium">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Acción</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y text-sm">
                                {myOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-3">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">
                                            ${(order.total / 100).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {/* Nota que cambiamos la ruta del detalle para quitarle "/detail" */}
                                            <Link href={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:underline">
                                                Ver Detalle
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            )}
        </div>
    );
}