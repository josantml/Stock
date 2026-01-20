/*'use client';

import { useTransition } from "react";
import { Button } from "../button";
import { createInvoiceFromOrder } from "@/app/lib/actions";


export default function GenerateInvoiceButton({orderId, disabled} : {orderId: string, disabled: boolean}) {
    const [isPending, startTransition] = useTransition();

    return(
       <Button
            disabled={disabled || isPending}
            onClick={() =>
                startTransition(async () => {
                await createInvoiceFromOrder(orderId);
                })
            }
            >
            Generate Invoice
        </Button>
    );

}*/
