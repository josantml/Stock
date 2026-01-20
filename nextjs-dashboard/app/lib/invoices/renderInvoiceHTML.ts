export function renderInvoiceHTML(data: {
    invoiceId: string;
    customerName: string;
    items: any[];
    total: number;
})
{
    return`
        <html>
            <body>
                <h1>Factura ${data.invoiceId}</h1>
                <p>Cliente: ${data.customerName}</p>
                <ul>
                    ${data.items.map(
                        i => `<li>${i.name} x ${i.qty}</li>`
                    ).join('')}
                </ul>
                <h3>Total: ${data.total / 100}</h3>
            </body>
        </html>
    `;
}