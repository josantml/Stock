import Link from "next/link";
import RegisterForm from "../ui/authForm/registerForm";

export default function RegisterPage() {
    return(
        <div>
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
                    </nav>
                </div>
            </header>
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div>
                        <h2 className="text-2xl font-bold text-center text-gray-700">Crear Cuenta</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Registrate para realizar tu compra
                        </p>
                    </div>

                    <RegisterForm/>

                    <p className="text-center text-sm text-gray-600">
                        ¿Ya tenés cuenta?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Iniciar sesion aqui.
                        </Link>
                    </p>

                </div>

            </div>
        </div>
        
    )
}