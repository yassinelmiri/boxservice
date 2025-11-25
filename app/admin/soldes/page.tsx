"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faFilter,
  faSearch,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";

interface Solde {
    id: number;
    solde: number; 
    createdAt: string;
  }

interface NewSoldeData {
    solde: number; 
}

interface Filters {
  minValue: string;
  maxValue: string;
  searchTerm: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

const SoldePage = () => {
  const [newSoldeData, setNewSoldeData] = useState<NewSoldeData>({
    solde: 0,
  });
  const [soldes, setSoldes] = useState<Solde[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [soldesPerPage] = useState<number>(10);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedSolde, setSelectedSolde] = useState<Solde | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    minValue: "",
    maxValue: "",
    searchTerm: "",
  });

  const fetchSoldes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Aucun token d'authentification trouvé. Veuillez vous reconnecter."
        );
      }
  
      const response = await axios.get(`${apiUrl}/soldes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setSoldes(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err: any) {
      console.error("Détails de l'erreur:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Erreur inconnue";
      setError(`Échec de la récupération des remise: ${errorMessage}`);
      toast.error(`Échec de la récupération des remise: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(
        "Aucun token d'authentification trouvé. Veuillez vous reconnecter."
      );
      setLoading(false);
      toast.error("Veuillez vous connecter pour accéder à cette page.");
    } else {
      fetchSoldes();
    }
  }, []);

  const applyFilters = () => {
    setCurrentPage(0);
    toast.success("Filtres appliqués avec succès!");
  };

  const resetFilters = () => {
    setFilters({
      minValue: "",
      maxValue: "",
      searchTerm: "",
    });
    setSearchTerm("");
    setCurrentPage(0);
    toast.success("Filtres réinitialisés!");
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredSoldes = soldes.filter((solde) => {
    const matchesSearch = solde.id.toString().includes(searchTerm.toLowerCase());
    const matchesMinValue =
      filters.minValue === "" || solde.solde >= Number(filters.minValue);  // Changé solde.solde à solde.solde
    const matchesMaxValue =
      filters.maxValue === "" || solde.solde <= Number(filters.maxValue);  // Changé solde.solde à solde.solde
  
    return matchesSearch && matchesMinValue && matchesMaxValue;
  });

  const pageCount = Math.ceil(filteredSoldes.length / soldesPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSoldeData({
      ...newSoldeData,
      [name]: Number(value),
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleModify = (solde: Solde) => {
    setSelectedSolde(solde);
    setNewSoldeData({
      solde: solde.solde,
    });
    setShowPopup(true);
  };

  const handleCreateSolde = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Aucun token d'authentification trouvé");
      }

      await axios.post(`${apiUrl}/soldes`, newSoldeData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Solde créé avec succès!");
      await fetchSoldes();
      setShowPopup(false);
      setNewSoldeData({ solde: 0 });
    } catch (error: any) {
      console.error("Erreur lors de la création du solde:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Erreur inconnue";
      toast.error("Échec de la création du solde. " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSolde = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolde) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Aucun token d'authentification trouvé");
      }
     await axios.put(
        `${apiUrl}/soldes`,
        { value: newSoldeData.solde },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Solde mis à jour avec succès!");
      await fetchSoldes();
      setShowPopup(false);
      setSelectedSolde(null);
      setNewSoldeData({ solde: 0 });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du solde:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Erreur inconnue";
      toast.error("Échec de la mise à jour du solde. " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce solde?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Aucun token d'authentification trouvé");
      }

      await axios.delete(`${apiUrl}/soldes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Solde supprimé avec succès!");
      await fetchSoldes();
    } catch (error: any) {
      console.error("Erreur lors de la suppression du solde:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Erreur inconnue";
      toast.error("Échec de la suppression du solde. " + errorMessage);
    }
  };

  const indexOfLastSolde = (currentPage + 1) * soldesPerPage;
  const indexOfFirstSolde = currentPage * soldesPerPage;
  const currentSoldes = filteredSoldes.slice(
    indexOfFirstSolde,
    indexOfLastSolde
  );

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#dfd750]"></div>
          <p className="ml-4 text-gray-600">Chargement des remise...</p>
        </div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchSoldes}
            className="bg-[#9f9911] text-white px-4 py-2 rounded hover:bg-[#6e6a0c] flex items-center"
          >
            <FiRefreshCw className="mr-2" /> Réessayer
          </button>
        </div>
      </AdminLayout>
    );

  if (soldes.length === 0 && !loading && !error) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Aucun solde disponible
            </h2>
            <p className="text-gray-600 mb-6">
              Il n'y a actuellement aucun solde dans la base de données.
            </p>
            <button
              onClick={() => {
                setSelectedSolde(null);
                setNewSoldeData({ solde: 0 });
                setShowPopup(true);
              }}
              className="px-6 py-3 bg-[#9f9911] text-white rounded-md hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750] shadow-md transition-all duration-200"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Créer un nouveau solde
            </button>
          </div>

          {showPopup && (
            <div className="fixed inset-0 bg-[#00000031] flex justify-center items-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-6 rounded-md w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Créer un Solde
                  </h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <form onSubmit={handleCreateSolde} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      solde du Solde
                    </label>
                    <input
                      type="number"
                      name="solde"
                      value={newSoldeData.solde}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-[#9f9911] text-white rounded-md hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750] disabled:opacity-50"
                  >
                    {loading ? "En cours..." : "Créer"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Gestion des Remise
          </h2>
          <button
            onClick={() => {
              setSelectedSolde(null);
              setNewSoldeData({ solde: 0 });
              setShowPopup(true);
            }}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Créer un Solde
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-grow">
              {/* <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Rechercher des remise..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
              /> */}
            </div>
            {/* <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-md ${
                showFilters ? "bg-[#f3f1cc] border-[#d9d262]" : ""
              }`}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-600" />
              <span className="text-gray-700">Filtres</span>
              <FontAwesomeIcon
                icon={showFilters ? faChevronUp : faChevronDown}
                className="ml-2 text-gray-600"
              />
            </button> */}
            {/* <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center shadow-md"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Réinitialiser
            </button> */}
            <button
              onClick={fetchSoldes}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2" size={16} />
              Actualiser
            </button>
          </div>

          {/* <AnimatePresence>
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
                        solde Minimum
                      </label>
                      <input
                        type="number"
                        name="minValue"
                        value={filters.minValue}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                        placeholder="solde Minimum"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        solde Maximum
                      </label>
                      <input
                        type="number"
                        name="maxValue"
                        value={filters.maxValue}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                        placeholder="solde Maximum"
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
          </AnimatePresence> */}
        </div>

        <div className="overflow-x-auto bg-white rounded-md shadow-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  solde
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Date de création
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSoldes.length > 0 ? (
                currentSoldes.map((solde, index) => (
                  <motion.tr
                    key={solde.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b even:bg-gray-100 odd:bg-white hover:bg-gray-200 transition-colors"
                  >
                    <td className="p-4 text-gray-700">{solde.id}</td>
                    <td className="p-4 text-green-600 font-bold">
                      {solde.solde}%
                    </td>
                    <td className="p-4 text-gray-700">
                      {new Date(solde.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleModify(solde)}
                          className="text-[#9f9911] hover:text-[#363504] mr-2"
                        >
                          <FiEdit size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Aucun solde trouvé correspondant à vos critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex justify-center mt-6">
            <ReactPaginate
              previousLabel={"Précédent"}
              nextLabel={"Suivant"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination flex space-x-2 items-center"}
              pageLinkClassName={
                "px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-[#f3f1cc] hover:border-[#d9d262] transition-colors duration-200"
              }
              previousLinkClassName={
                "px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-[#f3f1cc] hover:border-[#d9d262] transition-colors duration-200"
              }
              nextLinkClassName={
                "px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-[#f3f1cc] hover:border-[#d9d262] transition-colors duration-200"
              }
              disabledClassName={
                "opacity-50 cursor-not-allowed hover:bg-transparent"
              }
              activeClassName={"bg-[#f9f8e6] border-[#e6e297] text-[#9f9911]"}
            />
          </div>
        )}

        {showPopup && (
          <div className="fixed inset-0 bg-[#00000031] flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-md w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedSolde ? "Modifier le Solde" : "Créer un Solde"}
                </h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <form
                onSubmit={selectedSolde ? handleUpdateSolde : handleCreateSolde}
                className="space-y-4"
              >
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    solde du Solde
                  </label>
                  <input
                    type="number"
                    name="solde"
                    value={newSoldeData.solde}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-[#9f9911] text-white rounded-md hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750] disabled:opacity-50"
                >
                  {loading
                    ? "En cours..."
                    : selectedSolde
                    ? "Modifier"
                    : "Créer"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SoldePage;