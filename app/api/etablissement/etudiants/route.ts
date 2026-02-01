import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// --- 1. RÉCUPÉRATION (Pour le tableau StudentTable) ---
export async function GET() {
  try {
    const session = await auth();
    const etabId = session?.user.profileId;

    if (!etabId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const students = await prisma.etudiant.findMany({
      where: { etablissementId: etabId },
      include: {
        classe: true,
        statistiques: {
          orderBy: { createdAt: 'desc' },
          take: 2,
        },
      },
      orderBy: { nom: 'asc' },
    });

    const formatted = students.map((s) => ({
      id: s.id,
      initials: `${s.prenom[0]}${s.nom[0]}`.toUpperCase(),
      name: `${s.prenom} ${s.nom}`,
      class: s.classe?.nom || "N/A",
      classeId: s.classeId,
      average: s.statistiques[0]?.moyenneGenerale || 0,
      trend: s.statistiques[0]?.moyenneGenerale > s.statistiques[1]?.moyenneGenerale ? "up" : "stable", // simplifié pour l'exemple
      alerts: (s.statistiques[0]?.moyenneGenerale < 10) ? 1 : 0
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

// --- 2. CRÉATION (Pour le modal AddStudentModal) ---
export async function POST(req: Request) {
  try {
    const session = await auth();
    const etabId = session?.user.profileId;

    if (!etabId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { nom, prenom, email, password, classeId, matricule } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nom,
        prenom, // Ajouté car obligatoire dans ton schéma User
        email,
        password: hashedPassword,
        role: "ETUDIANT",
        etudiant: {
          create: {
            nom,
            prenom,
            matricule,
            classeId,
            etablissementId: etabId,
          }
        }
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}