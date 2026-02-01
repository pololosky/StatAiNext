"use client";
import { useState, useEffect } from "react";
import { X, BookPlus, Loader2, Trash2, Save, AlertCircle } from "lucide-react";

export default function AddMatiereModal({
  isOpen,
  onClose,
  classes,
  onSuccess,
  matiereToEdit,
}: any) {
  // 1. TOUS les hooks en premier (toujours appelés, peu importe si le modal est ouvert ou non)
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
  const [error, setError] = useState(""); // <-- Le hook fautif doit être ici !

  useEffect(() => {
    if (matiereToEdit && isOpen) {
      setForm({
        nom: matiereToEdit.nom,
        code: matiereToEdit.code || "",
        categorie: matiereToEdit.categorie,
        coefficient: matiereToEdit.coefficient.toString(),
        classeId: matiereToEdit.classeId,
        description: matiereToEdit.description || "",
      });
      setError(""); // Reset l'erreur à l'ouverture
    } else if (isOpen) {
      setForm({
        nom: "",
        code: "",
        categorie: "SCIENCE",
        coefficient: "1",
        classeId: "",
        description: "",
      });
      setError("");
    }
  }, [matiereToEdit, isOpen]);

  // 2. SEULEMENT APRÈS les hooks, on gère le rendu conditionnel
  if (!isOpen) return null;

  // 3. Les fonctions de gestion (Handlers)
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
      const res = await fetch(
        `/api/etablissement/matieres/${matiereToEdit.id}`,
        {
          method: "DELETE",
        },
      );

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

  // 4. Le JSX
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
        {/* Affichage de l'erreur si elle existe */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            {matiereToEdit ? (
              <Save className="text-amber-500" />
            ) : (
              <BookPlus className="text-blue-600" />
            )}
            {matiereToEdit ? "Modifier" : "Nouvelle Matière"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ... (Reste du formulaire identique à l'étape précédente) ... */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Inputs ici... */}
          <div className="flex gap-3 pt-4">
            {matiereToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || loading}
                className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            )}
            <button
              type="submit"
              disabled={loading || isDeleting}
              className={`flex-[3] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${matiereToEdit ? "bg-amber-500 hover:bg-amber-600 shadow-amber-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"} shadow-lg`}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
