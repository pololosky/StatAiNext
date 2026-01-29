import FooterPremium from "@/components/FooterPremium";
import Header from "@/components/Headere";
import StartCard from "@/components/StartCard";
import StudentTable from "@/components/StudentTable";
import { Users, AlertCircle, Plus, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (  
    <main className="min-h-screen bg-gray-50">
    <Header />

    <div className="p-6">
    {/* Titre */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des profils étudiants</h1>
        <p className="text-gray-500">Tableau de bord établissement</p>
      </div>

      <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        <Plus size={18}/> Ajouter un étudiant
      </button>
    </div>

    {/*Cartes statistiques*/}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StartCard
        title="Etudiants inscrits"
        value="6"
        subtitle="Profils actifs"
        icon={<Users size={28} />}
      />

      <StartCard
        title="Moyenne générale"
        value="14.0 / 20"
        subtitle="Etablissement"
        icon={< TrendingUp size={28} className="text-green-500"/>}
      />

      <StartCard
        title="Alertes actives"
        value="3"
        subtitle="Nécessitent un suivi"
        icon={<AlertCircle size={28} className="text-orange-500"/>}
      />
    </div>

      {/*Recherche*/}
      <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
        <input 
          type="text"
          placeholder="Rechercher un étudiant ou une classe..."
          className="flex-1 border rounded-lg px-8 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select className="border rounded-lg px-4 py-2">
          <option>Toutes les classes</option>
          <option>Terminale</option>
          <option>Première</option>
          <option>Secondes</option>
        </select>

      </div>
      <StudentTable/>
    </div>
    <FooterPremium/>
    </main>
  )
}

