import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const etabId = session?.user.profileId;

  if (!etabId || session?.user.role !== "ETABLISSEMENT") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [totalEtudiants, totalClasses, moyennes] = await Promise.all([
      prisma.etudiant.count({ where: { etablissementId: etabId } }),
      prisma.classe.findMany({ where: { etablissementId: etabId } }),
      prisma.note.aggregate({
        where: { etudiant: { etablissementId: etabId } },
        _avg: { valeur: true },
      }),
    ]);

    // Simulation d'alertes (étudiants avec moyenne < 10)
    const alertesCount = await prisma.statistiqueEtudiant.count({
      where: {
        etudiant: { etablissementId: etabId },
        moyenneGenerale: { lt: 10 },
      },
    });

    return NextResponse.json({
      counts: {
        etudiants: totalEtudiants,
        moyenneG: moyennes._avg.valeur?.toFixed(2) || "0.00",
        alertes: alertesCount,
      },
      classes: totalClasses,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
