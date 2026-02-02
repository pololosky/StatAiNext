"use client";

import { useState, useEffect } from "react";
import { X, BookPlus, Loader2, Trash2, Save, AlertCircle, Hash, Info, GraduationCap } from "lucide-react";

interface AddMatiereModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: any[];
  onSuccess: () => void;
  matiereToEdit?: any;
}

export default function AddMatiereModal({
  isOpen,
  onClose,
  classes,
  onSuccess,
  matiereToEdit,
}: AddMatiereModalProps) {
  // 1. HOOKS (Toujours en premier)
  const [form, setForm] = useState({
    nom: "",
    code: "",
    categorie: "SCIENCE",
    coefficient: "1",
    classeId: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (matiereToEdit) {
        setForm({
          nom: matiereToEdit.nom || "",
          code: matiereToEdit.code || "",
          categorie: matiereToEdit.categorie || "SCIENCE",
          coefficient: matiereToEdit.coefficient?.toString() || "1",
          classeId: matiereToEdit.classeId || "",
          description: matiereToEdit.description || "",
        });
      } else {
        setForm({
          nom: "",
          code: "",
          categorie: "SCIENCE",
          coefficient: "1",
          classeId: "",
          description: "",
        });
      }
      setError("");
    }
  }, [matiereToEdit, isOpen]);

  // 2. RENDU CONDITIONNEL (Après les hooks)
  if (!isOpen) return null;

  // 3. HANDLERS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = matiereToEdit
        ? `/api/etablissement/matieres/${matiereToEdit.id}`
        : "/api/etablissement/matieres";

      const res = await fetch(url, {
        method: matiereToEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette matière ?")) return;
    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/etablissement/matieres/${matiereToEdit.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setIsDeleting(false);
    }
  };

  const inputStyle = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            {matiereToEdit ? <Save className="text-amber-500" /> : <BookPlus className="text-blue-600" />}
            {matiereToEdit ? "Modifier la matière" : "Ajouter une matière"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <BookPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required 
                placeholder="Nom" 
                value={form.nom}
                className={inputStyle}
                onChange={(e) => setForm({ ...form, nom: e.target.value })} 
              />
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                placeholder="Code (ex: MATH01)" 
                value={form.code}
                className={inputStyle}
                onChange={(e) => setForm({ ...form, code: e.target.value })} 
              />
            </div>
          </div>

          <div className="relative">
            <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              required 
              value={form.categorie}
              className={inputStyle}
              onChange={(e) => setForm({ ...form, categorie: e.target.value })}
            >
              <option value="SCIENCE">SCIENCE</option>
              <option value="LITTERATURE">LITTERATURE</option>
              <option value="ART_SPORT">ART_SPORT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">COEFF</span>
              <input 
                required 
                type="number" 
                step="0.5" 
                min="1"
                placeholder="Coeff" 
                value={form.coefficient}
                className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                onChange={(e) => setForm({ ...form, coefficient: e.target.value })} 
              />
            </div>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                required 
                value={form.classeId}
                className={inputStyle}
                onChange={(e) => setForm({ ...form, classeId: e.target.value })}
              >
                <option value="">Classe cible</option>
                {classes?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea 
            placeholder="Description (optionnelle)" 
            value={form.description}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px]"
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {matiereToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || loading}
                className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
              </button>
            )}
            <button
              type="submit"
              disabled={loading || isDeleting}
              className={`flex-[3] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                matiereToEdit 
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Save size={20} />
                  <span>{matiereToEdit ? "Mettre à jour" : "Enregistrer"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}