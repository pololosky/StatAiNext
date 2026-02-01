import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // On définit params comme une Promise
) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  // 1. ATTENDRE les paramètres (Correction ici)
  const { id } = await params;

  try {
    // 2. Chercher l'établissement pour récupérer l'userId lié
    const etablissement = await prisma.etablissement.findUnique({
      where: { id: id },
    });

    if (!etablissement) {
      return new NextResponse("Établissement non trouvé", { status: 404 });
    }

    // 3. Supprimer l'User (le cascade supprimera l'Etablissement)
    await prisma.user.delete({
      where: { id: etablissement.userId },
    });

    return NextResponse.json({
      message: "Établissement et compte utilisateur supprimés avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Important: Promise pour Next.js 15+
) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  try {
    // 1. Attendre les paramètres de l'URL
    const { id } = await params;
    
    // 2. Récupérer les données du corps de la requête
    const { nom, email, adresse, telephone } = await req.json();

    // 3. Mettre à jour l'Etablissement ET l'User lié en une seule fois
    const updatedEtab = await prisma.etablissement.update({
      where: { id: id },
      data: {
        nom,
        email,
        adresse,
        telephone,
        user: {
          update: {
            nom: nom,
            email: email,
          }
        }
      }
    });

    return NextResponse.json(updatedEtab);
  } catch (error) {
    console.error("Erreur PATCH:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'établissement" }, 
      { status: 500 }
    );
  }
}