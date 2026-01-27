import React from 'react'
import Link from 'next/link'
import Image from 'next/image'  
import NavBar from '@/components/NavBar'

export default function Page() {
  return (
    <div>

      <div className="pricing-page py-16 px-4">
        <div className="max-w-6xl mx-auto">
        
          <header className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Tarifs simples et transparents</h1>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">Choisissez la formule adaptée à vos besoins. Aucun engagement, résiliable à tout moment.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-center">
            
              <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col transition-transform hover:scale-105">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Étudiant Gratuit</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-6">0F CFA <span className="text-base font-normal text-gray-400">/mois</span></div>
                  <a href="#" className="block w-full py-3 px-4 mb-6 text-center font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Accès gratuit</a>
                  <ul className="space-y-4 flex-grow text-sm">
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Consultation illimitée du profil</li>
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Forces et faiblesses</li>
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Graphiques d'évolution</li>
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Appréciations enseignants</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 flex flex-col relative md:scale-110 shadow-xl z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    ★ Populaire
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Accompagnement</h3>
                <div className="text-2xl font-bold text-blue-600 mb-6">25.000F CFA <span className="text-base font-normal text-gray-400">/mois</span></div>
                <a href="#" className="block w-full py-3 px-4 mb-6 text-center font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-colors">Commencer l'essai</a>
                <ul className="space-y-4 flex-grow text-sm">
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-3">✓</span> Plans d'action personnalisés</li>
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-3">✓</span> Suivi hebdomadaire</li>
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-3">✓</span> Conseils adaptés</li>
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-3">✓</span> Support prioritaire</li>
                </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col transition-transform hover:scale-105">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Établissement</h3>
                <div className="text-2xl font-bold text-blue-600 mb-6">Sur mesure</div>
                <a href="#" className="block w-full py-3 px-4 mb-6 text-center font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Nous contacter</a>
                <ul className="space-y-4 flex-grow text-sm">
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Gestion illimitée</li>
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Analyses prédictives</li>
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Export de données</li>
                    <li className="flex items-start"><span className="text-green-500 font-bold mr-3">✓</span> Support dédié</li>
                </ul>
            </div>
          </section>

          <section className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 mb-16 shadow-sm">
            <h3 className="text-2xl font-bold text-center mb-8">Tarification établissement</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-gray-50 p-6 rounded-xl">
                    <strong className="block text-gray-700 mb-1">Petit</strong>
                    <div className="text-blue-600 font-bold text-xl mb-1">149€/mois</div>
                    <small className="text-gray-400">Max 100 profils</small>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                    <strong className="block text-gray-700 mb-1">Moyen</strong>
                    <div className="text-blue-600 font-bold text-xl mb-1">299€/mois</div>
                    <small className="text-gray-400">Max 500 profils</small>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                    <strong className="block text-gray-700 mb-1">Grand</strong>
                    <div className="text-blue-600 font-bold text-xl mb-1">Sur devis</div>
                    <small className="text-gray-400">+500 profils</small>
                </div>
            </div>
          </section>

          <section className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>
            <div className="space-y-2">
                <div className="border-b border-gray-200 py-6">
                    <h4 className="text-lg font-semibold mb-2">Comment fonctionne l'essai gratuit ?</h4>
                    <p className="text-gray-500 leading-relaxed">Les établissements bénéficient de 30 jours d'essai gratuit avec accès complet. Aucune carte bancaire requise.</p>
                </div>
                <div className="border-b border-gray-200 py-6">
                    <h4 className="text-lg font-semibold mb-2">Puis-je résilier à tout moment ?</h4>
                    <p className="text-gray-500 leading-relaxed">Oui, tous nos abonnements sont sans engagement. La résiliation est possible en un clic.</p>
                </div>
                <div className="border-b border-gray-200 py-6">
                    <h4 className="text-lg font-semibold mb-2">Les données sont-elles sécurisées ?</h4>
                    <p className="text-gray-500 leading-relaxed">Absolument. Les données sont chiffrées et conformes au RGPD pour protéger la vie privée des étudiants.</p>
                </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
