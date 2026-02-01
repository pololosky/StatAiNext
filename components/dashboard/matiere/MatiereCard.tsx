import { BookOpen, Hash, Layers, TrendingUp } from "lucide-react";

export default function MatiereCard({ matiere }: any) {
  const categories: any = {
    SCIENCE: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    LITTERATURE: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    ART_SPORT: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" }
  };

  const style = categories[matiere.categorie] || categories.SCIENCE;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${style.bg} ${style.color}`}>
          <BookOpen size={24} />
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${style.bg} ${style.color} ${style.border}`}>
          {matiere.categorie}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
        {matiere.nom}
      </h3>
      <p className="text-slate-400 text-sm mb-4 flex items-center gap-1">
        <Layers size={14} /> {matiere.classe.nom}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3 rounded-2xl">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Coefficient</p>
          <p className="text-lg font-bold text-slate-700">x{matiere.coefficient}</p>
        </div>
        <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-50">
          <p className="text-[10px] text-blue-400 uppercase font-bold mb-1">Moyenne</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-700">{matiere.moyenne}</span>
            <TrendingUp size={14} className="text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}