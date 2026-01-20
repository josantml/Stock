// app/api/ticket/[orderId]/route.ts
import { generateTicketHTML } from '@/app/lib/invoices/generateTicketPDF/generateTicketPDF';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const html = await generateTicketHTML(params.orderId);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
