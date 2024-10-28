import prisma from '@/app/lib/prisma';
import { Lead } from '@prisma/client';

export async function fetchLead(): Promise<Lead[]> {
    try {

        const data = await prisma.lead.findMany();

        return data as Lead[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch lead data.');
    }
}

