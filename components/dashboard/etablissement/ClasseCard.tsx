// components/etablissement/ClasseCard.tsx
import { Users, GraduationCap, ChevronRight } from "lucide-react";

interface ClasseCardProps {
  classe: {
    id: string;
    nom: string;
    niveau?: string;
    _count: { etudiants: number };
  };
}

export default function ClasseCard({ classe }: ClasseCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <GraduationCap size={24} />
        </div>
        <ChevronRight
          size={20}
          className="text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1"
        />
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-1">{classe.nom}</h3>
      <p className="text-sm text-slate-500 mb-4">
        {classe.niveau || "Niveau non spécifié"}
      </p>

      <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg w-fit">
        <Users size={16} className="text-blue-500" />
        <span className="text-sm font-semibold">
          {classe._count.etudiants} Étudiants
        </span>
      </div>
    </div>
  );
}
