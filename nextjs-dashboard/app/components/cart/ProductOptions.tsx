"use client";

import { useState, useEffect, useRef } from 'react';

type Props = {
  product?: any;
  value?: Record<string, string>;
  onChange?: (opts: Record<string, string>) => void;
};

export default function ProductOptions({ product, value = {}, onChange }: Props) {
  const [options, setOptions] = useState<Array<{ key: string; val: string }>>([]);

  const syncingFromProp = useRef(false);

  useEffect(() => {
    // Inicializar desde value sin disparar onChange
    syncingFromProp.current = true;
    const entries = Object.entries(value).map(([k, v]) => ({ key: k, val: v }));
    setOptions(entries);
  }, [value]);

  // Notificar cambios al padre pero solo cuando provienen de la interacción del usuario
  useEffect(() => {
    if (syncingFromProp.current) {
      syncingFromProp.current = false;
      return;
    }
    onChange && onChange(Object.fromEntries(options.map(o => [o.key, o.val])));
  }, [options, onChange]);

  const updateKey = (idx: number, key: string) => {
    setOptions(prev => prev.map((p, i) => i === idx ? { ...p, key } : p));
  };

  const updateVal = (idx: number, val: string) => {
    setOptions(prev => prev.map((p, i) => i === idx ? { ...p, val } : p));
  };

  const add = () => setOptions(prev => [...prev, { key: '', val: '' }]);

  const remove = (idx: number) => setOptions(prev => prev.filter((_, i) => i !== idx));

  if (!product || !product.opciones) {
    // Mostrar UI para añadir/editar opciones libres (si el producto no define variantes)
    return (
      <div className="space-y-2">
        {options.length === 0 && (
          <div className="text-sm text-gray-600">No hay opciones. Añade una para empezar.</div>
        )}
        {options.map((o, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={o.key} onChange={(e) => updateKey(i, e.target.value)} placeholder="Nombre" className="border rounded px-2 py-1" />
            <input value={o.val} onChange={(e) => updateVal(i, e.target.value)} placeholder="Valor" className="border rounded px-2 py-1" />
            <button onClick={() => remove(i)} className="text-red-600">Eliminar</button>
          </div>
        ))}
        <button onClick={add} className="text-sm text-blue-600">+ Añadir opción</button>
      </div>
    );
  }

  // Si el producto define opciones (por ejemplo variantes), podemos renderizarlas como selects
  if (product && product.opciones) {
    return (
      <div className="space-y-2">
        {product.opciones.map((opt: any, idx: number) => (
          <div key={idx} className="flex flex-col">
            <label className="text-sm font-medium">{opt.name}</label>
            <select value={value[opt.name] || ''} onChange={(e) => onChange && onChange({ ...value, [opt.name]: e.target.value })} className="border rounded px-2 py-1">
              <option value="">Seleccionar</option>
              {opt.values.map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
