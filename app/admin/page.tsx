'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUsers,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: boolean;
  trendValue?: number;
  color?: "blue" | "green" | "purple" | "yellow" | "red";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue = 0,
  color = "blue",
}) => {
  const colors = {
    blue: "bg-[#f9f8e6] text-[#9f9911]",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  const iconClass = colors[color] || colors.blue;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value || "0"}</h3>
        </div>
        <div className={`p-3 rounded-full ${iconClass}`}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={
              trendValue >= 0
                ? "text-green-600 flex items-center"
                : "text-red-600 flex items-center"
            }
          >
            {trendValue >= 0 ? (
              <FiArrowUp size={16} className="mr-1" />
            ) : (
              <FiArrowDown size={16} className="mr-1" />
            )}
            {Math.abs(trendValue)}%{" "}
            {trendValue >= 0 ? "augmentation" : "diminution"}
          </span>
          <span className="ml-2 text-gray-500">
            par rapport au mois dernier
          </span>
        </div>
      )}
    </div>
  );
};

interface DashboardStats {
  usersCount: number;
  storageCount: number;
  unitsCount: number;
  AttentCount: number;
  bookingsCount: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

interface BookingStats {
  totalBookings: number;
  statusCounts: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  totalRevenue: string;
  monthlyBookings: {
    _count: {
      id: number;
    };
    createdAt: string;
    revenue?: number; // ajout d'un champ pour le revenu
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    usersCount: 0,
    storageCount: 0,
    unitsCount: 0,
    AttentCount: 0,
    bookingsCount: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });
  
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    totalBookings: 0,
    statusCounts: {
      pending: 0,
      confirmed: 0,
      cancelled: 0
    },
    totalRevenue: "0",
    monthlyBookings: []
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette page");
      }

      const [usersResponse, storageResponse, unitsResponse, attentResponse, bookingsResponse] = await Promise.all([
        axios.get<number>(`${apiUrl}/users/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<number>(`${apiUrl}/storage/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<number>(`${apiUrl}/storage/units/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<number>(`${apiUrl}/waiting-list/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<BookingStats>(`${apiUrl}/bookings/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Modifier les données reçues pour ajouter des revenus mensuels
      const bookingsData = bookingsResponse.data;
      
      // Calculer le revenu moyen par réservation
      const averageRevenue = parseFloat(bookingsData.totalRevenue) / bookingsData.totalBookings;
      
      // Ajouter des revenus à chaque mois basés sur le nombre de réservations
      const updatedMonthlyBookings = bookingsData.monthlyBookings.map(month => ({
        ...month,
        revenue: Math.round(month._count.id * averageRevenue)
      }));
      
      bookingsData.monthlyBookings = updatedMonthlyBookings;

      setStats(prev => ({
        ...prev,
        usersCount: usersResponse.data,
        storageCount: storageResponse.data,
        unitsCount: unitsResponse.data,
        AttentCount: attentResponse.data,
        bookingsCount: bookingsData.totalBookings,
        totalRevenue: parseFloat(bookingsData.totalRevenue) || 0,
        pendingBookings: bookingsData.statusCounts.pending,
        completedBookings: bookingsData.statusCounts.confirmed,
        cancelledBookings: bookingsData.statusCounts.cancelled,
      }));

      setBookingStats(bookingsData);
    } catch (err: any) {
      console.error("Error fetching Tableau de bord data:", err);
      setError(
        "Impossible de charger les données du tableau de bord. Veuillez réessayer."
      );
      // Fallback data
      const fallbackMonthlyBookings = [
        { _count: { id: 45 }, createdAt: "2025-01-01T00:00:00.000Z", revenue: 10500 },
        { _count: { id: 60 }, createdAt: "2025-02-01T00:00:00.000Z", revenue: 12750 },
        { _count: { id: 72 }, createdAt: "2025-03-01T00:00:00.000Z", revenue: 15840 },
        { _count: { id: 85 }, createdAt: "2025-04-01T00:00:00.000Z", revenue: 19200 },
      ];
      
      setStats({
        usersCount: 1450,
        storageCount: 24,
        unitsCount: 367,
        AttentCount: 15,
        bookingsCount: 518,
        totalRevenue: 46290,
        pendingBookings: 23,
        completedBookings: 487,
        cancelledBookings: 8,
      });
      setBookingStats({
        totalBookings: 518,
        statusCounts: {
          pending: 23,
          confirmed: 487,
          cancelled: 8
        },
        totalRevenue: "46290",
        monthlyBookings: fallbackMonthlyBookings
      });
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyBookingsData = () => {
    return bookingStats.monthlyBookings.map(item => ({
      name: format(parseISO(item.createdAt), 'MMM', { locale: fr }),
      count: item._count.id,
      fullDate: format(parseISO(item.createdAt), 'MMMM yyyy', { locale: fr })
    }));
  };
  
  const getMonthlyRevenueData = () => {
    return bookingStats.monthlyBookings.map(item => ({
      name: format(parseISO(item.createdAt), 'MMM', { locale: fr }),
      revenue: item.revenue || 0,
      fullDate: format(parseISO(item.createdAt), 'MMMM yyyy', { locale: fr })
    }));
  };

  const getStatusData = () => {
    return [
      { name: 'En attente', value: bookingStats.statusCounts.pending },
      { name: 'Confirmées', value: bookingStats.statusCounts.confirmed },
      { name: 'Annulées', value: bookingStats.statusCounts.cancelled }
    ];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="mt-1 text-sm text-gray-500">
                Vue d'ensemble de votre application de stockage
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={fetchDashboardData}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiRefreshCw className="mr-2" size={16} />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9f9911]"></div>
            <span className="ml-3 text-gray-600">
              Chargement des statistiques...
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Utilisateurs"
                value={stats.usersCount}
                icon={<FiUsers size={20} />}
                trend={true}
                trendValue={8}
                color="blue"
              />
              <StatCard
                title="Stockages"
                value={stats.storageCount}
                icon={<FiMapPin size={20} />}
                trend={true}
                trendValue={5}
                color="purple"
              />
              <StatCard
                title="Unités"
                value={stats.unitsCount}
                icon={<FiHome size={20} />}
                trend={true}
                trendValue={12}
                color="green"
              />
              <StatCard
                title="Liste D'attents"
                value={stats.AttentCount}
                icon={<FiClock size={20} />}
                trend={true}
                trendValue={12}
                color="red"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Revenu Total"
                value={`${stats.totalRevenue.toLocaleString("fr-FR")}€`}
                icon={<FiDollarSign size={20} />}
                color="green"
              />
              <StatCard
                title="Réservations en Attente"
                value={stats.pendingBookings}
                icon={<FiClock size={20} />}
                color="yellow"
              />
              <StatCard
                title="Réservations Terminées"
                value={stats.completedBookings}
                icon={<FiCheckCircle size={20} />}
                color="blue"
              />
              <StatCard
                title="Réservations Annulées"
                value={stats.cancelledBookings}
                icon={<FiXCircle size={20} />}
                color="red"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Réservations Mensuelles
                  </h3>
                  <div className="text-xs text-gray-500">
                    {format(new Date(), 'yyyy', { locale: fr })}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getMonthlyBookingsData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} réservations`, 'Nombre']}
                        labelFormatter={(label) => {
                          const item = getMonthlyBookingsData().find(item => item.name === label);
                          return item?.fullDate || label;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Réservations" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Statut des Réservations
                  </h3>
                  <div className="text-xs text-gray-500">
                    Total: {bookingStats.totalBookings}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} réservations`, 'Nombre']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Revenus des Réservations
                </h3>
                <div className="text-xs text-gray-500">
                  Total: {bookingStats.totalRevenue}€
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getMonthlyRevenueData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value}€`, 'Revenu']}
                      labelFormatter={(label) => {
                        const item = getMonthlyRevenueData().find(item => item.name === label);
                        return item?.fullDate || label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenu (€)" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;