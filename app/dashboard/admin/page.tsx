"use client";

import { useEffect, useState } from "react";
import StartCard from "@/components/StartCard"; // Ton composant initial
import {
  Building2,
  Users,
  BookOpen,
  FileSpreadsheet,
  Loader2,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function AdminStatsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Statistiques Globales
        </h1>
        <p className="text-slate-500">
          Aperçu de l'activité sur la plateforme StatAi
        </p>
      </div>

      {/* Cartes de statistiques (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StartCard
          title="Établissements"
          value={data.counts.etablissements.toString()}
          subtitle="Inscrits sur la plateforme"
          icon={<Building2 size={24} />}
        />
        <StartCard
          title="Étudiants"
          value={data.counts.etudiants.toString()}
          subtitle="Profils actifs"
          icon={<Users size={24} />}
        />
        <StartCard
          title="Classes"
          value={data.counts.classes.toString()}
          subtitle="Réparties par école"
          icon={<BookOpen size={24} />}
        />
        <StartCard
          title="Notes saisies"
          value={data.counts.notes.toString()}
          subtitle="Données collectées"
          icon={<FileSpreadsheet size={24} />}
        />
      </div>

      {/* Graphiques de croissance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" size={20} />
            <h2 className="font-bold text-slate-800">
              Croissance des Établissements
            </h2>
          </div>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.graph}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: "#2563eb", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">
            Répartition par Volume
          </h2>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Étab.", val: data.counts.etablissements },
                  { name: "Étu.", val: data.counts.etudiants },
                  { name: "Notes", val: data.counts.notes / 10 }, // Scale adjust
                ]}
              >
                <Bar
                  dataKey="val"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
