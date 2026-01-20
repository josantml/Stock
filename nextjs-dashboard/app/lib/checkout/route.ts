import { createStripeCheckout } from "../payments/stripe";
import { NextResponse } from "next/server";


export async function POST(req: Request){
    const {orderId} = await req.json();
    const url = await createStripeCheckout(orderId);

    if(!url){
        return NextResponse.json({ url: null, message: 'Stripe deshabilitado en este despliegue' });
    }

    return NextResponse.json({url});
}