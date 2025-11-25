"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import iconLogo from "@/public/assets/image/position.png";
import SearchHeroMap from "./SearchMap";
import { useRouter } from "next/navigation";

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance: number;
  minPrice: number;
  image: string;
  lat?: number;
  lng?: number;
  hasAvailableUnits?: boolean;
}

interface StorageCenter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  pricing?: boolean;
  units?: number;
  bookings?: number;
  startingPrice?: number;
}

interface MapComponentProps {
  locations?: Location[];
}

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

interface SearchResult {
  lat: number;
  lng: number;
  name: string;
  radius?: number;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";
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
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

const MapComponent = ({ locations = [] }: MapComponentProps) => {
  const [isClient, setIsClient] = useState(false);
  const [center, setCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [storageCenters, setStorageCenters] = useState<StorageCenter[]>([]);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const mapRef = useRef<any>(null);
  const router = useRouter();
  const L = typeof window !== "undefined" ? require("leaflet") : null;
  const [searchRadius, setSearchRadius] = useState<number>(50);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Si on a des locations en props, on les utilise
    if (locations && locations.length > 0) {
      // Convertir les locations en StorageCenter format
      const convertedCenters = locations
        .filter(loc => loc.lat && loc.lng)
        .map(loc => ({
          id: loc.id.toString(),
          name: loc.name,
          lat: loc.lat!,
          lng: loc.lng!,
          address: loc.address,
          city: loc.city,
          country: "France",
          description: `${loc.city} - ${loc.postalCode}`,
          pricing: true,
          units: 1,
          bookings: 50,
          startingPrice: loc.minPrice
        }));
      
      setStorageCenters(convertedCenters);
      
      // Centrer la carte sur les locations
      if (convertedCenters.length > 0) {
        const avgLat = convertedCenters.reduce((sum, center) => sum + center.lat, 0) / convertedCenters.length;
        const avgLng = convertedCenters.reduce((sum, center) => sum + center.lng, 0) / convertedCenters.length;
        setCenter([avgLat, avgLng]);
      }
    } else {
      // Sinon, récupérer depuis l'API comme avant
      const fetchStorageCenters = async () => {
        try {
          const response = await axios.get(`${apiUrl}/storage`);
          setStorageCenters(response.data);
        } catch (err) {
          console.error("Erreur lors de la récupération des stockages:", err);
          toast.error("Erreur lors de la récupération des stockages.");
        }
      };

      fetchStorageCenters();
    }
  }, [isClient, locations]);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  const customIcon = L?.icon({
    iconUrl: iconLogo.src,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const flyToLocation = (location: [number, number], zoom: number = 13) => {
    if (!mapRef.current) return;

    setIsMoving(true);
    const flyOptions = {
      animate: true,
      duration: 2,
      easeLinearity: 0.5,
    };

    mapRef.current.flyTo(location, zoom, flyOptions);

    const onMoveEnd = () => {
      setIsMoving(false);
      mapRef.current.off("moveend", onMoveEnd);
    };

    mapRef.current.on("moveend", onMoveEnd);
  };

  const handleSearch = async (query: string, radius: number = 50) => {
    setSearchRadius(radius);
    if (query.includes(",") && query.split(",").length === 2) {
      const [lat, lng] = query.split(",");
      if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lng)];
        setCenter(newCenter);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
          );
          const data = await response.json();
          setSearchResult({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            name: data.display_name || "Votre position actuelle",
            radius: searchRadius * 1000,
          });
        } catch (error) {
          console.error("Error fetching location name:", error);
          setSearchResult({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            name: "Emplacement sélectionné",
          });
        }

        flyToLocation(newCenter);
        return;
      }
    }

    if (query.trim() === "") {
      toast.error("Veuillez entrer une ville ou un code postal.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&accept-language=fr`
      );
      const data = await response.json();

      if (data?.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setCenter(newCenter);
        setSearchResult({
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          name: display_name,
        });

        flyToLocation(newCenter);
      } else {
        toast.error("Aucun résultat trouvé pour cette ville.");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast.error("Erreur lors de la recherche.");
    }
  };

  const handleLocate = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Géolocalisation non supportée par votre navigateur");
      return;
    }
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      toast.warning(
        "La géolocalisation nécessite HTTPS pour fonctionner correctement"
      );
    }

    setIsLoadingLocation(true);
    toast.info("Recherche de votre position...");

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const newCenter: [number, number] = [latitude, longitude];
          setCenter(newCenter);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setSearchResult({
            lat: latitude,
            lng: longitude,
            name: data.display_name || "Votre position actuelle",
          });

          flyToLocation(newCenter);
          toast.success("Position trouvée!");
        } catch (error) {
          console.error("Error fetching location name:", error);
          setSearchResult({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "Votre position actuelle",
          });
          flyToLocation([position.coords.latitude, position.coords.longitude]);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error("Erreur de géolocalisation:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Vous avez refusé l'accès à votre position. Vérifiez les paramètres de votre navigateur."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Votre position est actuellement indisponible.");
            break;
          case error.TIMEOUT:
            toast.error("La demande de géolocalisation a expiré.");
            break;
          default:
            toast.error("Impossible de récupérer votre position.");
        }
      },
      options
    );
  };

  const handleRedirect = (id: string) => {
    router.push(`/location/${id}`);
  };

  const isInSearchResults = locations && locations.length > 0;

  return (
    <div className="map-container z-30">
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
      />

      {!isInSearchResults && (
        <div className="search-container">
          <SearchHeroMap
            onSearch={(query, radius) => handleSearch(query, radius)}
            onLocate={handleLocate}
            isLoadingLocation={isLoadingLocation}
          />
        </div>
      )}

      {isMoving && (
        <div className="map-moving-indicator">
          <div className="map-moving-spinner"></div>
          <span>Déplacement en cours...</span>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={isInSearchResults ? 10 : 6}
        scrollWheelZoom={true}
        style={{ 
          height: isInSearchResults ? "600px" : "700px", 
          width: "100%", 
          borderRadius: isInSearchResults ? "12px" : "20px" 
        }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="topright" />

        {storageCenters.map((center) => (
          <Marker
            key={center.id}
            position={[center.lat, center.lng]}
            icon={customIcon}
          >
            <Popup minWidth={300}>
              <div className="popup-content">
                <h3>{center.name}</h3>
                {center.address && (
                  <p>
                    {center.address}
                    <br />
                    {center.city}, {center.country}
                    <br />
                    {center.description}
                  </p>
                )}
                {center.pricing && (
                  <p className="price-info">
                    Boxes de {center.units} à {center.bookings}m³
                    <br />
                    Dès {center.startingPrice}€/mois
                  </p>
                )}
                <div className="popup-buttons">
                  <button className="close-btn">Fermer</button>
                  <button
                    className="view-pricing-btn"
                    onClick={() => handleRedirect(center.id)}
                  >
                   Voir détails
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {searchResult && searchResult.radius && (
          <Circle
            center={[searchResult.lat, searchResult.lng]}
            radius={searchResult.radius}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#2563eb",
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        )}
      </MapContainer>

      <style jsx>{`
        .map-container {
          height: ${isInSearchResults ? "600px" : "700px"};
          width: 100%;
          margin: ${isInSearchResults ? "0" : "10px"};
          padding: ${isInSearchResults ? "0" : "20px"};
          border-radius: ${isInSearchResults ? "12px" : "20px"};
          overflow: hidden;
          box-shadow: ${isInSearchResults ? "none" : "0 2px 4px rgba(0, 0, 0, 0.2)"};
          position: relative;
        }
        .search-container {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 800;
          width: 90%;
          max-width: 600px;
        }
        .map-moving-indicator {
          position: absolute;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 700;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-in-out;
        }
        .map-moving-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .popup-content {
          padding: 15px;
          text-align: center;
        }
        .popup-content h3 {
          margin: 0 0 10px;
          color: #333;
        }
        .popup-content p {
          margin: 4px 0;
          font-size: 14px;
        }
        .price-info {
          font-weight: bold;
          color: #2563eb;
        }
        .popup-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
        }
        .close-btn {
          padding: 8px 16px;
          background: #ddd;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .close-btn:hover {
          background: #ccc;
        }
        .view-pricing-btn {
          padding: 8px 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .view-pricing-btn:hover {
          background: #1d4ed8;
        }
        .search-result-popup {
          padding: 10px;
          text-align: center;
        }
        .search-result-popup h3 {
          margin: 0 0 10px;
          color: #333;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default MapComponent;