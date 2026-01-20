'use client';

import { motion, Variants } from "framer-motion";

const ConditionsGenerales = () => {
  // Configuration des animations avec typage correct
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] // Utilisez un array au lieu d'un string
      }
    }
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <motion.section
        className="relative py-20 bg-gradient-to-r from-[#9f9911] to-[#525008] text-white shadow-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl px-6 mx-auto text-center">
          <motion.h1 
            className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl"
            variants={itemVariants}
          >
            CONDITIONS GÉNÉRALES
          </motion.h1>
          <motion.p 
            className="text-xl font-medium"
            variants={itemVariants}
          >
            Contrat de mise à disposition d'un box
          </motion.p>
        </div>
      </motion.section>

      {/* Contenu */}
      <motion.section 
        className="py-16 bg-white"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl px-6 mx-auto prose prose-lg sm:px-8 lg:prose-xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Titre principal */}
            <motion.h2 
              className="text-2xl font-bold text-center text-gray-800 md:text-3xl" 
              variants={itemVariants}
            >
              Conditions générales du contrat de mise à disposition d'un box
            </motion.h2>
            <motion.p className="text-center text-gray-600" variants={itemVariants}>
            </motion.p>

            {/* Article 1 */}
            <motion.div className="mt-12 mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                1 - OBJET ET DÉFINITIONS
              </h3>
              <p className="mb-4 text-gray-600">
                Les présentes conditions générales s'appliquent à tout contrat de mise à disposition d'un espace de stockage, ci-après dénommé « le Box », entre toute société d'exploitation appartenant au réseau box-services.com, ci-après dénommée « la Société », et d'autre part l'utilisateur de cet espace, ci-après dénommé « le Client ».
              </p>
              <p className="text-gray-600">
                Le présent contrat est exclu du champ d'application des baux commerciaux codifié aux articles L.145-1 et suivants du code de commerce. Il ne crée à la charge de la Société aucune obligation de garde, de surveillance ou d'entretien des biens entreposés ou stockés par le Client dans le Box qui le sont sous sa seule responsabilité et hors la vue de la Société. Le Contrat n'est pas un contrat de dépôt au sens des articles 1921 et suivants du Code civil, le Client reste le seul dégostiaire et gardien de ses biens entreposés.
              </p>
            </motion.div>

            {/* Article 2 */}
            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                2 - CONDITIONS D'UTILISATION ET D'OCCUPATION DU BOX
              </h3>
              
              <p className="mb-2 font-semibold text-gray-700">2.1. Usage du Box</p>
              <p className="mb-4 text-gray-600">
                Le Box est affecté à un usage exclusif et personnel de stockage et d'entreposage de biens autorisés. En aucun cas le Client ne peut utiliser le Box à d'autres fins, sous peine de responsabilité seule et entière du Client.
              </p>
              
              <p className="mb-2 font-semibold text-gray-700">2.2. État du Box</p>
              <p className="mb-4 text-gray-600">
                Le Client reconnaît avoir pris possession du Box en bon état, vide de tout bien et en état de propreté satisfaisant.
              </p>

              <p className="mb-2 font-semibold text-gray-700">2.3. Sécurité</p>
              <p className="mb-4 text-gray-600">
                Le Client reconnaît avoir sous sa responsabilité la clé, le système de fermeture du box ainsi que son code d'accès au Box. Le Client a l'obligation d'utiliser exclusivement le système de fermeture fourni lors de la prise de possession du box. En cas de perte de la clé, le Client a la possibilité de passer commande d'un double à ses frais via l'espace client ou d'obtenir l'autorisation expresse de faire intervenir un serrurier à ses frais pour forcer l'ouverture du Box (obligation est alors faite de demander la fourniture d'un nouveau système de fermeture au gestionnaire du parc à ses frais).
              </p>

              <p className="mb-2 font-semibold text-gray-700">2.4. Responsabilité</p>
              <p className="mb-4 text-gray-600">
                Le Client est le seul responsable de l'ouverture et de la fermeture de son Box. Le Box doit obligatoirement rester fermé et verrouillé en cas d'absence physique du Client sur l'emplacement hébergeant le Box du Client ainsi que les autres espaces de stockage de la Société, ci-après dénommé « le Site ». Dans le cas où le Box serait resté ouvert, la Société ne saurait être tenue pour responsable des pertes, des vols ou des dégradations des biens du Client à l'intérieur du Box. La Société se réserve le droit de fermer et de verrouiller par tout moyen le Box du Client resté ouvert.
              </p>

              <p className="mb-2 font-semibold text-gray-700">2.5. Interdictions</p>
              <p className="mb-2 text-gray-600">Il est formellement interdit pour le Client :</p>
              <ul className="pl-5 mb-4 list-disc text-gray-600">
                <li className="mb-1">de changer le système de fermeture du box fourni lors de la prise de possession</li>
                <li className="mb-1">d'effectuer des aménagements à l'intérieur ou à l'extérieur du Box</li>
                <li className="mb-1">d'entreposer des biens à l'extérieur du Box, sous ou sur celui-ci</li>
                <li className="mb-1">d'effectuer des modifications sur le Site</li>
                <li className="mb-1">d'entreposer des biens sur le Site</li>
                <li className="mb-1">de faire adresser du courrier à l'adresse du Box</li>
                <li className="mb-1">d'utiliser le Box comme résidence principale ou secondaire, comme bureau ou à des fins de réception des Clients</li>
                <li className="mb-1">de domicilier une société à l'adresse du Box</li>
                <li className="mb-1">d'établir un siège social ou un établissement à l'adresse du Box</li>
                <li className="mb-1">de fumer dans le Box et dans l'enceinte du Site</li>
                <li>de mettre à disposition d'un tiers toute ou partie de son Box que ce soit à titre gracieux ou non</li>
              </ul>
            </motion.div>

            {/* Article 3 */}
            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                3 - CONDITIONS D'ACCÈS AU SITE ET RÈGLES APPLICABLES AUX VÉHICULES
              </h3>
              
              <p className="mb-2 text-gray-600">
                <span className="font-semibold">3.1.</span> A la signature du Contrat, un code permettant l'accès au Site est transmis au Client. Ce code ne doit en aucun cas être communiqué à des tiers, sous peine de résiliation du Contrat. Ce code peut faire l'objet d'un suivi informatisé à chacune de ses utilisations pour les entrées et sorties sur le Site. Outre les dispositions du paragraphe 2.8 la Société peut à n'importe quel moment désactiver le code fourni au Client en cas de non-respect des clauses du présent Contrat (dégradations du Box ou du Site, incidents de paiement, ouverture de l'accès au Site à des tiers non autorisés, etc.).
              </p>
              
              <p className="mb-2 text-gray-600">
                <span className="font-semibold">3.2.</span> La vitesse maximale autorisée au sein du Site est de 15 km/h. Les règles du code de la route s'appliquent sur le Site.
              </p>
            </motion.div>

            {/* Articles suivants... */}
            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                4 - BIENS INTERDITS
              </h3>
              <p className="mb-4 text-gray-600">
                Il est formellement interdit d'entreposer dans le Box tout objet ou substance illicite, dangereuse, inflammable, explosive, toxique, radioactive, périssable, vivante ou toute autre matière dont l'entreposage serait contraire à la réglementation en vigueur ou susceptible de causer des dommages aux biens ou aux personnes.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                5 - DURÉE DU CONTRAT
              </h3>
              <p className="mb-4 text-gray-600">
                Le présent contrat est conclu pour une durée déterminée ou indéterminée selon les termes spécifiés dans la convention particulière. En cas de contrat à durée déterminée, celui-ci est automatiquement reconduit par tacite reconduction pour des périodes identiques, sauf résiliation par l'une ou l'autre des parties selon les modalités prévues au contrat.
              </p>
            </motion.div>

            {/* Articles 6 à 14... */}
            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                6 - PRIX ET PAIEMENT
              </h3>
              <p className="mb-4 text-gray-600">
                Le prix de la mise à disposition du Box est fixé dans la convention particulière. Les modalités de paiement sont précisées dans le contrat. Tout retard de paiement pourra entraîner la suspension de l'accès au Box et/ou la résiliation du contrat.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                7 - ASSURANCE
              </h3>
              <p className="mb-4 text-gray-600">
                Le Client est tenu de souscrire une assurance couvrant les biens entreposés dans le Box contre tous les risques. La Société décline toute responsabilité en cas de vol, dégradation ou destruction des biens entreposés.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                8 - RESPONSABILITÉ
              </h3>
              <p className="mb-4 text-gray-600">
                La Société ne saurait être tenue responsable des dommages directs ou indirects subis par le Client ou ses biens, sauf en cas de faute lourde ou intentionnelle de sa part. Le Client est seul responsable des dommages causés au Box, au Site ou aux biens d'autrui.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                9 - RÉSILIATION
              </h3>
              <p className="mb-4 text-gray-600">
                Chaque partie peut résilier le contrat selon les modalités prévues dans la convention particulière. En cas de manquement grave aux obligations contractuelles, la résiliation pourra être prononcée sans préavis.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                10 - RESTITUTION DU BOX
              </h3>
              <p className="mb-4 text-gray-600">
                À l'expiration du contrat, le Client doit libérer le Box en le laissant dans l'état où il l'a trouvé. Tout bien restant dans le Box après la date de libération pourra être considéré comme abandonné et pourra être détruit ou vendu aux frais du Client.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                11 - DONNÉES PERSONNELLES
              </h3>
              <p className="mb-4 text-gray-600">
                Les données personnelles du Client sont traitées conformément à la politique de confidentialité de la Société et à la réglementation applicable en matière de protection des données.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                12 - LITIGES
              </h3>
              <p className="mb-4 text-gray-600">
                Tout litige relatif au présent contrat sera soumis à la compétence des tribunaux du lieu du siège social de la Société.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                13 - DROIT APPLICABLE
              </h3>
              <p className="mb-4 text-gray-600">
                Le présent contrat est régi par le droit français.
              </p>
            </motion.div>

            <motion.div className="mb-12" variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                14 - MODIFICATION DU CONTRAT
              </h3>
              <p className="mb-4 text-gray-600">
                La Société se réserve le droit de modifier les présentes conditions générales. Les modifications seront notifiées au Client et s'appliqueront à compter de leur entrée en vigueur.
              </p>
            </motion.div>

            {/* Article 15 */}
            <motion.div variants={itemVariants}>
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2 border-gray-200 md:text-2xl">
                15 - DIVERS
              </h3>
              
              <p className="mb-2 font-semibold text-gray-700">15.1. Surfaces</p>
              <p className="mb-4 text-gray-600">
                Les surfaces de box annoncées dans les contrats et les vitrines web sont réputées non contractuelles dans la mesure où les tailles et volumes peuvent varier en fonction des lots de fabrication.
              </p>
              
              <p className="mb-2 font-semibold text-gray-700">15.2. Liste noire</p>
              <p className="mb-4 text-gray-600">
                La Société a mis en place une liste noire ayant notamment pour objectif de lutter contre la fraude, les impayés et les incivilités sur un centre de stockage. En conséquence, la Société est responsable du respect des obligations posées par la réglementation applicable, comprenant notamment l'information des personnes concernées, l'exercice de leurs droits, et la mise en œuvre des mesures de sécurité adaptées. En cas de survenue d'un incident, le Client sera informé au préalable et par tout moyen du risque d'être ajouté à cette liste noire. Le Client aura dès lors 8 jours pour régulariser sa situation ou faire part de ses observations. La Société informera par tout moyen le Client dès son ajout dans la liste noire. La Société se réserve le droit de suspendre, de ne pas renouveler, ou de ne pas donner accès aux services proposés à tout Client inscrit en liste noire. Le Client a un droit à l'oubli et ne pourra être inscrit plus de 5 ans sur la liste noire de la Société.
              </p>

              <p className="mb-4 text-gray-600">
                15.8. En cas de réservation effectuée à distance (par internet ou par téléphone) par le Client agissant en qualité de consommateur ou de non-professionnel tels que définis par le Code de la Consommation, celui-ci dispose d'un délai légal d'une durée de quatorze (14) jours francs pour exercer son droit de rétractation et annuler sa commande sans frais ni pénalité. Les sommes versées par le Client lui seront intégralement remboursées sous un délai maximum de trente (30) jours à compter de la date à laquelle la Société aura été informée de la rétractation du Client. Le délai d'exercice du droit de rétractation court dès le lendemain du jour de la réservation conclue à distance. Lorsque le délai expire un samedi, un dimanche ou un jour férié ou chômé, il est prorogé jusqu'au premier jour ouvrable suivant. Ce droit pourra être exercé à l'aide d'une demande via l'espace client. Il ne pourra toutefois pas être exercé dès lors que la prestation de la Société aura commencé à la demande expresse du Client, avant la fin du délai de rétractation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ConditionsGenerales;