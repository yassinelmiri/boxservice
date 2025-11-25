"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import {
    FiEdit,
    FiTrash2,
    FiCheck,
    FiX,
    FiPlus,
    FiSearch,
    FiCalendar,
    FiDollarSign,
    FiUser,
    FiRefreshCw,
    FiPackage,
    FiDownload,
    FiRepeat,
    FiClock,
} from "react-icons/fi";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";


interface User {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
    bookings?: any[];
}

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

interface Service {
    id: string;
    name: string;
    price: number;
}

interface Booking {
    id: string;
    userId: string;
    unitId: string;
    startDate: string;
    durationMonths: number;
    monthlyPayment: boolean;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    totalPrice: number;
    createdAt: string;
    customer?: User;
    unit?: Unit;
    services?: Service[];
}

interface Stats {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    revenue: number;
}

interface FormData {
    userId?: string;
    unitId?: string;
    startDate?: string;
    durationMonths?: number;
    monthlyPayment?: boolean;
    serviceIds?: string[];
    status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

const BookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({});
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [users, setUsers] = useState<User[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    const [stats, setStats] = useState<Stats>({
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);



    useEffect(() => {
        fetchBookings();
        fetchUsers();
        fetchUnits();
        fetchServices();
    }, []);

    useEffect(() => {
        if (bookings.length > 0) {
            const active = bookings.filter((b) => b.status === "CONFIRMED").length;
            const completed = bookings.filter((b) => b.status === "COMPLETED").length;
            const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
            const revenue = bookings
                .filter((b) => b.paymentStatus === "PAID")
                .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

            setStats({
                total: bookings.length,
                active,
                completed,
                cancelled,
                revenue,
            });
        }
    }, [bookings]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const response = await axios.get<Booking[]>(`${apiUrl}/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(response.data);
            setError(null);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred";
            setError("Failed to fetch bookings. " + errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const response = await axios.get<User[]>(`${apiUrl}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const fetchUnits = async () => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const response = await axios.get<Unit[]>(`${apiUrl}/storage/units`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnits(response.data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred";
            setError("Failed to fetch units. " + errorMessage);
            console.error("Failed to fetch units", err);
        }
    };

    const fetchServices = async () => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const response = await axios.get<Service[]>(
                `${apiUrl}/storage/services`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setServices(response.data);
        } catch (err) {
            console.error("Failed to fetch services", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (
            typeof window !== "undefined" &&
            window.confirm("Are you sure you want to delete this booking?")
        ) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${apiUrl}/bookings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(bookings.filter((booking) => booking.id !== id));
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError("Failed to delete booking. " + errorMessage);
                console.error(err);
            }
        }
    };

    const handleEdit = (booking: Booking) => {
        setEditingId(booking.id);
        setFormData({
            userId: booking.userId,
            unitId: booking.unitId,
            startDate: new Date(booking.startDate).toISOString().split("T")[0],
            monthlyPayment: booking.monthlyPayment,
            durationMonths: booking.durationMonths,
            serviceIds: booking.services?.map((s) => s.id) || [],
            status: booking.status,
            paymentStatus: booking.paymentStatus,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleSaveEdit = async () => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const response = await axios.patch<Booking>(
                `${apiUrl}/bookings/${editingId}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBookings(
                bookings.map((booking) =>
                    booking.id === editingId ? response.data : booking
                )
            );

            setEditingId(null);
            setFormData({});
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred";
            setError("Failed to update booking. " + errorMessage);
            console.error(err);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleServiceChange = (serviceId: string) => {
        const updatedServices = formData.serviceIds?.includes(serviceId)
            ? formData.serviceIds.filter((id) => id !== serviceId)
            : [...(formData.serviceIds || []), serviceId];

        setFormData({ ...formData, serviceIds: updatedServices });
    };

    const handleAddBooking = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
            const response = await axios.post<Booking>(`${apiUrl}/bookings`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBookings([...bookings, response.data]);
            setShowAddForm(false);
            setFormData({});
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError("Failed to add booking. " + errorMessage);
            console.error(err);
        }
    };

    const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
            await axios.patch(
                `${apiUrl}/bookings/${bookingId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBookings(
                bookings.map((booking) =>
                    booking.id === bookingId ? { ...booking, status: newStatus } : booking
                )
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(
                `Failed to update booking status to ${newStatus}. ${errorMessage}`
            );
            console.error(err);
        }
    };

    const handleUpdatePaymentStatus = async (
        bookingId: string,
        newStatus: Booking["paymentStatus"]
    ) => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            await axios.patch(
                `${apiUrl}/bookings/${bookingId}/payment`,
                { paymentStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBookings(
                bookings.map((booking) =>
                    booking.id === bookingId
                        ? { ...booking, paymentStatus: newStatus }
                        : booking
                )
            );
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred";
            setError(
                `Failed to update payment status to ${newStatus}. ${errorMessage}`
            );
            console.error(err);
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const searchFields = [
            booking.id?.toString(),
            booking.customer?.email,
            booking.customer?.firstName + " " + booking.customer?.lastName,
            booking.unit?.name,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            searchTerm === "" || searchFields.includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || booking.status === statusFilter;

        let matchesDate = true;
        if (dateFilter === "today") {
            const today = new Date().toISOString().split("T")[0];
            matchesDate = booking.startDate?.startsWith(today);
        } else if (dateFilter === "this-week") {
            const now = new Date();
            const weekStart = new Date(
                now.setDate(now.getDate() - now.getDay())
            ).toISOString();
            const weekEnd = new Date(now.setDate(now.getDate() + 6)).toISOString();
            matchesDate =
                booking.startDate >= weekStart && booking.startDate <= weekEnd;
        } else if (dateFilter === "this-month") {
            const now = new Date();
            const monthStart = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            ).toISOString();
            const monthEnd = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0
            ).toISOString();
            matchesDate =
                booking.startDate >= monthStart && booking.startDate <= monthEnd;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const sortedBookings = [...filteredBookings].sort((a, b) => {
        let aValue: any = a[sortField as keyof Booking];
        let bValue: any = b[sortField as keyof Booking];

        if (sortField === "user.name") {
            aValue = a.customer ? `${a.customer.firstName} ${a.customer.lastName}` : "";
            bValue = b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : "";
        } else if (sortField === "unit.name") {
            aValue = a.unit?.name || "";
            bValue = b.unit?.name || "";
        }

        if (sortField === "startDate" || sortField === "createdAt") {
            aValue = new Date(aValue || 0).getTime();
            bValue = new Date(bValue || 0).getTime();
        }

        if (sortField === "totalPrice" || sortField === "durationMonths") {
            aValue = Number(aValue || 0);
            bValue = Number(bValue || 0);
        }

        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const getStatusBadgeClasses = (status: Booking['status']) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "COMPLETED":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-[#f3f1cc] text-[#525008]";
        }
    };

    const getPaymentStatusBadgeClasses = (status: Booking["paymentStatus"]) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            case "REFUNDED":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    const renderBookingForm = (isEditing = false) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-3">
                {isEditing ? "Edit Booking" : "Add New Booking"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        User
                    </label>
                    <select
                        name="userId"
                        value={formData.userId || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.email} ({user.firstName} {user.lastName})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Storage Unit
                    </label>
                    <select
                        name="unitId"
                        value={formData.unitId || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                    >
                        <option value="">Select Unit</option>
                        {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.name || `Unit #${unit.id}`} - {unit.size}m² (
                                {unit.storageCenter?.name || "Unknown location"})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiCalendar className="text-gray-400" size={16} />
                        </div>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (months)
                    </label>
                    <input
                        type="number"
                        name="durationMonths"
                        value={formData.durationMonths || ""}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                    />
                </div>

                {isEditing && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status || "PENDING"}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Status
                            </label>
                            <select
                                name="paymentStatus"
                                value={formData.paymentStatus || "PENDING"}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="PAID">Paid</option>
                                <option value="FAILED">Failed</option>
                                <option value="REFUNDED">Refunded</option>
                            </select>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Services
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {services.map((service) => (
                        <div key={service.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`service-${service.id}`}
                                checked={formData.serviceIds?.includes(service.id)}
                                onChange={() => handleServiceChange(service.id)}
                                className="h-4 w-4 text-[#9f9911] focus:ring-[#ccc32d] border-gray-300 rounded"
                            />
                            <label
                                htmlFor={`service-${service.id}`}
                                className="ml-2 text-sm text-gray-900"
                            >
                                {service.name} (${service.price})
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
                        >
                            <FiX className="inline mr-1" /> Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-[#9f9911] text-white rounded-md hover:bg-[#6e6a0c]"
                        >
                            <FiCheck className="inline mr-1" /> Save Changes
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
                        >
                            <FiX className="inline mr-1" /> Cancel
                        </button>
                        <button
                            onClick={handleAddBooking}
                            className="px-4 py-2 bg-[#9f9911] text-white rounded-md hover:bg-[#6e6a0c]"
                        >
                            <FiCheck className="inline mr-1" /> Create Booking
                        </button>
                    </>
                )}
            </div>
        </div>
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedBookings.slice(indexOfFirstItem, indexOfLastItem);
    return (
        <AdminLayout>
            <div>
                {/* En-tête de page */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Gestion des réservations
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Visualisez et gérez toutes les réservations d'espaces de stockage
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0">
                       {/* <button
                            onClick={() => {
                                setShowAddForm(true);
                                setFormData({});
                            }}
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
                        >
                            <FiPlus className="mr-1" /> Nouvelle réservation
                        </button>*/}
                    </div>
                </div>

                {/* Cartes récapitulatives */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Réservations totales
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-[#f3f1cc]">
                                <FiPackage className="text-[#9f9911]" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Réservations actives
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.active}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100">
                                <FiCheck className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Annulées</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {stats.cancelled}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-red-100">
                                <FiX className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Chiffre d'affaires
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.revenue.toFixed(2)}€
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-100">
                                <FiDollarSign className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="float-right text-red-700 hover:text-red-900"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                )}

                {showAddForm && renderBookingForm(false)}

                {/* Filtres & Barre de recherche */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-4">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-0">
                            {/* Recherche */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FiSearch className="text-gray-400" size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher des réservations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent min-w-[250px]"
                                />
                            </div>

                            {/* Filtre Statut */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="py-2 px-3 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="PENDING">En attente</option>
                                <option value="CONFIRMED">Confirmé</option>
                                <option value="COMPLETED">Terminé</option>
                                <option value="CANCELLED">Annulé</option>
                            </select>

                            {/* Filtre Date */}
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="py-2 px-3 border rounded focus:ring-2 focus:ring-[#ccc32d] focus:border-transparent"
                            >
                                <option value="all">Toutes les dates</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="this-week">Cette semaine</option>
                                <option value="this-month">Ce mois-ci</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={fetchBookings}
                                className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                                title="Actualiser"
                            >
                                <FiRefreshCw size={16} />
                            </button>

                            <button
                                className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                                title="Exporter en CSV"
                            >
                                <FiDownload size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Résultats */}
                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <FiRefreshCw
                            className="animate-spin text-[#9f9911] mr-2"
                            size={24}
                        />
                        <span>Chargement des réservations...</span>
                    </div>
                ) : sortedBookings.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                            <FiPackage className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mt-4">
                            Aucune réservation trouvée
                        </h3>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                                ? "Essayez d'ajuster votre recherche ou vos filtres pour trouver ce que vous cherchez."
                                : "Il n'y a aucune réservation dans le système pour le moment. Créez votre première réservation pour commencer."}
                        </p>
                        {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setDateFilter("all");
                                }}
                                className="mt-4 px-4 py-2 bg-[#9f9911] text-white rounded-md hover:bg-[#6e6a0c]"
                            >
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
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
                                            Client
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Unité
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Date de début
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Durée
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Prix
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Statut
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Paiement
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.map((booking) => (
                                        <React.Fragment key={booking.id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{booking.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {booking.customer ? (
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <FiUser className="text-gray-500" size={14} />
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {booking.customer?.firstName}{" "}
                                                                    {booking.customer?.lastName}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {booking.customer?.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            Client inconnu
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {booking.unit ? (
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {booking.unit.name ||
                                                                    `Unité #${booking.unit.id}`}
                                                            </div>
                                                            <div className="text-xs">
                                                                {booking.unit.size}m² -{" "}
                                                                {booking.unit.storageCenter?.name || "Inconnu"}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        "Unité inconnue"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {booking.startDate &&
                                                        format(new Date(booking.startDate), "MMM d, yyyy")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {booking.monthlyPayment === true ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#f3f1cc] text-[#6e6a0c]">
                                                            <FiRepeat className="w-4 h-4" />
                                                            Année
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                            <FiRepeat className="w-4 h-4" />
                                                            {booking.durationMonths === 1 ? "Mois" : "Mois"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {Number(booking.totalPrice).toFixed(2)}€
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="relative">
                                                        <div
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                                                                booking.status
                                                            )}`}
                                                        >
                                                            {booking.status}
                                                        </div>
                                                        <div className="mt-1">
                                                            <select
                                                                value={booking.paymentStatus}
                                                                onChange={(e) => {
                                                                    const value = e.target
                                                                        .value as Booking["paymentStatus"];
                                                                    handleUpdatePaymentStatus(booking.id, value);
                                                                }}
                                                                className="text-xs border-0 bg-transparent text-gray-500 cursor-pointer hover:text-[#9f9911] focus:ring-0"
                                                            >
                                                                <option value="PENDING">
                                                                    Change to Pending
                                                                </option>
                                                                <option value="CONFIRMED">
                                                                    Change to Confirmed
                                                                </option>
                                                                <option value="COMPLETED">
                                                                    Change to Completed
                                                                </option>
                                                                <option value="CANCELLED">
                                                                    Change to Cancelled
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="relative">
                                                        <div
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClasses(
                                                                booking.paymentStatus
                                                            )}`}
                                                        >
                                                            {booking.paymentStatus}
                                                        </div>
                                                        <div className="mt-1">
                                                            <select
                                                                value={booking.paymentStatus}
                                                                onChange={(e) => {
                                                                    const value = e.target
                                                                        .value as Booking["paymentStatus"];
                                                                    handleUpdatePaymentStatus(booking.id, value);
                                                                }}
                                                                className="text-xs border-0 bg-transparent text-gray-500 cursor-pointer hover:text-[#9f9911] focus:ring-0"
                                                            >
                                                                <option value="PENDING">
                                                                    Change to Pending
                                                                </option>
                                                                <option value="PAID">Change to Paid</option>
                                                                <option value="FAILED">Change to Failed</option>
                                                                <option value="REFUNDED">
                                                                    Change to Refunded
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </td>
                                             
                                            </tr>
                                            {editingId === booking.id && (
                                                <tr>
                                                    <td className="p-0">
                                                        {renderBookingForm(true)}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                            <div className="flex-1 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">
                                            {(currentPage - 1) * itemsPerPage + 1}
                                        </span> to <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, sortedBookings.length)}
                                        </span> of <span className="font-medium">
                                            {sortedBookings.length}
                                        </span> bookings
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    {/* Affichage des numéros de page */}
                                    {Array.from({ length: Math.ceil(sortedBookings.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 border rounded-md text-sm font-medium ${currentPage === page
                                                ? 'bg-[#9f9911] text-white border-[#9f9911]'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedBookings.length / itemsPerPage)))}
                                        disabled={currentPage === Math.ceil(sortedBookings.length / itemsPerPage)}
                                        className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === Math.ceil(sortedBookings.length / itemsPerPage)
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default BookingsPage;
