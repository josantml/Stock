import { auth } from '@/auth';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default async function Page() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';
  const isClient = session?.user?.role === 'client';

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            ROMA Multirubros
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/shop" className="text-gray-600 hover:text-gray-800 font-medium">
              Tienda
            </Link>
            {!session ? (
              <>
                <Link 
                  href="/register"
                  className='text-gray-600 hover:text-blue-600 font-medium'
                >
                  Registrarse
                </Link>
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Ingresar
                </Link>
              </>
            ) : (
              <>
                <Link href="/cart" className="text-gray-600 hover:text-gray-800 font-medium">
                  🛒 Carrito
                </Link>
                <Link
                  href={isAdmin ? '/dashboard' : '/dashboard'}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isAdmin ? 'Admin' : 'Mi Cuenta'}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/ROMA Mult. original.jpeg"
            alt="Roma Multirubros"
            width={300}
            height={300}
            priority
            className="rounded-full"
          />
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          ROMA Multirubros
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Tu tienda online de productos de calidad. Explora nuestro catálogo, agrega productos a tu carrito y realiza tu compra de forma segura.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/shop"
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ver Tienda <ArrowRightIcon className="w-5" />
          </Link>

          {!session && (
            <div className='flex gap-4'>
              <Link 
                href="/register"
                className='flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition'
              >
                Crear Cuenta
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Ingresar Cuenta
              </Link>
            </div>
            
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Amplio Catálogo
              </h3>
              <p className="text-gray-600">
                Encuentra una gran variedad de productos de alta calidad en nuestras categorías.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Compra Segura
              </h3>
              <p className="text-gray-600">
                Tu información personal está protegida bajo estrictos estándares de seguridad.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Entrega Rápida
              </h3>
              <p className="text-gray-600">
                Procesa tus órdenes rápidamente y estará listo para entregar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-blue-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Explora nuestros productos y agrega lo que necesites a tu carrito.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Ir a la Tienda <ArrowRightIcon className="w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Roma Multirubros. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
