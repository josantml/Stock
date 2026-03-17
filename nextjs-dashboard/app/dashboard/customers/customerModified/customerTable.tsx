'use client';

import { useState } from 'react';
import { updateCustomerInfo } from '@/app/lib/actions';
import { Customer } from '@/app/lib/definitions';
import { PencilIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';


export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ phone: '', address: '' });

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData({
      phone: customer.phone || '',
      address: customer.address || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
    await updateCustomerInfo(id, formData.phone, formData.address);
    setEditingId(null);
    // No necesitamos refetch manual porque updateCustomerInfo usa revalidatePath
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Imagen</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Teléfono</th>
            <th className="px-4 py-2 text-left">Dirección</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t">
                {/*<td className="px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {customer.image_url ? (
                        // Si hay imagen, la mostramos
                            <Image
                                src={customer.image_url}
                                alt={customer.name}
                                width={6}
                                height={6}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                        // Si NO hay imagen, mostramos el icono
                        <UserIcon className="w-5 h-5 text-gray-900" />
                        )}
                    </div>
                </td>*/}
                <td className="px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                    </div>
                </td>
              <td className="px-4 py-2">{customer.name}</td>
              <td className="px-4 py-2">{customer.email}</td>
              
              {/* Celdas de Teléfono y Dirección condicionales */}
              <td className="px-4 py-2">
                {editingId === customer.id ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border p-1 rounded w-full"
                    placeholder="Sin teléfono"
                  />
                ) : (
                  customer.phone || '-'
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === customer.id ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border p-1 rounded w-full"
                    placeholder="Sin dirección"
                  />
                ) : (
                  customer.address || '-'
                )}
              </td>

              {/* Botones de Acción */}
              <td className="px-4 py-2">
                {editingId === customer.id ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave(customer.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleEdit(customer)}
                    className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200 border"
                  >
                    <PencilIcon className="w-4 h-6" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}