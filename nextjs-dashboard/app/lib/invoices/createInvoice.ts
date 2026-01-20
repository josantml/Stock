import { generateInvoicePDF } from "./generateInvoicePDF";
import { renderInvoiceHTML } from "./renderInvoiceHTML";
import { storeInvoicePDF } from "./storeInvoicePDF";

export async function createInvoice(data: any) {
    const html = renderInvoiceHTML(data);
    const pdf = await generateInvoicePDF(html);

    // puppeteer returns a Buffer or Uint8Array — normalize to Buffer
    const pdfBuffer: Buffer = Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf as Uint8Array);

    const pdfUrl = await storeInvoicePDF(data.invoiceId, pdfBuffer);

    return pdfUrl;
}