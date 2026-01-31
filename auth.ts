// src/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // On récupère l'utilisateur et ses relations pour avoir l'ID de l'entité liée
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            include: {
              etablissement: { select: { id: true } },
              etudiant: { select: { id: true } },
            },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );

          if (!isValid) return null;

          // On détermine l'ID "métier" (établissement ou étudiant)
          const profileId = user.etablissement?.id || user.etudiant?.id || null;

          return {
            id: user.id,
            email: user.email,
            name: `${user.prenom} ${user.nom}`, // Concaténation pour le champ standard 'name'
            role: user.role,
            profileId: profileId, // Remplace tenantId
          };
        } catch (err) {
          console.error("Erreur authorize :", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
      // On s'assure que la valeur n'est pas "undefined" pour le JWT
      token.profileId = (user as any).profileId ?? null;
    }
    return token;
  },
  async session({ session, token }) {
    if (token && session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as any;
      session.user.profileId = token.profileId as string | null;
    }
    return session;
  },
},

  pages: {
    signIn: "/sign-in",
    error: "/login",
  },

  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
