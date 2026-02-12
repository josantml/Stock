'use client';

import { useActionState } from "react";
import { sendOrderEmail } from "@/app/lib/actions";

export function TicketSenderButton({orderId}: {orderId: string}) {
    const [state, formAction] = useActionState(sendOrderEmail, {message: ''});

    return(
        <div>
            <form action={formAction} className="inline">
                <input type="hidden"  name="orderId" value={orderId}/>

                <button disabled={state?.message === 'Enviando...'} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Enviar ticket por mail
                </button>
            </form>


            {/* Mensaje de estado */}
            {state?.message && (
                <p className={`text-xs mt-2 ${state.message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {state.message}
                </p>
            )}
        </div>
    );

}