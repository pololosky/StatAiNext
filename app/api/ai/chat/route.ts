import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Limites de sécurité
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB par fichier
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB au total
const MAX_FILES = 3; // Maximum 3 fichiers

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const files = formData.getAll("files") as File[];

    // ✅ Validation des fichiers
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} fichiers autorisés` },
        { status: 400 }
      );
    }

    let totalSize = 0;
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} dépasse 10 MB` },
          { status: 400 }
        );
      }
      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: "Taille totale dépasse 20 MB" },
        { status: 400 }
      );
    }

    // ✅ Traitement parallèle optimisé
    const fileParts = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        
        return {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        };
      })
    );

    const parts: any[] = [
      { text: prompt || "Analyse ce contenu en détail." },
      ...fileParts,
    ];

    // ✅ Appel avec timeout personnalisé
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s max

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts }],
      });

      clearTimeout(timeoutId);

      const text =
        response.text || 
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Aucune réponse générée.";

      return NextResponse.json({ text });
      
    } catch (genError: any) {
      clearTimeout(timeoutId);
      
      if (genError.name === "AbortError") {
        throw new Error("Le traitement a pris trop de temps. Réduis la taille des fichiers.");
      }
      throw genError;
    }

  } catch (error: any) {
    console.error("❌ ERREUR GEMINI:", error);

    const errorMessage = 
      error.message?.includes("trop de temps") 
        ? error.message
        : error.message?.includes("quota") || error.message?.includes("rate")
        ? "Quota API dépassé. Réessaie dans quelques secondes."
        : error.message?.includes("fetch")
        ? "Connexion interrompue. Vérifie ta connexion internet."
        : "Erreur lors du traitement. Réessaie avec des fichiers plus légers.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const maxDuration = 60; // Vercel