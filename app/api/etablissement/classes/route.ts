import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET : Récupérer les classes
export async function GET() {
  const session = await auth();
  const etabId = session?.user.profileId;

  if (!etabId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const classes = await prisma.classe.findMany({
      where: { etablissementId: etabId },
      include: {
        _count: {
          select: { etudiants: true } // Compte automatique des étudiants
        }
      },
      orderBy: { nom: 'asc' }
    });
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST : Créer une classe
export async function POST(req: Request) {
  const session = await auth();
  const etabId = session?.user.profileId;

  if (!etabId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { nom, niveau } = await req.json();
    const newClasse = await prisma.classe.create({
      data: {
        nom,
        niveau,
        etablissementId: etabId
      }
    });
    return NextResponse.json(newClasse);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 400 });
  }
}