"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faSortAlphaDown
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";
import dynamic from "next/dynamic";
import iconLogo from "@/public/assets/image/position.png";
import { getCookie } from 'cookies-next';
const StorageFormModal = dynamic(
  () => import("@/components/admin/locations/StorageFormModal"),
  { ssr: false }
);
const StorageList = dynamic(
  () => import("@/components/admin/locations/StorageList"),
  { ssr: false }
);
const VolumeFormModal = dynamic(
  () => import("@/components/admin/locations/VolumeFormModel"),
  { ssr: false }
);
const MapComponent = dynamic(
  () => import("@/components/admin/locations/MapComponent"),
  { ssr: false }
);

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

const LocationsPage = () => {
  const [storageCenters, setStorageCenters] = useState<any[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStoreData, setNewStoreData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    lat: "",
    lng: "",
    codeGate: ""
  });
  const [editStoreData, setEditStoreData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [showPopup, setShowPopup] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6);
  const [sortType, setSortType] = useState("name");
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );
  const [volumeValue, setVolumeValue] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchStorageCenters();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isMounted) {
      import("leaflet").then((L) => {
        const icon = L.icon({
          iconUrl: iconLogo.src,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
        setCustomIcon(icon);
      });
    }
  }, [isMounted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editStoreData) {
      setEditStoreData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setNewStoreData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storeDataWithNumbers = {
        ...newStoreData,
        lat: parseFloat(newStoreData.lat),
        lng: parseFloat(newStoreData.lng),
      };

      const token = localStorage.getItem("token");
      await axios.post(`${apiUrl}/storage/`, storeDataWithNumbers, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewStoreData({
        name: "",
        description: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        lat: "",
        lng: "",
        codeGate: ""
      });

      setShowPopup(false);
      fetchStorageCenters();
      toast.success("Stockage créé avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la création du stockage.");
    }
  };

  const handleCreateVolume = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${apiUrl}/storage/volumes`,
        { value: volumeValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVolumeValue(0);
      setShowVolumePopup(false);
      toast.success("Taille ajoutée avec succès !");
    } catch (err) {
      toast.error("Erreur lors de l'ajout de la taille.");
    }
  };

  const fetchStorageCenters = async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/storage`, {
          headers: { Authorization: `Bearer ${token}` },
        });
              console.log(response.data);

        setStorageCenters(response.data);
        setFilteredCenters(response.data);
      }
      
    } catch (err) {
      setError("Erreur lors de la récupération des stockages.");
      if (typeof window !== "undefined") {
        toast.error("Erreur lors de la récupération des stockages.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/storage/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: searchTerm },
      });
      setFilteredCenters(response.data.data);
      setCurrentPage(0);
      toast.success("Recherche effectuée avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la recherche des stockages.");
    }
  };

  const handleSort = (type: string) => {
    setSortType(type);
    const sortedCenters = [...filteredCenters].sort((a, b) => {
      if (type === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    setFilteredCenters(sortedCenters);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = getCookie('token');
      console.log(token);

      await axios.patch(`${apiUrl}/storage/${id}/hide`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStorageCenters();
      toast.success("Le stockage a été archivé avec succès.");
    } catch (err) {
      console.log(err);
      toast.error("Erreur lors de la suppression du stockage.");
    }
  };

  const handleEdit = (center: any) => {
    setEditStoreData(center);
    setShowPopup(true);
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!editStoreData?.id) {
      toast.error("ID du stockage manquant.");
      return;
    }
    const updateData = {
      name: editStoreData.name,
      description: editStoreData.description,
      address: editStoreData.address,
      city: editStoreData.city,
      country: editStoreData.country,
      postalCode: editStoreData.postalCode,
      lat: parseFloat(editStoreData.lat),
      lng: parseFloat(editStoreData.lng),
      codeGate: editStoreData.codeGate
    };
    if (!updateData.name || !updateData.address || !updateData.city || !updateData.country || !updateData.postalCode) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (isNaN(updateData.lat) ){
      toast.error("Latitude invalide");
      return;
    }
    if (isNaN(updateData.lng)) {
      toast.error("Longitude invalide");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token d'authentification manquant.");
      return;
    }

    const response = await axios.patch(
      `${apiUrl}/storage/${editStoreData.id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setStorageCenters(prev => 
      prev.map(center => center.id === editStoreData.id ? response.data : center)
    );
    
    setFilteredCenters(prev =>
      prev.map(center => center.id === editStoreData.id ? response.data : center)
    );
    
    setEditStoreData(null);
    setShowPopup(false);
    toast.success("Stockage mis à jour avec succès !");
    
  } catch (err: any) {
    console.error("Erreur lors de la mise à jour :", err);
    
    let errorMessage = "Erreur lors de la mise à jour";
    if (err.response) {
      if (err.response.status === 401) {
        errorMessage = "Non autorisé - Veuillez vous reconnecter";
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
    }
    
    toast.error(errorMessage);
  }
};

  const pageCount = Math.ceil(filteredCenters.length / itemsPerPage);
  const currentItems = filteredCenters.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
        style={{ minHeight: "90vh" }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-3xl font-bold text-gray-800"
          >
            Gestion des Stockages
          </motion.h2>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditStoreData(null);
                setShowPopup(true);
              }}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Ajouter un Stockage
            </motion.button>
          </div>
        </div>

        {isMounted && showPopup && customIcon && (
          <StorageFormModal
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            editStoreData={editStoreData}
            newStoreData={newStoreData}
            setNewStoreData={setNewStoreData}
            setEditStoreData={setEditStoreData}
            handleChange={handleChange}
            handleSubmit={editStoreData ? handleUpdateStore : handleCreateStore}
            mapCenter={mapCenter}
            customIcon={customIcon}
          />
        )}

        {isMounted && showVolumePopup && (
          <VolumeFormModal
            showPopup={showVolumePopup}
            setShowPopup={setShowVolumePopup}
            handleSubmit={handleCreateVolume}
            volumeValue={volumeValue}
            setVolumeValue={setVolumeValue}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <label className="block text-gray-600 mb-4">
            Rechercher par Ville, Code Postal ou Nom
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1 flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Entrez une ville, un code postal ou un nom"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="bg-[#dfd750] text-white py-2 px-2 rounded-md ml-2 hover:bg-[#9f9911] transition-all"
              >
                <FontAwesomeIcon icon={faSearch} className="animate-pulse" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSort("name")}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
            >
              <FontAwesomeIcon icon={faSortAlphaDown} className="mr-2" />
              Trier par Alphabétique
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStorageCenters}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2" size={16} />
              Actualiser
            </motion.button>
          </div>
        </motion.div>

        {isMounted && (
          <StorageList
            currentItems={currentItems}
            loading={loading}
            error={error}
            loadingImages={loadingImages}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        )}

        <ToastContainer position="bottom-right" autoClose={5000} />
      </motion.div>
    </AdminLayout>
  );
};

export default LocationsPage;