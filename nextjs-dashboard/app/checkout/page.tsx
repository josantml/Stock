import { auth } from '@/auth';
import CheckoutForm from "../components/checkout/CheckoutForm";

export const metadata = {
    title: 'Checkout',
};

export default async function CheckoutPage() {
    // Obtener sesión (puede ser null para guest checkout)
    const session = await auth();
    const userId = session?.user?.id || null;
    const userName = session?.user?.name || '';
    const userEmail = session?.user?.email || '';

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <CheckoutForm 
                userId={userId} 
                isAuthenticated={!!session?.user}
                defaultName={userName}
                defaultEmail={userEmail}
            />
        </div>
    );
}