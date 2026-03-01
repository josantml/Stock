import { Card } from "../../ui/dashboard/cards";
import LatestInvoices from "../../ui/dashboard/latest-invoices";
import RevenueChart from "../../ui/dashboard/revenue-chart";
import { lusitana } from "../../ui/fonts";
import CardWrapper from "../../ui/dashboard/cards";
import { Suspense } from "react";
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardSkeleton } from "@/app/ui/skeletons";

// IMPORTAR LAS NUEVAS FUNCIONES
import { 
  fetchTopProducts, 
  fetchTopCustomers, 
  fetchLowStockProducts 
} from "../../lib/data";

export default async function Page() {
    // OBTENER DATOS REALES
    const topProducts = await fetchTopProducts();
    const topCustomers = await fetchTopCustomers();
    const lowStockProducts = await fetchLowStockProducts();

    return(
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard Admin
            </h1>
            
            {/* SECCIÓN DE RESUMEN (Tus Cards existentes) */}
            {/*<h3 className={`${lusitana.className} text-xl mb-4`}>Resume Count</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 bg-blue-200 p-4 rounded-lg">
                <Suspense fallback={<CardSkeleton />}>
                    <CardWrapper/>
                </Suspense>
            </div>*/}

            {/* NUEVA SECCIÓN: ESTADÍSTICAS DE NEGOCIO */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                {/* GRÁFICO EXISTENTE */}
                <div className="lg:col-span-1">
                     <Suspense fallback={<RevenueChartSkeleton />}>
                        <RevenueChart />
                    </Suspense>
                </div>

                {/* ULTIMAS FACTURAS EXISTENTE */}
                 {/*<div className="lg:col-span-1">
                    <Suspense fallback={<LatestInvoicesSkeleton/>}>
                        <LatestInvoices/>
                    </Suspense>
                 </div>*/}

                 {/* NUEVO: PRODUCTOS MÁS VENDIDOS */}
                 <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
                    <h3 className={`${lusitana.className} text-lg mb-3`}>Productos Top (Vendidos)</h3>
                    <div className="space-y-2">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                                <span>{product.nombre}</span>
                                <span className="font-bold text-blue-600">{product.total_vendido} uds</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* NUEVO: CLIENTES TOP */}
                 <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
                    <h3 className={`${lusitana.className} text-lg mb-3`}>Clientes con Mayores Compras</h3>
                    <div className="space-y-2">
                        {topCustomers.map((customer, index) => (
                            <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                                <div>
                                    <p className="font-medium">{customer.customer_name}</p>
                                    <p className="text-xs text-gray-500">{customer.customer_email}</p>
                                </div>
                                <span className="font-bold text-green-600">${customer.total_gastado}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* NUEVO: STOCK BAJO */}
                 <div className="rounded-xl bg-red-50 p-4 shadow-sm border border-red-100">
                    <h3 className={`${lusitana.className} text-lg mb-3 text-red-700`}>Stock Bajo (Alertas)</h3>
                    <div className="space-y-2">
                        {lowStockProducts.length === 0 ? (
                            <p className="text-sm text-gray-500">¡Inventario OK!</p>
                        ) : (
                            lowStockProducts.map((product, index) => (
                                <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                                    <span>{product.nombre}</span>
                                    <span className="font-bold text-red-600">{product.stock} restantes</span>
                                </div>
                            ))
                        )}
                    </div>
                 </div>

            </div>
        </main>
        
    )
}

