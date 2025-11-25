"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Phone,
  Clock,
  Shield,
  Calendar,
  Lock,
  Truck,
  Camera,
  Thermometer,
  X,
  PackageOpen,
  Bell,
  Info,
  Eye,
  Filter,
} from "lucide-react";
import { CarouselItem, Button, Modal, Form } from "react-bootstrap";
import BookingForm from "./BookingForm";
import axios from "axios";
import L from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import Link from "next/link";
import NotifyModal from "./NotifyModal";
import iconLogo from "@/public/assets/image/position.png";

const localImages = [
  "/assets/image/location_image/box_services_container_stokage6.jpg",
  "/assets/image/location_image/box_services_container_stokage5.jpg",
  "/assets/image/location_image/box_services_container_stokage4.jpg",
  "/assets/image/location_image/box_services_container_stokage3.jpg",
  "/assets/image/location_image/box_services_container_stokage2.jpg",
  "/assets/image/location_image/box_services_container_stokage1.jpeg",
  "/assets/image/location_image/box_services_container_stokage.jpg",
];

const defaultCityImages = {
  Paris: localImages[Math.floor(Math.random() * localImages.length)],
  Lyon: localImages[Math.floor(Math.random() * localImages.length)],
  Marseille: localImages[Math.floor(Math.random() * localImages.length)],
  Bordeaux: localImages[Math.floor(Math.random() * localImages.length)],
  Lille: localImages[Math.floor(Math.random() * localImages.length)],
  default: localImages[Math.floor(Math.random() * localImages.length)],
};

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

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
  reviewCount: number;
  minPrice: number;
  image: string;
  units: Unit[];
  services: {
    id: number;
    name: string;
    price: number;
  }[];
  description?: string;
  country?: string;
}

interface StorageDetailsProps {
  locationId: string;
  onClose?: () => void;
}

const StorageDetails = ({
  locationId,
  onClose = () => { },
}: StorageDetailsProps) => {
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedNotifyUnit, setSelectedNotifyUnit] = useState<Unit | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [unitsPerPage] = useState(4);
  const [cityImage, setCityImage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    volume: "",
    price: "",
    availableOnly: false
  });
  const getCityImage = (cityName: string) => {
    const randomImage = localImages[Math.floor(Math.random() * localImages.length)];
    return (
      defaultCityImages[cityName as keyof typeof defaultCityImages] ||
      randomImage
    );
  };
  useEffect(() => {
    if (location?.city) {
      const imageUrl = getCityImage(location.city);
      setCityImage(imageUrl);
    }
  }, [location?.city]);

  const imagesToDisplay = cityImage ? [cityImage] : [defaultCityImages.default];

  const filteredUnits =
    location?.units?.filter((unit) => {
      return (
        (filters.volume ? unit.volume >= Number(filters.volume) : true) &&
        (filters.price ? unit.pricePerMonth <= Number(filters.price) : true) &&
        (filters.availableOnly ? unit.available === true : true)
      );
    })
    // Tri: disponibles d'abord, puis non disponibles
    .sort((a, b) => {
      if (a.available && !b.available) return -1;  // a (disponible) avant b (non disponible)
      if (!a.available && b.available) return 1;   // b (disponible) avant a (non disponible)
      return 0; // même statut, garder l'ordre original
    }) || [];

  const indexOfLastUnit = currentPage * unitsPerPage;
  const indexOfFirstUnit = indexOfLastUnit - unitsPerPage;
  const currentUnits =
    filteredUnits?.slice(indexOfFirstUnit, indexOfLastUnit) || [];

  const mockLocations: Location[] = [
    {
      id: 1,
      name: "Paris 11",
      address: "SCI Millet, 15 Allée DE LAUNIS, 17620 ECHILLAIS",
      city: "Paris",
      postalCode: "75011",
      lat: 48.8566,
      lng: 2.3522,
      distance: 1.2,
      rating: 4.7,
      reviewCount: 124,
      minPrice: 45,
      image: defaultCityImages.Paris,
      units: [],
      services: [
        { id: 1, name: "24/7 Access", price: 0 },
        { id: 2, name: "Climate Controlled", price: 10 },
        { id: 3, name: "Security Camera", price: 5 },
      ],
    },
  ];

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${apiUrl}/storage/${locationId}`, {
          headers,
        });
        const data = response.data;

        setLocation(data);
        if (data.units && data.units.length > 0) {
          setSelectedUnit(data.units[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching location details:", err);
        setLocation(mockLocations[0]);
        setSelectedUnit(mockLocations[0].units[0]);
        setError("Failed to fetch location details");

        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [locationId, apiUrl, router]);

  const handleSelect = (selectedIndex: number) => {
    setActiveIndex(selectedIndex);
  };

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleSelectUnitPage = (unit: Unit) => {
    router.push(`/units/${unit.id}`);
  };

  const handleBookNow = (unit: Unit) => {
    if (selectedUnit) {
      router.push(`/booking/${unit.id}`);
    }
  };

  const handleBookingComplete = (bookingData: any) => {
    setShowBookingModal(false);
  };

  const handleNotifyClick = (unit: Unit) => {
    setSelectedNotifyUnit(unit);
    setShowNotifyModal(true);
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

      setShowNotifyModal(false);
    } catch (error) {
      console.error("Error submitting waiting list request:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#dfd750]"></div>
        <span className="ml-3 text-lg text-gray-700">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 text-lg mb-4">Erreur : {error}</div>
        <Button
          onClick={() => router.push("/search")}
          className="bg-[#9f9911] hover:bg-[#6e6a0c] text-white py-2 px-6 rounded-lg"
        >
          Retour à la recherche
        </Button>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-700">Aucun emplacement trouvé.</div>
      </div>
    );
  }

  const customIcon = new L.Icon({
    iconUrl: iconLogo.src,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const getImageByUnitSize = (volumeNum: number) => {
    let imagePath = "";

    if (volumeNum <= 6) {
      imagePath = "/assets/units/10/STU_5x5x4-600x338.jpg";
    } else if (volumeNum <= 15) {
      imagePath = "/assets/units/10/STU_5x10-600x338.jpg";
    } else if (volumeNum <= 30) {
      imagePath = "/assets/units/10/STU_10x10-600x338.jpg";
    } else if (volumeNum <= 60) {
      imagePath = "/assets/units/10/STU_10x15-600x338.jpg";
    } else if (volumeNum <= 100) {
      imagePath = "/assets/units/10/STU_10x20-600x338.jpg";
    } else if (volumeNum <= 150) {
      imagePath = "/assets/units/10/STU_10x25-600x338.jpg";
    } else {
      imagePath = "/assets/units/10/STU_12x30-600x338.jpg";
    }
    return imagePath;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Fil d'Ariane */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm font-medium">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Accueil
            </Link>
            <div className="mx-2 text-gray-400">/</div>
            <Link
              href="/search"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Recherche
            </Link>
            <div className="mx-2 text-gray-400">/</div>
            <span className="text-gray-900 font-semibold">{location.name}</span>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche */}
          <div className="grid grid-cols-1 lg:col-span-3">
            {/* Carrousel d'images */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
              {imagesToDisplay.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative">
                    <img
                      src={image}
                      alt={`${location.name} - ${index + 1}`}
                      className="w-full rounded-lg object-cover"
                      style={{ height: "400px" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-2xl font-bold drop-shadow-md">
                        {location.name}
                      </h2>
                      <p className="text-sm drop-shadow-md">
                        {location.city}, {location.postalCode}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </div>

            {/* Informations sur le centre de stockage */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {location.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin
                      className="text-[#dfd750] mr-3 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="text-gray-700">{location.address}</p>
                      <p className="text-gray-700">
                        {location.postalCode} {location.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone
                      className="text-[#dfd750] mr-3 flex-shrink-0"
                      size={20}
                    />
                    <p className="text-gray-700">097 222 4661</p>
                  </div>
                  <div className="flex items-center">
                    <Clock
                      className="text-[#dfd750] mr-3 flex-shrink-0"
                      size={20}
                    />
                    <p className="text-gray-700">Accès 24h/24 et 7j/7</p>
                  </div>
                </div>
              </div>

              <div className="border-t mt-6 border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {location.description ||
                    "Ce centre de stockage offre une solution sécurisée et flexible pour tous vos besoins de stockage. Situé dans un emplacement pratique, il propose diverses tailles d'unités pour répondre à différents besoins, des petits objets aux meubles volumineux."}
                </p>
              </div>
            </div>

            {/* Services et équipements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="text-[#dfd750] mr-2" size={24} />
                Services et équipements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-[#f9f8e6] rounded-lg transition-all duration-300 hover:bg-[#f3f1cc]">
                  <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                    <Camera className="text-[#9f9911]" size={20} />
                  </div>
                  <span className="text-gray-700">Vidéosurveillance 24/7</span>
                </div>
                <div className="flex items-center p-3 bg-[#f9f8e6] rounded-lg transition-all duration-300 hover:bg-[#f3f1cc]">
                  <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                    <Lock className="text-[#9f9911]" size={20} />
                  </div>
                  <span className="text-gray-700">Accès sécurisé par code</span>
                </div>
                <div className="flex items-center p-3 bg-[#f9f8e6] rounded-lg transition-all duration-300 hover:bg-[#f3f1cc]">
                  <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                    <Truck className="text-[#9f9911]" size={20} />
                  </div>
                  <span className="text-gray-700">Zone de chargement</span>
                </div>
                <div className="flex items-center p-3 bg-[#f9f8e6] rounded-lg transition-all duration-300 hover:bg-[#f3f1cc]">
                  <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                    <Thermometer className="text-[#9f9911]" size={20} />
                  </div>
                  <span className="text-gray-700">Locaux tempérés</span>
                </div>
                {location.services &&
                  location.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-[#f9f8e6] rounded-lg transition-all duration-300 hover:bg-[#f3f1cc]"
                    >
                      <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                        <Shield className="text-[#9f9911]" size={20} />
                      </div>
                      <span className="text-gray-700">{service.name}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Carte OpenStreetMap */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg z-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="text-[#dfd750] mr-2" size={24} />
                Localisation
              </h2>
              {location ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <MapContainer
                    center={[location.lat, location.lng]}
                    zoom={14}
                    style={{ height: "400px", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[location.lat, location.lng]}
                      icon={customIcon}
                    >
                      <Tooltip permanent direction="top" offset={[0, -40]}>
                        {location.name}
                      </Tooltip>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-[#9f9911]">
                            {location.name}
                          </h3>
                          <p className="text-gray-700">{location.address}</p>
                          <p className="text-gray-700">
                            {location.postalCode} {location.city},{" "}
                            {location.country || "France"}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">Chargement de la carte...</p>
                </div>
              )}
            </div>
          </div>

          {/* Colonne de droite (sélection des unités) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <PackageOpen className="text-[#9f9911] mr-3" size={24} />
                Unités disponibles
              </h2>             
              <div className="mb-4 text-gray-600">
                {filteredUnits.length} unité
                {filteredUnits.length !== 1 ? "s" : ""} trouvée
                {filteredUnits.length !== 1 ? "s" : ""}
              </div>
              {filteredUnits.length === 0 ? (
                <div className="text-center py-10">
                  <PackageOpen className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-500">Aucune unité ne correspond à vos critères.</p>
                  <button
                    onClick={() => setFilters({ volume: "", price: "", availableOnly: false })}
                    className="mt-4 text-[#9f9911] hover:text-[#525008] underline font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredUnits
                    ?.slice(indexOfFirstUnit, indexOfLastUnit)
                    .map((unit) => (
                      <div
                        key={unit.id}
                        className="group relative flex flex-col border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#d9d262] cursor-pointer"
                        onClick={() => handleSelectUnitPage(unit)}
                      >
                        {/* Badge de disponibilité */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold z-10 ${unit.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}>
                          {unit.available ? "Disponible" : "No Disponible"}
                        </div>

                        {/* Image de l'unité avec effet de zoom */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={apiUrl + getImageByUnitSize(unit.volume)}
                            alt={`Unité ${unit.code || unit.volume}m²`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Overlay pour l'icône des détails */}
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 p-3 rounded-full shadow-lg">
                              <Eye className="text-[#9f9911]" size={20} />
                            </div>
                            <span className="absolute bottom-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded">
                              Voir les détails
                            </span>
                          </div>
                        </div>

                        {/* Contenu de la carte */}
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Unité {unit.volume}m²
                            </h3>
                            <div className="flex items-center">
                              <Info
                                size={18}
                                className="text-gray-400 hover:text-[#dfd750] cursor-pointer ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                            </div>
                          </div>

                          <div className="text-sm text-gray-500 mb-3">
                            {unit.volume} m² • {unit.floor || "Rez-de-chaussée"}
                          </div>

                          {/* Caractéristiques */}
                          {unit.features && unit.features.length > 0 && (
                            <div className="mt-auto mb-3">
                              <div className="flex flex-wrap gap-1">
                                {unit.features.slice(0, 3).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {unit.features.length > 3 && (
                                  <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    +{unit.features.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Prix et CTA */}
                          <div className="mt-auto pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-2xl font-bold text-[#9f9911]">
                                  {String(unit.pricePerMonth).slice(0, 5)}€
                                </span>

                                <span className="text-xs text-gray-500 ml-1">/mois</span>
                              </div>
                              {unit.available ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectUnit(unit);
                                    handleBookNow(unit);
                                  }}
                                  className="bg-[#9f9911] hover:bg-[#6e6a0c] text-white text-sm py-2 px-4 rounded-lg flex items-center border border-[#e6e297] transition-all duration-300 hover:scale-105"
                                >
                                  <Calendar size={14} className="mr-2" /> Réserver
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotifyClick(unit);
                                  }}
                                  className="bg-red-100 hover:bg-red-200 text-red-600 text-sm py-2 px-3 rounded-lg flex items-center border border-red-200 transition-all duration-300 hover:scale-105"
                                >
                                  <Bell size={10} className="mr-2" /> liste d'attente
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Pagination */}
              {filteredUnits.length > unitsPerPage && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {/* Premier bouton (<<) */}
                    <button
                      onClick={() => paginate(1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center
                        ${currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-[#f9f8e6] hover:text-[#dfd750] cursor-pointer"
                        }`}
                    >
                      <FaAngleDoubleLeft className="mr-1" />
                    </button>

                    {/* Bouton précédent (<) */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center
                        ${currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-[#f9f8e6] hover:text-[#dfd750] cursor-pointer"
                        }`}
                    >
                      <FaChevronLeft className="mr-1" />
                    </button>

                    {/* Numéros de page - Optimisés pour afficher seulement 5 pages maximum */}
                    {(() => {
                      const totalPages = Math.ceil(
                        (filteredUnits?.length || 0) / unitsPerPage
                      );
                      const pageNumbers = [];
                      let startPage = Math.max(1, currentPage - 2);
                      let endPage = Math.min(totalPages, startPage + 4);

                      if (endPage - startPage < 4) {
                        startPage = Math.max(1, endPage - 4);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pageNumbers.push(
                          <button
                            key={i}
                            onClick={() => paginate(i)}
                            disabled={i === currentPage}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer
                              ${i === currentPage
                                ? "bg-[#dfd750] text-white shadow-md"
                                : "text-gray-600 hover:bg-[#f9f8e6] hover:text-[#dfd750]"
                              }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pageNumbers;
                    })()}

                    {/* Bouton suivant (>) */}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredUnits?.length / unitsPerPage)
                      }
                      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center
                        ${currentPage ===
                          Math.ceil(filteredUnits?.length / unitsPerPage)
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-[#f9f8e6] hover:text-[#dfd750] cursor-pointer"
                        }`}
                    >
                      <FaChevronRight className="ml-1" />
                    </button>

                    {/* Dernier bouton (>>) */}
                    <button
                      onClick={() =>
                        paginate(
                          Math.ceil(filteredUnits?.length / unitsPerPage)
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredUnits?.length / unitsPerPage)
                      }
                      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center
                        ${currentPage ===
                          Math.ceil(filteredUnits?.length / unitsPerPage)
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-[#f9f8e6] hover:text-[#dfd750] cursor-pointer"
                        }`}
                    >
                      <FaAngleDoubleRight className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de réservation */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        size="lg"
        centered
      >
        <Modal.Header className="border-b-0">
          <Modal.Title className="text-xl font-semibold text-gray-900">
            Réserver une unité de stockage
          </Modal.Title>
          <Button
            variant="link"
            onClick={() => setShowBookingModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body>
          {selectedUnit && (
            <BookingForm
              unitId={selectedUnit.id}
              unitDetails={selectedUnit}
              onBookingComplete={handleBookingComplete}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal pour "Me prévenir" */}
      <Modal
        show={showNotifyModal}
        onHide={() => setShowNotifyModal(false)}
        size="lg"
        centered
        className="fixed inset-0 flex items-center justify-center p-4"
      >
        <Modal.Header className="border-b-0">
          <Modal.Title className="text-xl font-semibold text-gray-900">
            Me prévenir quand l'unité est disponible
          </Modal.Title>
          <Button
            variant="link"
            onClick={() => setShowNotifyModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedNotifyUnit && (
            <NotifyModal
              show={showNotifyModal}
              onHide={() => setShowNotifyModal(false)}
              unit={selectedNotifyUnit as Unit}
              onSubmit={handleNotifySubmit}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StorageDetails;
