// app/api/ticket/[orderId]/route.ts
import { generateTicketHTML } from '@/app/lib/invoices/generateTicketPDF/generateTicketPDF';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {

  const { orderId} = await params;
  const html = await generateTicketHTML(orderId);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
