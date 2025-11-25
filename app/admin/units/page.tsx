"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faTrash,
    faArchive,
    faPlus,
    faTimes,
    faFilter,
    faSearch,
    faChevronDown,
    faChevronUp,
    faRuler,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";
import dynamic from "next/dynamic";
import { getCookie } from 'cookies-next';

interface StorageCenter {
    id: string;
    name: string;
}

interface StorageVolume {
    id: string;
    value: string;
}

interface customer {
    firstName: string;
    lastName: string;
    email: string;
}
interface Booking {
    id: string;
    StripePaymentId: string;
    createdAt: string;
    customerId: number;
    durationMonths: number;
    monthlyPayment: boolean;
    paymentStatus: string;
    servicesCount: number;
    startDate: string;
    status: string;
    totalPrice: string;
    unitId: number;
    updatedAt: string;
    customer: customer | null;
}

interface StorageUnit {
    id: string;
    storageCenterName: string;
    pricePerMonth: number;
    available: boolean;
    storageCenterId: string;
    volume: string;
    code: string;
    images: string[];
    features: string[];
    createdAt: string;
    lastBookingDate: string;
    booking: Booking | null;
}

interface NewUnitData {
    pricePerMonth: number;
    available: boolean;
    storageCenterId: string;
    volume: string;
    code: string;
    images: string[];
    features: string[];
    updatedAt?: string;
}

interface Filters {
    minPrice: string;
    maxPrice: string;
    available: string;
    storageCenterId: string;
    volume: string;
    features: string[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

const VolumeFormModal = dynamic(
    () => import("@/components/admin/locations/VolumeFormModel"),
    { ssr: false }
);

const StorageUnitPage = () => {
    const [newUnitData, setNewUnitData] = useState<NewUnitData>({
        pricePerMonth: 0,
        available: true,
        storageCenterId: "",
        volume: "",
        code: "",
        images: [],
        features: [],
    });
    const [showBookingPopup, setShowBookingPopup] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [volumeValue, setVolumeValue] = useState<number>(0);
    const [showVolumePopup, setShowVolumePopup] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [storageCenters, setStorageCenters] = useState<StorageCenter[]>([]);
    const [storageVolumes, setStorageVolumes] = useState<StorageVolume[]>([]);
    const [units, setUnits] = useState<StorageUnit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [unitsPerPage] = useState<number>(10);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({
        minPrice: "",
        maxPrice: "",
        available: "",
        storageCenterId: "",
        volume: "",
        features: [],
    });

    const fetchStorageCentersAndUnits = async () => {
        try {
            const token = localStorage.getItem("token");

            const storageResponse = await axios.get(`${apiUrl}/storage`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStorageCenters(storageResponse.data);

            const unitsResponse = await axios.get(`${apiUrl}/storage/units`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnits(unitsResponse.data);
        } catch (err) {
            setError("Échec du chargement des données.");
            toast.error("Échec du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStorageVolumes = async () => {
        try {
            const token = localStorage.getItem("token");

            const volumesResponse = await axios.get(`${apiUrl}/storage/volumes/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStorageVolumes(volumesResponse.data);
        } catch (err) {
            setError("Échec du chargement des tailles de stockage.");
            toast.error("Échec du chargement des tailles de stockage.");
        }
    };

    useEffect(() => {
        fetchStorageCentersAndUnits();
        fetchStorageVolumes();
    }, []);

    const BookingPopup = () => {
        if (!selectedBooking) return null;

        return (
            <div className="fixed inset-0 bg-[#00000054] bg-opacity-50 flex justify-center items-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-md w-full max-w-md"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Détails de la dernier réservation</h3>
                        <button
                            onClick={() => setShowBookingPopup(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium">ID:</span>
                            <span>{selectedBooking.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Name Client:</span>
                            <span>{selectedBooking.customer?.firstName} {selectedBooking.customer?.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Email Client:</span>
                            <span>{selectedBooking.customer?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Date de début:</span>
                            <span>{new Date(selectedBooking.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Durée:</span>
                            <span>{selectedBooking.durationMonths} mois</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Prix total:</span>
                            <span className="font-bold">{selectedBooking.totalPrice}€</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Statut paiement:</span>
                            <span className={`px-2 py-1 rounded text-xs ${selectedBooking.paymentStatus === 'PAID'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {selectedBooking.paymentStatus}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };
    const applyFilters = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const cleanFilters = Object.entries(filters).reduce(
                (acc, [key, value]) => {
                    if (
                        value !== "" &&
                        value !== null &&
                        (Array.isArray(value) ? value.length > 0 : true)
                    ) {
                        acc[key] = value;
                    }
                    return acc;
                },
                {} as Record<string, any>
            );
            const response = await axios.get(`${apiUrl}/storage/units/filter`, {
                headers: { Authorization: `Bearer ${token}` },
                params: cleanFilters,
            });
            setUnits(response.data);
            setCurrentPage(0);
            toast.success("Filtres appliqués avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'application des filtres:", error);
            toast.error("Échec de l'application des filtres.");
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = async () => {
        setFilters({
            minPrice: "",
            maxPrice: "",
            available: "",
            storageCenterId: "",
            volume: "",
            features: [],
        });

        try {
            const token = localStorage.getItem("token");
            const unitsResponse = await axios.get(`${apiUrl}/storage/units`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnits(unitsResponse.data);
            setCurrentPage(0);
            toast.success("Filtres réinitialisés !");
        } catch (error) {
            toast.error("Échec de la réinitialisation des filtres.");
        }
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilterFeatureChange = (feature: string) => {
        setFilters((prev) => {
            const features = prev.features.includes(feature)
                ? prev.features.filter((f) => f !== feature)
                : [...prev.features, feature];
            return { ...prev, features };
        });
    };

    const filteredUnits = units.filter((unit) => {
        const unitCode = unit.code || "";
        return unitCode.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const pageCount = Math.ceil(filteredUnits.length / unitsPerPage);

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const handleFeatureChange = (feature: string) => {
        setNewUnitData((prevData) => {
            const updatedFeatures = prevData.features.includes(feature)
                ? prevData.features.filter((f) => f !== feature)
                : [...prevData.features, feature];

            return {
                ...prevData,
                features: updatedFeatures,
            };
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setNewUnitData({
            ...newUnitData,
            [name]: value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImageFiles((prevFiles) => [...prevFiles, ...files]);
        }
    };

    const handleUpdateUnit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token || !selectedUnit) return;

            const formData = new FormData();

            formData.append(
                "pricePerMonth",
                parseFloat(newUnitData.pricePerMonth.toString()).toString()
            );
            formData.append("available", newUnitData.available.toString());
            formData.append("storageCenterId", newUnitData.storageCenterId);
            formData.append("code", newUnitData.code);
            formData.append("volume", newUnitData.volume);



            if (newUnitData.features && newUnitData.features.length > 0) {
                newUnitData.features.forEach((feature, index) => {
                    formData.append(`features[${index}]`, feature);
                });
            }

            if (imageFiles.length > 0) {
                imageFiles.forEach((file) => {
                    formData.append("images", file);
                });
            }

            await axios.patch(
                `${apiUrl}/storage/units/${selectedUnit.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const unitsResponse = await axios.get(`${apiUrl}/storage/units`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnits(unitsResponse.data);

            setShowPopup(false);
            setImageFiles([]);
            setNewUnitData({
                pricePerMonth: 0,
                available: true,
                storageCenterId: "",
                volume: "",
                code: "",
                images: [],
                features: [],
            });

            toast.success("Unité mise à jour avec succès !");
        } catch (error: any) {
            console.error(
                "Erreur lors de la mise à jour de l'unité:",
                error.response?.data || error.message
            );
            toast.error(
                "Échec de la mise à jour de l'unité. " +
                (error.response?.data?.message || "")
            );
        }
    };

    const handleCreateUnit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const formData = new FormData();

            formData.append("pricePerMonth", newUnitData.pricePerMonth.toString());
            formData.append("available", newUnitData.available ? "true" : "false");
            formData.append("storageCenterId", newUnitData.storageCenterId);
            formData.append("volume", newUnitData.volume);
            formData.append("code", newUnitData.code);

            if (newUnitData.features && newUnitData.features.length > 0) {
                newUnitData.features.forEach((feature, index) => {
                    formData.append(`features[${index}]`, feature);
                });
            }

            if (imageFiles.length > 0) {
                imageFiles.forEach((file) => {
                    formData.append("images", file);
                });
            }

            await axios.post(`${apiUrl}/storage/units`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Unité créée avec succès !");

            const unitsResponse = await axios.get(`${apiUrl}/storage/units`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnits(unitsResponse.data);
            setShowPopup(false);
            setImageFiles([]);
            setNewUnitData({
                pricePerMonth: 0,
                available: true,
                storageCenterId: "",
                volume: "",
                code: "",
                images: [],
                features: [],
            });
        } catch (error: any) {
            console.error(
                "Erreur lors de la création de l'unité:",
                error.response?.data || error.message
            );
            toast.error(
                "Échec de la création de l'unité. " +
                (error.response?.data?.message || error.message || "")
            );
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
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

    const handleModify = (unit: StorageUnit) => {
        setSelectedUnit(unit);
        setNewUnitData({
            pricePerMonth: unit.pricePerMonth,
            available: unit.available,
            storageCenterId: unit.storageCenterId,
            volume: unit.volume,
            code: unit.code,
            features: unit.features || [],
            images: unit.images || [],
            updatedAt: unit.lastBookingDate || unit.createdAt
        });
        setShowPopup(true);
    };

    const handleUpdateAvailability = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const currentUnit = units.find((unit) => unit.id === id);
            if (!currentUnit) return;

            const newAvailabilityStatus = !currentUnit.available;

            await axios.patch(
                `${apiUrl}/storage/units/${id}/status`,
                {
                    available: newAvailabilityStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const unitsResponse = await axios.get(`${apiUrl}/storage/units`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setUnits(unitsResponse.data);
            toast.success(
                `Unité ${newAvailabilityStatus
                    ? "marquée comme disponible"
                    : "marquée comme indisponible"
                } !`
            );
        } catch (error: any) {
            console.error(
                "Erreur lors de la mise à jour de la disponibilité:",
                error.response?.data || error.message
            );
            toast.error("Échec de la mise à jour de la disponibilité.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = getCookie('token');
            console.log(token);
            if (!token) return;
            await axios.patch(
                `${apiUrl}/storage/units/${id}/hide`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const unitsResponse = await axios.get(`${apiUrl}/storage/units`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUnits(unitsResponse.data);
            toast.success("Unité supprimée avec succès !");
        } catch (error: any) {
            console.error(
                "Erreur lors de la suppression de l'unité:",
                error.response?.data || error.message
            );
            toast.error("Échec de la suppression de l'unité.");
        }
    };


    const ImageCard = ({
        file,
        onRemove,
    }: {
        file: File | string;
        onRemove: () => void;
    }) => {
        const getImageUrl = () => {
            if (typeof file === 'string') {
                if (file.startsWith('http')) {
                    return file;
                }
                return `${apiUrl}${file}`;
            }
            return URL.createObjectURL(file);
        };

        const imageUrl = getImageUrl();

        return (
            <div className="relative group">
                <img
                    src={imageUrl}
                    alt="Selected"
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onRemove();
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                </button>
            </div>
        );
    };

    const availableFeatures = [
        "Accès 24/7",
        "Caméras de surveillance",
        "Climatisation",
        "Système d'alarme",
        "Accès biométrique",
    ];

    const indexOfLastUnit = (currentPage + 1) * unitsPerPage;
    const indexOfFirstUnit = currentPage * unitsPerPage;
    const currentUnits = filteredUnits.slice(indexOfFirstUnit, indexOfLastUnit);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#dfd750]"></div>
            </div>
        );
    if (error) return <p className="text-red-500 text-center text-xl mt-6">{error}</p>;
    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-6">
                <ToastContainer />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Unités de Stockage
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Gestion des unités de stockage disponibles
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setSelectedUnit(null);
                                setNewUnitData({
                                    pricePerMonth: 0,
                                    available: true,
                                    storageCenterId: "",
                                    volume: "",
                                    code: "",
                                    images: [],
                                    features: [],
                                });
                                setImageFiles([]);
                                setShowPopup(true);
                            }}
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2 w-4 h-4" />
                            <span>Créer une Unité</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowVolumePopup(true)}
                            className="flex items-center justify-center px-4 py-2 border border-transparent bg-green-600 hover:bg-green-500 text-sm text-white  font-medium rounded-md shadow-sm transition-all duration-200"
                        >
                            <FontAwesomeIcon icon={faRuler} className="mr-2 w-4 h-4" />
                            <span>Ajouter une Taille</span>
                        </motion.button>
                    </div>
                </div>

                {showVolumePopup && (
                    <VolumeFormModal
                        showPopup={showVolumePopup}
                        setShowPopup={setShowVolumePopup}
                        handleSubmit={handleCreateVolume}
                        volumeValue={volumeValue}
                        setVolumeValue={setVolumeValue}
                    />
                )}

                <div className="mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Rechercher des unités..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-md ${showFilters ? "bg-[#f3f1cc] border-[#d9d262]" : ""
                                }`}
                        >
                            <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-600" />
                            <span className="text-gray-700">Filtres</span>
                            <FontAwesomeIcon
                                icon={showFilters ? faChevronUp : faChevronDown}
                                className="ml-2 text-gray-600"
                            />
                        </button>
                        <button
                            onClick={() => resetFilters()}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center shadow-md"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Réinitialiser
                        </button>
                        <button
                            onClick={fetchStorageCentersAndUnits}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Disponibilité
                                            </label>
                                            <select
                                                name="available"
                                                value={filters.available}
                                                onChange={handleFilterChange}
                                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                                            >
                                                <option value="">Tous</option>
                                                <option value="true">Disponible</option>
                                                <option value="false">Indisponible</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Centre de Stockage
                                            </label>
                                            <select
                                                name="storageCenterId"
                                                value={filters.storageCenterId}
                                                onChange={handleFilterChange}
                                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                                            >
                                                <option value="">Tous les Centres</option>
                                                {storageCenters.map((center) => (
                                                    <option key={center.id} value={center.id}>
                                                        {center.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Taille de Stockage
                                            </label>
                                            <select
                                                name="volume"
                                                value={filters.volume}
                                                onChange={handleFilterChange}
                                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                                            >
                                                <option value="">Toutes les tailles</option>
                                                {storageVolumes.map((volume) => (
                                                    <option key={volume.id} value={volume.id}>
                                                        {volume.value}
                                                    </option>
                                                ))}
                                            </select>
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

                <div className="overflow-hidden rounded-lg shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            ID / Box
                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Taille
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Prix/mois
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Dernier Client
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            Création
                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Dernière réservation
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUnits.length > 0 ? (
                                    currentUnits.map((unit, index) => (
                                        <motion.tr
                                            key={unit.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.03 }}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-[#f3f1cc] rounded-full flex items-center justify-center">
                                                        <span className="text-[#9f9911] font-medium">#{String(unit.id).slice(0, 2)}</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{unit.storageCenterName}</div>
                                                        <div className="text-sm text-gray-500">Ref: {unit.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {unit.volume || 'N/A'} m²
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {unit.pricePerMonth}€
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`flex-shrink-0 h-3 w-3 rounded-full ${unit.available ? "bg-green-400" : "bg-red-400"}`}></span>
                                                    <span className={`ml-2 text-sm font-medium ${unit.available ? "text-green-600" : "text-red-600"}`}>
                                                        {unit.available ? "Disponible" : "Occupé"}
                                                    </span>
                                                </div>
                                                {unit.booking && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Jusqu'au {new Date(unit.booking.updatedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {unit.booking?.customer ? (
                                                    <div className="text-sm">
                                                        <div className="font-medium text-gray-900">
                                                            {unit.booking.customer.firstName} {unit.booking.customer.lastName}
                                                        </div>
                                                        <div className="text-gray-500 text-xs">
                                                            {unit.booking.customer.email}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500 italic">Aucune réservation</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {unit.createdAt ? new Date(unit.createdAt).toLocaleDateString() : new Date(unit.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {unit.lastBookingDate ? (
                                                    <>
                                                        <div>{new Date(unit.lastBookingDate).toLocaleDateString()}</div>
                                                    </>
                                                ) : new Date(unit.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleUpdateAvailability(unit.id)}
                                                        className="p-1 rounded-full hover:bg-[#f9f8e6] transition-colors cursor-pointer"
                                                        title="Changer le statut"
                                                        aria-label="Changer le statut"
                                                    >
                                                        {unit.available ? (<svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-green-400 hover:text-green-800 transition-colors"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        ) : (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5 text-red-400 hover:text-red-800 transition-colors"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-10.54a1 1 0 00-1.415-1.415L10 8.586 7.875 6.46a1 1 0 00-1.415 1.415L8.586 10l-2.126 2.125a1 1 0 101.415 1.415L10 11.414l2.125 2.126a1 1 0 001.415-1.415L11.414 10l2.126-2.125z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleModify(unit)}
                                                        className="text-[#9f9911] hover:text-[#363504] mr-2"
                                                    >
                                                        <FiEdit size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(unit.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                    {unit.booking && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBooking(unit.booking);
                                                                setShowBookingPopup(true);
                                                            }}
                                                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-purple-50 transition-colors"
                                                            title="Détails réservation"
                                                            aria-label="Détails réservation"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune unité trouvée</h3>
                                                <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
                                                <button
                                                    onClick={() => resetFilters()}
                                                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#9f9911] hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750]"
                                                >
                                                    Réinitialiser les filtres
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

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
                        disabledClassName={"opacity-50 cursor-not-allowed hover:bg-transparent"}
                        activeClassName={"bg-[#f9f8e6] border-[#e6e297] text-[#9f9911]"}
                    />
                </div>
                {showPopup && (
                    <div className="fixed inset-0 bg-[#00000042] bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8 overflow-hidden flex flex-col"
                            style={{ maxHeight: "90vh" }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                    {selectedUnit ? "Modifier l'Unité" : "Créer une Unité"}
                                </h2>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Fermer"
                                >
                                    <FontAwesomeIcon icon={faTimes} size="lg" />
                                </button>
                            </div>

                            {/* Content - Scrollable area */}
                            <div className="overflow-y-auto p-6 flex-1">
                                <form onSubmit={selectedUnit ? handleUpdateUnit : handleCreateUnit} className="space-y-4">
                                    {/* Storage Center */}
                                    <div className="space-y-2">
                                        <label htmlFor="storageCenterId" className="block text-sm font-medium text-gray-700">
                                            Centre de Stockage
                                        </label>
                                        <select
                                            id="storageCenterId"
                                            name="storageCenterId"
                                            value={newUnitData.storageCenterId}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]"
                                        >
                                            <option value="">Sélectionner un centre</option>
                                            {storageCenters.map((center) => (
                                                <option key={center.id} value={center.id}>{center.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Storage Size */}
                                    <div className="space-y-2">
                                        <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                                            Taille de Stockage
                                        </label>
                                        <select
                                            id="volume"
                                            name="volume"
                                            value={newUnitData.volume}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]"
                                        >
                                            <option value="">Sélectionner une taille</option>
                                            {storageVolumes.map((volume) => (
                                                <option key={volume.id} value={volume.value}>{volume.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Price and Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="pricePerMonth" className="block text-sm font-medium text-gray-700">
                                                Prix par Mois
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    id="pricePerMonth"
                                                    name="pricePerMonth"
                                                    value={newUnitData.pricePerMonth}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]"
                                                    placeholder="0.00"
                                                />
                                                <span className="absolute right-3 top-3 text-gray-500">€</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                                Code
                                            </label>
                                            <input
                                                type="text"
                                                id="code"
                                                name="code"
                                                value={newUnitData.code}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]"
                                                placeholder="Code unité"
                                            />
                                        </div>
                                    </div>
                                    {/* Last Reservation Date */}
                                    {selectedUnit && (
                                        <div className="space-y-2">
                                            <label htmlFor="lastReservationDate" className="block text-sm font-medium text-gray-700">
                                                Dernière réservation
                                            </label>
                                            <input
                                                type="date"
                                                id="lastReservationDate"
                                                name="lastReservationDate"
                                                value={newUnitData.updatedAt ? new Date(newUnitData.updatedAt).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setNewUnitData({ ...newUnitData, updatedAt: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]"
                                            />
                                        </div>
                                    )}
                                    {/* Images */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Images
                                        </label>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {imageFiles.map((file, index) => (
                                                <ImageCard
                                                    key={index}
                                                    file={file}
                                                    onRemove={() => {
                                                        setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
                                                    }}
                                                />
                                            ))}
                                            {newUnitData.images.map((image, index) => (
                                                <ImageCard
                                                    key={`existing-${index}`}
                                                    file={image}
                                                    onRemove={() => {
                                                        setNewUnitData((prev) => ({
                                                            ...prev,
                                                            images: prev.images.filter((_, i) => i !== index),
                                                        }));
                                                    }}
                                                />
                                            ))}
                                            <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#dfd750] transition-colors">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <FontAwesomeIcon icon={faPlus} className="text-gray-400" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Caractéristiques
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                            {availableFeatures.map((feature) => (
                                                <label key={feature} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={newUnitData.features.includes(feature)}
                                                        onChange={() => handleFeatureChange(feature)}
                                                        className="h-4 w-4 text-[#9f9911] rounded focus:ring-[#dfd750]"
                                                    />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t bg-gray-50">
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPopup(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={selectedUnit ? handleUpdateUnit : handleCreateUnit}
                                        className="px-4 py-2 text-sm font-medium text-white bg-[#9f9911] rounded-md hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
                                    >
                                        {selectedUnit ? "Enregistrer" : "Créer"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
            {showBookingPopup && <BookingPopup />}
        </AdminLayout>
    );
};

export default StorageUnitPage;