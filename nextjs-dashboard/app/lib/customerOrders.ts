import sql from './db';

export interface CustomerOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  invoice_id: string | null;
  items_count: number;
}

export interface CustomerOrderDetail {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
  invoice?: {
    id: string;
    pdf_url: string | null;
  } | null;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * Obtiene todas las órdenes de un cliente
 */
export async function fetchCustomerOrders(customerId: string): Promise<CustomerOrder[]> {
  try {
    const orders = await sql<CustomerOrder[]>`
      SELECT 
        o.id,
        o.status,
        o.total,
        o.created_at,
        o.invoice_id,
        COUNT(oi.id) AS items_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.customer_id = ${customerId}
      GROUP BY o.id, o.status, o.total, o.created_at, o.invoice_id
      ORDER BY o.created_at DESC
    `;
    return orders;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer orders');
  }
}

/**
 * Obtiene el detalle completo de una orden del cliente
 */
export async function fetchCustomerOrderDetail(
  orderId: string,
  customerId: string
): Promise<CustomerOrderDetail | null> {
  try {
    // Verify order belongs to customer
    const orderCheck = await sql`
      SELECT id FROM orders 
      WHERE id = ${orderId} AND customer_id = ${customerId}
    `;

    if (!orderCheck || orderCheck.length === 0) {
      return null;
    }

    // Get order details
    const orders = await sql<CustomerOrderDetail[]>`
      SELECT 
        o.id,
        o.status,
        o.total,
        o.created_at,
        jsonb_build_object(
          'id', i.id,
          'pdf_url', i.pdf_url
        ) AS invoice
      FROM orders o
      LEFT JOIN invoices i ON i.id = o.invoice_id
      WHERE o.id = ${orderId}
    `;

    if (!orders || orders.length === 0) {
      return null;
    }

    const order = orders[0];

    // Get order items
    const items = await sql<OrderItem[]>`
      SELECT 
        oi.id,
        p.nombre AS product_name,
        p.imagen AS product_image,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) AS subtotal
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
      ORDER BY p.nombre ASC
    `;

    return {
      ...order,
      items,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order detail');
  }
}

/**
 * Obtiene estadísticas de órdenes del cliente
 */
export async function fetchCustomerOrderStats(customerId: string) {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) AS total_orders,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paid_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) AS shipped_orders,
        SUM(total) AS total_spent
      FROM orders
      WHERE customer_id = ${customerId}
    `;
    
    if (!stats || stats.length === 0) {
      return {
        total_orders: 0,
        paid_orders: 0,
        pending_orders: 0,
        shipped_orders: 0,
        total_spent: 0,
      };
    }

    return stats[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order stats');
  }
}
