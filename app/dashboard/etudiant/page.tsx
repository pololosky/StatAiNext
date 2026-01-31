import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import AverageBarChart from "@/components/BarChart";
import SkillsRadar from "@/components/RadarChart";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">

      {/* Header */}
      <h1 className="text-3xl font-bold">Mon Profil Étudiant</h1>

      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Profil de compétences</h2>
          {/* <SkillsRadar /> */}
        </Card>

        <div className="space-y-4">
          <StatCard title="Moyenne générale" value="15.5 / 20" subtitle="+0.7 ce trimestre" />
          <StatCard title="Classement" value="8 / 32" subtitle="Dans la classe" />
          <StatCard title="Assiduité" value="98%" subtitle="Excellent" />
        </div>
      </div>

      {/* Evolution */}
      <Card>
        <h2 className="font-semibold mb-4">Évolution de la moyenne</h2>
        {/* <AverageBarChart /> */}
      </Card>

      {/* Points forts / améliorer */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card>
          <h3 className="font-semibold mb-3 text-green-600">Points forts</h3>
          <ul className="space-y-2 text-sm">
            <li>Analyse littéraire</li>
            <li>Raisonnement logique</li>
            <li>Expression écrite</li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3 text-orange-600">Points à améliorer</h3>
          <ul className="space-y-2 text-sm">
            <li>Histoire contemporaine</li>
            <li>Physique expérimentale</li>
          </ul>
        </Card>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h3 className="font-bold">Débloquez l'accompagnement personnalisé</h3>
          <p className="text-sm opacity-80">
            Plans d'action + suivi hebdomadaire
          </p>
        </div>

        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
          Accéder
        </button>
      </div>
    </div>
  );
}
