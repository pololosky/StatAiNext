"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BookOpen,
  Calendar,
  Info,
  Loader2,
} from "lucide-react";
import Card from "@/components/Card";

export default function GradesComparisonPage() {
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/grades/compare")
      .then((res) => res.json())
      .then((data) => {
        setComparisons(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Mes Résultats</h1>
        <p className="text-slate-500">
          Comparaison de vos performances par période
        </p>
      </div>

      <Card className="overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                  Matière
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                  Période Précédente
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                  Période Actuelle
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                  Évolution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {comparisons.map((item, idx) => {
                const currentVal = item.current?.valeur || 0;
                const prevVal = item.previous?.valeur || 0;
                const diff = currentVal - prevVal;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <BookOpen size={18} />
                        </div>
                        <span className="font-bold text-slate-700">
                          {item.current?.matiere.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-400">
                      {item.previous ? `${prevVal}/20` : "—"}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`text-lg font-black ${currentVal >= 10 ? "text-slate-900" : "text-rose-500"}`}
                      >
                        {currentVal}/20
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {item.previous ? (
                        <div
                          className={`flex items-center gap-1 font-bold ${diff > 0 ? "text-emerald-500" : diff < 0 ? "text-rose-500" : "text-slate-400"}`}
                        >
                          {diff > 0 ? (
                            <ArrowUpRight size={18} />
                          ) : diff < 0 ? (
                            <ArrowDownRight size={18} />
                          ) : (
                            <Minus size={18} />
                          )}
                          <span>
                            {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-1 rounded-full uppercase">
                          Nouvelle note
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Note de sécurité */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-800 text-sm">
            Mode Lecture Seule
          </h4>
          <p className="text-amber-700/80 text-xs mt-1">
            Conformément au règlement de l'établissement, vous ne pouvez pas
            modifier vos notes. En cas d'erreur manifeste, veuillez contacter
            votre professeur principal ou l'administration.
          </p>
        </div>
      </div>
    </div>
  );
}
