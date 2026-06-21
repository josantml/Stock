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

    /* Forzar A4 */
    @page {
        size: A4 portrait;
        margin: 15mm; /* Un poco más de margen para A4 */
    }

    html, body {
        width: 100%;
        margin: 0;
        padding: 0;
    }
    
    body {
        font-family: 'Courier New', monospace;
        line-height: 1.5; /* Un poco más de separación para A4 */
        font-size: 14px; /* Aumentado de 11px para que se lea bien en A4 */
    }
    
    .ticket {
        width: 100%; /* Ocupa todo el ancho disponible */
        padding: 0;
        margin: 0 auto;
    }
    
    .header {
        text-align: center;
        border-bottom: 2px dashed #000;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }
    
    .header-brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px; /* Más separación entre logo y nombre */
        margin-bottom: 10px;
    }

    .logo {
        width: 70px; /* Logo un poco más grande */
        height: 70px;
        object-fit: contain;
        display: block;
    }

    .store-name {
        font-size: 28px; /* Aumentado para A4 */
        font-weight: bold;
    }
    
    .ticket-title {
        font-size: 14px;
        margin-bottom: 5px;
    }
    
    .ticket-id, .ticket-datetime {
        font-size: 12px;
        margin-bottom: 3px;
    }

    .ticket-warning {
        font-size: 11px;
        margin-top: 5px;
        font-style: italic;
    }
    
    .client-section {
        border-bottom: 1px dashed #000;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }
    
    .section-title {
        font-weight: bold;
        font-size: 13px;
        margin-bottom: 5px;
    }
    
    .client-name {
        font-size: 13px;
        margin-bottom: 3px;
    }
    
    .client-email {
        font-size: 12px;
        word-break: break-all;
    }
    
    .items-section {
        border-bottom: 1px dashed #000;
        margin-bottom: 15px;
    }
    
    /* --- EL CAMBIO MÁS IMPORTANTE ESTÁ AQUÍ (EL GRID) --- */
    .items-header, .item {
        display: grid;
        /* En lugar de píxeles fijos, usamos "fr" (fracciones) para que se estire */
        /* 3 partes para nombre, 1.5 para precio, 1 para cantidad, 1.5 para total */
        grid-template-columns: 3fr 1.5fr 1fr 1.5fr; 
        gap: 15px;
        align-items: start;
        padding: 4px 0;
    }

    .items-header {
        font-weight: bold;
        border-bottom: 1px solid #000;
        margin-bottom: 5px;
    }
    
    .item-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    /* Eliminamos los width: 80px fijos y dejamos que el grid controle el ancho */
    .item-price {
        text-align: right;
    }

    .item-qty {
        text-align: center; /* Centrado en A4 se ve mejor para la cantidad */
    }
    
    .item-total {
        text-align: right;
        font-weight: bold;
    }
    
    .total-section {
        display: flex;
        justify-content: flex-end; /* Empuja el total hacia la derecha */
        align-items: center;
        gap: 20px;
        text-align: right;
        padding: 15px 0;
        border-bottom: 2px dashed #000;
        border-top: 2px dashed #000;
        margin-bottom: 20px;
    }
    
    .total-label {
        font-weight: bold;
        font-size: 16px;
    }
    
    .total-amount {
        font-size: 22px; /* Total grande y visible */
        font-weight: bold;
        color: #000;
    }
    
    .footer {
        text-align: center;
        font-size: 12px;
        padding-top: 15px;
    }
    
    .thank-you {
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 14px;
    }
    
    .footer-text {
        font-size: 11px;
    }

    /* === PARA IMPRIMIR === */
    @media print {
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        
        html, body {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .ticket {
            width: 100% !important;
            padding: 0 !important;
        }

        /* Evitar que un producto se corte feo al saltar de página */
        .item {
            page-break-inside: avoid;
            break-inside: avoid;
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
