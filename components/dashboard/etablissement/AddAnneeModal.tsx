"use client";
import { useState } from "react";
import { X, CalendarPlus, Loader2, Info } from "lucide-react";

export default function AddAnneeModal({ isOpen, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    libelle: "",
    dateDebut: "",
    dateFin: "",
    active: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/etablissement/annees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la création");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <CalendarPlus className="text-blue-600" /> Nouvelle Année
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs flex items-center gap-2">
              <Info size={14} /> {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">LIBELLÉ</label>
            <input 
              required 
              placeholder="ex: 2024-2025" 
              className={inputStyle}
              value={form.libelle}
              onChange={e => setForm({...form, libelle: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">DATE DÉBUT</label>
              <input 
                required type="date" className={inputStyle}
                onChange={e => setForm({...form, dateDebut: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">DATE FIN</label>
              <input 
                required type="date" className={inputStyle}
                onChange={e => setForm({...form, dateFin: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <input 
              type="checkbox" 
              id="active"
              className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              checked={form.active}
              onChange={e => setForm({...form, active: e.target.checked})}
            />
            <label htmlFor="active" className="text-sm font-medium text-blue-800 cursor-pointer">
              Définir comme année scolaire active
            </label>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Enregistrer l'année scolaire"}
          </button>
        </form>
      </div>
    </div>
  );
}