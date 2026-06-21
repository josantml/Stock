import sql from '../../db';

interface OrderData {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  created_at: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number; // Este es el precio unitario
  subtotal: number;
}

export async function generateTicketHTML(
  orderId: string,
  storeName: string = 'ROMA Multirubros'
) {
  try {
    // Obtener datos de la orden
    const [orderData] = await sql<OrderData[]>`
      SELECT id, customer_name, customer_email, total, created_at
      FROM orders
      WHERE id = ${orderId}
    `;

    if (!orderData) {
      throw new Error('Orden no encontrada');
    }

    // Obtener items de la orden
    const orderItems = await sql<OrderItem[]>`
      SELECT 
        p.nombre as product_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) as subtotal
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
      ORDER BY p.nombre ASC
    `;

    const fecha = new Date(orderData.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const hora = new Date(orderData.created_at).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Generar HTML para ticket
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ticket ${orderId.slice(0, 8)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A5 portrait;
            margin: 10mm;
        }

        html, body {
            width: 100%;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Courier New', monospace;
            line-height: 1.4;
            font-size: 11px;
        }
        
        .ticket {
            width: 100%;
            max-width: 128mm; /* Asegura que no exceda el área útil del A5 */
            padding: 0;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
        }
        
        .store-name {
            /*font-size: 14px;*/
            /*font-weight: bold;*/
            margin-bottom: 2px;
            font-size: 18px;
            font-weight: bold;
        }
        
        .ticket-title {
            font-size: 10px;
            margin-bottom: 2px;
        }
        
        .ticket-id {
            font-size: 9px;
            margin-bottom: 2px;
        }
        
        .ticket-datetime {
            font-size: 9px;
            margin-bottom: 5px;
        }

        .ticket-warning {
            font-size: 9px;
            margin-bottom: 9px;
        }
        
        .client-section {
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 9px;
            margin-bottom: 2px;
        }
        
        .client-name {
            font-size: 9px;
            margin-bottom: 2px;
        }
        
        .client-email {
            font-size: 8px;
            word-break: break-all;
        }
        
        .items-section {
            border-bottom: 1px dashed #000;
            margin-bottom: 5px;
        }
        
        .items-header {
            display: grid;
            grid-template-columns: 1fr 80px 50px 80px; /* flexible, precio, cant, total */
            gap: 4px;
            align-items: start;
        }
        
        .item {
            display: grid;
            grid-template-columns: 1fr 80px 50px 80px; /* flexible, precio, cant, total */
            gap: 4px;
            align-items: start;
        }
        
        .item-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .item-price {
           /* width: 50px; */ /* Ancho fijo para Precio Unitario */
            text-align: right;
            margin-right: 4px;
            font-weight: bold;
            width: 80px;
        }

        .item-qty {
            /*width: 30px;*/ /* Ancho fijo para Cantidad */
            text-align: right;
            width: 60px;
        }
        
        .item-total {
            /*width: 40px;*/ /* Ancho fijo para Subtotal */
            text-align: right;
            width: 80px;
        }
        
        .total-section {
            text-align: right;
            padding: 5px 0;
            border-bottom: 2px dashed #000;
            border-top: 2px dashed #000;
            margin-bottom: 5px;
        }
        
        .total-label {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 2px;
        }
        
        .total-amount {
            font-size: 14px;
            font-weight: bold;
            color: #000;
        }
        
        .footer {
            text-align: center;
            font-size: 9px;
            padding-top: 5px;
        }
        
        .thank-you {
            margin-bottom: 2px;
            font-weight: bold;
        }
        
        .footer-text {
            font-size: 8px;
        }

        .header-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 8px;
        }

        .logo {
            /*width: 80px;
            height: auto;*/
            width: 50px;
            height: 50px;
            object-fit: contain;
            display: block;
            margin: 0 auto 8px auto;
        }
        
     /* === FORZAR A5 AL IMPRIMIR === */
        @media print {
            @page {
                size: A5 portrait;
                margin: 10mm;
            }
            
            html, body {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            .ticket {
                width: 100% !important;
                max-width: none !important;
                padding: 0 !important;
            }
        }
    </style>
</head>
<body>
    <div class="ticket" id="ticket">
        <div class="header">

        <div class="header-brand">
            <img
                src="/ROMA Mult.jpeg"
                alt= "ROMA Multirubro"
                class= "logo"
             />

            <div class="store-name">${storeName}</div>
        </div>
            

            <div class="ticket-title">PRESUPUESTO</div>
            <div class="ticket-id">ID Orden: ${orderId.slice(0, 8)}</div>
            <div class="ticket-datetime">${fecha} ${hora}</div>
            <div class="ticket-warning">"Presupuesto no valido como factura"</div>
        </div>
        
        <div class="client-section">
            <div class="section-title">CLIENTE:</div>
            <div class="client-name">${orderData.customer_name || 'GUEST'}</div>
            <div class="client-email">${orderData.customer_email || '---'}</div>
        </div>
        
        <div class="items-section">
            <div class="items-header">
                <div style="flex:1;">Descripción</div>
                <div class="item-price">Precio U.</div>
                <div class="item-qty">Cant.</div>
                <div class="item-total">Total</div>
            </div>
            
            ${orderItems
              .map(
                (item) => `
                <div class="item">
                    <div class="item-name">${item.product_name.substring(0, 60)}</div>
                    <div class="item-price">$${(item.price).toFixed(2)}</div>
                    <div class="item-qty">${item.quantity}</div>
                    <div class="item-total">$${(item.subtotal).toFixed(2)}</div>
                </div>
            `
              )
              .join('')}
        </div>
        
        <div class="total-section">
            <div class="total-label">TOTAL:</div>
            <div class="total-amount">$${(orderData.total).toFixed(2)}</div>
        </div>
        
        <div class="footer">
            <div class="thank-you">¡Gracias por su compra!</div>
            <div class="footer-text">Conserve este comprobante</div>
        </div>
    </div>
</body>
</html>
    `;

    return html;
  } catch (error) {
    console.error('Error generating ticket HTML:', error);
    throw error;
  }
}
