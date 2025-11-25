'use client';
import { useState } from "react";
import { motion } from "framer-motion";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className="bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
      onClick={toggleAnswer}
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900" itemProp="name">{question}</h3>
        <motion.span
          className="text-[#9f9911] text-2xl font-bold"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          {isOpen ? "-" : "+"}
        </motion.span>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <p className="text-gray-600 mt-4" itemProp="text">{answer}</p>
      </motion.div>
    </div>
  );
};

const FAQSection = () => {
  return (
    <section 
      className="py-20 bg-white" 
      id="faq"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Foire aux questions (FAQ)
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez des réponses aux questions les plus fréquemment posées sur nos solutions de stockage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <FAQItem
            question="Comment faire de la place chez moi ?"
            answer="Pour optimiser l'espace chez vous, commencez par trier vos affaires (à garder, donner, recycler ou jeter). Ensuite, nos boxes de stockage sécurisés (de 1m² à 30m²) vous permettent de ranger les objets saisonniers ou peu utilisés. Nous proposons des solutions accessibles 24h/24 avec des tarifs à partir de 50€/mois."
          />
          <FAQItem
            question="Où puis-je stocker mes affaires pendant un déménagement ?"
            answer="Nos centres de stockage sécurisés (surveillance vidéo 24/7) sont idéaux pour le stockage temporaire lors d'un déménagement. Avec des contrats flexibles (à partir d'1 mois) et des boxes de toutes tailles, nous adaptons notre solution à vos besoins spécifiques."
          />
          <FAQItem
            question="Comment choisir un bon garde-meuble ?"
            answer="Un bon garde-meuble doit offrir : 1) Sécurité renforcée (alarme, accès sécurisé), 2) Flexibilité (pas d'engagement long), 3) Accessibilité (horaires étendus), 4) Assurance incluse, et 5) Propreté des lieux. Nos centres répondent à tous ces critères avec en plus un rapport qualité-prix optimal."
          />
          <FAQItem
            question="Quel est le tarif d'un garde-meuble ?"
            answer="Nos tarifs démarrent à 50€/mois pour un box de 1m² (environ 10 cartons) et varient selon la taille (jusqu'à 300€/mois pour 30m²). Nous proposons des promotions fréquentes et des réductions pour engagements longs. Contactez-nous pour une estimation personnalisée."
          />
        </div>

        {/* Contenu caché pour le SEO */}
        <div className="sr-only" aria-hidden="true">
          <h3>Questions fréquentes sur le stockage</h3>
          <p>
            Retrouvez toutes les informations sur nos services de garde-meuble en libre-service :
            locations courtes ou longues durées, assurance des biens stockés, accessibilité
            des centres, et conseils pour optimiser votre espace de stockage.
          </p>
          <h4>Autres questions posées</h4>
          <ul>
            <li>Quels objets puis-je stocker ? (Tous sauf produits dangereux/périssables)</li>
            <li>Comment accéder à mon box ? (Badge personnel 24h/24)</li>
            <li>Puis-je changer de taille de box ? (Oui, selon disponibilité)</li>
            <li>Quelle est la durée minimale de location ? (1 mois)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;