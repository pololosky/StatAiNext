import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "ADMIN")
    return new NextResponse("Unauthorized", { status: 401 });

  try {
    const [totalEtab, totalEtudiants, totalClasses, totalNotes] =
      await Promise.all([
        prisma.etablissement.count(),
        prisma.etudiant.count(),
        prisma.classe.count(),
        prisma.note.count(),
      ]);

    // Simulation de croissance (ou calcul réel basé sur createdAt)
    const statsCroissance = [
      { name: "Sept", total: 12 },
      { name: "Oct", total: 18 },
      { name: "Nov", total: 25 },
      { name: "Dec", total: totalEtab },
    ];

    return NextResponse.json({
      counts: {
        etablissements: totalEtab,
        etudiants: totalEtudiants,
        classes: totalClasses,
        notes: totalNotes,
      },
      graph: statsCroissance,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
