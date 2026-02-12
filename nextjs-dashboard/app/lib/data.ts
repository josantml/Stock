import sql from './db';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Product,
  Categories,
  OrderRow,
  OrderDetail,
  OrderItemRow
} from './definitions';
import { formatCurrency } from './utils';
import { ProductWithCategories } from './definitions';


export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


export async function fetchProducts() {
  try {
      const data = await sql<Product[]>`
        SELECT id, nombre, descripcion, precio, imagen, stock, caracteristicas
        FROM products
      `;
      console.log('PRODUCTOS DESDE DB:', data);
      return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch products.');
  }

}  


export async function fetchCategories(): Promise<Categories[]> {
  try {
     const data = await sql<Categories[]>`
      SELECT id, name, slug, description
      FROM categories
      ORDER BY name ASC
     `;
      return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories');
    
  }
}


export async function fetchLatestInvoices() {
  try {

    console.log('Fetching Latst Invoices...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}


export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}


export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}



const ITEMS_LIMIT_PAGE = 4;
export async function fetchFilteredProducts(query : string, currentPage: number){

  console.log('BUSCANDO:', query);

  const offset = (currentPage - 1) * ITEMS_LIMIT_PAGE;
  try {
    const productsFilter = await sql`
      SELECT id, nombre, descripcion, precio, imagen, stock, caracteristicas
      FROM products
      WHERE
        products.nombre ILIKE ${`%${query}%`} OR
        products.descripcion ILIKE ${`%${query}%`} OR
        products.precio::text ILIKE ${`%${query}%`}
      ORDER BY nombre ASC
      LIMIT ${ITEMS_LIMIT_PAGE} OFFSET ${offset};
    `;

    console.log('RESULTADOS:', productsFilter.length);

    return productsFilter
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products')
  }
}



export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.log('fetched invoice:', invoice)
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}



function normalizeCaracteristicas(caracteristicas: any){
  if(Array.isArray(caracteristicas)){
    return caracteristicas;
  }

  if(typeof caracteristicas === 'string'){
    try {
      
      const parsed = JSON.parse(caracteristicas);
      return Object.entries(parsed).map(([key, value]) => ({
        label: key,
        value: String(value),
      }));
    } catch (error) {
      console.error('Error parsing caracteristicas:', error);
      return [];
    }
  }

  if(typeof caracteristicas === 'object' && caracteristicas !== null) {
    return Object.entries(caracteristicas).map(([key, value]) => ({
      label: key,
      value: String(value),
    }));
  }
    return [];
}


export async function fetchProductById(id: string) {
  try {
    const data = await sql`
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen,
        p.stock,
        p.caracteristicas,
        -- CORRECCIÓN: Usamos uuid[] en lugar de text[] para coincidir con el tipo de la columna
        COALESCE(ARRAY_AGG(pc.category_id) FILTER (WHERE pc.category_id IS NOT NULL), ARRAY[]::uuid[]) as category_ids
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      WHERE p.id = ${id}
      GROUP BY p.id
    `;
    const product = data[0];

    if (!product) {
      return null;
    }

    return {
      ...product,
      caracteristicas: normalizeCaracteristicas(product.caracteristicas),
      category_ids: product.category_ids || [],
    };
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch product.');
  }
}



export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}


export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}


export async function fetchProductByCaT(
  id: string
): Promise<ProductWithCategories | null> {
  try {
    const data = await sql<ProductWithCategories[]>`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen,
        p.stock,
        p.caracteristicas,
        COALESCE(
          jsonb_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'name', c.name,
              'slug', c.slug,
              'description', c.description
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::jsonb
        ) AS categories
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.id = ${id}
      GROUP BY p.id;
    `;

    const product = data[0];

    if (!product) {
      return null;
    }

    return {
      ...product,
      caracteristicas: normalizeCaracteristicas(product.caracteristicas),
      categories: product.categories ?? [],
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product with categories.');
  }
}



// Obtener los productos por el slug de la categoria
export async function fetchProductByCategorySlug(slug: string): Promise<Product[]>{
  const products = await sql<Product[]>`
    SELECT DISTINCT p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.imagen,
    p.stock,
    p.caracteristicas
    FROM products p
    JOIN product_categories pc ON p.id = pc.product_id
    JOIN categories c ON c.id = pc.category_id
    WHERE c.slug = ${slug}
    ORDER BY p.nombre ASC;
    `;

    return products.map((product) => ({
      ...product,
      caracteristicas: normalizeCaracteristicas(product.caracteristicas),
    }));
}



//Obtener los pedidos de compra en formato tabla

export async function fetchOrders(customerEmail?: string){
  try {
    let query;
    if(customerEmail){
      //CASO CLIENTE: filtra directamente en SQL
      query = sql<OrderRow[]>`
        SELECT o.id,
          o.status,
          o.total,
          o.created_at,
          o.invoice_id,
          o.customer_name,
          o.customer_email,
          COUNT (oi.id) AS items_count
        FROM orders o 
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.customer_email = ${customerEmail}
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
    }else{
      // CASO ADMIN: se trae todo (como estaba)
      query = await sql<OrderRow[]>`
        SELECT o.id,
          o.status,
          o.total,
          o.created_at,
          o.invoice_id,
          o.customer_name,
          o.customer_email,
          COUNT (oi.id) AS items_count
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
    }
    
    return query;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error: No se pudieron obtener los pedidos');
  }
}



// Obtener detalle de la orden

export async function fetchOrderById(id: string) {
  try {
    const detailOrder = await sql<OrderDetail[]>`
      SELECT
          o.id,
          o.status,
          o.total,
          o.created_at,
          o.customer_name,
          o.customer_email,
          jsonb_build_object(
            'id', i.id,
            'pdf_url', i.pdf_url
          ) AS invoice
        FROM orders o
        LEFT JOIN invoices i ON i.id = o.invoice_id
        WHERE o.id = ${id}
    `;
    return detailOrder[0] ?? null;
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error: NO se pudo obtener el detalle del pedido');
  }
}



// Obtener los productos de la orden

export async function fetchOrderItem(orderId: string){
  try {
    const orderItem = await sql<OrderItemRow[]>`
      SELECT oi.id,
        oi.product_id,
        p.nombre AS product_name,
        p.imagen AS product_image,
        oi.quantity,
        oi.price,
        COALESCE(oi.notes, NULL) AS notes,
        (oi.quantity * oi.price) AS subtotal
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ${orderId}
        ORDER BY p.nombre ASC
    `;
    return orderItem;

  } catch (error) {
    console.error('Database Error:', error);
    // Si falla porque no existe la columna notes, intentar sin ella
    if (error instanceof Error && error.message?.includes('column oi.notes does not exist')) {
      try {
        const fallbackOrderItem = await sql<OrderItemRow[]>`
          SELECT oi.id,
            oi.product_id,
            p.nombre AS product_name,
            p.imagen AS product_image,
            oi.quantity,
            oi.price,
            NULL AS notes,
            (oi.quantity * oi.price) AS subtotal
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ${orderId}
            ORDER BY p.nombre ASC
        `;
        return fallbackOrderItem;
      } catch (fallbackError) {
        throw new Error('Error: No se puedieron obtener los articulos del pedido');
      }
    }
    throw new Error('Error: No se puedieron obtener los articulos del pedido');
  }
}


// unificar las ordenes, items y totales

export async function fetchOrderFull(orderId: string) {
  const [order] = await sql`
    SELECT o.id,
      o.status,
      o.total,
      o.created_at,
      c.name,
      c.email
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    WHERE o.id = ${orderId}
  `;

  if(!order) return null;

  const items = await sql`
    SELECT oi.quantity,
      oi.price,
      p.nombre,
      p.imagen,
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ${orderId}
  `;

  return {...order, items};
}


