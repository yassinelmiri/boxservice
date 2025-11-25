"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
  MapPin,
  Search,
  Filter,
  SortAsc,
  List,
  Grid,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Star,
  Package,
  Check,
  Calendar,
  Euro,
  Square,
  RefreshCw
} from "lucide-react";
import dynamic from "next/dynamic";

import MapSection from "@/components/sections/MapSection";
import { log } from "console";

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
  size: number;
  code: string;
  [key: string]: any;
}

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance: number;
  minPrice: number;
  image: string;
  units: Unit[];
  services?: Array<{ id: number; name: string; price: number }>;
  lat?: number;
  lng?: number;
  hasAvailableUnits?: boolean;
}

interface ApiResponse {
  data: Location[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PopularSearch {
  city: string;
  count: number;
}

const SearchResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const radius = searchParams?.get("radius") || "50";
  const [loading, setLoading] = useState(true);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("distance");
  const [cityFilter, setCityFilter] = useState("");
  const [postalCodeFilter, setPostalCodeFilter] = useState("");
  const [volumeFilter, setVolumeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState(250);
  const [availableFilter, setAvailableFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

  useEffect(() => {
    if (query) {
      const cleanedQuery = query.replace(/\s/g, '');
      if (/^\d+$/.test(cleanedQuery)) {
        setPostalCodeFilter(cleanedQuery.substring(0, 2));
        setCityFilter("");
      } else {
        setCityFilter(query.replace(/\s+/g, ' ').trim());
        setPostalCodeFilter("");
      }
    }
    fetchAllStorageCenters();
  }, [query, radius]);



  const fetchAllStorageCenters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      const searchValue = postalCodeFilter || cityFilter;

      if (searchValue) {
        if (/^\d{5}$/.test(searchValue)) {
          params.append("postalCode", searchValue);
        } else {
          params.append("city", searchValue.trim());
        }
      }

      if (radius) params.append("radius", radius);

      const url = `${apiUrl}/storage/search`;
      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data && response.data.data) {
        const centers = response.data.data.map((center: Location) => {
          const processedUnits = center.units.map((unit) => ({
            ...unit,
            available: unit.available !== undefined ? unit.available : Math.random() > 0.3,
          }));

          const hasAvailableUnits = processedUnits.some(unit => unit.available);

          return {
            ...center,
            units: processedUnits,
            distance: calculateDistance(center.lat || 0, center.lng || 0),
            minPrice: getMinPrice(processedUnits),
            hasAvailableUnits,
          };
        });

        setAllLocations(centers);
      } else {
        console.warn("Unexpected response format:", response.data);
        setAllLocations([]);
      }
    } catch (error) {
      console.error("Error fetching storage centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularSearches = async () => {
    try {
      const response = await axios.get<PopularSearch[]>(`${apiUrl}/searches/popular`);
      setPopularSearches(response.data);
    } catch (error) {
      console.error("Error fetching popular searches:", error);
      setPopularSearches([
        { city: "Saintes", count: 42 },
        { city: "Saint-Martin-d'Ary", count: 35 },
        { city: "Montgenèvre", count: 28 },
        { city: "Bergerac", count: 24 },
        { city: "Angoulême", count: 18 }
      ]);
    }
  };
  const handleInputChange = (value: string) => {

    const cleanedValue = value.replace(/\s/g, '');

    if (/^\d+$/.test(cleanedValue)) {
      setPostalCodeFilter(cleanedValue);
      setCityFilter("");
    } else {
      setCityFilter(value.replace(/\s+/g, ' ').trim());
      setPostalCodeFilter("");
    }
    setCurrentPage(1);
  };

  const filteredAndSortedLocations = useMemo(() => {
    let filtered = [...allLocations];

    if (cityFilter || postalCodeFilter) {
      filtered = filtered.filter((location) => {
        if (cityFilter && postalCodeFilter) {
          const cityMatch = location.city.toLowerCase().includes(cityFilter.toLowerCase()) ||
            location.address.toLowerCase().includes(cityFilter.toLowerCase());
          const exactPostalExists = allLocations.some(loc => loc.postalCode === postalCodeFilter);

          const postalMatch = postalCodeFilter.length === 5 ?
            (exactPostalExists ? location.postalCode === postalCodeFilter : location.postalCode.startsWith(postalCodeFilter.substring(0, 2))) :
            location.postalCode.startsWith(postalCodeFilter.substring(0, 2));

          return cityMatch && postalMatch;
        }

        if (cityFilter) {
          return location.city.toLowerCase().includes(cityFilter.toLowerCase()) ||
            location.address.toLowerCase().includes(cityFilter.toLowerCase());
        }

        if (postalCodeFilter) {
          if (postalCodeFilter.length === 5) {
            const exactPostalExists = allLocations.some(loc => loc.postalCode === postalCodeFilter);

            return exactPostalExists ?
              location.postalCode === postalCodeFilter :
              location.postalCode.startsWith(postalCodeFilter.substring(0, 2));
          } else {
            return location.postalCode.startsWith(postalCodeFilter.substring(0, 2));
          }
        }
        return true;
      });
    }

    filtered = filtered.filter((location) => location.minPrice <= priceFilter);
    if (volumeFilter !== "all") {
      filtered = filtered.filter((location) => {
        return location.units.some((unit) => {
          const unitVolume = Number(unit.volume);
          switch (volumeFilter) {
            case "small":
              setCurrentPage(1);
              return unitVolume >= 1 && unitVolume <= 6;
            case "medium":
              setCurrentPage(1);
              return unitVolume >= 12 && unitVolume <= 23;
            case "large":
              setCurrentPage(1);
              return unitVolume >= 24;
            default:
              setCurrentPage(1);
              return true;
          }
        });
      });
    }

    if (availableFilter) {
      filtered = filtered.filter((location) => location.hasAvailableUnits);
    }

    // Tri
    switch (sortOption) {
      case "distance":
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case "price-asc":
        filtered.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.minPrice - a.minPrice);
        break;
      default:
        break;
    }

    return filtered;
  }, [allLocations, cityFilter, postalCodeFilter, priceFilter, volumeFilter, availableFilter, sortOption]);

  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLocations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedLocations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedLocations.length / itemsPerPage);

  const getMinPrice = (units: Unit[]) => {
    if (!units || units.length === 0) return 0;
    return Math.min(...units.map((unit) => Number(unit.pricePerMonth)));
  };

  const calculateDistance = (lat: number, lng: number) => {
    return Math.round((Math.random() * 9.5 + 0.5) * 10) / 10;
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchValue = (postalCodeFilter || cityFilter).trim();

    if (searchValue) {
      const normalizedValue = searchValue.replace(/\s+/g, ' ');
      router.push(`/search?query=${encodeURIComponent(normalizedValue)}&radius=${radius}`);
    }
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const resetFilters = () => {
    setCityFilter("");
    setPostalCodeFilter("");
    setVolumeFilter("all");
    setPriceFilter(250);
    setAvailableFilter(false);
    setCurrentPage(1);
    setSortOption("distance");
  };

  const refreshData = () => {
    fetchAllStorageCenters();
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#9f9911] via-[#9f9911] to-[#9f9911] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute top-60 -left-32 w-64 h-64 rounded-full bg-green-400/20 blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-emerald-400/20 blur-xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Trouvez votre
                <span className="bg-[#a09c53] bg-clip-text text-transparent"> espace parfait</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed">
                Plus de 500 espaces de stockage sécurisés avec accès 24h/24 et 7j/7
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-5xl mx-auto border border-white/20">
              <div className="p-8">
                <form
                  className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:space-x-6"
                  onSubmit={handleSearchSubmit}
                >
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin size={24} className="text-green-400" />
                    </div>
                    <input
                      id="search-input"
                      type="text"
                      value={postalCodeFilter || cityFilter}
                      placeholder="Ville ou code postal (ex: Paris, 75001)"
                      className="w-full pl-14 pr-6 py-5 bg-white/90 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:bg-white transition-all duration-300 text-lg font-medium shadow-lg"
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit(e);
                        }
                      }}
                      aria-label="Recherche par ville ou code postal"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-[#9f9911] hover:from-green-600 hover:to-emerald-700 text-white px-8 py-5 rounded-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-400/30 shadow-lg hover:shadow-xl font-bold text-lg transform hover:scale-105"
                    >
                      <Search className="mr-3" size={24} />
                      <span>Rechercher</span>
                    </button>
                    <button
                      type="button"
                      onClick={refreshData}
                      className="bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 text-white px-6 py-5 rounded-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg hover:shadow-xl font-medium transform hover:scale-105"
                      title="Actualiser les données"
                    >
                      <RefreshCw size={24} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Results Info */}
                <div className="flex items-center space-x-6">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => toggleViewMode("grid")}
                      className={`p-2 rounded-md transition-all duration-200 ${viewMode === "grid"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                      aria-label="Vue grille"
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => toggleViewMode("list")}
                      className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                      aria-label="Vue liste"
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <SortAsc size={18} className="text-gray-500" />
                    <select
                      value={sortOption}
                      onChange={handleSortChange}
                      className="border-0 bg-transparent p-0 focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="distance">Distance</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
                  </div>

                  {/* Size Filter */}
                  <div className="flex items-center space-x-2">
                    <Square size={16} className="text-gray-500" />
                    <select
                      value={volumeFilter}
                      onChange={(e) => setVolumeFilter(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="all">Toutes tailles</option>
                      <option value="small">Petit (≤ 6 m² / ≤ 15 m³)</option>
                      <option value="medium">Moyen (12–23 m² / 30–57.5 m³)</option>
                      <option value="large">Grand (≥ 24 m² / ≥ 60 m³)</option>

                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <Euro size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Max:</span>
                    <span className="text-sm font-bold text-emerald-600">{priceFilter}€</span>
                    <input
                      type="range"
                      min="0"
                      max="250"
                      step="10"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(Number(e.target.value))}
                      className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  {/* Availability Filter */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={availableFilter}
                      onChange={(e) => setAvailableFilter(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Disponible maintenant</span>
                  </label>

                  {/* Reset Button */}
                  <button
                    onClick={resetFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-800 font-medium hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw size={14} />
                    <span>Réinitialiser</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Results List - 50% */}
            <div className="lg:w-1/2">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-600"></div>
                    <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-green-600 animate-spin" style={{ animationDelay: '0.15s' }}></div>
                  </div>
                  <p className="text-gray-600 mt-6 font-medium">Chargement des résultats...</p>
                </div>
              ) : filteredAndSortedLocations.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 mb-6">
                    <Search size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Aucun résultat trouvé
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Nous n'avons trouvé aucun centre de stockage correspondant à vos critères.
                    Essayez d'élargir votre recherche.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#9f9911] text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                  {paginatedLocations.map((location) => (
                    <div
                      key={location.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group transform hover:-translate-y-1"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                {location.city}
                              </h3>
                              <div className="bg-[#9f9911] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                {location.units?.length || 0} Unités
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {location.address}, {location.postalCode} {location.name}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin size={16} className="mr-2 text-emerald-500" />
                              <span className="font-medium">{location.distance} km du centre</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <Package size={16} className="mr-2 text-emerald-500" />
                            Unités disponibles
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {location.units && location.units.slice(0, 4).map((unit) => (
                              <div
                                key={unit.id}
                                className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-lg p-3 hover:from-emerald-100 hover:to-green-100 transition-all duration-200 cursor-pointer group/unit"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-gray-900 group-hover/unit:text-emerald-600">
                                    {unit.volume} m² | ({(unit.volume * 2.5).toPrecision(2)} m³)
                                  </span>

                                  <span className="text-emerald-600 font-bold">
                                    {unit.pricePerMonth}€
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {location.units && location.units.length > 4 && (
                            <button
                              className="mt-3 text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center"
                              onClick={() => router.push(`/location/${location.id}`)}
                            >
                              +{location.units.length - 4} autres unités
                              <ArrowRight size={14} className="ml-1" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                              À partir de
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-3xl font-black text-transparent bg-[#9f9911] bg-clip-text">
                                {location.minPrice}€
                              </span>
                              <span className="text-gray-500 ml-2 font-medium">/mois</span>
                            </div>
                          </div>
                          <button
                            onClick={() => router.push(`/location/${location.id}`)}
                            className="bg-[#9f9911] hover:from-emerald-700 hover:to-green-700 text-white py-3 px-6 rounded-lg transition-all duration-300 font-bold flex items-center shadow-lg transform hover:scale-105 group/btn"
                          >
                            <span>Voir détails</span>
                            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                  {paginatedLocations.map((location) => (
                    <div
                      key={location.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group transform hover:-translate-y-1"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                {location.city}
                              </h3>
                              <div className="bg-[#9f9911] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                {location.units?.length || 0} Unités
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {location.address}, {location.postalCode} {location.name}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin size={16} className="mr-2 text-emerald-500" />
                              <span className="font-medium">{location.distance} km du centre</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <Package size={16} className="mr-2 text-emerald-500" />
                            Unités disponibles
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {location.units && location.units.slice(0, 4).map((unit) => (
                              <div
                                key={unit.id}
                                className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-lg p-3 hover:from-emerald-100 hover:to-green-100 transition-all duration-200 cursor-pointer group/unit"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-gray-900 group-hover/unit:text-emerald-600">
                                    {unit.volume} m² | ({(unit.volume * 2.5).toPrecision(2)} m³)
                                  </span>

                                  <span className="text-emerald-600 font-bold">
                                    {unit.pricePerMonth}€
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {location.units && location.units.length > 4 && (
                            <button
                              className="mt-3 text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center"
                              onClick={() => router.push(`/location/${location.id}`)}
                            >
                              +{location.units.length - 4} autres unités
                              <ArrowRight size={14} className="ml-1" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                              À partir de
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-3xl font-black text-transparent bg-[#9f9911] bg-clip-text">
                                {location.minPrice}€
                              </span>
                              <span className="text-gray-500 ml-2 font-medium">/mois</span>
                            </div>
                          </div>
                          <button
                            onClick={() => router.push(`/location/${location.id}`)}
                            className="bg-[#9f9911] hover:from-emerald-700 hover:to-green-700 text-white py-3 px-6 rounded-lg transition-all duration-300 font-bold flex items-center shadow-lg transform hover:scale-105 group/btn"
                          >
                            <span>Voir détails</span>
                            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredAndSortedLocations.length > itemsPerPage && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center font-medium"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Précédent
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + Math.max(1, currentPage - 2);
                      return page <= totalPages ? (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentPage === page
                            ? "bg-[#9f9911] text-white shadow-lg"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      ) : null;
                    })}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center font-medium"
                    >
                      Suivant
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Map Section - 50% */}
            <div className="lg:w-1/2">
              <div className="sticky top-24 h-[800px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-full relative">
                  <MapSection locations={filteredAndSortedLocations} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-sm font-medium text-gray-700">
                      {filteredAndSortedLocations.length} centre(s) affiché(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #9f9911, #9f9911);
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #4f46e5, #7c3aed);
      }
    `}</style>
    </div>
  );
};

const SearchResultsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Chargement...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
};

export default SearchResultsPage;