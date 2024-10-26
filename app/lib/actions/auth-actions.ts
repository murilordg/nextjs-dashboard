'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
//import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { GitHubProfile } from 'next-auth/providers/github';


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
//Tip: const rawFormData = Object.fromEntries(formData.entries())


export async function getUser(email: string, password: string): Promise<User | undefined> {
  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const name = email.split('@')[0];
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: await bcrypt.hash(password, 10),
        }
      });

    } else {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) return undefined;

    }

    return user;

  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserByGitHub(profile: GitHubProfile): Promise<User | undefined> {
  try {
    if (profile.email === null) return undefined;
    const email = profile.email;
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.name ?? email.split('@')[0],
          email,
          password: '',
          /*
            name: 'Murilo',
            login: 'murilordg',
            id: 8861532,
            node_id: 'MDQ6VXNlcjg4NjE1MzI=',
            avatar_url: 'https://avatars.githubusercontent.com/u/8861532?v=4',
            type: 'User',
            company: null,
            bio: null,
            created_at: '2014-09-22T13:16:22Z',
            updated_at: '2024-10-21T00:51:58Z',
            two_factor_authentication: false,
            plan: {
              name: 'free',
            }
          */
        }
      });

    }

    return user;

  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}