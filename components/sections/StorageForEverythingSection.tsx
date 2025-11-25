import Image from "next/image";
import call_un from "../../public/assets/image/call1.png";
import call_deux from "../../public/assets/image/call2.png";

const StorageForEverythingSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-center">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#9f9911] mb-6">
              <span className="inline-block hover:text-[#6e6a0c] transition-colors duration-300">
                Solutions de stockage sécurisé pour particuliers et professionnels
              </span>
            </h1>
            <p className="text-gray-600 mb-4 leading-relaxed transition-all hover:text-gray-800">
              Que vous soyez particulier ou professionnel, nos boxes de stockage sécurisés accueillent mobilier, vaisselle, vêtements, livres, archives, stands commerciaux, matériel promotionnel et stocks de marchandises. Des petites affaires aux objets les plus encombrants !
            </p>
            <div>
              <h2 className="text-xl font-semibold text-[#9f9911] mb-4 inline-block border-b-2 border-[#e6e297] hover:border-[#ccc32d] transition-all duration-300">
                Stockage de biens personnels
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed transition-all hover:text-gray-800">
                Stockez l'intégralité du contenu de votre maison, garage ou cave dans nos boxes sécurisés. Gagnez de l'espace vital et retrouvez vos affaires facilement quand vous en avez besoin.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#9f9911] mb-4 inline-block border-b-2 border-[#e6e297] hover:border-[#ccc32d] transition-all duration-300">
                Stockage professionnel et commercial
              </h2>
              <p className="text-gray-600 leading-relaxed transition-all hover:text-gray-800">
                De nombreux artisans, commerçants et entreprises utilisent nos solutions de stockage comme extension de leur espace de travail. Idéal pour le matériel professionnel, les archives ou les stocks saisonniers.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
            <Image
              src={call_un}
              alt="Boxes de stockage sécurisés pour particuliers - rangement mobilier et effets personnels"
              className="w-full h-auto rounded-lg transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-center">
          <div className="p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
            <Image
              src={call_deux}
              alt="Espace de stockage professionnel - entrepôt sécurisé pour entreprises"
              className="w-full h-auto rounded-lg transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#9f9911] mb-6">
              <span className="inline-block hover:text-[#6e6a0c] transition-colors duration-300">
                Stockage flexible adapté à tous vos besoins
              </span>
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed transition-all hover:text-gray-800">
              Nos solutions de stockage s'adaptent à vos besoins, qu'il s'agisse de garde-meuble temporaire pendant un déménagement ou de stockage longue durée pour votre activité professionnelle.
            </p>
            <div>
              <h3 className="text-xl font-semibold text-[#9f9911] mb-4 inline-block border-b-2 border-[#e6e297] hover:border-[#ccc32d] transition-all duration-300">
                Accès facile et sécurisé
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed transition-all hover:text-gray-800">
                Tous nos boxes sont équipés de systèmes de sécurité avancés et accessibles 7j/7. Vous pouvez accéder à vos affaires quand vous le souhaitez, en toute tranquillité.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#9f9911] mb-4 inline-block border-b-2 border-[#e6e297] hover:border-[#ccc32d] transition-all duration-300">
                Différentes tailles disponibles
              </h3>
              <p className="text-gray-600 leading-relaxed transition-all hover:text-gray-800">
                Nous proposons une gamme complète de boxes de différentes tailles pour s'adapter parfaitement au volume de vos affaires, sans payer pour un espace inutilisé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorageForEverythingSection;