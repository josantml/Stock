'use client';

import { useState } from 'react';

interface DeleteItemButtonProps {
  orderId: string;
  itemId: string;
}

export default function DeleteItemButton({ orderId, itemId }: DeleteItemButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este item? El stock se devolverá al producto.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar');
      }

      // Recargar la página para actualizar
      window.location.reload();
    } catch (error) {
      alert('Error al eliminar el item');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? '⏳' : '🗑️'} Eliminar
    </button>
  );
}
