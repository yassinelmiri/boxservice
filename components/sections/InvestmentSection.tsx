import Link from 'next/link';
import { ArrowRight, Star, TrendingUp, Shield, RefreshCw } from 'lucide-react';

const InvestmentSection = () => {
  return (
    <section 
      aria-labelledby="investment-heading"
      className="py-16 bg-gradient-to-b from-gray-50 to-white"
      itemScope
      itemType="https://schema.org/InvestmentOrDeposit"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="investment-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" itemProp="name">
            Investissez dans une solution <span className="text-[#9f9911]">rentable et sécurisée</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" itemProp="description">
            Découvrez notre concept de location de containers avec des rendements jusqu'à 20% par an
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Carte Rentabilité */}
          <div 
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/InvestmentFund"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#f3f1cc] p-3 rounded-full mr-4" aria-hidden="true">
                <TrendingUp className="w-6 h-6 text-[#9f9911]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900" itemProp="name">Rentabilité élevée</h3>
            </div>
            <p className="text-gray-600 mb-4" itemProp="description">
              Jusqu'à 780€/mois de revenus passifs avec un retour sur investissement en 2-3 ans.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center" itemProp="performance">
                <Star className="w-4 h-4 text-[#9f9911] mr-2" aria-hidden="true" />
                <span>Rentabilité moyenne: <span itemProp="annualPercentageRate">20%</span>/an</span>
              </li>
              <li className="flex items-center" itemProp="occupancyRate">
                <Star className="w-4 h-4 text-[#9f9911] mr-2" aria-hidden="true" />
                <span>Taux d'occupation: 95%</span>
              </li>
            </ul>
            <meta itemProp="investmentType" content="Real Estate Investment" />
          </div>

          {/* Carte Sécurité */}
          <div 
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/Security"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#f3f1cc] p-3 rounded-full mr-4" aria-hidden="true">
                <Shield className="w-6 h-6 text-[#9f9911]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900" itemProp="name">Sécurité totale</h3>
            </div>
            <p className="text-gray-600 mb-4" itemProp="description">
              Investissez en toute sérénité avec nos garanties et notre accompagnement complet.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center" itemProp="guarantee">
                <Star className="w-4 h-4 text-[#9f9911] mr-2" aria-hidden="true" />
                <span>Garantie de rachat à vie</span>
              </li>
              <li className="flex items-center" itemProp="securityFeature">
                <Star className="w-4 h-4 text-[#9f9911] mr-2" aria-hidden="true" />
                <span>Sites sécurisés 24/7 avec surveillance vidéo</span>
              </li>
            </ul>
          </div>

          {/* Carte Flexibilité */}
          <div 
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/InvestmentFund"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#f3f1cc] p-3 rounded-full mr-4" aria-hidden="true">
                <RefreshCw className="w-6 h-6 text-[#9f9911]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900" itemProp="name">Flexibilité</h3>
            </div>
            <p className="text-gray-600 mb-4" itemProp="description">
              Plusieurs options adaptées à votre budget et à vos objectifs d'investissement.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center" itemProp="amount">
                <Star className="w-4 h-4 text-[#9f9911] mr-2" aria-hidden="true" />
                <span>Investissement à partir de <span itemProp="minimumInvestment">3 000€</span></span>
              </li>
              <li className="flex items-center" itemProp="service">
                <Star className="w-4 h-4 text-[#9f9911] mr-2" aria-hidden="true" />
                <span>Gestion locative professionnelle incluse</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/investisser" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#9f9911] to-[#dfd750] text-black font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            aria-label="Découvrir nos solutions d'investissement en containers de stockage"
            itemProp="url"
          >
            Découvrir nos solutions d'investissement
            <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
          </Link>
        </div>

        {/* Contenu caché pour le SEO */}
        <div className="sr-only" aria-hidden="true">
          <h3>Investissement dans des containers de stockage - Avantages clés</h3>
          <p>
            Notre solution d'investissement dans des containers de stockage offre une alternative 
            rentable et sécurisée aux placements traditionnels. Avec des rendements attractifs et 
            une gestion simplifiée, c'est l'option idéale pour diversifier votre patrimoine.
          </p>
          <h4>Pourquoi investir avec nous ?</h4>
          <ul>
            <li>Rendements supérieurs aux placements bancaires classiques</li>
            <li>Investissement tangible dans des actifs réels</li>
            <li>Gestion entièrement prise en charge</li>
            <li>Contrats clairs et transparents</li>
            <li>Accompagnement personnalisé</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;