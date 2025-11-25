"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Clock,
  Shield,
  Calendar,
  Info,
  CreditCard,
  Lock,
  Truck,
  Thermometer,
  X,
  PackageOpen,
  Bell,
  Home,
  Search,
  Box,
  ChevronRight,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import UnitI from "@/public/assets/image/unitsID.png";
import Image from "next/image";
import NotifyModal from "@/components/NotifyModal";
import iconLogo from "@/public/assets/image/position.png";
import L from "leaflet";
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface Unit {
  id: string;
  name?: string;
  storageCenterId: string;
  volume: number;
  pricePerMonth: number;
  available: boolean;
  description?: string;
  features?: string[];
  address?: string;
  images: string[];
  size: string;
  code: string;
  [key: string]: any;
}

interface WaitlistForm {
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  description: string;
}

const UniteDetail = () => {
  const params = useParams();
  const unitId = params.unitId as string;
  const router = useRouter();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState<WaitlistForm>({
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const customIcon = new L.Icon({
    iconUrl: iconLogo.src,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";
  const mockImages = [
    "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  ];

  const handleSelect = (selectedIndex: number) => {
    setActiveIndex(selectedIndex);
  };

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/storage/units/${params.unitId}`
        );
        setUnit(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          router.push("/not-found");
        } else {
          setError("Erreur lors du chargement des détails de l'unité.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUnitDetails();
  }, [params.unitId, apiUrl]);

  const getValidImageUrl = (imagePath: string, baseUrl: string) => {
    try {
      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        new URL(imagePath);
        return imagePath;
      }
      const fullUrl = `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
      new URL(fullUrl); 
      return fullUrl;
    } catch (error) {
      console.error("Invalid image URL:", imagePath);
      return UnitI.src;
    }



  };
  const addToCart = () => {
    if (!unit) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as any[];

    const isUnitInCart = cart.some((item) => item.id === unit.id);

    if (!isUnitInCart) {
      cart.push({
        id: unit.id,
        code: unit.storageCenterId,
        volume: unit.volume,
        pricePerMonth: unit.pricePerMonth,
        features: unit.features,
        location: unit.address,
      });
      localStorage.setItem("cart", JSON.stringify(cart));

      toast.success("Unité ajoutée au panier 🛒!", {
        className: "toast-success-custom",
      });

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.error("Cette unité est déjà dans votre panier 🛒.", {
        className: "toast-error-custom",
      });
    }
  };

  const handleBookNow = () => {
    if (unit?.id) {
      router.push(`/booking/${unit.id}`);
    }
  };

  const handleNotifySubmit = async (data: {
    email: string;
    phone: string;
    description: string;
    startDate: string;
    unitId: number;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        email: data.email,
        phone: data.phone,
        description: data.description,
        startDate: new Date(data.startDate).toISOString(),
        unitId: Number(data.unitId),
      };

      const response = await axios.post(`${apiUrl}/waiting-list`, payload, {
        headers,
      });

      if (response.status === 200 || response.status === 201) {
      } else {
        toast.error("Une erreur s'est produite. Veuillez réessayer.");
      }

      setShowWaitlistModal(false);
    } catch (error) {
      console.error("Error submitting waiting list request:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleWaitlistChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWaitlistForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="loader"></div>
        <p className="ml-3 text-lg font-medium text-[#9f9911]">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 mb-4">
          <X size={48} />
        </div>
        <p className="text-xl font-medium text-gray-800">Erreur : {error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#9f9911] text-white rounded-lg hover:bg-[#6e6a0c] transition-all duration-300 flex items-center"
        >
          <ChevronLeft size={16} className="mr-2" />
          Retour
        </button>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-amber-500 mb-4">
          <Info size={48} />
        </div>
        <p className="text-xl font-medium text-gray-800">
          Aucune unité trouvée.
        </p>
        <button
          onClick={() => router.push("/search")}
          className="mt-4 px-4 py-2 bg-[#9f9911] text-white rounded-lg hover:bg-[#6e6a0c] transition-all duration-300 flex items-center"
        >
          <Search size={16} className="mr-2" />
          Rechercher des unités
        </button>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <motion.nav
              className="flex items-center text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="text-gray-500 hover:text-[#9f9911] transition-colors flex items-center"
              >
                <Home size={16} className="mr-1" />
                Accueil
              </Link>
              <div className="mx-2 text-gray-400">/</div>
              <Link
                href="/search"
                className="text-gray-500 hover:text-[#9f9911] transition-colors flex items-center"
              >
                <Search size={16} className="mr-1" />
                Recherche
              </Link>
              <div className="mx-2 text-gray-400">/</div>
              <span className="text-[#9f9911] font-semibold flex items-center">
                <Box size={16} className="mr-1" />
                Unité {unit.storageCenterId}
              </span>
            </motion.nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Image Carousel */}
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full h-[500px]">
                {/* Main Image Display */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={
                      unit.images?.[activeIndex]
                        ? getValidImageUrl(unit.images[activeIndex], apiUrl)
                        : UnitI.src
                    }
                    alt={`Unité ${unit.storageCenterId} - Vue ${activeIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                </div>

                {/* Navigation Arrows */}
                {unit.images && unit.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveIndex(prev => prev === 0 ? unit.images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-3 shadow-md z-10 transition-all duration-300"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => setActiveIndex(prev => (prev + 1) % unit.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-3 shadow-md z-10 transition-all duration-300"
                      aria-label="Image suivante"
                    >
                      <ChevronRight size={24} className="text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {unit.images && unit.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                    {activeIndex + 1} / {unit.images.length}
                  </div>
                )}

                {/* Thumbnail Navigation */}
                {unit.images && unit.images.length > 1 && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full">
                    {unit.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === idx ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                          }`}
                        aria-label={`Voir image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Unit Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                  <h2 className="text-white text-3xl font-bold flex items-center">
                    <Box className="mr-3" size={28} />
                    Unité {unit.storageCenterId}
                  </h2>
                  <div className="flex items-center mt-2">
                    <MapPin className="text-[#ccc32d] mr-2" size={16} />
                    <p className="text-white text-lg">
                      {unit.volume}m² - Emplacement premium
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Unit Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column */}
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                    <Box className="text-[#9f9911] mr-3" size={28} />
                    Unité [ {unit.volume}m² ]
                    {unit.available ? (
                      <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Disponible
                      </span>
                    ) : (
                      <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Indisponible
                      </span>
                    )}
                  </h1>
                  <div className="flex flex-wrap gap-6 mt-6">
                    <div className="flex items-center">
                      <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                        <Phone className="text-[#9f9911]" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contactez-nous</p>
                        <p className="text-gray-700 font-medium">
                          097 222 4661
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                        <Clock className="text-[#9f9911]" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Horaires</p>
                        <p className="text-gray-700 font-medium">
                          Accès 24h/24 et 7j/7
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                        <CreditCard className="text-[#9f9911]" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Prix mensuel</p>
                        <p className="text-gray-700 font-medium">
                          {unit.pricePerMonth || "99"}€ / mois
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="text-[#9f9911] mr-2" size={20} />
                    Description
                  </h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {unit.description ||
                      "Cette unité de stockage offre une solution sécurisée et flexible pour vos besoins de stockage. Avec un accès 24h/24 et 7j/7, vous pouvez récupérer vos biens quand vous le souhaitez. L'unité est équipée d'un système de surveillance avancé et d'un contrôle d'accès sécurisé pour garantir la sécurité de vos affaires."}
                  </p>

                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="text-[#9f9911] mr-2" size={20} />
                    Caractéristiques
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {(
                      unit.features || [
                        "Accès 24/7",
                        "Climatisé",
                        "Sécurité renforcée",
                        "Assurance incluse",
                      ]
                    ).map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center bg-gray-50 p-3 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                          {index % 4 === 0 ? (
                            <Lock className="text-[#9f9911]" size={18} />
                          ) : index % 4 === 1 ? (
                            <Thermometer className="text-[#9f9911]" size={18} />
                          ) : index % 4 === 2 ? (
                            <Shield className="text-[#9f9911]" size={18} />
                          ) : (
                            <Truck className="text-[#9f9911]" size={18} />
                          )}
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="text-[#9f9911] mr-2" size={20} />
                    Localisation
                  </h2>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                    <MapContainer
                      center={[51.505, -0.09]}
                      zoom={13}
                      style={{ height: "400px", width: "100%" }}
                      className="z-0"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[51.505, -0.09]} icon={customIcon}>
                        <Popup>Emplacement de l'unité de stockage.</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Adresse</h3>
                    <p className="text-gray-700">
                      {unit.address ||
                        "123 Rue du Stockage, 75001 Paris, France"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-24">
                  <div className="p-4 mb-6 bg-[#f9f8e6] rounded-lg border border-[#f3f1cc]">
                    <h3 className="text-xl font-semibold text-[#525008] mb-2">
                      Résumé
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taille</span>
                        <span className="font-medium">{unit.volume}m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix mensuel</span>
                        <span className="font-medium">
                          {unit.pricePerMonth || "99"}€
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut</span>
                        <span
                          className={`font-medium ${unit.available ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {unit.available ? "Disponible" : "Indisponible"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {unit.available ? (
                    <div className="space-y-4">
                      {/* <button
                        onClick={addToCart}
                        className="w-full bg-[#9f9911] hover:bg-[#6e6a0c] text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      >
                        <PackageOpen className="mr-2" size={20} />
                        Ajouter au panier
                      </button> */}
                      <button
                        onClick={handleBookNow}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      >
                        <Calendar className="mr-2" size={20} />
                        Réserver maintenant
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowWaitlistModal(true)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <Bell className="mr-2" size={20} />
                      Ajouter à la liste d'attente
                    </button>
                  )}

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                      <Info className="text-gray-500 mr-2" size={18} />
                      Besoin d'aide ?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Notre équipe est disponible pour répondre à toutes vos
                      questions.
                    </p>
                    <a
                      href="tel:(+33) 972 22 4661"
                      className="block w-full text-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="inline-block mr-2" size={16} />
                      097 222 4661
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Waitlist Modal */}
        <AnimatePresence>
          {showWaitlistModal && (
            <NotifyModal
              show={showWaitlistModal}
              onHide={() => setShowWaitlistModal(false)}
              unit={unit}
              onSubmit={handleNotifySubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default UniteDetail;
