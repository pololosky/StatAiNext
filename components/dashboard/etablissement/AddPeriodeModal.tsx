"use client";
import { useState } from "react";
import { X, CalendarClock, Loader2, Layers } from "lucide-react";

export default function AddPeriodeModal({ isOpen, onClose, annees, classes, onSuccess }: any) {
  const [form, setForm] = useState({
    numero: "1", typePeriode: "TRIMESTRE", dateDebut: "", dateFin: "", anneeId: "", classeId: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/etablissement/periodes", {
      method: "POST",
      body: JSON.stringify(form)
    });
    if (res.ok) { onSuccess(); onClose(); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2"><CalendarClock className="text-purple-600"/> Nouvelle Période</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select required className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setForm({...form, typePeriode: e.target.value})}>
              <option value="TRIMESTRE">Trimestre</option>
              <option value="SEMESTRE">Semestre</option>
            </select>
            <input required type="number" placeholder="N° (ex: 1)" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setForm({...form, numero: e.target.value})} />
          </div>

          <select required className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-blue-600" onChange={e => setForm({...form, anneeId: e.target.value})}>
            <option value="">Choisir l'Année Scolaire</option>
            {annees.map((a: any) => <option key={a.id} value={a.id}>{a.libelle}</option>)}
          </select>

          <select required className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setForm({...form, classeId: e.target.value})}>
            <option value="">Classe concernée</option>
            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 ml-2">DÉBUT</label>
              <input required type="date" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setForm({...form, dateDebut: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 ml-2">FIN</label>
              <input required type="date" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setForm({...form, dateFin: e.target.value})} />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 mt-4 flex justify-center">
            {loading ? <Loader2 className="animate-spin" /> : "Créer la période"}
          </button>
        </form>
      </div>
    </div>
  );
}