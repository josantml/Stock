/*'use client'

import { useActionState } from "react";
import { Button } from "../button";
import {  } from "@/app/lib/actions";



type OrderUpdateState = {
    message: string | null;
};


export default function OrderStatusForm({orderId, currentStatus,} : {orderId: string; currentStatus: string}) {

    const updateWithId = updateOrderStatus.bind(null, orderId);
    const [state, formAction] = useActionState<OrderUpdateState, FormData>(updateWithId, {message: null});

    return(
        <form action={formAction} className="flex items-center gap-4">
            <select name="status" defaultValue={currentStatus} className="rounded-md border px-3 py-2 text-sm">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
            </select>

            <Button type="submit">Update</Button>


            {state?.message && (
                <p className="text-sm text-gray-600">{state.message}</p>
            )}
        </form>
    );
}*/
