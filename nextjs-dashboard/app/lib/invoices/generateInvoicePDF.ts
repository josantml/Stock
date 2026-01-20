import puppeteer from 'puppeteer';

export async function generateInvoicePDF(html: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, {waitUntil: 'networkidle0'});

    const pdf = await page.pdf({format: 'A4'});


    await browser.close();

    return pdf;

}