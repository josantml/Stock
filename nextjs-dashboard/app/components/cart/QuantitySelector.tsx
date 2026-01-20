"use client";

import { useCallback } from 'react';

type Props = {
  value: number;
  onChange: (q: number) => void;
  max?: number;
};

export default function QuantitySelector({ value, onChange, max = 999 }: Props) {
  const dec = useCallback(() => onChange(Math.max(1, value - 1)), [value, onChange]);
  const inc = useCallback(() => onChange(Math.min(max, value + 1)), [value, onChange, max]);

  return (
    <div className="inline-flex items-center border rounded-md overflow-hidden">
      <button aria-label="disminuir" onClick={dec} className="px-3 py-1 bg-gray-100">-</button>
      <input
        type="number"
        value={value}
        min={1}
        max={max}
        onChange={(e) => onChange(Math.max(1, Math.min(max, Number(e.target.value) || 1)))}
        className="w-16 text-center px-2 py-1"
      />
      <button aria-label="aumentar" onClick={inc} className="px-3 py-1 bg-gray-100">+</button>
    </div>
  );
}
