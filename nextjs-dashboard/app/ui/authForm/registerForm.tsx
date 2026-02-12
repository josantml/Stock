'use client';

import { useActionState, useState } from 'react';
import { registerUser, type RegisterState } from '@/app/lib/actions';
import { z } from 'zod';

const RegisterClientSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener mayúsculas')
    .regex(/[a-z]/, 'Debe contener minúsculas')
    .regex(/[0-9]/, 'Debe contener números')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':",.<>?/\\|`~]/,
      'Debe contener caracteres especiales'
    ),
});

type RegisterClientFormData = z.infer<typeof RegisterClientSchema>;

export default function RegisterForm() {
  const initialState: RegisterState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterClientFormData>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validation = RegisterClientSchema.safeParse({ name, email, password });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (typeof err.path[0] === 'string') {
          errors[err.path[0]] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    formAction(formData);
  }

    return(
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium">Nombre Completo</label>
                <input 
                    id="name"
                    type="text" 
                    name="name"
                    required
                    className={`mt-1 block w-full rounded-md border ${
                      fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                    } p-2`}
                />
                {fieldErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                )}
                {state.errors?.name && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input 
                    id="email"
                    type="email" 
                    name="email"
                    required
                    className={`mt-1 block w-full rounded-md border ${
                      fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                    } p-2`}
                />
                {fieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                )}
                {state.errors?.email && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>
                )}
            </div>

            {/* Contraseña */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                <input 
                    id="password"
                    type="password" 
                    name="password"
                    required
                    className={`mt-1 block w-full rounded-md border ${
                      fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                    } p-2`}
                />
                {fieldErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                )}
                {state.errors?.password && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.password[0]}</p>
                )}
            </div>

            {/* Mensajes de error o exito globales */}
            {state.message && (
                <p className={`text-sm ${state.message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {state.message}
                </p>
            )}

            <button type="submit" disabled={isPending}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
        </form>
    );
}