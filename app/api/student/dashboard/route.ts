import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const studentId = session?.user?.profileId;

  if (!studentId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const student = await prisma.etudiant.findUnique({
    where: { id: studentId },
    include: {
      classe: { include: { _count: { select: { etudiants: true } } } },
      notes: { include: { matiere: true } },
      statistiques: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  });

  if (!student) return NextResponse.json({ error: "Étudiant introuvable" }, { status: 404 });

  // Calcul du rang en comparant avec les autres élèves de la même classe
  const allStats = await prisma.statistiqueEtudiant.findMany({
    where: { etudiant: { classeId: student.classeId } },
    orderBy: { moyenneGenerale: 'desc' }
  });

  const rank = allStats.findIndex(s => s.etudiantId === studentId) + 1;

  return NextResponse.json({
    ...student,
    calculatedRank: rank > 0 ? rank : "—",
    totalClass: student.classe?._count.etudiants || 0
  });
}