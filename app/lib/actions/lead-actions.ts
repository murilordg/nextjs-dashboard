'use server';

import prisma from '@/app/lib/prisma';
import { Lead, LeadStatus } from '@prisma/client';

export type LeadCreateModel = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

export type LeadReturnedModel = Omit<Lead, 'tags'> & {
    tags: { id: string, color: string, name: string }[]
}

export async function createLead(lead: LeadCreateModel, tags: string[]): Promise<Lead> {
    try {
        const data = await prisma.lead.create({
            data: {
                ...lead,
                tags: { connect: tags.map((tag) => ({ id: tag })) }
            },
        });

        return data as Lead;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create lead data.');
    }

}

export async function fetchLead(): Promise<LeadReturnedModel[]> {
    try {

        const data = await prisma.lead.findMany({
            include: {
                tags: true
            }
        });

        return data as LeadReturnedModel[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch lead data.');
    }
}

export async function fetchLeadStatus(): Promise<LeadStatus[]> {
    try {

        const data = await prisma.leadStatus.findMany();

        return data as LeadStatus[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch lead status data.');
    }
}

export async function createLeadStatus(leadStatus: { name: string }): Promise<LeadStatus> {
    try {

        const data = await prisma.leadStatus.create({
            data: leadStatus
        });

        return data as LeadStatus;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create lead status data.');
    }
}

