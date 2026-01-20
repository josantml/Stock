'use client';

import Link from 'next/link';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useUser } from '@/app/lib/hooks/useUser';

type NavLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className: string }>;
  adminOnly?: boolean;
};

const links: NavLink[] = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
    adminOnly: true,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon, adminOnly: true },
  { name: 'Products', href: '/dashboard/products', icon: DocumentDuplicateIcon, adminOnly: true },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  if (loading) return <div className="text-sm text-gray-500">Cargando...</div>;

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {links.map((link) => {
        // Ocultar si es solo admin y el usuario no es admin
        if (link.adminOnly && !isAdmin) return null;

        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx('flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
