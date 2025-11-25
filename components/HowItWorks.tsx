'use client';

import { motion } from "framer-motion";
import { Search, Calendar, CreditCard, Key } from "lucide-react";
import Link from "next/link";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      icon: <Search size={36} className="text-[#9f9911]" />,
      title: "Trouvez",
      description:
        "Trouvez un box de stockage près de chez vous en entrant votre ville ou code postal.",
    },
    {
      icon: <Calendar size={36} className="text-[#9f9911]" />,
      title: "Réservez",
      description:
        "Réservez votre espace en ligne en quelques clics. Choisissez la taille et la durée.",
    },
    {
      icon: <CreditCard size={36} className="text-[#9f9911]" />,
      title: "Payez",
      description:
        "Payez en ligne de manière sécurisée. Pas de frais cachés, tout est transparent.",
    },
    {
      icon: <Key size={36} className="text-[#9f9911]" />,
      title: "Accédez",
      description:
        "Accédez à votre espace 24h/24 et 7j/7 avec votre code personnel.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Louer un espace de stockage n'a jamais été aussi simple
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 text-center relative hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-md">
                {step.icon}
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 hidden lg:block">
                {index < steps.length - 1 && (
                  <div className="w-8 h-1 bg-[#e6e297] rounded"></div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/how-it-works"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#9f9911] hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] transition-colors"
            >
              En savoir plus
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;