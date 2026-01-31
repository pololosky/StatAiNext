export default function FooterPremium() {
    return (
        <div className="mt-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-md">
                {/*Texte*/}
                <div className="text-white">
                    <h3 className="text-lg font-semibold">Plan Etablissement Premium</h3>
                    <p className="text-blue-100 mt-1">Vous gérer actuellement 6 profil étudiants</p>
                </div>

                {/*Bouton*/}
                <button className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition">Gérer l&apos; abonnement</button>
            </div>
        </div>
    );

}