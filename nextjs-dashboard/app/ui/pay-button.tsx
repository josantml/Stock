'use client';


export function PayButton({orderId}: {orderId: string}){
    const handlePay = async () => {
        const res = await fetch('/lib/checkout', {
            method: 'POST',
            body: JSON.stringify({orderId}),
        });

        const {url} = await res.json();
        window.location.href = url;
    };


    return (
        <button onClick={handlePay}>
            Pagar ahora
        </button>
    )
}