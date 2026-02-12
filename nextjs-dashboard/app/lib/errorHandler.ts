/**
 * Utilidad para manejar errores de forma segura
 * Evita exposer información sensible en la respuesta al cliente
 */

export interface SafeError {
  message: string;
  code?: string;
  isDatabaseError?: boolean;
  userMessage: string; // Mensaje seguro para mostrar al cliente
}

export function createSafeError(
  error: any,
  context: string,
  defaultMessage: string = 'Ocurrió un error al procesar la solicitud'
): SafeError {
  const isDatabaseError = error?.message?.includes('database') || error?.code === 'ECONNREFUSED';

  // Log interno (solo en servidor)
  if (typeof window === 'undefined') {
    console.error(`[${context}] Error:`, error);
  }

  // Determinar tipo de error
  let userMessage = defaultMessage;

  if (error?.message?.includes('duplicate key')) {
    userMessage = 'Este registro ya existe en el sistema';
  } else if (error?.message?.includes('not found')) {
    userMessage = 'El recurso solicitado no fue encontrado';
  } else if (isDatabaseError) {
    userMessage = 'Error de conexión con la base de datos. Intenta de nuevo más tarde';
  } else if (error?.message?.includes('validation')) {
    userMessage = 'Los datos proporcionados son inválidos';
  }

  return {
    message: error?.message || defaultMessage,
    code: error?.code,
    isDatabaseError,
    userMessage, // Esto es lo que se envía al cliente
  };
}

export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  context: string,
  errorMessage?: string
): Promise<{ success: boolean; data?: T; error?: SafeError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const safeError = createSafeError(error, context, errorMessage);
    return { success: false, error: safeError };
  }
}
