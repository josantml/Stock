import PDFDocument from 'pdfkit';
import { supabase } from '../supabaseClient';

interface InvoiceData {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  date: string;
  status: string;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on('error', reject);

      // Colores
      const brandColor = '#3b82f6';
      const textDark = '#1f2937';
      const textGray = '#6b7280';

      // Header
      doc.fontSize(28).font('Helvetica-Bold').fillColor(brandColor).text('FACTURA', 40, 50);

      doc.fontSize(10).fillColor(textGray).font('Helvetica').text('Sistema de Facturación Automático', 40, 85);

      // Invoice info - Right aligned
      const rightX = 500;
      doc.fontSize(10).fillColor(textDark).font('Helvetica-Bold').text('No. Factura:', rightX, 50);
      doc.fontSize(10).fillColor(textGray).font('Helvetica').text(invoiceData.id.substring(0, 8).toUpperCase(), rightX + 90, 50);

      doc.fontSize(10).fillColor(textDark).font('Helvetica-Bold').text('Fecha:', rightX, 70);
      const fecha = new Date(invoiceData.date).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc.fontSize(10).fillColor(textGray).font('Helvetica').text(fecha, rightX + 90, 70);

      // Status badge
      const statusText = invoiceData.status.toUpperCase();
      const statusY = 90;
      doc.rect(rightX, statusY, 100, 20).fillAndStroke(brandColor, brandColor);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('white').text(statusText, rightX, statusY + 3, {
        width: 100,
        align: 'center',
      });

      // Línea divisoria
      doc.moveTo(40, 130).lineTo(560, 130).stroke(brandColor);

      // Customer info
      doc.fontSize(10).fillColor(textDark).font('Helvetica-Bold').text('CLIENTE', 40, 150);
      doc.fontSize(12).font('Helvetica-Bold').fillColor(textDark).text(invoiceData.customer.name, 40, 170);
      doc.fontSize(10).font('Helvetica').fillColor(textGray).text(invoiceData.customer.email, 40, 190);

      // Items table
      const tableTop = 240;
      const col1X = 40;
      const col2X = 450;
      const rowHeight = 25;

      // Table headers
      doc
        .rect(col1X - 10, tableTop - 15, 520, rowHeight)
        .fill('#f3f4f6');

      doc.fontSize(10).font('Helvetica-Bold').fillColor(textDark).text('Descripción', col1X, tableTop - 10);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(textDark).text('Monto', col2X, tableTop - 10, {
        align: 'right',
      });

      // Table row
      let currentY = tableTop + rowHeight + 5;

      doc.fontSize(10).font('Helvetica').fillColor(textDark).text('Compra de productos', col1X, currentY);
      doc.fontSize(10).font('Helvetica').fillColor(textDark).text(`$${(invoiceData.amount / 100).toFixed(2)}`, col2X, currentY, {
        align: 'right',
      });

      currentY += rowHeight + 10;

      // Totals section
      const totalBoxX = col2X - 120;
      const totalBoxWidth = 130;

      doc.fontSize(9).fillColor(textGray).text('Subtotal:', totalBoxX, currentY);
      doc.text(`$${(invoiceData.amount / 100).toFixed(2)}`, totalBoxX + totalBoxWidth - 50, currentY, {
        align: 'right',
      });

      currentY += 20;

      doc.fontSize(9).fillColor(textGray).text('Impuestos:', totalBoxX, currentY);
      doc.text('$0.00', totalBoxX + totalBoxWidth - 50, currentY, {
        align: 'right',
      });

      currentY += 25;

      // Grand total
      doc.rect(totalBoxX - 10, currentY - 15, totalBoxWidth + 20, 25).stroke(brandColor);

      doc.fontSize(12).font('Helvetica-Bold').fillColor(brandColor).text('Total:', totalBoxX, currentY);
      doc.fontSize(12).font('Helvetica-Bold').fillColor(brandColor).text(`$${(invoiceData.amount / 100).toFixed(2)}`, totalBoxX + totalBoxWidth - 50, currentY, {
        align: 'right',
      });

      // Footer
      currentY = 700;
      doc.moveTo(40, currentY).lineTo(560, currentY).stroke(textGray);

      doc.fontSize(8).fillColor(textGray).text('Esta factura fue generada automáticamente por el sistema. No requiere firma.', 40, currentY + 20, {
        width: 520,
        align: 'center',
      });

      doc.fontSize(8).fillColor(textGray).text('Gracias por su compra.', 40, currentY + 35, {
        width: 520,
        align: 'center',
      });

      doc.end();
    } catch (error) {
      reject(new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

export async function uploadInvoicePDFToSupabase(
  invoiceId: string,
  pdfBuffer: Buffer,
  bucketName: string = 'invoices'
): Promise<string> {
  try {
    const fileName = `${invoiceId}.pdf`;
    const filePath = `invoices/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!publicData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return publicData.publicUrl;
  } catch (error) {
    console.error('Error uploading PDF to Supabase:', error);
    throw new Error(
      `Failed to upload PDF: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

