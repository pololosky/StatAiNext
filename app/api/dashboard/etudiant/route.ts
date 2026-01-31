import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ETUDIANT") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const etudiantId = session.user.profileId;

  if (!etudiantId) {
    return new NextResponse("Profil étudiant introuvable", { status: 404 });
  }

  try {
    // 1. Récupérer les dernières statistiques calculées
    const stats = await prisma.statistiqueEtudiant.findFirst({
      where: { etudiantId },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Récupérer les notes par matière pour les graphiques
    const notesParMatiere = await prisma.note.findMany({
      where: { etudiantId },
      include: {
        matiere: {
          select: { nom: true, categorie: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({
      moyenneGenerale: stats?.moyenneGenerale || 0,
      rang: stats?.rangClasse || "-",
      totalEleves: stats?.totalEleves || "-",
      poles: {
        science: stats?.moyenneScience || 0,
        litterature: stats?.moyenneLitterature || 0,
        artSport: stats?.moyenneArtSport || 0,
      },
      notes: notesParMatiere
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}