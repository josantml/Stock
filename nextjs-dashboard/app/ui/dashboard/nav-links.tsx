'use client';

import Link from 'next/link';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingCartIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useUser } from '@/app/lib/hooks/useUser';

type NavLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className: string }>;
  adminOnly?: boolean;
  clientOnly?: boolean;
};

const links: NavLink[] = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  
  // Admin Only
  {
    name: 'Productos',
    href: '/dashboard/products',
    icon: ShoppingCartIcon,
    adminOnly: true,
  },
  {
    name: 'Órdenes de Clientes',
    href: '/dashboard/admin/orders',
    icon: DocumentDuplicateIcon,
    adminOnly: true,
  },
  {
    name: 'Facturas',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
    adminOnly: true,
  },
  {
    name: 'Clientes',
    href: '/dashboard/customers',
    icon: UserGroupIcon,
    adminOnly: true,
  },

  // Client Only
  {
    name: 'Mis Órdenes',
    href: '/dashboard/orders',
    icon: ShoppingCartIcon,
    clientOnly: true,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  if (loading) return <div className="text-sm text-gray-500">Cargando...</div>;

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  return (
    <>
      {links.map((link) => {
        // Ocultar si es solo admin y el usuario no es admin
        if (link.adminOnly && !isAdmin) return null;
        
        // Ocultar si es solo cliente y el usuario no es cliente
        if (link.clientOnly && !isClient) return null;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            {link.icon && <link.icon className="w-6" />}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
