'use client';

interface Props {
  orderId: string;
}

export default function TicketActions({ orderId }: Props) {
  const handlePrintTicket = async () => {
    try {
      // Abre el HTML del ticket en nueva ventana para impresión térmica
      const res = await fetch(`/api/orders/${orderId}/ticket`);
      const html = await res.text();

      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (!printWindow) return;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      printWindow.focus();
      // Espera a que cargue el DOM antes de imprimir
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (error) {
      console.error('Error al imprimir ticket:', error);
      alert('Error al cargar el ticket');
    }
  };

  const handleViewTicket = async () => {
    try {
      // Abre el ticket en una pestaña nueva (usuario puede guardar como PDF)
      window.open(`/api/orders/${orderId}/ticket`, '_blank');
    } catch (error) {
      console.error('Error al abrir ticket:', error);
      alert('Error al abrir el ticket');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={handlePrintTicket}>
        🖨️ Imprimir ticket
      </button>

      <button onClick={handleViewTicket}>
        📄 Ver ticket
      </button>
    </div>
  );
}
