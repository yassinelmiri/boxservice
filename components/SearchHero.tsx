'use client';

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import image from "@/public/assets/image/image.png";
import Image from "next/image";

const SearchHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState("50");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const generateRandomRectangles = () => {
    const rectangles = [];
    const baseColors = [
      "rgb(255, 255, 255)",
      "rgb(200, 200, 255)",
      "rgb(150, 150, 255)",
    ];
    const fixedPositions = [
      { width: 80, height: 40, left: 10, top: 20, colorIdx: 0, rotate: 45 },
      { width: 60, height: 50, left: 30, top: 40, colorIdx: 1, rotate: 120 },
      { width: 90, height: 30, left: 70, top: 10, colorIdx: 2, rotate: 210 },
      { width: 50, height: 60, left: 20, top: 70, colorIdx: 0, rotate: 300 },
      { width: 70, height: 45, left: 60, top: 60, colorIdx: 1, rotate: 30 },
      { width: 85, height: 55, left: 40, top: 30, colorIdx: 2, rotate: 150 },
      { width: 65, height: 35, left: 80, top: 50, colorIdx: 0, rotate: 240 },
      { width: 75, height: 40, left: 50, top: 80, colorIdx: 1, rotate: 330 },
    ];

    for (let i = 0; i < fixedPositions.length; i++) {
      const pos = fixedPositions[i];
      const color = baseColors[pos.colorIdx];

      rectangles.push(
        <motion.div
          key={i}
          className="absolute rounded-lg"
          style={{
            width: `${pos.width}px`,
            height: `${pos.height}px`,
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            backgroundColor: color,
          }}
          initial={{
            opacity: 0,
            rotate: pos.rotate
          }}
          animate={isMounted ? {
            opacity: [0.2, 0.5, 0.2],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            rotate: [pos.rotate, pos.rotate + Math.random() * 360]
          } : {}}
          transition={{
            duration: isMounted ? Math.random() * 20 + 10 : 0,
            delay: isMounted ? Math.random() * 5 : 0,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      );
    }
    return rectangles;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}&radius=${radius}`);
    }else{
        router.push(`/search`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section aria-label="Recherche d'espaces de stockage" className="bg-gradient-to-r from-[#ccc32d] to-[#363504d0] text-white py-24 px-4 relative overflow-hidden">
      {/* Éléments d'arrière-plan animés */}
      <div className="absolute inset-0 overflow-hidden">
        {generateRandomRectangles()}
      </div>

      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "@/public/assets/images/storage-hero.jpg" }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-[#dfd750] to-white bg-clip-text text-transparent leading-tight"
            >
              Trouvez votre espace de stockage idéal en France
            </motion.h1>
            
            <motion.p
              className="text-xl max-w-2xl mx-auto md:mx-0 mb-8"
              variants={itemVariants}
            >
              Des milliers d'espaces de stockage sécurisés disponibles près de chez vous. 
              Comparez les prix et réservez en ligne en quelques clics.
            </motion.p>
            
            <motion.form
              onSubmit={handleSearch}
              className="bg-white rounded-lg p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl"
              variants={itemVariants}
              role="search"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                  <label htmlFor="search-location" className="sr-only">Rechercher par localisation</label>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <MapPin size={20} aria-hidden="true" />
                  </div>
                  <input
                    id="search-location"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ville, code postal, adresse..."
                    className="flex-1 p-4 text-gray-700 pl-10 border border-[#d9d262] rounded-lg w-full focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-300 hover:border-[#ccc32d]"
                    aria-required="true"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#9f9911] text-white px-8 py-4 rounded-lg hover:bg-[#6e6a0c] transition-colors duration-300 flex items-center justify-center font-semibold shadow-md hover:shadow-lg"
                  aria-label="Rechercher des espaces de stockage"
                >
                  <Search className="mr-2" size={20} aria-hidden="true" />
                  Rechercher
                </button>
              </div>
            </motion.form>
          </motion.div>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Image
              src={image}
              alt="Intérieur moderne d'un espace de stockage sécurisé avec des boxes de différentes tailles"
              className="rounded-lg"
              priority
              width={800}
              height={600}
              quality={85}
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
          variants={containerVariants}
          aria-label="Avantages de notre service"
        >
          {[
            { value: "100%", label: "Réservation en ligne sécurisée" },
            { value: "24/7", label: "Accès à votre box à toute heure" },
            { value: "Sécurisé", label: "Surveillance vidéo 24h/24" },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-64 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              role="region"
              aria-label={card.label}
            >
              <div className="text-3xl font-bold mb-2">{card.value}</div>
              <div>{card.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contenu caché pour le SEO */}
        <div className="sr-only" aria-hidden="true">
          <h2>Location d'espaces de stockage sécurisés en France</h2>
          <p>
            StockageFacile propose des solutions de stockage adaptées à tous vos besoins, 
            que ce soit pour un déménagement, un rangement saisonnier ou le stockage 
            professionnel. Nos espaces sont sécurisés, accessibles 24h/24 et disponibles 
            dans toute la France.
          </p>
          <h3>Pourquoi choisir nos espaces de stockage ?</h3>
          <ul>
            <li>Des boxes de toutes tailles, de 1m² à 30m²</li>
            <li>Climatisation et contrôle d'humidité</li>
            <li>Assurance incluse</li>
            <li>Pas d'engagement à long terme</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SearchHero;