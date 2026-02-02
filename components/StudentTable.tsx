"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Eye,
  Pencil,
  TrendingDown,
  TrendingUp,
  Loader2,
  UserX,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface StudentTableProps {
  searchTerm: string;
  classeId: string;
}

export default function StudentTable({
  searchTerm,
  classeId,
}: StudentTableProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch("/api/etablissement/etudiants");

        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "L'API n'a pas renvoyé de JSON valide. Vérifiez votre session.",
          );
        }

        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error("Erreur StudentTable:", error);
        setErrorMessage(error.message || "Une erreur inconnue est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // On garde tes noms de variables originaux : s.name et s.matricule
      const nameMatch =
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matriculeMatch =
        s.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesSearch = nameMatch || matriculeMatch;

      const matchesClasse = classeId === "all" || s.classeId === classeId;
      return matchesSearch && matchesClasse;
    });
  }, [students, searchTerm, classeId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-slate-400 text-sm animate-pulse">
          Récupération des données...
        </p>
      </div>
    );

  if (errorMessage)
    return (
      <div className="p-10 text-center flex flex-col items-center gap-3">
        <AlertTriangle className="text-amber-500" size={40} />
        <div className="text-slate-600">
          <p className="font-bold">Impossible de charger les étudiants</p>
          <p className="text-sm opacity-70">{errorMessage}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 font-semibold text-sm hover:underline"
        >
          Réessayer
        </button>
      </div>
    );

  if (filteredStudents.length === 0)
    return (
      <div className="p-20 text-center text-slate-400">
        <UserX className="mx-auto mb-4 opacity-20" size={48} />
        <p>Aucun étudiant ne correspond à votre recherche.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr className="text-slate-500 text-[11px] uppercase tracking-wider font-bold">
            <th className="px-6 py-4">Étudiant</th>
            <th className="px-6 py-4">Classe</th>
            <th className="px-6 py-4">Moyenne</th>
            <th className="px-6 py-4 text-center">Tendance</th>
            <th className="px-6 py-4 text-center">Alertes</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {filteredStudents.map((s) => {
            
            // --- LOGIQUE DE MOYENNE UNIQUEMENT ---
            // On vérifie s.average (ton ancien champ) OU s.statistiques (le nouveau)
            const statsMoyenne = s.statistiques?.[0]?.moyenneGenerale;
            const finalAverage = statsMoyenne !== undefined ? statsMoyenne : (s.average || 0);

            return (
              <tr
                key={s.id}
                className="hover:bg-slate-50/50 transition-colors group text-sm"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {/* On garde initials */}
                    {s.initials || (s.nom?.[0] || "?")}
                  </div>
                  <span className="text-slate-700 font-semibold truncate max-w-[180px]">
                    {/* On garde name */}
                    {s.name || `${s.nom} ${s.prenom}`}
                  </span>
                </td>
                {/* On garde class */}
                <td className="px-6 py-4 text-slate-500">{s.class || s.classe?.nom}</td>
                
                {/* LA MOYENNE CORRIGÉE */}
                <td
                  className={`px-6 py-4 font-bold ${finalAverage < 10 && finalAverage > 0 ? "text-rose-500" : "text-slate-900"}`}
                >
                  {finalAverage > 0 ? `${finalAverage.toFixed(2)}` : "—"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {s.trend === "up" ? (
                      <TrendingUp className="text-emerald-500" size={18} />
                    ) : s.trend === "down" ? (
                      <TrendingDown className="text-rose-500" size={18} />
                    ) : (
                      <div className="h-[2px] w-4 bg-slate-200" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {s.alerts > 0 ? (
                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md text-[10px] font-black">
                      {s.alerts}
                    </span>
                  ) : (
                    <span className="text-slate-200 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/dashboard/etablissement/etudiants/${s.id}`}
                      className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 inline-block"
                    >
                      <Eye size={16} />
                    </Link>
                    <button title="Modifier" className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-amber-600">
                      <Pencil size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}