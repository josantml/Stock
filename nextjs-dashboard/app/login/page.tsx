import LoginForm from "../ui/login-form";
import { Suspense } from "react";
import Image from "next/image";



export default function LoginPage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">

        {/* Rectángulo azul */}
        <div className="relative flex h-24 w-full items-end rounded-lg bg-blue-500 p-3">

          {/* Contenedor circular */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
              <Image
                src="/Logo_Roma.png"
                alt="Logo"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          </div>

        </div>

        <div className="pt-16">
          <Suspense fallback={<div className="text-center text-gray-500">Cargando...</div>}>
            <LoginForm />
          </Suspense>
        </div>

      </div>
    </main>
  );
}