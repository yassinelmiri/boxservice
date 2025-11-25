'use client';

import { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Check,
  Calculator,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Item {
  id: string;
  name: string;
  size: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
  items: Item[];
}

interface BoxSize {
  size: number;
  name: string;
  maxVolume: number;
  description: string;
}

const StorageCalculator = () => {
  const categories: Category[] = [
    {
      id: "furniture",
      name: "Mobilier",
      items: [
        { id: "sofa", name: "Canapé", size: 3, image: "🛋️" },
        { id: "chair", name: "Chaise", size: 0.5, image: "🪑" },
        { id: "table", name: "Table", size: 2, image: "🪑" },
        { id: "bed_single", name: "Lit simple", size: 2, image: "🛏️" },
        { id: "bed_double", name: "Lit double", size: 3, image: "🛏️" },
        { id: "wardrobe", name: "Armoire", size: 2.5, image: "🗄️" },
        { id: "dresser", name: "Commode", size: 1.5, image: "🗄️" },
        { id: "desk", name: "Bureau", size: 1.5, image: "🖥️" },
        { id: "bookshelf", name: "Bibliothèque", size: 1, image: "📚" },
      ],
    },
    {
      id: "appliances",
      name: "Électroménager",
      items: [
        { id: "refrigerator", name: "Réfrigérateur", size: 1.5, image: "❄️" },
        {
          id: "washing_machine",
          name: "Machine à laver",
          size: 1,
          image: "🧺",
        },
        { id: "dryer", name: "Sèche-linge", size: 1, image: "👕" },
        { id: "dishwasher", name: "Lave-vaisselle", size: 1, image: "🍽️" },
        { id: "microwave", name: "Micro-ondes", size: 0.3, image: "♨️" },
        { id: "oven", name: "Four", size: 0.5, image: "🔥" },
      ],
    },
    {
      id: "boxes",
      name: "Cartons et divers",
      items: [
        { id: "small_box", name: "Petit carton", size: 0.1, image: "📦" },
        { id: "medium_box", name: "Carton moyen", size: 0.2, image: "📦" },
        { id: "large_box", name: "Grand carton", size: 0.3, image: "📦" },
        { id: "suitcase", name: "Valise", size: 0.3, image: "🧳" },
        { id: "bike", name: "Vélo", size: 0.5, image: "🚲" },
        { id: "tv", name: "Télévision", size: 0.5, image: "📺" },
      ],
    },
  ];

  const boxSizes: BoxSize[] = [
    {
      size: 1,
      name: "Box S - 1m²",
      maxVolume: 3,
      description: "Idéal pour quelques cartons et petits objets",
    },
    {
      size: 3,
      name: "Box M - 3m²",
      maxVolume: 9,
      description: "Parfait pour le contenu d'une petite pièce",
    },
    {
      size: 5,
      name: "Box M+ - 5m²",
      maxVolume: 15,
      description: "Adapté pour le mobilier d'un studio",
    },
    {
      size: 9,
      name: "Box L - 9m²",
      maxVolume: 27,
      description: "Stockage d'un appartement 2 pièces",
    },
    {
      size: 12,
      name: "Box L+ - 12m²",
      maxVolume: 36,
      description: "Contenu d'un appartement 2-3 pièces",
    },
    {
      size: 15,
      name: "Box XL - 15m²",
      maxVolume: 45,
      description: "Parfait pour un 3 pièces complet",
    },
    {
      size: 20,
      name: "Box XXL - 20m²",
      maxVolume: 60,
      description: "Pour le contenu d'une maison",
    },
  ];

  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [totalVolume, setTotalVolume] = useState(0);
  const [recommendedBox, setRecommendedBox] = useState<BoxSize | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  useEffect(() => {
    let newTotalVolume = 0;
    Object.entries(selectedItems).forEach(([itemId, count]) => {
      const category = categories.find((cat) =>
        cat.items.some((item) => item.id === itemId)
      );
      if (category) {
        const item = category.items.find((item) => item.id === itemId);
        if (item) {
          newTotalVolume += item.size * count;
        }
      }
    });

    setTotalVolume(newTotalVolume);

    const newRecommendedBox =
      boxSizes.find((box) => box.maxVolume >= newTotalVolume) ||
      boxSizes[boxSizes.length - 1];
    setRecommendedBox(newRecommendedBox);
  }, [selectedItems]);

  const handleAddItem = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    if (!selectedItems[itemId] || selectedItems[itemId] <= 0) return;

    setSelectedItems((prev) => {
      const newItems = { ...prev };
      newItems[itemId] -= 1;

      if (newItems[itemId] === 0) {
        delete newItems[itemId];
      }

      return newItems;
    });
  };

  const handleChangeCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleReset = () => {
    setSelectedItems({});
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-[#9f9911] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Calculator size={48} className="mx-auto mb-6 text-[#e6e297]" />
            <h1 className="text-4xl font-bold mb-6">
              Calculateur d'espace de stockage
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Déterminez facilement la taille de box dont vous avez besoin en
              sélectionnant les objets que vous souhaitez stocker.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sélectionnez vos objets
                </h2>
                <p className="text-gray-600">
                  Ajoutez tous les objets que vous souhaitez stocker pour
                  obtenir une estimation de l'espace nécessaire.
                </p>
              </div>

              <div className="p-6">
                {/* Category Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex -mb-px space-x-8 overflow-x-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === category.id
                          ? "border-[#dfd750] text-[#9f9911]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        onClick={() => handleChangeCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Item Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {categories
                    .find((cat) => cat.id === activeCategory)
                    ?.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-2xl">{item.image}</span>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {item.size} m³
                          </div>
                        </div>
                        <div className="mb-3">
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 rounded-full border border-gray-300 text-gray-400 hover:text-gray-500 hover:border-gray-400 focus:outline-none"
                              disabled={!selectedItems[item.id]}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="mx-2 min-w-[20px] text-center">
                              {selectedItems[item.id] || 0}
                            </span>
                            <button
                              onClick={() => handleAddItem(item.id)}
                              className="p-1 rounded-full border border-gray-300 text-gray-400 hover:text-gray-500 hover:border-gray-400 focus:outline-none"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedItems[item.id]
                              ? `${(
                                item.size * (selectedItems[item.id] || 0)
                              ).toPrecision(2)} m³`
                              : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Summary & Reset */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <button
                      onClick={handleReset}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Réinitialiser la sélection
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">
                      Volume total des objets
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {totalVolume.toPrecision(2)} m³
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendation Section */}
        <section className="py-12 bg-[#f9f8e6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Notre recommandation
              </h2>
              <p className="text-xl text-gray-600 mt-2">
                Basée sur le volume total de vos objets
              </p>
            </div>

            {totalVolume > 0 ? (
              <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-3xl mx-auto transition-all duration-500 transform hover:scale-105">
                <div className="bg-[#9f9911] text-white p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">
                      {recommendedBox?.name}
                    </h3>
                    <div className="text-xl font-medium bg-white text-[#9f9911] px-3 py-1 rounded-full">
                      {recommendedBox?.size} m² | (
                      {recommendedBox?.size !== undefined
                        ? (recommendedBox.size * 2.5).toPrecision(2)
                        : 'N/A'}
                      m³)
                    </div>

                  </div>
                </div>
                <div className="p-6">
                  <p className="text-lg text-gray-600 mb-6">
                    {recommendedBox?.description}
                  </p>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center text-green-600 mb-2">
                        <Check size={16} className="mr-2" />
                        <span>
                          Volume estimé de vos objets: {totalVolume.toPrecision(2)}{" "}
                          m³
                        </span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Check size={16} className="mr-2" />
                        <span>
                          Capacité du box: {recommendedBox?.maxVolume} m³
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#9f9911] hover:bg-[#6e6a0c] transition-colors"
                    >
                      Réserver ce box
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto">
                <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucun objet sélectionné
                </h3>
                <p className="text-gray-600">
                  Sélectionnez les objets que vous souhaitez stocker pour
                  obtenir une recommandation de taille de box.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Size Guide Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Guide des tailles de box
              </h2>
              <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
                Voici un aperçu des différentes tailles de box disponibles et de
                ce que vous pouvez y stocker
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boxSizes.map((box, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-[#9f9911]">
                        {box.name}
                      </h3>
                      <span className="text-sm font-medium bg-[#f9f8e6] text-[#6e6a0c] px-2 py-1 rounded-full">
                        {box.size} m² | ({(box.size * 2.5).toPrecision(2)} m³)
                      </span>

                    </div>
                    <p className="text-gray-700 mb-4">{box.description}</p>
                    <div className="text-gray-500 text-sm">
                      Capacité maximale: {box.maxVolume} m³
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#9f9911]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à réserver votre box ?
            </h2>
            <p className="text-xl text-[#f3f1cc] mb-8 max-w-3xl mx-auto">
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
        </section>
      </main>
    </div>
  );
};

export default StorageCalculator;