import sql from '../db';

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
  price: number;
  subtotal: number;
}

export async function generateTicketHTML(
  orderId: string,
  storeName: string = 'StockPablo'
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
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ticket ${orderId.slice(0, 8)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: 80mm auto;
            margin: 0;
            padding: 0;
        }

        @media print {
            body {
                width: 80mm !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            html {
                width: 80mm !important;
                height: auto;
            }
        }

        html, body {
            width: 80mm;
            height: auto;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Courier New', Courier, monospace;
            width: 80mm;
            font-size: 10px;
            line-height: 1.2;
            color: #000;
            background: white;
        }
        
        .ticket {
            width: 100%;
            max-width: 80mm;
            height: auto;
            padding: 6px;
            margin: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 6px;
            padding-bottom: 6px;
            border-bottom: 2px dashed #000;
        }
        
        .store-name {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .ticket-title {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .ticket-id {
            font-size: 8px;
            margin-bottom: 2px;
        }
        
        .ticket-datetime {
            font-size: 8px;
        }
        
        .client-section {
            margin: 6px 0;
            padding-bottom: 6px;
            border-bottom: 1px dashed #000;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 9px;
            margin-bottom: 2px;
        }
        
        .client-name {
            font-size: 9px;
            margin-bottom: 1px;
        }
        
        .client-email {
            font-size: 8px;
            word-break: break-word;
        }
        
        .items-section {
            margin: 6px 0;
        }
        
        .items-header {
            display: grid;
            grid-template-columns: 1fr 30px 35px;
            gap: 2px;
            font-weight: bold;
            font-size: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #000;
            margin-bottom: 3px;
        }
        
        .items-header > div:nth-child(2),
        .items-header > div:nth-child(3) {
            text-align: right;
        }
        
        .item {
            display: grid;
            grid-template-columns: 1fr 30px 35px;
            gap: 2px;
            font-size: 8px;
            padding: 2px 0;
            border-bottom: 1px dotted #ddd;
        }
        
        .item > div:nth-child(2),
        .item > div:nth-child(3) {
            text-align: right;
        }
        
        .item-name {
            word-break: break-word;
            overflow-wrap: break-word;
        }
        
        .total-section {
            margin: 6px 0;
            padding: 6px 0;
            border-top: 2px dashed #000;
            border-bottom: 2px dashed #000;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: bold;
            line-height: 1.4;
        }
        
        .footer {
            text-align: center;
            margin-top: 6px;
            padding-top: 6px;
        }
        
        .thank-you {
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .footer-text {
            font-size: 7px;
        }
        
        @media print {
            html, body {
                width: 80mm;
                margin: 0;
                padding: 0;
            }
            body {
                margin: 0;
                padding: 0;
            }
            .ticket {
                padding: 4px;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <div class="store-name">${storeName}</div>
            <div class="ticket-title">TICKET DE VENTA</div>
            <div class="ticket-id">ID: ${orderId.slice(0, 8)}</div>
            <div class="ticket-datetime">${fecha} ${hora}</div>
        </div>
        
        <div class="client-section">
            <div class="section-title">CLIENTE:</div>
            <div class="client-name">${orderData.customer_name || 'GUEST'}</div>
            <div class="client-email">${orderData.customer_email || '---'}</div>
        </div>
        
        <div class="items-section">
            <div class="items-header">
                <div>Descripción</div>
                <div>Cant.</div>
                <div>Total</div>
            </div>
            
            ${orderItems
              .map(
                (item) => `
                <div class="item">
                    <div>${item.product_name.substring(0, 25)}</div>
                    <div>${item.quantity}</div>
                    <div>$${(item.subtotal / 100).toFixed(2)}</div>
                </div>
            `
              )
              .join('')}
        </div>
        
        <div class="total-section">
            <div class="total-row">
                <span>TOTAL:</span>
                <span>$${(orderData.total / 100).toFixed(2)}</span>
            </div>
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
