import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from 'next-auth/providers/credentials'
import { z } from "zod";
import { User } from "./app/lib/definitions";
import bcrypt from 'bcrypt'
import postgres from "postgres";

// Configurar AUTH_URL dinámicamente basado en NODE_ENV
const AUTH_URL = process.env.NODE_ENV === 'production'
  ? process.env.AUTH_URL_PRODUCTION
  : process.env.AUTH_URL_DEVELOPMENT || 'http://localhost:3000/api/auth';

// Validar que AUTH_URL esté configurada
if (process.env.NODE_ENV !== 'production' && !AUTH_URL) {
  console.warn('AUTH_URL not configured. Using default: http://localhost:3000/api/auth');
}


const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, {ssl: 'require'});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Database error in getUser');
    throw new Error('Failed to fetch user'); 
  }
}

// AGREGA 'handlers' A LA DESESTRUCTURACIÓN
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  basePath: '/api/auth',
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials){
        const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);

        if(parsedCredentials.success){
            const {email, password} = parsedCredentials.data;
            const user = await getUser(email)

            if(!user) {
                return null;
            }
                
            const passwordMatch = await bcrypt.compare(password, user.password);

            if(passwordMatch){
                return user;
            }
        }
        return null;
      },
    })],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'admin' | 'client';
            }
            return session;
        },
    },
})