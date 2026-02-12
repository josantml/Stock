// app/api/admin/domains/add/route.ts

import { auth } from '@/auth'; // Ajusta esta ruta según tu estructura
import { NextRequest, NextResponse } from 'next/server';
import { Resend, type DomainRegion } from 'resend'; // Asegúrate de tener instalado 'resend'
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  // 1. Verificar que el usuario sea Admin
  // Usa la misma función que usas en tus otras rutas seguras
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error de autenticación:', error);
    return NextResponse.json(
      { message: 'Error de autenticación' },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);

    try {
        // 2. Obtener datos (Nombre del Dominio y Región)
        const body = await request.json() as {domain: string; region?: DomainRegion;};

        const { domain, region = 'us-east-1' } = body; // Región predeterminada

        // 3. Definir el dominio desde env o usar el del body
        const domainName = domain || 'stockpablo.com'; 

        // 4. Crear el dominio usando la API de Resend
        const { data, error } = await resend.domains.create({
          name: domain,
          region,
        });


        // 5. Manejo de Respuesta de Resend
        if (error) {
            console.error('Error al añadir dominio:', error);
            
            // Conflict 409: Ya existe el dominio en la cuenta
            if (error.statusCode === 409) {
                return NextResponse.json(
                    { message: `El dominio "${domain}" ya existe en tu cuenta de Resend.` },
                    { status: 409 } // Usamos 409 para indicar que ya existe
                );
            }

            // Errores comunes (400 Bad Request, etc)
            console.log('Dominio agregado con ID:', data);

            return NextResponse.json(
            {
                message: `Dominio "${domain}" agregado y verificado correctamente.`,
                domain: data,  // Devuelve el objeto completo del dominio con el ID y estados
                status: 201
            }
            );

        } 
    }catch (error) {
    console.error('Error interno en la API de dominios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al agregar el dominio.' },
      { status: 500 }
    );
  }
}

try {
    
} catch (error) {
    
}