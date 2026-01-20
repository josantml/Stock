import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });

export async function getProducts() {
  const products = await sql`
    SELECT id, nombre, descripcion, precio, imagen, stock
    FROM products;
  `;
  return products;
}

export async function GET() {
  try {
    const products = await getProducts();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}