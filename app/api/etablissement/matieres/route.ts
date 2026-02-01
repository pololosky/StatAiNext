import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const etabId = session?.user.profileId;

  if (!etabId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const matieres = await prisma.matiere.findMany({
      where: { etablissementId: etabId },
      include: {
        classe: true,
        _count: { select: { notes: true } },
        notes: { select: { valeur: true } }
      }
    });

    // Calcul de la moyenne par matière
    const formatted = matieres.map(m => {
      const totalNotes = m.notes.reduce((acc, n) => acc + n.valeur, 0);
      const moyenne = m.notes.length > 0 ? (totalNotes / m.notes.length).toFixed(2) : "N/A";
      
      return {
        ...m,
        moyenne,
        nbDevoirs: m._count.notes
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const etabId = session?.user.profileId;

  if (!etabId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { nom, code, categorie, coefficient, classeId, description } = await req.json();

    const matiere = await prisma.matiere.create({
      data: {
        nom,
        code,
        categorie,
        coefficient: parseFloat(coefficient),
        description,
        classeId,
        etablissementId: etabId
      }
    });

    return NextResponse.json(matiere);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Cette matière existe déjà pour cette classe." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}