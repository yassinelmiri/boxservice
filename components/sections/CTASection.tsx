import Link from "next/link";

const CTASection = () => {
  return (
    <section 
      aria-labelledby="cta-heading"
      className="py-16 bg-[#9f9911]"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 
            id="cta-heading" 
            className="text-3xl font-bold text-white sm:text-4xl mb-6"
            itemProp="name"
          >
            Prêt à trouver votre espace de stockage ?
          </h2>
          <p 
            className="text-xl text-[#f3f1cc] max-w-2xl mx-auto mb-8"
            itemProp="description"
          >
            Réservez en ligne et accédez à votre box en quelques minutes
          </p>
          <Link
            href="/recherche"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-[#9f9911] bg-white hover:bg-[#f9f8e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] transition-colors"
            aria-label="Trouver un espace de stockage disponible maintenant"
            itemProp="potentialAction" itemScope itemType="https://schema.org/SearchAction"
          >
            Trouver mon box maintenant
          </Link>
        </div>

        {/* Contenu caché pour le SEO */}
        <div className="sr-only" aria-hidden="true">
          <h3>Réservation rapide d'espace de stockage</h3>
          <p>
            Notre plateforme vous permet de trouver et réserver un espace de stockage sécurisé 
            en seulement quelques clics. Disponible 24h/24 pour répondre à tous vos besoins 
            de stockage en France.
          </p>
          <ul>
            <li>Réservation instantanée en ligne</li>
            <li>Accès immédiat après paiement</li>
            <li>Pas de frais cachés</li>
            <li>Assurance incluse</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CTASection;