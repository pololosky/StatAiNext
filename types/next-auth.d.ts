import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Role } from "../app/generated/prisma"; // Ajusté selon ton output prisma-client

// Extension pour le modèle User (retourné par authorize)
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: Role;
    /** ID de l'Etablissement ou de l'Etudiant lié */
    profileId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      profileId: string | null;
    } & DefaultSession["user"];
  }
}

// Extension JWT pour le stockage du token
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    profileId: string | null;
  }
}
