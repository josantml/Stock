import React from 'react';

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <section className="flex-grow max-w-6xl mx-auto px-4 py-20 text-center w-full">
         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitio en mantenimiento</h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">Estamos realizando tareas de mantenimiento. Por favor, vuelve más tarde.</p>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Roma Multirubros. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
   
  );
}
