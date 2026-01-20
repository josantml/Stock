import sql from '../db';
import Stripe from 'stripe';

/*
  Toggle para desactivar Stripe sin eliminar el código.

  Para reactivar Stripe:
  1. Cambiar `ENABLE_STRIPE` a `true`.
  2. Asegurarse de configurar la variable de entorno `STRIPE_SECRET_KEY` con la
      clave secreta de Stripe en el entorno donde se despliega la app.
  3. Verificar que `NEXT_PUBLIC_URL` apunta a la URL pública de la aplicación
      (se usa para `success_url` / `cancel_url`).
  4. Revisar webhooks (si los usas): configurar `STRIPE_WEBHOOK_SECRET` y
      revisar la ruta de webhook si corresponde.

  Nota: Dejamos el código intacto para facilitar volver a activar Stripe sin
  tener que rehacer la implementación.
*/
const ENABLE_STRIPE = false;

export function getStripe(): Stripe {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
    return new Stripe(key, { apiVersion: '2025-12-15.clover' });
}

// Create a singleton-like instance for webhook verification
let stripeInstance: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
    get() {
        if (!stripeInstance) {
            stripeInstance = getStripe();
        }
        return stripeInstance;
    }
}) as unknown as Stripe;

export async function createStripeCheckout(orderId: string): Promise<string | null> {
    if (!ENABLE_STRIPE) {
        // Stripe está deshabilitado por configuración. Retornar null para indicar no disponible.
        return null;
    }
    const [order] = await sql`
        SELECT id, total
        FROM orders
        WHERE id = ${orderId}
    `;


    if(!order) throw new Error ('Orden no encontrada');


    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data:{
                    currency: 'usd',
                    unit_amount: order.total,
                    product_data: {
                        name: `Orden ${order.id}`,
                    },
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
        metadata: {
            orderId: order.id,
        },
    });

        return session.url;

}