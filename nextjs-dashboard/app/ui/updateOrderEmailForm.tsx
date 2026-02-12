'use client'

import {useState} from 'react';
import { updateOrderEmail } from '../lib/actions';


export default function UpdateOrderEmailForm({orderId, initialEmail}: {orderId: string; initialEmail?: string | null;}) {
    const [email, setEmail] = useState(initialEmail ?? '');
    const [message, setMessage] = useState<string | null>(null);

    async function action(formData: FormData) {
        const result = await updateOrderEmail({}, formData);

        if (result?.message){
            setMessage(result.message);
        }
    }

    return(
        <form action={action} className="space-y-4">
            <input type='hidden' name='orderId' defaultValue={orderId}/>

            <input
                type='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='email@cliente.com'
                className='w-full border rounded px-3 py-2'
                required
            />

            <button type='submit' className='px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700'>
                Guardar Email
            </button>

            {message && (<p className='text-sm text-gray-600'>{message}</p>)}

        </form>
    )
}