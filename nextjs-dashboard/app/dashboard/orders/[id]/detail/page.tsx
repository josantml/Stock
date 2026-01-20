import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOrderById, fetchOrderItem } from "@/app/lib/data";
//import OrderStatusForm from "@/app/ui/orders/orderStatus-form";
//import GenerateInvoiceButton from "@/app/ui/orders/generate-invoices-button";
import Image from "next/image";


export default async function Page({params,}: {params: Promise<{id: string}>;}){

    const { id }= await params;

    const order = await fetchOrderById(id);
    const items = await fetchOrderItem(id);

    if(!order){
        notFound();
    }

    return(
        <main className="space-y-6">
            {/* Header */}

            <div>
                <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:underline">
                    ← Back to orders
                </Link>

                <h1 className="mt-2 text-2xl font-semibold">
                    Orden #{order.id}
                </h1>
            </div>


            {/* Order Info */}
            <div className="rounded-md bg-gray-50 p-4 space-y-2">
                <p><strong>Cliente:</strong>{order.customer.name}</p>
                <p><strong>Email:</strong>{order.customer.email}</p>
                <p><strong>Estado:</strong>{order.status}</p>
                <p><strong>Total:</strong>{order.total / 100}</p>

                {order.invoice_id && (
                    <Link href={`/dashboard/invoices/${order.invoice_id}`} className="mt-2 inline-block text-blue-600 underline">
                        Ver Factura
                    </Link>
                )}

                {order.invoice?.pdf_url && (
                    <a 
                        href={order.invoice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Descargar factura (PDF)
                    </a>
                )}
            </div>

            <div className="rounded-md bg-white border">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left">Producto</th>
                            <th className="px-3 py-2">Cantidad</th>
                            <th className="px-3 py-2">Precio</th>
                            <th className="px-3 py-2">Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-3 py-2">{item.product_name}</td>
                                <td className="px-3 py-2 text-center">{item.quantity}</td>
                                <td className="px-3 py-2 text-right">{item.price / 100}</td>
                                <td className="px-3 py-2 text-right">{item.subtotal / 100}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            

        </main>
    )

}