import { fetchOrders } from "@/app/lib/data"
import OrdersTestClient from "@/app/ui/orders/orders-test/order-test-client";


export default async function OrdersTestPage() {
    const orders = await fetchOrders();

    return(
        <div style={{padding:40}}>
            <h1 className="text-2xl mb-3">Order Test Panel</h1>

            {orders.length === 0 && (<p>No hay Ordenes</p>)}

            <OrdersTestClient orders={orders}/>
        </div>
    )
}