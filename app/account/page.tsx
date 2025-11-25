'use client';

import { useEffect, useState } from 'react';
import { User, Lock, Box, CreditCard, Bell, LogOut, HelpCircle, X, Save, ChevronRight, FileText, AlertTriangle, Calendar, Home, Globe, Phone, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface StorageUnit {
  unitId: number;
  unitCode: string;
  unitStorageCenter: string;
  unitStorageCenterAddress: string;
  unitStorageCenterCity: string;
  unitStorageCenterCountry: string;
  unitVolume: number;
  unitPrice: string;
  startDate: string;
  duration: number;
  unitImages: string[];
  lat: number;
  lng: number;
  bookingId: number,
  bookingLastUpdate: string,
  services: any[];
}

interface Payment {
  unitId: number;
  amount: string;
  paymentStatus: string;
  stripePaymentId: string | null;
  stripe: {
    metadata: {
      bookingId: string;
      customerId: string;
      unitId: string;
    };
    status: string;
  };
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('storage');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Ajoutez ces états près des autres états
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [minDate, setMinDate] = useState<string>('');
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  // Fonction pour formater la date au format JJ/MM/AAAA
  const formatToFrenchDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fonction pour convertir du format JJ/MM/AAAA vers un format de date valide (YYYY-MM-DD)
  const parseFrenchDate = (frenchDate: string) => {
    if (!frenchDate) return '';
    const [day, month, year] = frenchDate.split('/');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour calculer la date minimale (aujourd'hui + 15 jours)
  const calculateMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.setDate(today.getDate() + 15));
    return minDate.toISOString().split('T')[0];
  };
  const [passwordData, setPasswordData] = useState({
    oldpassword: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";
    try {
      await axios.post(
        `${apiUrl}/customer/change-password`,
        {
          oldpassword: passwordData.oldpassword,
          password: passwordData.password
        },
        { headers }
      );

      setPasswordSuccess('Mot de passe changé avec succès');
      setPasswordError('');
      setPasswordData({
        oldpassword: '',
        password: '',
        confirmPassword: ''
      });
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

      try {
        const [profileResponse, unitsResponse, paymentsResponse] = await Promise.all([
          axios.get<UserData>(`${apiUrl}/customer/profile-customer`, { headers }),
          axios.get<StorageUnit[]>(`${apiUrl}/customer/units-reservations`, { headers }),
          axios.get<Payment[]>(`${apiUrl}/customer/payments`, { headers })
        ]);


        console.log(unitsResponse.data)
        setUserData(profileResponse.data);
        setStorageUnits(unitsResponse.data);
        setPayments(paymentsResponse.data);

        setFormData({
          firstName: profileResponse.data.firstName || '',
          lastName: profileResponse.data.lastName || '',
          email: profileResponse.data.email || '',
          phone: profileResponse.data.phone || '',
          address: profileResponse.data.address || '',
          city: profileResponse.data.city || '',
          postalCode: profileResponse.data.postalCode || '',
          country: profileResponse.data.country || ''
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCancelReservation = async () => {
    if (!selectedBookingId) {
      setCancelError('Veuillez sélectionner une réservation valide');
      return;
    }

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";
    console.log('token', token);
    try {

      await axios.patch(
        `${apiUrl}/bookings/${selectedBookingId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCancelSuccess('Réservation annulée avec succès');
      setCancelError('');

      const [unitsResponse] = await Promise.all([
        axios.get<StorageUnit[]>(`${apiUrl}/customer/units-reservations`, { headers }),
      ]);

      setStorageUnits(unitsResponse.data);

      setTimeout(() => {
        setIsCancelModalOpen(false);
        setCancelSuccess('');
      }, 3000);
    } catch (err: any) {
      setCancelError(err.response?.data?.message || 'Erreur lors de résilier de la réservation');
    }
  };

  const openCancelModal = (unit: StorageUnit) => {
    const today = new Date();
    const minCancelDate = new Date(today);
    minCancelDate.setDate(today.getDate() + 15);

    setMinDate(calculateMinDate());
    setSelectedBookingId(unit.bookingId);
    setSelectedDate('');
    setIsCancelModalOpen(true);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

    try {
      const response = await axios.post(
        `${apiUrl}/customer/update-customer`,
        formData,
        { headers }
      );
      setUserData(response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil");
    }
  };


  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const calculateEndDate = (startDate: string, duration: number) => {
    try {
      const date = new Date(startDate);
      date.setDate(date.getDate() + duration);
      return date.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  };

  const openUnitDetails = (unit: StorageUnit) => {
    setSelectedUnit(unit);
    setIsUnitModalOpen(true);
  };

  const openPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dfd750]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-28">
      {/* Gradient Header */}
      <header className="bg-gradient-to-r from-[#9f9911] to-[#9f9911]  shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            Mon Espace Client
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-20 rounded-full px-4 py-2 text-bleu-600 backdrop-blur-sm"
          >
            {userData?.firstName} {userData?.lastName}
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-72 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#dfd750] to-[#9f9911]  rounded-full p-3 mr-4">
                  <User className="text-white h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    {userData?.firstName} {userData?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Membre depuis {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'storage', label: 'Mes Box', icon: Box },
                  { id: 'payments', label: 'Votre Historique', icon: CreditCard },
                  { id: 'profile', label: 'Profil', icon: User },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 
                      ${activeTab === item.id
                        ? 'bg-gradient-to-r from-[#f9f8e6] to-indigo-50 text-[#6e6a0c] shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-[#9f9911]' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <h3 className="font-medium mb-4 flex items-center text-gray-800">
                <HelpCircle className="mr-2 h-5 w-5 text-[#9f9911]" />
                Besoin d'aide ?
              </h3>
              <Link href="/contact" className="flex items-center text-[#9f9911] hover:text-[#525008] hover:translate-x-1 transition-all duration-300">
                <ChevronRight className="mr-1 h-4 w-4" />
                Contactez le support
              </Link>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">


              {/* Storage Units Tab */}
              {activeTab === 'storage' && (
                <motion.div
                  key="storage"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#f3f1cc] p-2 rounded-full">
                        <Box className="h-5 w-5 text-[#9f9911]" />
                      </div>
                      <h2 className="text-lg font-medium text-gray-900">Mes Box de Stockage</h2>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/search" className="px-4 py-2 bg-gradient-to-r from-[#9f9911] to-[#9f9911]  text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center text-sm font-medium">
                        + Réserver un nouveau box
                      </Link>
                    </motion.div>
                  </div>
                  <div className="overflow-x-auto">
                    {storageUnits.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Box Id</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {storageUnits.map((unit, index) => (
                            <motion.tr
                              key={`unit-${unit.unitId}-${index}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{unit.unitId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {unit.unitStorageCenter}
                                <p className="text-xs text-gray-400">{unit.unitStorageCenterCity}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {unit.unitVolume} m² | ({(unit.unitVolume * 2.5).toPrecision(2)} m³)
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(unit.startDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(calculateEndDate(unit.startDate, unit.duration))}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                {unit.unitPrice}€/mois
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                - {unit.unitCode} -
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="text-[#9f9911] hover:text-[#363504] flex items-center"
                                    onClick={() => openUnitDetails(unit)}
                                  >
                                    <ChevronRight className="h-4 w-4 mr-1" />
                                    Détails
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="text-red-600 hover:text-red-900 flex items-center"
                                    onClick={() => openCancelModal(unit)}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    résilier
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-12 text-center">
                        <Box className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Vous n'avez pas encore réservé de box de stockage.</p>
                        <Link href="/search" className="mt-4 inline-block px-4 py-2 bg-[#9f9911] text-white rounded-lg hover:bg-[#6e6a0c] transition-colors">
                          Réserver un box maintenant
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="px-6 py-5 border-b border-gray-200 flex items-center space-x-3">
                    <div className="bg-[#f3f1cc] p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-[#9f9911]" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900">Votre Historique</h2>
                  </div>
                  <div className="overflow-x-auto">
                    {payments.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Box</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {payments.map((payment, index) => (
                            <motion.tr
                              key={`payment-${payment.stripePaymentId || index}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {payment.stripePaymentId ? `#${payment.stripePaymentId.substring(3, 14)}...` : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Box #{payment.unitId || payment.stripe?.metadata?.unitId || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                                {payment.amount}€
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${payment.paymentStatus === 'PAID'
                                    ? 'bg-green-100 text-green-800'
                                    : payment.paymentStatus === 'FAILED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'}`}>
                                  {payment.paymentStatus === 'PAID'
                                    ? 'Payé'
                                    : payment.paymentStatus === 'FAILED'
                                      ? 'Échoué'
                                      : payment.paymentStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date().toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  className="text-[#9f9911] hover:text-[#363504] flex items-center"
                                  onClick={() => openPaymentDetails(payment)}
                                >
                                  <ChevronRight className="h-4 w-4 mr-1" />
                                  Afficher détail
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-12 text-center">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucun paiement trouvé dans votre historique.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && userData && (
                <motion.div
                  key="profile"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="px-6 py-5 border-b border-gray-200 flex items-center space-x-3">
                    <div className="bg-[#f3f1cc] p-2 rounded-full">
                      <User className="h-5 w-5 text-[#9f9911]" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900">Mon Profil</h2>
                  </div>
                  <div className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                            <User className="h-4 w-4 mr-2 text-[#dfd750]" />
                            Informations personnelles
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                              <p className="text-gray-900 font-medium">{userData.firstName}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                              <p className="text-gray-900 font-medium">{userData.lastName}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                <p className="text-gray-900">{userData.email}</p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                <p className="text-gray-900">{userData.phone || 'Non renseigné'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                            <Home className="h-4 w-4 mr-2 text-[#dfd750]" />
                            Adresse
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                              <p className="text-gray-900">{userData.address || 'Non renseignée'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                              <p className="text-gray-900">
                                {userData.postalCode || ''} {userData.city || ''}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 text-gray-400 mr-2" />
                                <p className="text-gray-900">{userData.country || 'Non renseigné'}</p>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* Section Sécurité - Pleine largeur sous les deux colonnes */}
                      <div className="mt-8">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                            <Lock className="h-4 w-4 mr-2 text-[#dfd750]" />
                            Sécurité du compte
                          </div>

                          <div className="bg-gradient-to-br from-[#f9f8e6] to-indigo-50 p-6 rounded-xl border border-[#f3f1cc]">
                            <form onSubmit={handlePasswordSubmit} className="space-y-5">
                              {/* Messages d'état */}
                              <AnimatePresence>
                                {passwordError && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                      <div className="flex items-center">
                                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                                        <p className="text-sm text-red-700">{passwordError}</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {passwordSuccess && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                                      <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                        <p className="text-sm text-green-700">{passwordSuccess}</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Champ Mot de passe actuel */}
                              <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <input
                                    type="password"
                                    name="oldpassword"
                                    value={passwordData.oldpassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                                    placeholder="••••••••"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Champ Nouveau mot de passe */}
                              <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <input
                                    type="password"
                                    name="password"
                                    value={passwordData.password}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                              </div>

                              {/* Champ Confirmation */}
                              <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                  />
                                </div>
                              </div>

                              {/* Bouton de soumission */}
                              <div className="pt-2">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="submit"
                                  className="w-full px-5 py-3 bg-gradient-to-r from-[#9f9911] to-[#9f9911]  text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center font-medium shadow-md"
                                >
                                  <Lock className="mr-2 h-5 w-5" />
                                  Mettre à jour le mot de passe
                                </motion.button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Bouton Modifier mes informations */}
                      <div className="mt-8">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsModalOpen(true)}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#9f9911] to-[#9f9911]  text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center font-medium"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Modifier mes informations
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Modal de mise à jour du profil avec animation */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#0000003b] bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full m-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#f3f1cc] p-2 rounded-full">
                      <User className="h-5 w-5 text-[#9f9911]" />
                    </div>
                    <h3 className="text-lg font-medium">Modifier le profil</h3>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <div className="relative">
                      <Phone className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <div className="relative">
                      <Home className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <div className="relative">
                      <Globe className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
                    >
                      résilier
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#9f9911] to-[#9f9911]  text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCancelModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#0000003b] bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
              onClick={() => setIsCancelModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full m-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium">Résilier la réservation</h3>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsCancelModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <AnimatePresence>
                    {cancelError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                            <p className="text-sm text-red-700">{cancelError}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {cancelSuccess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <p className="text-sm text-green-700">{cancelSuccess}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Veuillez sélectionner une date résilier. Notez qu'un préavis de 15 jours minimum est requis.
                    </p>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Date résilier
                      </label>
                      <div className="relative">
                        <Calendar className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                          type="date"
                          min={minDate}
                          max={minDate}
                          value={minDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all duration-200"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Date minimum: {minDate ? formatDate(minDate) : 'calcul...'}
                      </p>
                    </div>

                    <div className="pt-4 border-t mt-4 flex justify-end space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setIsCancelModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
                      >
                        Retour
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleCancelReservation}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center"
                        disabled={!selectedDate}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Confirmer Résilier
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal pour les détails du box */}
      <AnimatePresence>
        {isUnitModalOpen && selectedUnit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#0000003b] bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
              onClick={() => setIsUnitModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full m-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#f3f1cc] p-2 rounded-full">
                      <Box className="h-5 w-5 text-[#9f9911]" />
                    </div>
                    <h3 className="text-lg font-medium">Détails du box #{selectedUnit.unitId}</h3>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsUnitModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Informations générales</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Code du box</p>
                          <p className="font-medium">{selectedUnit.unitCode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Centre de stockage</p>
                          <p className="font-medium">{selectedUnit.unitStorageCenter}</p>
                          <p className="text-sm text-gray-500">{selectedUnit.unitStorageCenterAddress}</p>
                          <p className="text-sm text-gray-500">{selectedUnit.unitStorageCenterCity}, {selectedUnit.unitStorageCenterCountry}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Volume</p>
                          <p className="font-medium">{selectedUnit.unitVolume}m³</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Période de location</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Date de début</p>
                          <p className="font-medium">{formatDate(selectedUnit.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date de fin</p>
                          <p className="font-medium">{formatDate(calculateEndDate(selectedUnit.startDate, selectedUnit.duration))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Durée</p>
                          <p className="font-medium">{selectedUnit.duration} / Mois</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Prix mensuel</p>
                          <p className="font-medium text-green-600">{selectedUnit.unitPrice}€</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedUnit.unitImages && selectedUnit.unitImages.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Photos du box</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedUnit.unitImages.map((image, index) => {
                          const imageUrl = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL || 'https://ws.box-service.eu'}${image}`;

                          return (
                            <div key={`image-${index}`} className="rounded-lg overflow-hidden">
                              <img
                                src={imageUrl}
                                alt={`Box ${selectedUnit.unitCode}`}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="mt-6 pt-4 border-t flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsUnitModalOpen(false)}
                      className="px-4 py-2 bg-[#9f9911] text-white rounded-lg hover:bg-[#6e6a0c] transition-colors"
                    >
                      Fermer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal pour les détails de paiement */}
      <AnimatePresence>
        {isPaymentModalOpen && selectedPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#0000003b] bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full m-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#f3f1cc] p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-[#9f9911]" />
                    </div>
                    <h3 className="text-lg font-medium">Détails du paiement</h3>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Référence</p>
                      <p className="font-medium">
                        {selectedPayment.stripePaymentId ? `#${selectedPayment.stripePaymentId}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Box concerné</p>
                      <p className="font-medium">
                        #{selectedPayment.unitId || selectedPayment.stripe?.metadata?.unitId || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Montant</p>
                      <p className="font-medium text-green-600">{selectedPayment.amount}€</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <p className="font-medium">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedPayment.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : selectedPayment.paymentStatus === 'FAILED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedPayment.paymentStatus === 'PAID'
                            ? 'Payé'
                            : selectedPayment.paymentStatus === 'FAILED'
                              ? 'Échoué'
                              : selectedPayment.paymentStatus}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                    {selectedPayment.stripe && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Informations Stripe</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-500">ID de réservation</p>
                            <p className="font-medium">{selectedPayment.stripe.metadata.bookingId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">ID client</p>
                            <p className="font-medium">{selectedPayment.stripe.metadata.customerId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Statut Stripe</p>
                            <p className="font-medium">{selectedPayment.stripe.status}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="px-4 py-2 bg-[#9f9911] text-white rounded-lg hover:bg-[#6e6a0c] transition-colors"
                    >
                      Fermer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}