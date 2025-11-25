'use client';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useMap } from "react-leaflet";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMapMarkerAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface StoreData {
  lat: number;
  lng: number;
  city: string;
  country: string;
  postalCode: string;
  address: string;
}

interface LocationSearchProps {
  setStoreData: React.Dispatch<React.SetStateAction<StoreData>>;
  isEditMode: boolean;
}

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    postcode?: string;
    road?: string;
  };
}

const LocationSearch: React.FC<LocationSearchProps> = ({ setStoreData, isEditMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap();

  // Fermer les résultats quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Recherche automatique avec délai
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult[]>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche de lieux.');
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSelectLocation = (location: SearchResult) => {
    const { lat, lon, display_name, address } = location;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    // Extraction des informations d'adresse
    const city = address?.city || address?.town || address?.village || address?.municipality || '';
    const country = address?.country || '';
    const postalCode = address?.postcode || '';
    const road = address?.road || '';

    setStoreData((prev) => ({
      ...prev,
      lat: latitude,
      lng: longitude,
      city: city,
      country: country,
      postalCode: postalCode,
      address: road ? `${road}, ${city}` : city,
    }));
    
    map.flyTo([latitude, longitude], 15, {
      duration: 1
    });
    
    // Fermer les résultats et mettre à jour la recherche
    setShowResults(false);
    setSearchQuery(display_name);
    setSearchResults([]); // Ajouté pour vider les résultats après sélection
  };

  return (
    <div 
      className="mb-4 absolute z-[1000] top-0 left-10 right-0 bg-white shadow-md rounded-md p-2 m-2 max-w-md"
      ref={searchContainerRef}
    >
      <div className="flex items-center relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value === '') {
              setShowResults(false);
              setSearchResults([]);
            }
          }}
          placeholder="Rechercher une ville ou une adresse..."
          className="w-full p-2 pr-8 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-12 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded-r-md hover:bg-blue-600 transition-all"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faSearch} className={isLoading ? 'animate-spin' : ''} />
        </motion.button>
      </div>

      {showResults && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
        >
          {searchResults.map((result, index) => (
            <motion.button
              key={`${result.lat}-${result.lon}-${index}`}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => handleSelectLocation(result)}
              className="w-full text-left p-2 hover:bg-gray-100 flex items-center border-b last:border-b-0"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mr-2" />
              <div className="truncate">
                <div className="font-medium truncate">
                  {result.address?.road ? `${result.address.road}, ` : ''}
                  {result.address?.city || result.address?.town || result.address?.village || result.address?.municipality || ''}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {result.display_name}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LocationSearch;