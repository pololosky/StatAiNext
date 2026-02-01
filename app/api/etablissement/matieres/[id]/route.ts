import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT : Modifier une matière
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user.profileId)
    return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const updatedMatiere = await prisma.matiere.update({
      where: { id: params.id },
      data: {
        nom: body.nom,
        code: body.code,
        categorie: body.categorie,
        coefficient: parseFloat(body.coefficient),
        description: body.description,
        classeId: body.classeId,
      },
    });
    return NextResponse.json(updatedMatiere);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 },
    );
  }
}

// DELETE : Supprimer une matière
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user.profileId)
    return new NextResponse("Unauthorized", { status: 401 });

  try {
    await prisma.matiere.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Impossible de supprimer cette matière (elle contient peut-être des notes)",
      },
      { status: 400 },
    );
  }
}
