import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const student = await prisma.etudiant.findUnique({
      where: { id },
      include: {
        classe: true,
        notes: {
          include: {
            matiere: true, // Inclut le coefficient pour le calcul
            periode: true,
          },
          orderBy: { createdAt: "desc" },
        },
        statistiques: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!student)
      return NextResponse.json(
        { error: "Étudiant non trouvé" },
        { status: 404 },
      );

    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
