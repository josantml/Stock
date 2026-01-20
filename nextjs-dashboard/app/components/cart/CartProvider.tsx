'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../../lib/cart';

type CartContextType = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, selectedOptions?: Record<string, string>) => void;
    clear: () => void;
    total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) setItems(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const areOptionsEqual = (a?: Record<string, string>, b?: Record<string, string>) => {
        if (!a && !b) return true;
        if (!a || !b) return false;
        return JSON.stringify(a) === JSON.stringify(b);
    };

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find(i => i.productId === item.productId && areOptionsEqual(i.selectedOptions, item.selectedOptions));
            if (existing) {
                return prev.map(i =>
                    i.productId === existing.productId && areOptionsEqual(i.selectedOptions, existing.selectedOptions)
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeItem = (productId: string, selectedOptions?: Record<string, string>) => {
        setItems(prev => prev.filter(i => !(i.productId === productId && areOptionsEqual(i.selectedOptions, selectedOptions))));
    };

    const clear = () => setItems([]);

    const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be inside CartProvider');
    return ctx;
};