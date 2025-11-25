import { motion } from "framer-motion";

const VideoPresentationSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="p-8 rounded-lg transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <h1 className="text-2xl font-bold text-[#9f9911] mb-6">Stockage et garde-meuble en libre-service | Box-Services</h1>
            <p className="text-gray-600 mb-4 leading-relaxed transition-all hover:text-gray-800">
              Tout le monde a besoin d'un box de stockage au moins une fois dans sa vie. 
              Notre solution de stockage sécurisé est idéale pour particuliers et professionnels.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed transition-all hover:text-gray-800">
              <span className="font-semibold text-[#dfd750]">Box-Services.eu</span> est le leader national avec plus de <span className="font-semibold text-[#dfd750]">15 000 boxes de stockage sécurisés</span> disponibles dans toute la France.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed transition-all hover:text-gray-800">
              Forts de notre expérience de <span className="font-semibold text-[#dfd750]">15 ans</span> dans le garde-meuble en libre-service, nous vous proposons des solutions de stockage adaptées à tous vos besoins.
            </p>
            <p className="text-gray-600 leading-relaxed transition-all hover:text-gray-800">
              <span className="font-semibold text-[#9f9911] animate-bounce">Solution 100% digitale sans papier.</span> Avec <span className="font-semibold text-[#dfd750]">Box-Services.eu</span>, louez et accédez à votre box de stockage en <span className="font-semibold text-[#dfd750]">2 minutes</span>, 24h/24 et 7j/7. La plupart de nos boxes sont accessibles en voiture pour un chargement et déchargement facilité.
            </p>
          </motion.div>

          <motion.div
            className="p-8 rounded-lg transition-all duration-500"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <video
              className="w-full h-auto rounded-lg transform transition-transform duration-500 hover:scale-105"
              autoPlay
              muted
              loop
              playsInline
              title="Démonstration de nos services de stockage Box-Services"
              aria-label="Vidéo présentant nos boxes de stockage sécurisés"
            >
              <source src="/assets/vedio/ads.mp4" type="video/mp4" />
              <meta itemProp="description" content="Découvrez nos solutions de stockage sécurisé en vidéo" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoPresentationSection;