'use client';

import { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  name: string;
  size: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  features: string[];
}

interface AdditionalService {
  name: string;
  price: number | string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const Pricing = () => {
  const [duration, setDuration] = useState<"monthly" | "annually">("monthly");

  const pricingPlans: PricingPlan[] = [
    {
      name: "Box S",
      size: "1–3 m² (2.5–7.5 m³)",
      description: "Idéal pour stocker des cartons, valises et petits meubles",
      monthlyPrice: 39,
      annualPrice: 35,
      features: [
        "Accès 24h/24 et 7j/7",
        "Vidéosurveillance",
        "Cadenas sécurisé fourni",
        "Contrat sans engagement",
        "Assurance de base incluse",
      ],
    },
    {
      name: "Box M",
      size: "4–7 m² (10–17.5 m³)",
      description: "Parfait pour le contenu d'un studio ou les meubles d'une pièce",
      monthlyPrice: 79,
      annualPrice: 69,
      popular: true,
      features: [
        "Accès 24h/24 et 7j/7",
        "Vidéosurveillance",
        "Cadenas sécurisé fourni",
        "Contrat sans engagement",
        "Assurance de base incluse",
        "Chariot de transport disponible",
      ],
    },
    {
      name: "Box L",
      size: "8–12 m² (20–30 m³)",
      description: "Adapté pour le contenu d'un appartement 2 pièces",
      monthlyPrice: 129,
      annualPrice: 115,
      features: [
        "Accès 24h/24 et 7j/7",
        "Vidéosurveillance",
        "Cadenas sécurisé fourni",
        "Contrat sans engagement",
        "Assurance de base incluse",
        "Chariot de transport disponible",
        "Accès véhicule proche du box",
      ],
    },
    {
      name: "Box XL",
      size: "15+ m² (37.5+ m³)",
      description: "Idéal pour le contenu d'un appartement 3-4 pièces ou plus",
      monthlyPrice: 189,
      annualPrice: 169,
      features: [
        "Accès 24h/24 et 7j/7",
        "Vidéosurveillance",
        "Cadenas sécurisé fourni",
        "Contrat sans engagement",
        "Assurance premium incluse",
        "Chariot de transport disponible",
        "Accès véhicule au pied du box",
        "Assistance déménagement disponible",
      ],
    },
  ];

  const additionalServices: AdditionalService[] = [
    {
      name: "Assurance Premium",
      price: 9.9,
      description: "Couverture complète jusqu'à 50 000€ contre vol, dégâts des eaux, incendie",
    },
    {
      name: "Cadenas haute sécurité",
      price: 19.9,
      description: "Cadenas renforcé avec 3 clés et protection anti-cisaillement",
    },
    {
      name: "Matériel d'emballage",
      price: 49.9,
      description: "Kit complet avec 20 cartons, ruban adhésif, film bulle et marqueurs",
    },
    {
      name: "Transport",
      price: "59,9",
      description: "Service professionnel pour transporter vos affaires jusqu'à votre box",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "Y a-t-il une durée minimale de location ?",
      answer: "Non, il n'y a pas de durée minimale de location. Vous pouvez louer un box pour aussi peu qu'un mois, ou aussi longtemps que vous en avez besoin.",
    },
    {
      question: "Comment fonctionne le paiement ?",
      answer: "Le paiement s'effectue mensuellement par prélèvement automatique ou carte bancaire. Pour les engagements annuels, vous bénéficiez d'un tarif préférentiel.",
    },
    {
      question: "Puis-je changer de taille de box en cours de location ?",
      answer: "Oui, vous pouvez passer à un box plus petit ou plus grand à tout moment, sous réserve de disponibilité. Le tarif sera ajusté en conséquence.",
    },
    {
      question: "L'assurance est-elle obligatoire ?",
      answer: "Une assurance de base est incluse dans tous nos tarifs. Vous pouvez opter pour une assurance premium qui offre une couverture plus complète.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#9f9911] to-[#525008] text-white py-24 overflow-hidde">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-6 sm:text-5xl">Nos Tarifs</h1>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Des solutions de stockage adaptées à tous les besoins et tous les
              budgets
            </p>
          </div>
        </section>

        {/* Pricing Toggle Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-12">
              <div className="relative bg-gray-100 rounded-full p-1 flex">

              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg overflow-hidden shadow-lg border ${plan.popular ? "border-[#dfd750]" : "border-gray-200"
                    } transition-transform duration-300 hover:scale-105`}
                >
                  {plan.popular && (
                    <div className="bg-[#dfd750] text-white text-center text-sm font-semibold py-1">
                      Le plus populaire
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{plan.size}</p>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {duration === "monthly"
                          ? plan.monthlyPrice
                          : plan.annualPrice}
                        €
                      </span>
                      <span className="text-gray-500 text-sm">/mois</span>
                      {duration === "annually" && (
                        <div className="text-green-500 text-sm font-medium mt-1">
                          Économisez {(plan.monthlyPrice - plan.annualPrice) * 12}€ par an
                        </div>
                      )}
                    </div>
                    <Link
                      href="/"
                      className={`block w-full text-center py-3 px-4 rounded-lg ${plan.popular
                        ? "bg-[#9f9911] hover:bg-[#6e6a0c] text-white"
                        : "bg-[#f3f1cc] hover:bg-[#e6e297] text-[#9f9911]"
                        } transition-colors duration-300 font-medium`}
                    >
                      Réserver maintenant
                    </Link>
                  </div>
                  <div className="bg-gray-50 px-6 py-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Ce qui est inclus :
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check
                            size={18}
                            className="text-green-500 mr-2 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Services additionnels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 flex"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description}
                    </p>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-xl font-bold text-gray-900">
                      à partir de {service.price}€
                    </div>
                    {typeof service.price === "number" && (
                      <div className="text-sm text-gray-500">par mois</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Questions fréquentes
            </h2>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <HelpCircle size={20} className="text-[#dfd750]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#9f9911]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
                Prêt à stocker vos affaires ?
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

export default Pricing;