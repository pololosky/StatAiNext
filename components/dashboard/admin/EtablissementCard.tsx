// components/admin/EtablissementCard.tsx
"use client";

import { Building2, Mail, MapPin, Phone, Edit3, Trash2 } from "lucide-react";

interface EtablissementCardProps {
  etab: {
    id: string;
    nom: string;
    email: string;
    adresse?: string | null;
    telephone?: string | null;
  };
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export default function EtablissementCard({
  etab,
  onEdit,
  onDelete,
}: EtablissementCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md group">
      <div className="flex justify-between items-start">
        {/* Info Section */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Building2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 truncate max-w-[200px]">
              {etab.nom}
            </h3>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail size={14} className="text-blue-400" />
              <span className="truncate">{etab.email}</span>
            </div>
            
            {etab.telephone && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone size={14} className="text-blue-400" />
                <span>{etab.telephone}</span>
              </div>
            )}

            {etab.adresse && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={14} className="text-blue-400" />
                <span className="truncate">{etab.adresse}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Modifier"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onDelete(etab.id)}
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Petit footer discret pour l'ID ou le statut */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">
          ID: {etab.id.slice(-8)}
        </span>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">
          Actif
        </span>
      </div>
    </div>
  );
}