import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const studentId = session?.user?.profileId;

  if (!studentId)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // On récupère toutes les notes groupées par période
  const notes = await prisma.note.findMany({
    where: { etudiantId: studentId },
    include: {
      matiere: true,
      periode: true,
    },
    orderBy: { periode: { numero: "desc" } },
  });

  // Logique de comparaison par matière
  const comparison = notes.reduce((acc: any, current) => {
    const matiereNom = current.matiere.nom;
    if (!acc[matiereNom]) {
      acc[matiereNom] = { current: null, previous: null };
    }

    // On stocke la note la plus récente (période max) et la précédente
    if (!acc[matiereNom].current) {
      acc[matiereNom].current = current;
    } else if (!acc[matiereNom].previous) {
      acc[matiereNom].previous = current;
    }

    return acc;
  }, {});

  return NextResponse.json(Object.values(comparison));
}
