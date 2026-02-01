"use client";

import { useState, useEffect } from "react";
import StartCard from "@/components/StartCard";
import StudentTable from "@/components/StudentTable";
import AddStudentModal from "@/components/dashboard/etablissement/AddStudentModal";
import {
  Users,
  AlertCircle,
  Plus,
  TrendingUp,
  Search,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

export default function EtablissementDashboard() {
  // États pour les données
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("all");

  // État pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour charger les statistiques et les classes
  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/etablissement/stats");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fonction appelée après une création réussie
  const handleSuccess = () => {
    fetchDashboardData(); // Rafraîchir les compteurs et les classes
  };

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 w-12 h-12 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">
            Chargement du tableau de bord...
          </p>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Gestion des profils
            </h1>
            <p className="text-slate-500 text-sm">
              Espace Administration Établissement
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          Inscrire un étudiant
        </button>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StartCard
          title="Étudiants inscrits"
          value={data?.counts?.etudiants?.toString() || "0"}
          subtitle="Total des profils actifs"
          icon={<Users size={28} className="text-blue-600" />}
        />

        <StartCard
          title="Moyenne générale"
          value={`${data?.counts?.moyenneG || "0.00"} / 20`}
          subtitle="Performance de l'école"
          icon={<TrendingUp size={28} className="text-emerald-500" />}
        />

        <StartCard
          title="Alertes actives"
          value={data?.counts?.alertes?.toString() || "0"}
          subtitle="Suivi pédagogique requis"
          icon={
            <AlertCircle
              size={28}
              className={
                data?.counts?.alertes > 0
                  ? "text-orange-500 animate-pulse"
                  : "text-slate-300"
              }
            />
          }
        />
      </div>

      {/* --- FILTERS SECTION --- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher par nom ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-700"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedClasse}
            onChange={(e) => setSelectedClasse(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-700 appearance-none cursor-pointer"
          >
            <option value="all">Toutes les classes</option>
            {data?.classes?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="font-bold text-slate-800">Liste des étudiants</h2>
        </div>
        <StudentTable searchTerm={searchTerm} classeId={selectedClasse} />
      </div>

      {/* --- MODAL --- */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classes={data?.classes || []}
        onSuccess={() => window.location.reload()} // Force le navigateur à recharger
      />
    </main>
  );
}
