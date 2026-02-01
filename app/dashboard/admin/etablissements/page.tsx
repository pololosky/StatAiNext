"use client";

import { useState, useEffect } from "react";
import EtablissementCard from "@/components/dashboard/admin/EtablissementCard";
import EtablissementModal from "@/components/dashboard/admin/EtablissementModal";
import { Plus, Loader2, Building2 } from "lucide-react";

export default function AdminDashboard() {
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour le Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEtab, setSelectedEtab] = useState<any>(null);

  useEffect(() => {
    fetchEtablissements();
  }, []);

  const fetchEtablissements = async () => {
    const res = await fetch("/api/admin/etablissements");
    const data = await res.json();
    setEtablissements(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setSelectedEtab(null);
    setIsModalOpen(true);
  };

  const openEditModal = (etab: any) => {
    setSelectedEtab(etab);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet établissement ?")) return;
    await fetch(`/api/admin/etablissements/${id}`, { method: "DELETE" });
    fetchEtablissements();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Établissements</h1>
          <p className="text-slate-500">Gestion de la base de données StatAi</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} />
          Nouvel Établissement
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      ) : etablissements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500">Aucun établissement enregistré.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etablissements.map((etab: any) => (
            <EtablissementCard
              key={etab.id}
              etab={etab}
              onDelete={handleDelete}
              onEdit={() => openEditModal(etab)}
            />
          ))}
        </div>
      )}

      {/* Modal unique pour Add/Edit */}
      <EtablissementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEtablissements}
        initialData={selectedEtab}
      />
    </div>
  );
}
