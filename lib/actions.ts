'use server';

import prisma from '@/app/lib/prisma';
import { Tag } from '@prisma/client';

export type TagCreate = Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>;
export type TagUpdate = Omit<Tag, 'createdAt' | 'updatedAt'>;

export async function createTag(tagData: TagCreate) {
    try {
        return await prisma.tag.create({
            data: tagData,
        });

    } catch (error) {
        console.error('Database Error: Failed to Create Tag.', error);
    }
}

export async function updateTag(tagData: TagUpdate) {
    try {
        return await prisma.tag.update({
            where: { id: tagData.id },
            data: tagData,
        });

    } catch (error) {
        console.error('Database Error: Failed to Update Tag.', error);
    }
}

export async function deleteTag(tagId: string) {
    try {
        await prisma.tag.delete({
            where: { id: tagId },
        });

    } catch (error) {
        console.error('Database Error: Failed to Update Tag.', error);
    }
}

export async function fetchTags(): Promise<Tag[]> {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: 'asc' },
        });

        return tags;

    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}