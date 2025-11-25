"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilter,
    faSearch,
    faChevronDown,
    faChevronUp,
    faTimes,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";

interface Booking {
    id: number;
    customerId: number;
    unitId: number;
    startDate: string;
    durationMonths: number;
    status: string;
    paymentStatus: string;
    monthlyPayment: boolean;
    totalPrice: string;
    servicesCount: number;
    createdAt: string;
    updatedAt: string;
    StripePaymentId: string;
    customer: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    unit: {
        id: number;
        volume: number;
        pricePerMonth: string;
        code: string;
        storageCenter: {
            id: number;
            name: string;
            address: string;
            city: string;
            country: string;
            postalCode: string;
        };
    };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

const CancelledBookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [bookingsPerPage] = useState<number>(10);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [confirmCancel, setConfirmCancel] = useState<{
        show: boolean;
        booking: Booking | null;
    }>({ show: false, booking: null });

    const fetchCancelledBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error(
                    "Aucun token d'authentification trouvé. Veuillez vous reconnecter."
                );
            }
            const response = await axios.get(`${apiUrl}/bookings/all/cancelled`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);

            setBookings(response.data);
        } catch (err: any) {
            console.error("Détails de l'erreur:", err);
            const errorMessage =
                err.response?.data?.message || err.message || "Erreur inconnue";
            setError(`Échec de la récupération des réservations: ${errorMessage}`);
            toast.error(`Échec de la récupération des réservations: ${errorMessage}`);
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
            fetchCancelledBookings();
        }
    }, []);

    const handleCancelBooking = async (booking: Booking) => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + booking.durationMonths);

        const today = new Date();
        const daysBeforeEnd = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysBeforeEnd < 15) {
            toast.error("Impossible d'annuler : il reste moins de 15 jours avant la fin de la réservation.");
            return;
        }

        // Afficher la confirmation au lieu d'utiliser confirm()
        setConfirmCancel({ show: true, booking });
    };

    const confirmCancellation = async () => {
        if (!confirmCancel.booking) return;

        setCancellingId(confirmCancel.booking.id);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Aucun token d'authentification trouvé");
            }

            await axios.post(
                `${apiUrl}/payments/cancel-subscription`,
                { subscriptionId: confirmCancel.booking.StripePaymentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Réservation annulée avec succès !");
            await fetchCancelledBookings();
        } catch (error: any) {
            console.error("Erreur lors de l'annulation de la réservation:", error);
            const errorMessage =
                error.response?.data?.message || error.message || "Erreur inconnue";
            toast.error("Échec de l'annulation. " + errorMessage);
        } finally {
            setCancellingId(null);
            setConfirmCancel({ show: false, booking: null });
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            booking.customer.firstName.toLowerCase().includes(searchLower) ||
            booking.customer.lastName.toLowerCase().includes(searchLower) ||
            booking.unit.code.toLowerCase().includes(searchLower) ||
            booking.unit.storageCenter.name.toLowerCase().includes(searchLower)
        );
    });

    const pageCount = Math.ceil(filteredBookings.length / bookingsPerPage);

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    const indexOfLastBooking = (currentPage + 1) * bookingsPerPage;
    const indexOfFirstBooking = currentPage * bookingsPerPage;
    const currentBookings = filteredBookings.slice(
        indexOfFirstBooking,
        indexOfLastBooking
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR");
    };

    const calculateEndDate = (startDate: string, durationMonths: number) => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + durationMonths);
        return date.toLocaleDateString("fr-FR");
    };

    if (loading)
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#dfd750]"></div>
                    <p className="ml-4 text-gray-600">Chargement des réservations...</p>
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
                        onClick={fetchCancelledBookings}
                        className="bg-[#9f9911] text-white px-4 py-2 rounded hover:bg-[#6e6a0c] flex items-center"
                    >
                        <FiRefreshCw className="mr-2" /> Réessayer
                    </button>
                </div>
            </AdminLayout>
        );

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-6">
                <ToastContainer position="top-right" autoClose={3000} />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Réservations Annulées
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchCancelledBookings}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FiRefreshCw className="mr-2" size={16} />
                            Actualiser
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative flex-grow">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Rechercher des réservations..."
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
                    </div>
                    {/* Modal de confirmation d'annulation */}
                    <AnimatePresence>
                        {confirmCancel.show && confirmCancel.booking && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Confirmer l'annulation
                                        </h3>
                                        <button
                                            onClick={() => setConfirmCancel({ show: false, booking: null })}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-600 mb-2">
                                            Êtes-vous sûr de vouloir annuler la réservation #{confirmCancel.booking.id} ?
                                        </p>
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <FontAwesomeIcon
                                                        icon={faInfoCircle}
                                                        className="h-5 w-5 text-yellow-400"
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-yellow-700">
                                                        En attente de la confirmation du client. Vous disposez de 15 jours pour finaliser ou annuler la commande. La préparation de la box est en cours.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setConfirmCancel({ show: false, booking: null })}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            disabled={cancellingId === confirmCancel.booking.id}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={confirmCancellation}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                            disabled={cancellingId === confirmCancel.booking.id}
                                        >
                                            {cancellingId === confirmCancel.booking.id ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Traitement...
                                                </>
                                            ) : (
                                                "Confirmer l'annulation"
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Vous pouvez ajouter des filtres supplémentaires ici */}
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Statut
                                            </label>
                                            <select
                                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                                                disabled
                                            >
                                                <option>Annulé</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="overflow-x-auto bg-white rounded-md shadow-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Unité
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Centre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Période
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Prix
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBookings.length > 0 ? (
                                currentBookings.map((booking, index) => {
                                    const startDate = new Date(booking.startDate);
                                    const endDate = new Date(startDate);
                                    endDate.setMonth(endDate.getMonth() + booking.durationMonths);
                                    const today = new Date();
                                    const daysBeforeEnd = Math.floor(
                                        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                                    );

                                    return (
                                        <motion.tr
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="border-b even:bg-gray-100 odd:bg-white hover:bg-gray-200 transition-colors"
                                        >
                                            <td className="p-4 text-gray-700">{booking.id}</td>
                                            <td className="p-4 text-gray-700">
                                                {booking.customer.firstName} {booking.customer.lastName}
                                            </td>
                                            <td className="p-4 text-gray-700">
                                                {booking.unit.code} ({booking.unit.volume}m³)
                                            </td>
                                            <td className="p-4 text-gray-700">
                                                {booking.unit.storageCenter.name}
                                            </td>
                                            <td className="p-4 text-gray-700">
                                                {formatDate(booking.startDate)} -{" "}
                                                {calculateEndDate(booking.startDate, booking.durationMonths)}
                                            </td>
                                            <td className="p-4 text-green-600 font-bold">
                                                {booking.totalPrice}€
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                                    Annulé
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col space-y-2">
                                                    <button
                                                        onClick={() => {
                                                            // Afficher les détails de l'annulation
                                                            toast.info(
                                                                <div>
                                                                    <p>
                                                                        <strong>Détails de l'annulation :</strong>
                                                                    </p>
                                                                    <p>
                                                                        Annulé le : {formatDate(booking.updatedAt)}
                                                                    </p>
                                                                    <p>
                                                                        Paiement : {booking.paymentStatus === "PAID" ? "Payé" : "Non payé"}
                                                                    </p>
                                                                    <p>
                                                                        ID Stripe : {booking.StripePaymentId}
                                                                    </p>
                                                                </div>,
                                                                { autoClose: 5000 }
                                                            );
                                                        }}
                                                        className="text-[#9f9911] hover:text-[#363504] flex items-center"
                                                    >
                                                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                                        Détails
                                                    </button>

                                                    <button
                                                        onClick={() => handleCancelBooking(booking)}
                                                        className="text-red-600 hover:text-red-900 flex items-center"
                                                        disabled={cancellingId === booking.id}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                                        Annuler
                                                    </button>

                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center text-gray-500">
                                        Aucune réservation annulée trouvée.
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
            </div>
        </AdminLayout>
    );
};

export default CancelledBookingsPage;