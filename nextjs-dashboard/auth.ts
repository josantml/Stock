import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from 'next-auth/providers/credentials'
import { z } from "zod";
import { User } from "./app/lib/definitions";
import bcrypt from 'bcrypt'
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, {ssl: 'require'});

async function getUser(email: string): Promise<User | undefined> {
    try {
        console.log('🔍 Buscando usuario con email:', email);
        const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
        console.log('✅ Usuario encontrado:', user[0] ? { id: user[0].id, name: user[0].name, email: user[0].email } : 'NO ENCONTRADO');
        return user[0];
    } catch (error) {
        console.error('❌ Error al buscar usuario:', error);
        throw new Error('Failed to fetch user'); 
    }
}



export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials){
                const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);

                if(parsedCredentials.success){
                    const {email, password} = parsedCredentials.data;
                    console.log('🔐 Intento de login con:', email);
                    const user = await getUser(email)

                    if(!user){
                        console.log('❌ Usuario no existe:', email);
                        return null;
                    }
                    
                    console.log('🔑 Comparando contraseñas...');
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    console.log('🔐 Contraseña coincide:', passwordMatch);

                    if(passwordMatch){
                        console.log('✅ Login exitoso para:', email);
                        return user;
                    }
                    console.log('❌ Contraseña incorrecta para:', email);
                }
                console.log('❌ Credenciales inválidas o formato incorrecto');
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