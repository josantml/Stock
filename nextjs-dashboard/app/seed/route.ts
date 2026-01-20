import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users, products } from '../lib/placeholder-data';
import { z } from 'zod';

//const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });


async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `;


  /* si quiero que postgreSQL genere id automaticamente deberia quitar el campo id dentro del INSERT INTO users
  pero como inserto un id manualmente para probar debo dejarlo*/
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, role)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}


async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}


async function seedProducts() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      precio INT NOT NULL,
      imagen VARCHAR(255) NOT NULL,
      stock INT NOT NULL,
      caracteristicas JSONB
    );
  `;

  const insertedProducts = await Promise.all(
    products.map(
      (product) => sql`
              INSERT INTO products (id, nombre, descripcion, precio, imagen, stock, caracteristicas)
        VALUES (
          ${product.id},
          ${product.nombre},
          ${product.descripcion},
          ${product.precio},
          ${product.imagen || ''},
          ${product.stock},
          ${sql.json(product.caracteristicas || [])}
        )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedProducts;
}



async function seedCategories(){
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS categories(
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT
    );
  `;
}



async function seedProductCategories() {
  await sql`
    CREATE TABLE IF NOT EXISTS product_categories(
      product_id UUID NOT NULL,
      category_id UUID NOT NULL,
      PRIMARY KEY (product_id, category_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `;
}



async function seedOrder() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS orders(
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id),
      status TEXT NOT NULL,
      total INT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `;
}



async function seedOrderItem() {
  await sql`
    CREATE TABLE IF NOT EXISTS order_items(
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id),
      quantity INT NOT NULL,
      price INT NOT NULL
    );
  `;
}



export async function GET() {
  try {
    //const result = await sql.begin((sql) => [
      await seedUsers();
      await seedCustomers();
      await seedInvoices();
      await seedRevenue();
      await seedProducts();
      await seedCategories();
      await seedProductCategories();
      await seedOrder();
      await seedOrderItem();
    //]);

    
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}





