'use server';

import { auth } from './auth';
import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});


export async function signUp(values: z.infer<typeof signUpSchema>) {
    const validatedFields = signUpSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });
        return { success: "User created successfully!" };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function signIn(values: z.infer<typeof signInSchema>) {
    const validatedFields = signInSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });
        return { success: "Signed in successfully!" };
    } catch (error: any) {
        if (error.status === 401) {
            return { error: "Invalid email or password." };
        }
        return { error: "Something went wrong." };
    }
}

export async function signOut() {
    await auth.api.signOut();
}
