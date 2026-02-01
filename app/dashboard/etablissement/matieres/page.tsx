"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  BookOpen,
  Loader2,
  Search,
  LayoutGrid,
  Inbox,
  RefreshCw,
} from "lucide-react";
import MatiereCard from "@/components/dashboard/matiere/MatiereCard";
import AddMatiereModal from "@/components/dashboard/matiere/AddMatiereModal";

export default function MatieresPage() {
  // États de données
  const [matieres, setMatieres] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // États de l'interface
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Chargement des données
  const fetchData = async () => {
    try {
      const [resMat, resClas] = await Promise.all([
        fetch("/api/etablissement/matieres"),
        fetch("/api/etablissement/classes"),
      ]);

      if (!resMat.ok || !resClas.ok) throw new Error("Erreur de chargement");

      setMatieres(await resMat.json());
      setClasses(await resClas.json());
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleEdit = (matiere: any) => {
    setSelectedMatiere(matiere);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMatiere(null);
    setIsModalOpen(true);
  };

  // Filtrage en temps réel
  const filteredMatieres = matieres.filter(
    (m: any) =>
      m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.classe?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        <p className="text-slate-500 font-medium animate-pulse">
          Chargement des programmes...
        </p>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-blue-600">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Programmes d'études
            </h1>
            <p className="text-slate-500">
              Configuration des matières, coefficients et suivis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchData}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleAddNew}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus size={20} /> Nouvelle Matière
          </button>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher une matière, un code ou une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>
        <div className="hidden lg:flex items-center justify-end gap-2 text-slate-400 px-4">
          <LayoutGrid size={20} />
          <span className="text-sm font-medium">
            {filteredMatieres.length} matières trouvées
          </span>
        </div>
      </div>

      {/* --- GRID DE MATIÈRES --- */}
      {filteredMatieres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredMatieres.map((matiere) => (
            <div
              key={matiere.id}
              onClick={() => handleEdit(matiere)}
              className="cursor-pointer"
            >
              <MatiereCard matiere={matiere} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Inbox className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Aucun résultat</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">
            Nous n'avons trouvé aucune matière correspondant à votre recherche.
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* --- MODAL --- */}
      <AddMatiereModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMatiere(null); // Très important pour réinitialiser
        }}
        classes={classes}
        onSuccess={fetchData} // <--- C'est cette fonction qui rafraîchit la liste
        matiereToEdit={selectedMatiere}
      />
    </main>
  );
}
