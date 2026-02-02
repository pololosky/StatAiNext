"use client";
import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import AddAnneeModal from "@/components/dashboard/etablissement/AddAnneeModal";// À créer sur le même modèle
import AddPeriodeModal from "@/components/dashboard/etablissement/AddPeriodeModal";

export default function CalendrierPage() {
  const [annees, setAnnees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isAnneeOpen, setIsAnneeOpen] = useState(false);
  const [isPeriodeOpen, setIsPeriodeOpen] = useState(false);

  const fetchData = async () => {
    const [resA, resC] = await Promise.all([
      fetch("/api/etablissement/annees"),
      fetch("/api/etablissement/classes")
    ]);
    setAnnees(await resA.json());
    setClasses(await resC.json());
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendrier Académique</h1>
          <p className="text-slate-500">Gérez les années scolaires et les découpages temporels</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAnneeOpen(true)} className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
            <Plus size={18}/> Année
          </button>
          <button onClick={() => setIsPeriodeOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2">
            <Plus size={18}/> Période
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des Années */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500"/> Historique des Années
          </h2>
          {annees.map((annee: any) => (
            <div key={annee.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-all">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${annee.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {annee.active ? <CheckCircle2 size={24}/> : <Clock size={24}/>}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">{annee.libelle}</h3>
                  <p className="text-sm text-slate-400">Du {new Date(annee.dateDebut).toLocaleDateString()} au {new Date(annee.dateFin).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Périodes configurées</p>
                  <p className="text-lg font-black text-blue-600">{annee._count.periodes}</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Aide Sidebar */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-4">Fonctionnement</h3>
          <ul className="space-y-6 opacity-90">
            <li className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">1</div>
              <p className="text-sm">Créez l'année scolaire (ex: 2024-2025) et marquez-la comme <b>active</b>.</p>
            </li>
            <li className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">2</div>
              <p className="text-sm">Ajoutez les périodes (Trimestres/Semestres) pour chaque classe individuellement.</p>
            </li>
            <li className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">3</div>
              <p className="text-sm">Les notes seront ensuite rattachées à ces périodes précises pour le calcul des moyennes.</p>
            </li>
          </ul>
        </div>
      </div>

      <AddAnneeModal isOpen={isAnneeOpen} onClose={() => setIsAnneeOpen(false)} onSuccess={fetchData} />
      <AddPeriodeModal isOpen={isPeriodeOpen} onClose={() => setIsPeriodeOpen(false)} annees={annees} classes={classes} onSuccess={fetchData} />
    </div>
  );
}