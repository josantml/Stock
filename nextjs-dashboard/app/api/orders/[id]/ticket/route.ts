import { NextRequest, NextResponse } from 'next/server';
import { generateTicketHTML } from '@/app/lib/invoices/generateTicketPDF/generateTicketPDF';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // Verificar que hay sesión
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Generar HTML del ticket
    const ticketHTML = await generateTicketHTML(id, 'ROMA Multirubros');

    // Retornar como HTML que puede imprimirse como PDF
    return new NextResponse(ticketHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating ticket:', error);
    return NextResponse.json(
      { error: 'Error al generar el ticket' },
      { status: 500 }
    );
  }
}
