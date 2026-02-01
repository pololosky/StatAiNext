"use client";
import { useState } from "react";
import { X, Loader2, UserPlus, GraduationCap, ShieldCheck, Mail, Fingerprint, User } from "lucide-react";

export default function AddStudentModal({ isOpen, onClose, classes, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", password: "", matricule: "", classeId: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/etablissement/etudiants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Réponse serveur invalide");
      }

      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay avec flou plus prononcé */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-blue-900/20 overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header avec Dégradé subtil */}
        <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 text-white">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Nouvel Étudiant</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Inscription académique</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-3 animate-shake">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {/* Section 1: Identité */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <User size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Informations Personnelles</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input required placeholder="Nom" className={inputClass} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
              </div>
              <div className="relative">
                <input required placeholder="Prénom" className={inputClass} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
              </div>
            </div>

            <div className="relative">
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required placeholder="Matricule (ex: MAT-2024-001)" className={inputClass} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
            </div>

            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select required className={inputClass} onChange={(e) => setForm({ ...form, classeId: e.target.value })}>
                <option value="">Sélectionner une classe</option>
                {classes?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Sécurité */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Accès Plateforme</span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required type="email" placeholder="Adresse email" className={inputClass} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="relative">
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required type="password" placeholder="Mot de passe provisoire" className={inputClass} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Confirmer l'inscription</span>
                  <div className="bg-blue-500 p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                    <X size={14} className="rotate-45" />
                  </div>
                </>
              )}
            </button>
            <p className="text-center text-slate-400 text-[10px] mt-4">
              L'étudiant recevra une notification pour activer son compte.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}