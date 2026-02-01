"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save, AlertCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function EtablissementModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    adresse: "",
    telephone: "",
  });

  // Synchronisation des données quand on ouvre le modal ou qu'on change d'établissement
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (initialData) {
        setFormData({
          nom: initialData.nom || "",
          email: initialData.email || "",
          password: "", // On ne touche pas au password en modification
          adresse: initialData.adresse || "",
          telephone: initialData.telephone || "",
        });
      } else {
        setFormData({
          nom: "",
          email: "",
          password: "",
          adresse: "",
          telephone: "",
        });
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Construction de l'URL : on s'assure que l'ID est présent pour le PATCH
    const isEdit = !!initialData;
    const url = isEdit
      ? `/api/admin/etablissements/${initialData.id}`
      : "/api/admin/etablissements";

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(); // Rafraîchir la liste
        onClose(); // Fermer le modal
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData
                ? "Modifier l'établissement"
                : "Nouvel établissement"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {initialData
                ? "Mise à jour des informations de l'entité"
                : "Création d'un accès établissement"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm animate-shake">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nom
              </label>
              <input
                required
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="Nom de l'école"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email professionnel
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="admin@ecole.com"
              />
            </div>

            {/* Password affiché UNIQUEMENT à la création */}
            {!initialData && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-blue-800 mb-1">
                  Mot de passe initial
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="••••••••"
                />
                <p className="text-[10px] text-blue-500 mt-2 italic">
                  L'établissement pourra le modifier plus tard.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Téléphone
                </label>
                <input
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="+228..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Adresse
                </label>
                <input
                  value={formData.adresse}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Lomé, Togo"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {initialData ? "Mettre à jour" : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
