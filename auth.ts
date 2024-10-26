import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from "next-auth/providers/github"
import { authConfig } from './auth.config';
import { z } from 'zod';
import { getUser, getUserByGitHub } from '@/app/lib/actions/auth-actions';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email, password);
          if (user) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),

    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,

      async profile(profile, tokens) {
        await getUserByGitHub(profile);

        //console.log('********************', profile, '*************************');
        //console.log('********************', tokens, '*************************');

        return new Promise((resolve, reject) => {
          return resolve({
            id: profile.id.toString(),
            name: profile.name,
            email: profile.email,
            image: profile.avatar_url
          });
        });
      },

      account(account) {
        console.log('********************', account, '*************************');
        const refresh_token_expires_at =
          Math.floor(Date.now() / 1000) + Number(account.refresh_token_expires_in)
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          refresh_token_expires_at
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});