import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const etabId = session?.user.profileId;

  // Sécurité TS : on vérifie que etabId n'est ni null ni undefined
  if (!etabId) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const annees = await prisma.anneeScolaire.findMany({
    where: { etablissementId: etabId }, // Plus d'erreur ici !
    include: { _count: { select: { periodes: true } } },
    orderBy: { dateDebut: "desc" },
  });

  return NextResponse.json(annees);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const etabId = session?.user.profileId;

    // 1. Sécurité : Vérifier que l'établissement est connecté
    if (!etabId) {
      return new NextResponse("Non autorisé : ID établissement manquant", {
        status: 401,
      });
    }

    const { libelle, dateDebut, dateFin, active } = await req.json();

    // 2. Logique de l'année active (Transaction Prisma)
    // On utilise une transaction pour être sûr que tout se passe bien
    const result = await prisma.$transaction(async (tx) => {
      // Si l'utilisateur veut activer cette année, on désactive les autres d'abord
      if (active === true) {
        await tx.anneeScolaire.updateMany({
          where: { etablissementId: etabId },
          data: { active: false },
        });
      }

      // Création de la nouvelle année
      return await tx.anneeScolaire.create({
        data: {
          libelle,
          dateDebut: new Date(dateDebut),
          dateFin: new Date(dateFin),
          active: active || false,
          etablissementId: etabId, // Ici etabId est garanti d'être une string grâce au check au début
        },
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erreur POST AnneeScolaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'année scolaire" },
      { status: 500 },
    );
  }
}
