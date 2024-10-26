'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';

const FormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a name.',
    })
        .min(3, "Name must be at least 3 characters")
        .max(70, "Username must be at most 70 characters"),
    email: z.string()
        .email("Invalid email address"),
    image_url: z.string()
        .min(1, "Please provide a URL"),
});

const CreateCustomer = FormSchema.omit({ id: true });

const UpdateCustomer = FormSchema.omit({ id: true });

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
};

export async function createCustomer(prevState: State, formData: FormData) {
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    //console.log(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        };
    }

    const { name, email, image_url } = validatedFields.data;

    try {
        await prisma.customer.create({
            data: {
                name,
                email,
                image_url,
            },
        });

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Customers.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Customer.',
        };
    }
    const { name, email, image_url } = validatedFields.data;

    try {
        await prisma.customer.update({
            where: {
                id,
            },
            data: {
                name,
                email,
                image_url,
            },
        })

    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Customer.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
    try {
        await prisma.customer.delete({
            where: {
                id,
            },
        })
        revalidatePath('/dashboard/customers');

    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Customer.',
        };
    }
}
