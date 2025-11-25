import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import image from "../../public/assets/image/container.png";

const SizeGuideSection = () => {
  return (
    <section 
      aria-labelledby="size-guide-heading"
      className="py-20 bg-white"
      itemScope
      itemType="https://schema.org/HowTo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 id="size-guide-heading" className="text-3xl font-bold text-gray-900 sm:text-4xl" itemProp="name">
              Quelle taille de box vous convient ?
            </h2>
            <p className="mt-4 text-xl text-gray-600" itemProp="description">
Trouvez la taille idéale pour vos besoins de stockage. Que vous ayez
              besoin d'un petit espace pour quelques cartons ou d'un grand box pour
              vos meubles, nous avons la solution adaptée.
            </p>
            
            {/* Liste cachée pour le SEO */}
            <div className="sr-only" aria-hidden="true">
              <h3>Tailles disponibles pour vos besoins de stockage</h3>
              <ul>
                <li>Petit box (1m² - 3m²) : Idéal pour 10-20 cartons ou quelques meubles</li>
                <li>Box moyen (5m² - 10m²) : Parfait pour le contenu d'un studio ou un appartement 1 pièce</li>
                <li>Grand box (15m² - 30m²) : Adapté pour un déménagement complet de maison</li>
                <li>Box sur mesure : Solutions personnalisées pour les besoins spécifiques</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <Image
              src={image}
              alt="Comparaison des différentes tailles de boxes de stockage avec des exemples d'objets stockés"
              className="rounded-lg shadow-lg w-full h-auto"
              width={600}
              height={400}
              quality={85}
              itemProp="image"
            />
            <Link
              href="/storage-calculator"
              className="mt-6 inline-flex items-center px-6 py-3 border border-[#9f9911] text-base font-medium rounded-md text-[#9f9911] bg-white hover:bg-[#f9f8e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] transition-colors"
              aria-label="Utiliser notre calculateur d'espace de stockage pour trouver la taille idéale"
            >
              Calculer l'espace nécessaire
              <ChevronRight size={16} className="ml-2" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Contenu structuré caché pour le SEO */}
        <div className="sr-only" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
          <h3 itemProp="name">Comment choisir la bonne taille de box</h3>
          <div itemProp="text">
            <p>
              Notre guide vous aide à sélectionner la taille de box adaptée à vos besoins :
            </p>
            <ol>
              <li>Estimez le volume de vos affaires à stocker</li>
              <li>Consultez notre tableau de correspondance taille/objets</li>
              <li>Utilisez notre calculateur interactif</li>
              <li>Consultez nos conseillers pour une estimation personnalisée</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizeGuideSection;