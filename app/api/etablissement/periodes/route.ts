import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { numero, typePeriode, dateDebut, dateFin, anneeId, classeId } =
    await req.json();

  try {
    const periode = await prisma.periode.create({
      data: {
        numero: parseInt(numero),
        typePeriode,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        anneeId,
        classeId,
      },
    });
    return NextResponse.json(periode);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Cette période existe déjà pour cette classe et cette année.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
