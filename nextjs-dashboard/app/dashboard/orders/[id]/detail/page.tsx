import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchOrderById, fetchOrderItem } from "@/app/lib/data";
import { auth } from "@/auth";


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
        <main className="">
            {/* Header */}
            <div className="">
                <div>
                    <Link href="/dashboard/orders" className="">
                        ← Volver a mis ordenes
                    </Link>

                    <h1 className="">
                        Orden #{order.id.slice(0, 8)};
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
            <div className="">
                <h2 className="">Informacion de la Compra</h2>
                <div className="">
                    <div>
                        <p className="">Fecha</p>
                        <p className="">
                            {new Date(order.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="">Email Registrado</p>
                        <p className="">{order.customer_email || 'No registrado'}</p>
                    </div>
                    <div className="">
                        <p className="">Total Pagado</p>
                        <p className="">${(order.total / 100).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Items table */}
            <div className="">
                <div className="">
                    <h3 className="">Productos</h3>
                </div>
                <table className="">
                    <thead className="">
                        <tr>
                            <th className="">Producto</th>
                            <th className="">Cant.</th>
                            <th className="">Precio</th>
                            <th className="">Subtotal</th>
                        </tr>
                    </thead>

                    <tbody className="">
                        {items.map((item: any) => (
                            <tr key={item.id}>
                                <td className="">{item.product_name}</td>
                                <td className="">{item.quantity}</td>
                                <td className="">${(item.price / 100).toFixed(2)}</td>
                                <td className="">${(item.subtotal / 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}