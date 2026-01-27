import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      {/* // Ajout de bg-white ici pour s'assurer que toute la page est blanche */}
      <main className="scroll-smooth bg-white min-h-screen">
        {/* Présentation */}
        <section className="flex justify-between px-32 pt-10 pb-20 bg-white">
          <div className="flex flex-col gap-8 w-1/2">
            <div className="flex gap-2 w-fit p-2 border border-blue-500 rounded-xl shadow-2xl">
              <i className="ri-bard-line text-xl text-blue-600"></i>
              <p className="text-blue-600 font-semibold">
                L'IA au service de la réussite scolaire
              </p>
            </div>
            <h1 className="text-8xl font-bold text-gray-500">
              Révélez le potentiel de{" "}
              <span className="text-blue-600">chaque élève</span>
            </h1>
            <p className="w-4/5 text-gray-400 font-semibold text-xl">
              StatAi analyse les notes, les appréciations et les préférences
              pour créer des profils uniques et offrir un accompagnement
              personnalisé.
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="w-fit flex px-5 py-1.5 shadow bg-blue-600 text-white cursor-pointer rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Commencer maintenant
              </Link>
              <Link
                href="/"
                className="w-fit flex px-5 py-1.5 shadow bg-white text-blue-600 cursor-pointer rounded-xl text-xl font-semibold border border-gray-400 hover:bg-gray-50 transition-colors"
              >
                Pour les établissements
              </Link>
            </div>
            <div className="flex gap-4">
              <div className="flex gap-4 items-center">
                <i className="ri-check-line text-xl text-blue-600"></i>
                <p className="text-gray-400 text-lg">Analyse prédictive</p>
              </div>
              <div className="flex gap-4 items-center">
                <i className="ri-check-line text-xl text-blue-600"></i>
                <p className="text-gray-400 text-lg">Profils détaillés</p>
              </div>
              <div className="flex gap-4 items-center">
                <i className="ri-check-line text-xl text-blue-600"></i>
                <p className="text-gray-400 text-lg">Sécurisé</p>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <div className="mt-20 p-4 shadow-xl rounded-xl bg-white">
              <Image
                src="/back02.jpg"
                alt="Analyse StatAi"
                width={600}
                height={400}
                className="rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Les fonctionnalités - Fond blanc également */}
        <section
          className="flex flex-col gap-8 px-32 py-20 bg-gray-100"
          id="fonctionnalites"
        >
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Une analyse complète à 360°
            </h1>
            <p className="text-gray-400 font-semibold text-xl">
              Nous combinons données quantitatives et qualitatives pour
              comprendre l'élève dans sa globalité.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col gap-4 p-6 rounded-xl shadow-xl bg-white border border-gray-50">
              <div className="w-fit p-2 bg-blue-50 rounded-xl">
                <i className="ri-line-chart-line text-2xl text-blue-600 font-bold"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Profil de Compétences
              </h2>
              <p className="w-4/5 text-gray-400 text-xl">
                Visualisez instantanément les forces et les axes d'amélioration
                grâce à nos graphiques intuitifs basés sur les résultats
                scolaires.
              </p>
            </div>
            {/* Card 2 */}
            <div className="flex flex-col gap-4 p-6 rounded-xl shadow-xl bg-white border border-gray-50">
              <div className="w-fit p-2 bg-blue-50 rounded-xl">
                <i className="ri-brain-line text-2xl text-blue-600 font-bold"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Accompagnement IA
              </h2>
              <p className="w-4/5 text-gray-400 text-xl">
                Notre algorithme suggère des ressources pédagogiques et des
                méthodes de travail adaptées au profil cognitif de l'élève.
              </p>
            </div>
            {/* Card 3 */}
            <div className="flex flex-col gap-4 p-6 rounded-xl shadow-xl bg-white border border-gray-50">
              <div className="w-fit p-2 bg-gray-50 rounded-xl">
                <i className="ri-school-line text-2xl text-gray-600 font-bold"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Pour les Écoles
              </h2>
              <p className="w-4/5 text-gray-400 text-xl">
                Les établissements peuvent gérer leurs classes, suivre les
                tendances globales et importer facilement les données.
              </p>
            </div>
          </div>
        </section>

        {/* Section invitation - On garde le bleu ici pour le contraste, ou blanc si tu préfères ? */}
        <section className="flex flex-col items-center gap-8 px-32 bg-blue-600 py-20 text-white">
          <h1 className="text-5xl font-bold text-center">
            Prêt à transformer l'éducation ?
          </h1>
          <div className="w-1/2">
            <p className="text-xl text-center text-blue-100">
              Rejoignez les milliers d'élèves et d'établissements qui utilisent
              StatAi pour mieux comprendre et améliorer les parcours scolaires.
            </p>
          </div>
          <Link
            href="/"
            className="w-fit flex px-5 py-1.5 shadow bg-white text-blue-600 cursor-pointer rounded-xl text-xl font-semibold hover:bg-gray-100 transition-all"
          >
            Connectez-vous gratuitement
          </Link>
        </section>

        {/* Footer (Injecté via le layout global normalement) */}
      </main>
    </>
  );
};

export default LandingPage;
