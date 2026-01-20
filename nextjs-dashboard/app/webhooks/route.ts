import postgres from "postgres";
import { getStripe } from "../lib/payments/stripe";
import { createInvoiceFromOrder } from "../lib/actions";

// Use pooling URL for webhook (better for high concurrency)
const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
    ssl: 'require',
    onnotice: () => {} // Suppress notices
});

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const sig = req.headers.get('stripe-signature')!;

        const stripe = getStripe();
        const event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );


        if(event.type === 'checkout.session.completed'){
            const session = event.data.object as any;
            const orderId = session.metadata.orderId;

            console.log('[WEBHOOK] Processing checkout.session.completed for order:', orderId);

            // Update order status to paid
            console.log('[WEBHOOK] Updating order status to paid');
            await sql`
                UPDATE orders
                SET status = 'paid',
                    payment_id = ${session.payment_intent},
                    paid_at = now()
                WHERE id = ${orderId}
            `;

            // Create invoice with PDF generation
            console.log('[WEBHOOK] Creating invoice for order:', orderId);
            await createInvoiceFromOrder(orderId);
            console.log('[WEBHOOK] Invoice created for order:', orderId);

            console.log('[WEBHOOK] Webhook processed successfully for order:', orderId);
        }

        return new Response('OK');
    } catch(e) {
        console.error('[WEBHOOK ERROR]:', e instanceof Error ? e.message : String(e));
        if(e instanceof Error && e.stack) {
            console.error('[WEBHOOK STACK]:', e.stack);
        }
        return new Response(
            JSON.stringify({ 
                error: e instanceof Error ? e.message : 'Unknown error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}