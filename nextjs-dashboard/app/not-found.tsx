import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Página no encontrada</h1>
        <p className="mb-6 text-gray-600">No pudimos encontrar la página que buscas.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
