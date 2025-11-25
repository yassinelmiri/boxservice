import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FiRefreshCw } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface ServiceFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchTerm: string;
  handleSearch: (e: any) => void;
  filters: any;
  handleFilterChange: (e: any) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  fetchServices: () => void;
}

const ServiceFilters = ({
  showFilters,
  setShowFilters,
  searchTerm,
  handleSearch,
  filters,
  handleFilterChange,
  applyFilters,
  resetFilters,
  fetchServices,
}: ServiceFiltersProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Rechercher des services..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-md ${
            showFilters ? "bg-[#f3f1cc] border-[#d9d262]" : ""
          }`}
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-600" />
          <span className="text-gray-700">Filtres</span>
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center shadow-md"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Réinitialiser
        </button>
        <button
          onClick={fetchServices}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiRefreshCw className="mr-2" size={16} />
          Actualiser
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Prix Minimum
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                    placeholder="Prix Minimum"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Prix Maximum
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                    placeholder="Prix Maximum"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={applyFilters}
                  className="bg-[#9f9911] text-white px-4 py-2 rounded-lg hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750] transition-colors"
                >
                  Appliquer les Filtres
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceFilters;