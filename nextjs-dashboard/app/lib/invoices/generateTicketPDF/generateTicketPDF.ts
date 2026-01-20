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
            size: 80mm auto;
            margin: 0;
        }

        html, body {
            width: 80mm;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            font-size: 10px;
            line-height: 1.4;
        }
        
        .ticket {
            width: 100%;
            padding: 8px;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 8px;
            margin-bottom: 8px;
        }
        
        .store-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
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
            margin-bottom: 8px;
        }
        
        .client-section {
            border-bottom: 1px dashed #000;
            padding-bottom: 8px;
            margin-bottom: 8px;
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
            margin-bottom: 8px;
        }
        
        .items-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 9px;
            padding-bottom: 4px;
            border-bottom: 1px solid #000;
            margin-bottom: 4px;
        }
        
        .item {
            display: flex;
            justify-content: space-between;
            font-size: 8px;
            padding: 2px 0;
            border-bottom: 1px dotted #ccc;
        }
        
        .item-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .item-qty {
            width: 30px;
            text-align: right;
            margin: 0 4px;
        }
        
        .item-total {
            width: 40px;
            text-align: right;
        }
        
        .total-section {
            text-align: right;
            padding: 8px 0;
            border-bottom: 2px dashed #000;
            border-top: 2px dashed #000;
            margin-bottom: 8px;
        }
        
        .total-label {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 4px;
        }
        
        .total-amount {
            font-size: 16px;
            font-weight: bold;
            color: #000;
        }
        
        .footer {
            text-align: center;
            font-size: 9px;
            padding-top: 8px;
        }
        
        .thank-you {
            margin-bottom: 4px;
            font-weight: bold;
        }
        
        .footer-text {
            font-size: 8px;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .ticket {
                padding: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="ticket" id="ticket">
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
                <div style="flex: 1;">Descripción</div>
                <div class="item-qty">Cant.</div>
                <div class="item-total">Total</div>
            </div>
            
            ${orderItems
              .map(
                (item) => `
                <div class="item">
                    <div class="item-name">${item.product_name.substring(0, 20)}</div>
                    <div class="item-qty">${item.quantity}</div>
                    <div class="item-total">$${(item.subtotal / 100).toFixed(2)}</div>
                </div>
            `
              )
              .join('')}
        </div>
        
        <div class="total-section">
            <div class="total-label">TOTAL:</div>
            <div class="total-amount">$${(orderData.total / 100).toFixed(2)}</div>
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
