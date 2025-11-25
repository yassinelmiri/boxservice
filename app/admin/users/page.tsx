"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
  FiUser,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiInfo,
  FiCalendar,
  FiGlobe,
  FiHome,
  FiClock,
} from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";

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

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "MANAGER",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<string | number | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      let result = users;

      if (search) {
        result = result.filter(
          (user) =>
            `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (activeFilter !== "all") {
        result = result.filter(
          (user) => user.role === activeFilter.toUpperCase()
        );
      }

      setFilteredUsers(result);
    };

    filterUsers();
  }, [users, search, activeFilter]);

  useEffect(() => {
    paginateUsers();
  }, [filteredUsers, currentPage, usersPerPage]);

  const paginateUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    setPaginatedUsers(currentUsers);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => setCurrentPage(1);

  const goToLastPage = () => {
    const lastPage = Math.ceil(filteredUsers.length / usersPerPage);
    setCurrentPage(lastPage);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const lastPage = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changeUsersPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const [usersResponse, customersResponse] = await Promise.all([
        axios.get<User[]>(`${apiUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<User[]>(`${apiUrl}/users/customers/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allUsers = [
        ...usersResponse.data.map((user) => ({ ...user, id: `${user.id}` })),
        ...customersResponse.data.map((user) => ({
          ...user,
          id: `${user.id}`,
        })),
      ];

      setUsers(allUsers);
      setFilteredUsers(allUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        "Impossible de récupérer la liste des utilisateurs. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setUserForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "MANAGER",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      phone: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    if (user.role === "CUSTOMER") {
      alert(
        "L'édition des clients n'est pas disponible depuis cette interface."
      );
      return;
    }

    setUserForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      role: user.role || "MANAGER",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      country: user.country || "France",
      phone: user.phone || "",
    });
    setSelectedUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleShowUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id: string | number) => {
    const user = users.find((u) => u.id === id);
    if (user?.role === "CUSTOMER") {
      alert(
        "La suppression des clients n'est pas disponible depuis cette interface."
      );
      return;
    }
    setConfirmDelete(id);
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/users/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user.id !== confirmDelete));
      setConfirmDelete(null);

      alert("Utilisateur supprimé avec succès");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      if (isEditing && selectedUser) {
        const userData = { ...userForm };
        if (!userData.password) delete userData.password;
        console.log(selectedUser.id);

        await axios.patch(`${apiUrl}/users/${selectedUser.id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...userForm } : user
          )
        );
      } else {
        const response = await axios.post<User>(`${apiUrl}/users`, userForm, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers([...users, response.data]);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Erreur lors de l'enregistrement de l'utilisateur");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Prénom",
      "Nom",
      "Email",
      "Rôle",
      "Adresse",
      "Ville",
      "Code Postal",
      "Téléphone",
      "Date d'inscription",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.role,
          user.address || "",
          user.city || "",
          user.postalCode || "",
          user.phone || "",
          user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "users_and_customers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBookingsCount = (user: User) => {
    return user.bookings?.length || 0;
  };
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "MANAGER":
        return "bg-green-100 text-green-800";
      case "CUSTOMER":
        return "bg-[#f3f1cc] text-[#525008]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }; 
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur";
      case "MANAGER":
        return "Manager";
      case "CUSTOMER":
        return "Client";
      default:
        return role;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Date invalide";
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des Utilisateurs & Clients
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {filteredUsers.length} utilisateur(s) au total
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchAllUsers}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiRefreshCw className="mr-2" size={16} />
                Actualiser
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiDownload className="mr-2" size={16} />
                Exporter CSV
              </button>
              <button
                onClick={handleCreateUser}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
              >
                <FiUserPlus className="mr-2" size={16} />
                Nouvel Utilisateur
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-gray-700 whitespace-nowrap">
                <FiFilter className="inline mr-1" /> Filtrer:
              </span>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 text-sm ${activeFilter === "all"
                    ? "bg-[#9f9911] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setActiveFilter("admin")}
                  className={`px-3 py-1 text-sm ${activeFilter === "admin"
                    ? "bg-[#9f9911] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => setActiveFilter("manager")}
                  className={`px-3 py-1 text-sm ${activeFilter === "manager"
                    ? "bg-[#9f9911] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Manager
                </button>
                <button
                  onClick={() => setActiveFilter("customer")}
                  className={`px-3 py-1 text-sm ${activeFilter === "customer"
                    ? "bg-[#9f9911] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Client
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#9f9911]"></div>
              <p className="mt-2 text-gray-500">
                Chargement des utilisateurs...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localisation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inscrit le
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user, index) => (
                    <tr
                      key={`${user.id}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#f3f1cc] flex items-center justify-center text-[#9f9911] font-bold">
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                              {user.role === "CUSTOMER" && (
                                <span className="ml-2">
                                  <FiUsers className="inline mr-1" />
                                  {getBookingsCount(user)} réservation(s)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMail className="mr-1 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500">
                            <FiPhone className="inline mr-1 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.city ? (
                          <div className="flex items-center">
                            <FiMapPin className="mr-1 text-gray-400" />
                            {user.city}{" "}
                            {user.postalCode && `(${user.postalCode})`}
                          </div>
                        ) : (
                          "Non spécifié"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleShowUserDetails(user)}
                          className="text-[#9f9911] hover:text-[#363504] mr-4"
                          title="Voir les détails"
                        >
                          <FiInfo size={18} />
                        </button>

                        {user.role !== "CUSTOMER" && (
                          <>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-[#9f9911] hover:text-[#363504] mr-4"
                              title="Modifier"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * usersPerPage + 1}
                    </span>{" "}
                    à{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * usersPerPage,
                        filteredUsers.length
                      )}
                    </span>{" "}
                    sur{" "}
                    <span className="font-medium">{filteredUsers.length}</span>{" "}
                    utilisateurs
                  </span>
                  <div className="ml-4">
                    <select
                      value={usersPerPage}
                      onChange={changeUsersPerPage}
                      className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750]"
                    >
                      <option value={5}>5 par page</option>
                      <option value={10}>10 par page</option>
                      <option value={25}>25 par page</option>
                      <option value={50}>50 par page</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-sm rounded-md ${currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <FiChevronsLeft size={20} />
                  </button>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-sm rounded-md ${currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex">
                    {[
                      ...Array(Math.ceil(filteredUsers.length / usersPerPage)),
                    ].map((_, index) => {
                      const pageNum = index + 1;
                      const totalPages = Math.ceil(
                        filteredUsers.length / usersPerPage
                      );
                      if (
                        totalPages <= 5 ||
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={index}
                            onClick={() => paginate(pageNum)}
                            className={`px-3 py-1 text-sm rounded-md ${currentPage === pageNum
                              ? "bg-[#9f9911] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        (pageNum === currentPage - 2 && currentPage > 3) ||
                        (pageNum === currentPage + 2 &&
                          currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm text-gray-700"
                          >
                            ...
                          </span>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredUsers.length / usersPerPage)
                    }
                    className={`px-2 py-1 text-sm rounded-md ${currentPage ===
                      Math.ceil(filteredUsers.length / usersPerPage)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                  <button
                    onClick={goToLastPage}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredUsers.length / usersPerPage)
                    }
                    className={`px-2 py-1 text-sm rounded-md ${currentPage ===
                      Math.ceil(filteredUsers.length / usersPerPage)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <FiChevronsRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Création/Édition Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-[#0003] bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={userForm.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={userForm.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isEditing
                        ? "Mot de passe (laisser vide pour ne pas modifier)"
                        : "Mot de passe"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userForm.password}
                      onChange={handleInputChange}
                      required={!isEditing}
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                    >
                      <option value="ADMIN">Administrateur</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={userForm.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={userForm.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code Postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={userForm.postalCode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={userForm.country}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
                  >
                    {isEditing ? "Mettre à jour" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de détails */}
        {showDetailsModal && selectedUser && (
          <div className="fixed inset-0 bg-[#0003] bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de l'utilisateur
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-[#f3f1cc] flex items-center justify-center text-[#9f9911] text-xl font-bold">
                    {selectedUser.firstName?.charAt(0)}
                    {selectedUser.lastName?.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                        selectedUser.role
                      )}`}
                    >
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="border-b pb-3">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">
                      Informations de contact
                    </h5>
                    <div className="flex items-center mb-2">
                      <FiMail className="mr-2 text-gray-400" />
                      <span>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center">
                        <FiPhone className="mr-2 text-gray-400" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-b pb-3">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">
                      Adresse
                    </h5>
                    {selectedUser.address ? (
                      <div>
                        <div className="flex items-start mb-1">
                          <FiHome className="mr-2 text-gray-400 mt-1" />
                          <span>{selectedUser.address}</span>
                        </div>
                        <div className="ml-6">
                          {selectedUser.city && (
                            <div className="mb-1">
                              {selectedUser.city},{" "}
                              {selectedUser.postalCode || ""}
                            </div>
                          )}
                          {selectedUser.country && (
                            <div className="flex items-center">
                              <FiGlobe className="mr-2 text-gray-400" />
                              <span>{selectedUser.country}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Aucune adresse fournie
                      </p>
                    )}
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-2">
                      Informations du compte
                    </h5>
                    <div className="flex items-center mb-2">
                      <FiUser className="mr-2 text-gray-400" />
                      <span>ID: {selectedUser.id}</span>
                    </div>
                    {selectedUser.createdAt && (
                      <div className="flex items-center mb-2">
                        <FiCalendar className="mr-2 text-gray-400" />
                        <span>
                          Créé le: {formatDate(selectedUser.createdAt)}
                        </span>
                      </div>
                    )}
                    {selectedUser.updatedAt && (
                      <div className="flex items-center">
                        <FiClock className="mr-2 text-gray-400" />
                        <span>
                          Dernière mise à jour:{" "}
                          {formatDate(selectedUser.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedUser.role === "CUSTOMER" &&
                    selectedUser.bookings && (
                      <div className="mt-2 border-t pt-3">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">
                          Réservations
                        </h5>
                        {selectedUser.bookings.length > 0 ? (
                          <div>
                            <p>
                              {selectedUser.bookings.length} réservation(s) au
                              total
                            </p>
                            {/* Ici vous pourriez ajouter plus de détails sur les réservations si nécessaire */}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            Aucune réservation
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-[#0003] bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Confirmer la suppression
                </h3>
              </div>

              <div className="px-6 py-4">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette
                  action ne peut pas être annulée.
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
