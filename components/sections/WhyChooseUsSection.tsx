import { Shield, TrendingUp, Truck } from "lucide-react";

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Pourquoi choisir Box Service ?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Nous offrons bien plus qu'un simple espace de stockage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="bg-[#f3f1cc] rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
              <Shield className="text-[#9f9911]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Sécurité maximale
            </h3>
            <p className="text-gray-600">
              Vidéosurveillance 24/7, alarmes, gardiens sur site. Vos biens
              sont protégés en permanence.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="bg-[#f3f1cc] rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
              <TrendingUp className="text-[#9f9911]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Flexibilité totale
            </h3>
            <p className="text-gray-600">
              Pas d'engagement de durée, possibilité de changer de taille de
              box selon vos besoins.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="bg-[#f3f1cc] rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
              <Truck className="text-[#9f9911]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Accès pratique
            </h3>
            <p className="text-gray-600">
              Accès 24h/24 et 7j/7 à votre box, zones de
              chargement/déchargement faciles d'accès.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;