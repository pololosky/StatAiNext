"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/etablissement/etudiants/${params.id}/full`,
        );
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id]);

  // CALCUL DE LA MOYENNE (Si non présente en DB)
  const displayMoyenne = useMemo(() => {
    if (data?.statistiques?.[0]?.moyenneGenerale)
      return data.statistiques[0].moyenneGenerale;
    if (!data?.notes || data.notes.length === 0) return 0;

    const totalPoints = data.notes.reduce(
      (acc: number, n: any) => acc + n.valeur * (n.matiere?.coefficient || 1),
      0,
    );
    const totalCoeffs = data.notes.reduce(
      (acc: number, n: any) => acc + (n.matiere?.coefficient || 1),
      0,
    );
    return totalCoeffs > 0 ? totalPoints / totalCoeffs : 0;
  }, [data]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  if (!data)
    return <div className="p-10 text-center">Étudiant introuvable</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={20} /> Retour
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black">
            {data.nom?.[0] || ""}
            {data.prenom?.[0] || ""}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {data.nom} {data.prenom}
            </h1>
            <p className="text-slate-500 flex items-center gap-2 font-medium">
              <GraduationCap size={18} className="text-blue-500" />{" "}
              {data.classe?.nom} • {data.matricule}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-[2rem] text-center min-w-[180px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Moyenne Générale
          </p>
          <div className="text-4xl font-black">
            {displayMoyenne.toFixed(2)}
            <span className="text-lg text-slate-500">/20</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table des notes */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center gap-2 font-bold text-slate-800">
            <BookOpen size={20} className="text-blue-500" /> Relevé de notes
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-4">Matière</th>
                <th className="px-6 py-4">Période</th>
                <th className="px-6 py-4 text-center">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.notes?.map((n: any) => (
                <tr
                  key={n.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {n.matiere?.nom}{" "}
                    <span className="text-[10px] text-slate-300 ml-1">
                      x{n.matiere?.coefficient}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {n.periode?.typePeriode} {n.periode?.numero}
                  </td>
                  <td
                    className={`px-6 py-4 text-center font-black ${n.valeur < 10 ? "text-rose-500" : "text-blue-600"}`}
                  >
                    {n.valeur}/{n.surTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <TrendingUp size={20} /> Statut Performance
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
              {displayMoyenne >= 10
                ? "L'élève maintient des résultats satisfaisants. Continuez à encourager ses efforts."
                : "Attention : Des lacunes sont détectées. Un suivi pédagogique renforcé est conseillé."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
