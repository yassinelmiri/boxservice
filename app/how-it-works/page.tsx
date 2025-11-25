'use client';

import HowItWorks from "../../components/HowItWorks";
import {

  Calendar,
  Package,
  CreditCard,
  Key,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface DetailedStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

const HowItWorksPage = () => {
  const faqs: FAQItem[] = [
    {
      question: "Comment fonctionne la réservation en ligne ?",
      answer:
        "La réservation se fait entièrement en ligne. Vous sélectionnez la taille de box qui vous convient, la durée de location souhaitée, puis vous effectuez un paiement sécurisé. Vous recevrez ensuite par email votre code d'accès personnel ainsi que toutes les instructions nécessaires.",
    },
    {
      question: "Quels sont les horaires d'accès aux boxes ?",
      answer:
        "Nos centres de stockage sont accessibles 24h/24 et 7j/7, y compris les jours fériés. Vous pouvez accéder à votre box quand vous le souhaitez grâce à votre code personnel.",
    },
    {
      question: "Quelle est la durée minimale de location ?",
      answer:
        "Il n'y a pas de durée minimale de location. Vous pouvez louer un box pour une journée, une semaine, un mois ou plusieurs années selon vos besoins.",
    },
    {
      question: "Comment choisir la bonne taille de box ?",
      answer:
        "Nous proposons un calculateur d'espace sur notre site qui vous aidera à déterminer la taille idéale en fonction des objets que vous souhaitez stocker. Vous pouvez également nous contacter pour obtenir des conseils personnalisés.",
    },
    {
      question: "Les boxes sont-ils sécurisés ?",
      answer:
        "Oui, tous nos centres sont équipés de systèmes de vidéosurveillance 24h/24, d'alarmes et d'un système d'accès sécurisé par code personnel. Certains centres disposent également de gardiens sur place.",
    },
    {
      question: "Puis-je modifier ma réservation ?",
      answer:
        "Oui, vous pouvez modifier votre réservation à tout moment depuis votre espace client : changer de taille de box, prolonger ou raccourcir la durée de location.",
    },
  ];

  const detailedSteps: DetailedStep[] = [
    {
      icon: <Package size={48} className="text-[#9f9911]" />,
      title: "Choisissez la taille de votre box",
      description:
        "Utilisez notre calculateur d'espace ou parcourez nos différentes tailles de box pour trouver celle qui correspond le mieux à vos besoins de stockage.",
      details: [
        "Différentes tailles disponibles de 6m³ à 24m³ (3m² à 12m²)",
        "Options ventilés disponibles",
        "Hauteur sous plafond de 2m5",
      ],
    },
    {
      icon: <Calendar size={48} className="text-[#9f9911]" />,
      title: "Sélectionnez vos dates",
      description:
        "Choisissez la date de début de votre location ainsi que la durée estimée. Pas d'inquiétude, vous pourrez modifier ces dates ultérieurement si nécessaire.",
      details: [
        "Pas de durée minimale d'engagement",
        "Possibilité de prolonger à tout moment"
      ],
    },
    {
      icon: <CreditCard size={48} className="text-[#9f9911]" />,
      title: "Réservez en ligne",
      description:
        "Complétez votre réservation en quelques clics et effectuez un paiement sécurisé par carte bancaire ou prélèvement automatique.",
      details: [
        "Paiement 100% sécurisé",
        "Facturation mensuelle automatique",
        "Possibilité de résilier à tout moment",
      ],
    },
    {
      icon: <Key size={48} className="text-[#9f9911]" />,
      title: "Accédez à votre box",
      description:
        "Rendez-vous au centre de stockage à la date choisie, utilisez votre code d'accès personnel pour entrer et installez vos affaires dans votre box.",
      details: [
        "Accès 24h/24 et 7j/7",
        "Code d'accès personnel",
        "Zones de chargement/déchargement à proximité",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#9f9911] to-[#525008] text-white py-24 overflow-hidde">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-6 sm:text-5xl">
              Comment ça marche
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Découvrez notre processus simple et transparent pour stocker vos
              biens en toute sécurité
            </p>
          </div>
        </section>

        {/* How It Works Component */}
        <HowItWorks />

        {/* Detailed Process */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Le processus en détail
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Louer un espace de stockage n'a jamais été aussi simple
              </p>
            </div>

            <div className="space-y-16">
              {detailedSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                    } gap-12`}
                >
                  <div className="md:w-1/2 flex justify-center">
                    <div className="bg-[#f9f8e6] rounded-full p-8">
                      {step.icon}
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <svg
                              className="h-5 w-5 text-[#dfd750]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="ml-3 text-gray-600">{detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Questions fréquentes
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur notre service
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <HelpCircle size={20} className="text-[#dfd750]" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <p className="text-gray-600 mb-4">
                Vous avez d'autres questions ?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#9f9911] hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] transition-colors"
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#9f9911]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
                Prêt à commencer ?
              </h2>
              <p className="text-xl text-[#f3f1cc] max-w-2xl mx-auto mb-8">
                Trouvez un box de stockage près de chez vous et réservez en
                quelques minutes
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-[#9f9911] bg-white hover:bg-[#f9f8e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] transition-colors"
              >
                Trouver mon box maintenant
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;