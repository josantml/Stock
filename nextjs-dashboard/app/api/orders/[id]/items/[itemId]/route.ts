import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

interface DeleteParams {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: DeleteParams) {
  try {
    const session = await auth();

    // Validar autenticación y permiso de admin
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id: orderId, itemId } = await params;

    // Obtener el item para obtener el precio y cantidad
    const [orderItem] = await sql`
      SELECT quantity, price, product_id
      FROM order_items
      WHERE id = ${itemId} AND order_id = ${orderId}
    `;

    if (!orderItem) {
      return NextResponse.json(
        { message: 'Item no encontrado' },
        { status: 404 }
      );
    }

    // Usar transacción para:
    // 1. Eliminar el item
    // 2. Restar del total de la orden
    // 3. Devolver stock al producto
    const result = await sql.begin(async (sql) => {
      // Eliminar item
      await sql`
        DELETE FROM order_items
        WHERE id = ${itemId} AND order_id = ${orderId}
      `;

      // Calcular el monto a restar del total
      const subtotalToRemove = orderItem.quantity * orderItem.price;

      // Actualizar total de la orden
      await sql`
        UPDATE orders
        SET total = total - ${subtotalToRemove}
        WHERE id = ${orderId}
      `;

      // Devolver stock al producto
      await sql`
        UPDATE products
        SET stock = stock + ${orderItem.quantity}
        WHERE id = ${orderItem.product_id}
      `;

      return { success: true, subtotalRemoved: subtotalToRemove };
    });

    return NextResponse.json({
      message: 'Item eliminado correctamente',
      success: true,
      subtotalRemoved: result.subtotalRemoved,
    });

  } catch (error) {
    console.error('Error deleting order item:', error);
    return NextResponse.json(
      { message: 'Error al eliminar el item' },
      { status: 500 }
    );
  }
}
