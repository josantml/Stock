import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchOrderById, fetchOrderItem } from "@/app/lib/data";
import { auth } from "@/auth";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


export default async function Page({params}: {params: Promise<{id: string}>;}){
    const { id }= await params;
    const session = await auth();

    if(!session || session.user?.role !== 'client'){
        redirect('/login');
    }

    const order = await fetchOrderById(id);
    const items = await fetchOrderItem(id);

    if(!order){
        notFound();
    }

    /* Seguridad de los datos: se verifica quela orden pertenezca al usuario logueado
    comparando el email de la sesion con el mail de la orden*/
    if(order.customer_email !== session.user.email) {
        redirect('/dashboard/orders');
    }

    return(
        <main className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 mb-2">
                        <ArrowLeftIcon className="w-4 h-4"/>
                        Volver a mis ordenes
                    </Link>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                        Orden N°{order.id.slice(0, 8)};
                    </h1>
                </div>
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {order.status}
                    </span>
                </div>
            </div>
            


            {/* Order Info */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-n pb-2">Informacion de la Compra</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Fecha</p>
                        <p className="text-gray-800 font-medium">
                            {new Date(order.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email Registrado</p>
                        <p className="text-gray-800 font-medium truncate">{order.customer_email || 'No registrado'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Pagado</p>
                        <p className="text-xl text-green-600 font-bold">${order.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Items table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">Productos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Producto</th>
                                <th className="px-6 py-4 text-center font-semibold">Cant.</th>
                                <th className="px-6 py-4 text-right font-semibold">Precio</th>
                                <th className="px-6 py-4 text-right font-semibold">Subtotal</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {items.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 font-medium">{item.product_name}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                                    <td className="px-6 py-4 text-right text-gray-600 ">${item.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-800 ">${item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
            </div>
        </main>
    )
}