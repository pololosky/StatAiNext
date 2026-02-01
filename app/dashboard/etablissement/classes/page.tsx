"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, X, School } from "lucide-react";
import ClasseCard from "@/components/dashboard/etablissement/ClasseCard";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClasse, setNewClasse] = useState({ nom: "", niveau: "" });

  const fetchClasses = async () => {
    const res = await fetch("/api/etablissement/classes");
    const data = await res.json();
    setClasses(data);
    setLoading(false);
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/etablissement/classes", {
      method: "POST",
      body: JSON.stringify(newClasse),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setNewClasse({ nom: "", niveau: "" });
      fetchClasses();
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vos Classes</h1>
          <p className="text-slate-500 font-medium">Gérez les divisions de votre établissement</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Nouvelle Classe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c: any) => <ClasseCard key={c.id} classe={c} />)}
      </div>

      {/* Modal de Création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Ajouter une classe</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la classe</label>
                <input 
                  required
                  placeholder="Ex: Terminale S1"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  onChange={e => setNewClasse({...newClasse, nom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Niveau / Cycle</label>
                <input 
                  placeholder="Ex: Lycée - Second Cycle"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  onChange={e => setNewClasse({...newClasse, niveau: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-2">Créer la classe</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}