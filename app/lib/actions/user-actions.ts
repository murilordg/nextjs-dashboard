'use server';

import prisma from '@/app/lib/prisma';
import { User } from '@prisma/client';

export async function fetchUsers(): Promise<User[]> {
    try {

        const data = await prisma.user.findMany();

        return data as User[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch User data.');
    }
}
