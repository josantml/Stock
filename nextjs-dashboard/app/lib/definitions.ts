// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type Product = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;

  caracteristicas?: {label: string, value: string}[];
}


export type Categories = {
  id: string;
  name: string;
  slug: string;
  description: string;
}


export type ProductCategory = {
  productId: string;
  categoryId: string;
}


// Producto con categorias (ideal para UI)
export type ProductWithCategories = Product & {
  categories: Categories[];
}


//Producto para formulario (creacion/edicion)
export type ProductForm = {
  categoryIds: string[];
}


export type OrderStatus = 'pending'|'paid'|'cancelled'|'shipped';

export type Order = {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total: number;
  created_at: string
};



export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
};


export type CreateOrderItem = {
  productId: string;
  quantity: number;
};


// Orden para listado (en tabla admin) muestra estado de cada cliente
export type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items_count: number;
  invoice_id: string | null;
};



// Orden completa (detalle de compra)
export type OrderDetail = {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  invoice_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer:{
    id: string;
    name: string;
    email: string;
  };
   invoice?: {
    id: string;
    pdf_url: string | null;
  } | null;
};


//Items de la orden
export type OrderItemRow = {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  subtotal: number;
};


// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};


export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};



