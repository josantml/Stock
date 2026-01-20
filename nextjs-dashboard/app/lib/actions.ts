'use server';

import { date, z } from 'zod';
import sql from './db';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { invoices } from './placeholder-data';
import { OrderStatus } from './definitions';
import type { State, ProductState, CategoryState, OrderState } from './types';
import { supabase } from './supabaseClient';
import { generateInvoicePDF, uploadInvoicePDFToSupabase } from './invoices/pdfGenerator';
import { requireAdmin } from './auth-utils';

// Re-export types for use in client components
export type { State, ProductState, CategoryState, OrderState };

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({invalid_type_error: 'Customer is required. Please select a customer'}),
    amount: z.coerce.number().gt(0, {message: 'Please enter a valid amount greater than $0'}),
    status: z.enum(['paid', 'pending'], {invalid_type_error: 'Status is required. Please select  status'}),
    date: z.string(),
})




const CreateInvoice = FormSchema.omit({id: true, date:true});

export async function createInvoice(prevState: State, formData: FormData) {

  
    const validatedFields = CreateInvoice.safeParse({
        customerId : formData.get('customerId'),
        amount : formData.get('amount'),
        status : formData.get('status'),
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation Error: Failed to create invoice. Please check the form for errors.'
        }
    }
    
    // Preparar los datos validados para la insercion en la base de datos
    const {customerId, amount, status} = validatedFields.data;
    // Convertir la cantidad monetaria a centvos a fin de evitar errores de punto flotante
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        console.error('ERROR EN SERVER ACTION:', error);
        return {
            message: 'Database Error: No es posible crear La factura'
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}




export async function createInvoiceFromOrder(orderId: string) {

    try {
        // obtener orden con datos del cliente
        const orders = await sql`
            SELECT o.id, o.customer_id, o.total, o.invoice_id, c.name, c.email
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.id = ${orderId}
        `;

        if(!orders || orders.length === 0) {
            throw new Error('Order not found');
        }

        const order = orders[0];

        if(order.invoice_id){
            throw new Error('Order already invoiced');
        }

        //crear factura en BD
        const amountInCents = order.total * 100;
        const date = new Date().toISOString().split('T')[0];

        const invoices = await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${order.customer_id}, ${amountInCents}, 'paid', ${date})
            RETURNING id
        `;

        if(!invoices || invoices.length === 0) {
            throw new Error('Failed to create invoice');
        }

        const invoice = invoices[0];

        // Generar PDF de la factura
        console.log('Generating PDF for invoice:', invoice.id);
        const pdfBuffer = await generateInvoicePDF({
            id: invoice.id,
            customer: {
                name: order.name,
                email: order.email,
            },
            amount: order.total,
            date: date,
            status: 'paid',
        });

        // Subir PDF a Supabase
        console.log('Uploading PDF to Supabase...');
        const pdfUrl = await uploadInvoicePDFToSupabase(invoice.id, pdfBuffer);

        // Actualizar factura con URL del PDF
        await sql`
            UPDATE invoices
            SET pdf_url = ${pdfUrl}
            WHERE id = ${invoice.id}
        `;

        // vincular la orden con la factura
        await sql`
            UPDATE orders
            SET invoice_id = ${invoice.id},
                status = 'paid'
            WHERE id = ${orderId}
        `;

        console.log('Invoice created with PDF:', invoice.id, pdfUrl);
        
        // Revalidate after completion (best effort)
        try {
            revalidatePath(`/dashboard/orders/${orderId}`);
            revalidatePath('/dashboard/orders');
            revalidatePath('/dashboard/invoices');
        } catch(e) {
            console.warn('Revalidation warning:', e instanceof Error ? e.message : String(e));
        }
        
    } catch (error) {
        console.error('CreateInvoiceFromOrder error:', error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`No se pudo generar la factura: ${message}`);
    }
}




const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData) {

    
     const validatedFields = CreateInvoice.safeParse({
        customerId : formData.get('customerId'),
        amount : formData.get('amount'),
        status : formData.get('status'),
    });

    if(!validatedFields.success){
        return{
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation Error. Failed to update invoice',
        }
    }

    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId},
            amount = ${amountInCents},
            status = ${status}
            WHERE id = ${id}
        `;

    } catch (error) {
        console.error('ERROR EN SERVER ACTION:', error);
        return {
            message: 'Database Error: No es posible actualizar la factura'
        }
    }
    
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}







export async function deleteInvoice(id: string) {
    
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    /*try {
        await sql`
        DELETE FROM invoices
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');

    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: No es posible eliminar La factura'
        }
    }*/
}   







export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type){
                case 'CredentialsSignin':
                    return 'Invalid Credentials';
                default:
                    return 'Something went wrong';
            }
        }
        throw error;
    }
}





//ABM de Productos


const ProductSchema = z.object({
    nombre: z.string().min(1, {message: 'Nombre de producto obligatorio'}),
    descripcion: z.string().min(1, {message: 'Descripcion del producto obligatoria'}),
    precio: z.coerce.number().gt(0, {message: 'EL precio debe ser un valor mayor o igual a 0'}),
    stock: z.coerce.number().int().gte(0, {message: 'El stock debe ser mayor a 0'}),
    caracteristicas: z.record(z.string(), z.string()).refine((obj) => Object.keys(obj).length > 0, {
        message: 'Debe agregar al menos una caracteristica'
    }),
    categoryIds: z.array(z.string()).min(1, {message: 'Debe seleccionar al menos una categoria'}),
})


// En la creacion de producto la imagen es obligatoria
const CreateProductSchema = ProductSchema.extend({
    imagen: z.any()
});


 //Para la edicion de producto la imagen es opcional
const UpdateProductSchema = ProductSchema.extend({
    imagen: z.any().optional()
});



export async function createProduct(prevState: ProductState, formData: FormData) {
    // ✓ Verificar que el usuario sea admin
    try {
        await requireAdmin();
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : 'Forbidden'
        };
    }

    const validateProduct = CreateProductSchema.safeParse({
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: formData.get('precio'),
        stock: formData.get('stock'),
        caracteristicas: JSON.parse(formData.get('caracteristicas') as string),
        categoryIds: formData.getAll('categoryIds'),
        imagen: formData.get('imagen')
    });

    if(!validateProduct.success){
        return {
            errors: validateProduct.error.flatten().fieldErrors,
            message: 'Validation Error: Fallo al crear el producto. Por favor verifique que los campos esten completos.'
        }
    }

    const {nombre, descripcion, precio, stock, caracteristicas, imagen} = validateProduct.data;

    console.log('IMAGEN:', imagen);
    console.log('ES FILE:', imagen instanceof File);


    // Subir la imagen a Supabase storage

    const imagenFile = imagen as File;
    const fileExt = imagenFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const {error: uploadError} = await supabase.storage.from("products").upload(fileName, imagenFile, { contentType: imagenFile.type});

    if(uploadError){
        console.error('Supabase Storage Error:', uploadError);
        return {
            message: 'Error al subir imagen del producto'
        }
    }

    const {data: publicUrlData} = supabase.storage.from("products").getPublicUrl(fileName);

    const productId = crypto.randomUUID();

    try {
        await sql`
        INSERT INTO products (id, nombre, descripcion, precio, stock, imagen, caracteristicas)
        VALUES (${productId}, ${nombre}, ${descripcion}, ${precio}, ${stock}, ${publicUrlData.publicUrl}, ${JSON.stringify(caracteristicas)})
        `;

        // Insertar las categorias asociadas

        for (const categoryId of validateProduct.data.categoryIds) {
            await sql`
            INSERT INTO product_categories (product_id, category_id)
            VALUES (${productId}, ${categoryId})
            `;
        }

    } catch (error) {
        console.error('ERROR EN SERVER ACTION:', error);
        return { message: "Error al guardar en la base" };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');

}





export async function updateProduct( id:string, prevState: ProductState, formData: FormData ) {
        // ✓ Verificar que el usuario sea admin
        try {
            await requireAdmin();
        } catch (error) {
            return {
                message: error instanceof Error ? error.message : 'Forbidden'
            };
        }

        const validateProduct = UpdateProductSchema.safeParse({
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio : formData.get('precio'),
            stock: formData.get('stock'),
            caracteristicas: JSON.parse(formData.get('caracteristicas') as string),
            imagen : formData.get('imagen')
        });

        if(!validateProduct.success){
            return {
                errors: validateProduct.error.flatten().fieldErrors,
                message: 'Validation Error: Falla al actualizar el producto. Verifique el formulario.'
            }
        }

        const { nombre, descripcion, precio, stock, caracteristicas, imagen } = validateProduct.data;

         let imagenUrl: string | null = null;

        // Si hay nueva imagen la subimos a supabase storage

         if (imagen instanceof File && imagen.size > 0) {
            const fileExt = imagen.name.split(".").pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imagen, { contentType: imagen.type});

            if (uploadError) {
                console.error('Error de supabase storage:', uploadError);
                return { message: 'Error al actualizar la imagen del producto'};
            }

            const {data: publicUrlData} = supabase.storage.from('products').getPublicUrl(fileName);
            imagenUrl = publicUrlData.publicUrl;
         }

        try {
            await sql`
            UPDATE products
                SET nombre = ${nombre},
                descripcion = ${descripcion},
                precio = ${precio},
                stock = ${stock},
                caracteristicas = ${JSON.stringify(caracteristicas)},
                imagen = COALESCE(${imagenUrl}, imagen)
            WHERE id = ${id}
            `;
        } catch (error) {
            console.error('ERROR EN SERVER ACTION:', error);
            return { message: 'Error al actualizar el producto. Por favor revise los datos ingresados.'}
        }

        revalidatePath('/dashboard/products');
        redirect('/dashboard/products');
}




export async function deleteProduct(id: string) {
    // ✓ Verificar que el usuario sea admin
    try {
        await requireAdmin();
    } catch (error) {
        throw error; // Propagar error de autenticación
    }

    await sql` DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/dashboard/products');
}





const CategorySchema = z.object({
  name: z.string().min(1, 'Nombre Categoria Requerido'),
  description: z.string().optional(),
});


export async function createCategories(prevState: CategoryState, formData: FormData): Promise<CategoryState>{
    // ✓ Verificar que el usuario sea admin
    try {
        await requireAdmin();
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : 'Forbidden'
        };
    }

    const validateCategories = CategorySchema.safeParse({
        name: formData.get('name'),
        description : formData.get('description')
    });

    if(!validateCategories.success){
        return{
            errors: validateCategories.error.flatten().fieldErrors,
            message: 'Validation Error: Fallo al crear la categoria. Por favor verifique los valores e intente nuevamente'
        }
    }


    const{name, description} = validateCategories.data;
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    try {
        await sql`
            INSERT INTO categories (id, name, slug, description)
            VALUES (
                ${crypto.randomUUID()},
                ${name},
                ${slug},
                ${description ?? null}
            )
        `;
        
    } catch (error) {
        console.error('ERROR EN SERVER ACTION:', error);
        return { message: 'Error al intentar crear la categoria'}
    }

    revalidatePath('/dashboard/categories');
    return {message: 'Categoria creada correctamente'};
}





const CreateOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional().or(z.literal("")).transform(val => val || null),
  customerId: z.string().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.coerce.number().int().gt(0),
      notes: z.string().optional(),
    })
  ).min(1),
});



export async function createOrder(prevState: OrderState, formData: FormData): Promise<OrderState> {
    const validateOrder = CreateOrderSchema.safeParse({
        customerId: formData.get('customerId') || null,
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        items: JSON.parse(formData.get('items') as string),
    });

    if(!validateOrder.success){
        console.error('Validation errors:', validateOrder.error);
        return{
            message: 'Datos invalidos para crear la orden'
        };
    }

    const {customerId, customerName, customerEmail, items} = validateOrder.data;

            try {
                const createdOrderId = await sql.begin(async (sql) => {
                    let total = 0;

                    // Validacion de productos y stock
                    for (const item of items) {
                        const [product] = await sql`
                            SELECT precio, stock
                            FROM products
                            WHERE id = ${item.productId}
                            FOR UPDATE
                        `;

                        if (!product) {
                            throw new Error('Producto no encontrado');
                        }

                        if (product.stock < item.quantity) {
                            throw new Error('Stock insuficiente');
                        }

                        total += product.precio * item.quantity;
                    }

                    // Crear orden
                    const [order] = await sql`
                        INSERT INTO orders (customer_id, customer_name, customer_email, status, total)
                        VALUES (${customerId ?? null}, ${customerName}, ${customerEmail ?? null}, 'pending', ${total}) 
                        RETURNING id
                    `;             // ${customerEmail ?? null} permite en este caso que sea null si no se proporciona email (el cliente tendra la opcion de no ingresar email)

                    // Crear order_items + descontar stock
                    for (const item of items) {
                        const [product] = await sql`
                            SELECT precio
                            FROM products
                            WHERE id = ${item.productId}
                        `;

                        await sql`
                            INSERT INTO order_items (order_id, product_id, quantity, price, notes)
                            VALUES (
                                ${order.id},
                                ${item.productId},
                                ${item.quantity},
                                ${product.precio},
                                ${item.notes || null}
                            )
                        `;

                        await sql`
                            UPDATE products
                            SET stock = stock - ${item.quantity}
                            WHERE id = ${item.productId}
                        `;
                    }

                    return order.id;
                });

                return { message: 'Orden Creada!', orderId: createdOrderId };
            } catch (error) {
                console.error('CreateOrder Error:', error);
                return { message: 'Error al crear la Orden' };
            }
}




// Actualizar el estado de la orden
/*const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped']),
});


export type OrderUpdate = {
    message?: string | null;
};


export async function updateOrderStatus(
  orderId: string,
  prevState: OrderUpdate,
  formData: FormData
) {
  const validatedUpdate = UpdateOrderStatusSchema.safeParse({
    status: formData.get('status'),
  });


  if (!validatedUpdate.success) {
    return { message: 'Estado inválido' };
  }


  try {
    await sql`
      UPDATE orders
      SET status = ${validatedUpdate.data.status}
      WHERE id = ${orderId}
    `;

  } catch (error) {
    console.error('ERROR EN SERVER ACTION:', error);
    return { message: 'Error al actualizar la orden' };
  }


  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath('/dashboard/orders');

  return { message: 'Estado actualizado' };
}*/



//cancelar la orden

export async function cancelOrder(orderId: string){
    try {

        await sql.begin(async (sql) => {
            // busca la orden con id pasado por parametro
            const [order] = await sql`
                SELECT status
                FROM orders
                WHERE id = ${orderId}
                FOR UPDATE
            `;

            // Si no exise orden 
            if(!order || order.status !== 'pending'){
                throw new Error('Orden no cancelable. Solo las ordenes pendientes pueden cancelarse');
            }


            // Si existe selecciona el/los producto/s de la orden
            const items = await sql`
                SELECT product_id, quantity
                FROM order_items
                WHERE order_id = ${orderId}
            `;


            // Actualiza el stock 
            for(const item of items){
                await sql`
                    UPDATE products
                    SET stock = stock + ${item.quantity}
                    WHERE id = ${item.product_id}
                `;
            }


            // Actualiza ek estado de la orden a cancelado (siempre y cuando este en estado pendiente)
            await sql`
                UPDATE orders
                SET status = 'cancelled'
                WHERE id = ${orderId}
            `;
        });
    } catch (error) {
        console.error('Error de cancelacion de orden', error);
        throw new Error ('Cancellation Error: No se pudo cancelar la orden')
    }
}



//Actualizar la orden a estado pagada


export async function payOrder(orderId : string) {
    try {
        
        await sql.begin(async (sql) => {
            const [order] = await sql`
                SELECT id, status, customer_id, total
                FROM orders
                WHERE id = ${orderId}
                FOR UPDATE
            `;


            if(!order || order.status !== 'pending'){
                throw new Error ('Orden no valida para pago!')
            }


            //crear invoice (factura)
          const [invoice] = await sql`
                INSERT INTO invoices (customer_id, amount, status, date)
                VALUES (
                    ${order.customer_id},
                    ${order.total},
                    'paid',
                    ${new Date().toISOString().split('T')[0]}
                )
                RETURNING id
            `;


            //actualizar estado de pago orden
            await sql`
                UPDATE orders
                SET status = 'paid',
                    invoice_id = ${invoice.id},
                    updated_at = now()
                WHERE id = ${orderId}
            `;

        });
    } catch (error) {
        console.error('ERROR EN SERVER ACTION:', error)
        throw new Error('No se pudo confirmar el pago')
    }

}



//Helper para validar cambio de estado de orden

function canTransition(from: OrderStatus, to: OrderStatus){
    const trasitions : Record<OrderStatus, OrderStatus[]> = {
        pending : ['paid', 'cancelled'],
        paid : ['shipped'],
        cancelled : [],
        shipped : []
    };

    return trasitions[from]?.includes(to) ?? false;
}




export async function newUpdateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {

        await sql.begin(async (sql) => {
            const [order] = await sql`
                SELECT id, status, customer_id, total, invoice_id
                FROM orders
                WHERE id = ${orderId}
                FOR UPDATE
            `;

            if(!order){
                throw new Error('Orden no encontrada')
            }

            if(!canTransition(order.status, newStatus)){
                throw new Error (`Transicion invalida ${order.status} → ${newStatus}`);
            }


            // rollback del stock si se cancela la orden

            if(newStatus === 'cancelled'){
                const items = await sql`
                    SELECT product_id, quantity
                    FROM order_items
                    WHERE order_id = ${orderId}
                `;


                for (const item of items){
                    await sql`
                        UPDATE products
                        SET stock = stock + ${item.quantity}
                        WHERE id = ${item.product_id}
                    `;
                }
            }


            // crear factura si pasa a paid

            let invoiceId: string | null = order.invoice_id;

            if(newStatus === 'paid' && !order.invoice_id){
                /*const [orderData] = await sql`
                    SELECT customer_id, total
                    FROM orders
                    WHERE id = ${orderId}
                `;*/


                const [invoice] = await sql`
                INSERT INTO invoices (customer_id, amount, status, date)
                VALUES (
                    ${order.customer_id},
                    ${order.total},
                    'paid',
                    ${new Date().toISOString().split('T')[0]}
                )
                RETURNING id
                `;

                invoiceId = invoice.id;
            }

           await sql`
                UPDATE orders
                SET
                    status = ${newStatus},
                    invoice_id = ${invoiceId},
                    updated_at = now()
                WHERE id = ${orderId}
            `;
    });
        
    } catch (error) {
        console.error('ERROR EN SERVER ACTION:', error)
        throw new Error ('No se pudo actualizar el estado de la orden')
        
    }
}


// Server Action para obtener URL de Stripe checkout
import { createStripeCheckout } from './payments/stripe';

export async function getStripeCheckoutUrl(orderId: string): Promise<string | null> {
    try {
        const checkoutUrl = await createStripeCheckout(orderId);
        return checkoutUrl;
    } catch (error) {
        console.error('Error getting Stripe checkout URL:', error);
        throw new Error('No se pudo crear la sesión de pago');
    }
}


