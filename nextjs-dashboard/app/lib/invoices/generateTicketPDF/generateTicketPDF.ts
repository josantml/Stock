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

        /* ============================================
           CONFIGURACIÓN DE PÁGINA A4
           A4 = 210mm x 297mm
           ============================================ */
        @page {
            size: A4 portrait;
            margin: 10mm;
        }

        html {
            width: 210mm; /* ✅ ANCHO FIJO A4 */
            min-height: 297mm;
        }
        
        /* LETRA AGRANDADA: Base subida a 16px */
        body {
            /* ✅ FORZAR OCUPAR ANCHO COMPLETO */
            width: 190mm; /* 210mm - 10mm margen izq - 10mm margen der */
            min-width: 190mm;
            max-width: 190mm;
            margin: 0;
            padding: 0;
            
            /* ✅ DESACTIVAR SHRINK-TO-FIT */
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            
            /* Fuente más profesional que aprovecha el espacio */
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.5;
            font-size: 16px;
            color: #000;
        }
        
        .ticket {
            width: 100%;
            min-width: 190mm; /* ✅ FORZAR ANCHO MÍNIMO */
            padding: 0;
            margin: 0;
        }
        
        /* ============================================
           HEADER
           ============================================ */

        .header {
            border-bottom: 2px dashed #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .header-brand {
            display: flex;
            align-items: center;
            justify-content: flex-start; /* ✅ CAMBIO: alineado a la izquierda */
            gap: 25px;
            margin-bottom: 15px;
        }

        .logo {
            width: 130px; /* ✅ CAMBIO: logo más grande (era 80px) */
            height: 130px;
            object-fit: contain;
            display: block;
            flex-shrink: 0; /* ✅ Evitar que el logo se encoja */
        }

        .store-name {
            font-size: 36px;
            font-weight: bold;
            text-align: left; /* ✅ NUEVO: texto del nombre alineado a la izquierda */
            line-height: 1.2;
        }

        .header-info {
            text-align: left; /* ✅ Info del header a la izquierda */
            padding-left: 145px; /* Alineado con el texto del nombre */
        }
        
        .ticket-title {
            font-size: 20px; /* Agrandado */
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .ticket-id, .ticket-datetime {
            font-size: 15px;
            margin-bottom: 4px;
        }

        .ticket-warning {
            font-size: 14px;
            margin-top: 8px;
            font-style: italic;
            color: #333;
        }

         /* ============================================
           SECCIÓN CLIENTE
           ============================================ */
        
        .client-section {
            border-bottom: 1px dashed #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 8px;
        }
        
        .client-name {
            font-size: 16px; /* Agrandado */
            margin-bottom: 4px;
        }
        
        .client-email {
            font-size: 15px; /* Agrandado */
            word-break: break-all;
        }

         /* ============================================
           TABLA DE ITEMS - OCUPA ANCHO COMPLETO
           ============================================ */
        
        .items-section {
            border-bottom: 1px dashed #000;
            margin-bottom: 20px;
        }
        
        /* El grid se sigue adaptando automáticamente al nuevo ancho */
        .items-header, .item {
            display: grid;
            /* ✅ COLUMNAS QUE OCUPAN TODO EL ANCHO */
            grid-template-columns: 1fr 120px 80px 140px; 
            gap: 10px;
            align-items: center;
            padding: 8px 0;
            width: 100%;
        }

        .items-header {
            font-weight: bold;
            border-bottom: 2px solid #000;
            margin-bottom: 5px;
            font-size: 16px;
            padding-bottom: 10px;
        }

        .item {
            border-bottom: 1px dotted #ccc;
        }
        
        .item-name {
            font-size: 16px;
            /* ✅ PERMITIR QUE EL TEXTO SE EXPANDA */
            white-space: normal;
            word-wrap: break-word;
        }
        
        .item-price {
            text-align: right;
            font-size: 16px; /* Agrandado */
        }

        .item-qty {
            text-align: center;
            font-size: 16px; /* Agrandado */
        }
        
        .item-total {
            text-align: right;
            font-weight: bold;
            font-size: 16px; /* Agrandado */
        }


        /* ============================================
           TOTAL
           ============================================ */
        
        .total-section {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 25px;
            text-align: right;
            padding: 20px 0;
            border-bottom: 2px dashed #000;
            border-top: 2px dashed #000;
            margin-bottom: 25px;
        }
        
        .total-label {
            font-weight: bold;
            font-size: 22px;
        }
        
        .total-amount {
            font-size: 32px;
            font-weight: bold;
            color: #000;
        }

         /* ============================================
           FOOTER
           ============================================ */
        
        .footer {
            text-align: center;
            font-size: 15px;
            padding-top: 20px;
        }
        
        .thank-you {
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 20px;
        }
        
        .footer-text {
            font-size: 14px;
            color: #555;
        }

        /* ============================================
           ESTILOS ESPECÍFICOS PARA IMPRESIÓN
           ============================================ */

        @media print {
            /* MÁRGENES REDUCIDOS también en la vista de impresión */
            @page {
                size: A4 portrait;
                margin: 10mm;
            }
            
            html {
                width: 210mm !important;
            }


            body {
                width: 190mm !important;
                min-width: 190mm !important;
                max-width: 190mm !important;
                margin: 0 !important;
                padding: 0 !important;
                /* ✅ BLOQUEAR CUALQUIER ESCALA DEL NAVEGADOR */
                transform: none !important;
                -webkit-transform: none !important;
                zoom: 1 !important;
            }
            
            .ticket {
                width: 100% !important;
                min-width: 190mm !important;
            }

            .item {
                page-break-inside: avoid;
                break-inside: avoid;
            }

            /* ✅ EVITAR QUE EL NAVEGADOR AJUSTE EL CONTENIDO */
            @page {
                size: A4 portrait;
                margin: 10mm;
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
                    alt="ROMA Multirubro"
                    class="logo"
                />
                <div class="store-name">${storeName}</div>
            </div>

            <div class="header-info">
                <div class="ticket-title">PRESUPUESTO</div>
                <div class="ticket-id">ID Orden: ${orderId.slice(0, 8)}</div>
                <div class="ticket-datetime">${fecha} ${hora}</div>
                <div class="ticket-warning">"Presupuesto no valido como factura"</div>
            </div>

        </div>
        
        <div class="client-section">
            <div class="section-title">CLIENTE:</div>
            <div class="client-name">${orderData.customer_name || 'GUEST'}</div>
            <div class="client-email">${orderData.customer_email || '---'}</div>
        </div>
        
        <div class="items-section">
            <div class="items-header">
                <div class="item-name">Descripción</div>
                <div class="item-price">Precio U.</div>
                <div class="item-qty">Cant.</div>
                <div class="item-total">Total</div>
            </div>
            
            ${orderItems
              .map(
                (item) => `
                <div class="item">
                    <div class="item-name">${item.product_name}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-qty">${item.quantity}</div>
                    <div class="item-total">$${item.subtotal.toFixed(2)}</div>
                </div>
            `
              )
              .join('')}
        </div>
        
        <div class="total-section">
            <div class="total-label">TOTAL:</div>
            <div class="total-amount">$${orderData.total.toFixed(2)}</div>
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
