import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { CartProvider } from './components/cart/CartProvider';
import { SessionProvider } from 'next-auth/react';
import CartUI from './components/cart/CartUI';

export const metadata: Metadata = {
  title: {
    template: '%s | Pablo Dashboard',
    default: 'Pablo Dashboard',
  },
  description: 'The Officia Next Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
        <body className={`${inter.className} antialiased`}>
          <SessionProvider>
            <CartProvider>
              {children}
              <CartUI />
            </CartProvider>
          </SessionProvider>
        </body>
    </html>
  );
}
