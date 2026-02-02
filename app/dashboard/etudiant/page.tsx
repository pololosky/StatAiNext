"use client";

import { useEffect, useState, useMemo } from "react";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { Loader2, TrendingUp, Target, Award, Zap } from "lucide-react";
import AverageBarChart from "@/components/BarChart";
import SkillsRadar from "@/components/RadarChart";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // CALCUL DYNAMIQUE DE LA MOYENNE
  const moyenneAffichee = useMemo(() => {
    // Priorité 1 : La stat officielle en DB
    if (data?.statistiques?.[0]?.moyenneGenerale) {
      return data.statistiques[0].moyenneGenerale.toFixed(2);
    }
    // Priorité 2 : Calcul direct sur les notes
    if (data?.notes && data.notes.length > 0) {
      const totalPoints = data.notes.reduce(
        (acc: number, n: any) => acc + n.valeur * (n.matiere?.coefficient || 1),
        0,
      );
      const totalCoeffs = data.notes.reduce(
        (acc: number, n: any) => acc + (n.matiere?.coefficient || 1),
        0,
      );
      return totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : "0.00";
    }
    return "0.00";
  }, [data]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  const stats = data?.statistiques?.[0] || {};
  const pointsForts = stats.matieresFortes
    ? JSON.parse(stats.matieresFortes)
    : [];
  const pointsFaibles = stats.matieresFaibles
    ? JSON.parse(stats.matieresFaibles)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900">
          Mon Tableau de Bord
        </h1>
        <p className="text-slate-500 font-medium">
          {data?.prenom} {data?.nom} • {data?.classe?.nom}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="text-blue-600" size={20} /> Analyse des
            compétences
          </h2>
          {data?.notes?.length > 0 ? (
            <SkillsRadar notes={data.notes} />
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400 italic">
              Pas encore de notes pour générer le radar
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <StatCard
            title="Moyenne Générale"
            value={`${moyenneAffichee} / 20`}
            subtitle={
              Number(moyenneAffichee) >= 10 ? "Admis" : "En progression"
            }
          />
          <StatCard
            title="Rang"
            value={
              data?.calculatedRank !== "—"
                ? `${data.calculatedRank} / ${data.totalClass}`
                : "—"
            }
            subtitle="Classement actuel"
          />
          <StatCard title="Assiduité" value="98%" subtitle="Excellent" />
        </div>
      </div>

      <Card>
        <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={20} /> Évolution
          trimestrielle
        </h2>
        {data?.notes?.length > 0 ? (
          <AverageBarChart notes={data.notes} />
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400 italic">
            Données insuffisantes pour le graphique
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card borderTopColor="border-t-emerald-500">
          <h3 className="font-bold mb-4 text-emerald-600 flex items-center gap-2">
            🚀 Points forts
          </h3>
          {pointsForts.map((p: any, i: number) => (
            <div
              key={i}
              className="flex justify-between p-2 bg-emerald-50 rounded-lg mb-2 text-sm"
            >
              <span className="font-medium text-slate-700">{p.nom}</span>
              <span className="font-bold text-emerald-700">{p.moyenne}/20</span>
            </div>
          ))}
        </Card>
        <Card borderTopColor="border-t-orange-500">
          <h3 className="font-bold mb-4 text-orange-600 flex items-center gap-2">
            💡 À améliorer
          </h3>
          {pointsFaibles.map((p: any, i: number) => (
            <div
              key={i}
              className="flex justify-between p-2 bg-orange-50 rounded-lg mb-2 text-sm"
            >
              <span className="font-medium text-slate-700">{p.nom}</span>
              <span className="font-bold text-orange-700">{p.moyenne}/20</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
