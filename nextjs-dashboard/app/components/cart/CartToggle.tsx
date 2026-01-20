"use client";

export default function CartToggle({onClick}:{onClick:()=>void}){
    return (
        <button onClick={onClick} aria-label="Abrir carrito" className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M16 11V9a4 4 0 10-8 0v2H5a1 1 0 000 2h1v2a3 3 0 006 0v-2h1a1 1 0 000-2h-1z" />
            </svg>
        </button>
    )
}
