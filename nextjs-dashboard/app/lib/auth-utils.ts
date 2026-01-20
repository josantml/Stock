import { auth } from '@/auth';
import type { Session } from 'next-auth';

/**
 * Verifica que el usuario autenticado sea administrador.
 * Lanza error si no está autenticado o no es admin.
 */
export async function requireAdmin() {
  const session = (await auth()) as Session | null;
  
  if (!session || !session.user) {
    throw new Error('Unauthorized: User not authenticated');
  }
  
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden: Only admins can perform this action');
  }
  
  return session.user;
}

/**
 * Verifica que el usuario esté autenticado.
 * Retorna el usuario o lanza error.
 */
export async function requireAuth() {
  const session = (await auth()) as Session | null;
  
  if (!session || !session.user) {
    throw new Error('Unauthorized: User not authenticated');
  }
  
  return session.user;
}

/**
 * Obtiene la sesión actual sin requerir autenticación.
 * Retorna null si no hay sesión.
 */
export async function getSession() {
  return await auth() as Session | null;
}
