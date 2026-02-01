import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const etablissements = await prisma.etablissement.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(etablissements);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const { nom, email, password, adresse, telephone } = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Créer le compte User
      const user = await tx.user.create({
        data: {
          email,
          nom, // Nom de l'établissement stocké comme nom de famille par défaut
          prenom: "Etablissement",
          password: await bcrypt.hash(password, 10),
          role: "ETABLISSEMENT",
        }
      });

      // 2. Créer l'entité Etablissement liée
      return await tx.etablissement.create({
        data: {
          nom,
          email,
          adresse,
          telephone,
          userId: user.id
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Email déjà utilisé ou erreur serveur" }, { status: 400 });
  }
}