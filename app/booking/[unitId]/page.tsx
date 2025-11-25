"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiInfo,
  FiCreditCard,
  FiCalendar,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiHome,
  FiClock,
  FiUser,
  FiMapPin,
} from "react-icons/fi";
import { useParams } from "next/navigation";
import { prefix } from "@fortawesome/free-solid-svg-icons";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
}

interface UnitDetails {
  id: number;
  volume: number;
  pricePerMonth: number;
  available: boolean;
  storageCenterId: number;
  code: string;
  images: string[];
  features: string[];
}

interface FormData {
  unitId: number;
  startDate: string;
  durationMonths: number;
  monthlyPayment: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  serviceIds: number[];
}

interface Solde {
  id: number;
  solde: number;
  createdAt: string;
}

const BookingPage = () => {
  const router = useRouter();
  const params = useParams<{ unitId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [unitDetails, setUnitDetails] = useState<UnitDetails | null>(null);
  const [isLoadingUnitDetails, setIsLoadingUnitDetails] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [solde, setSolde] = useState<Solde | null>(null);
  const [prefi, setPrefi] = useState<number>(0);

  const validateStartDate = (selectedDate: string) => {
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate());

    const selected = new Date(selectedDate);

    return selected >= minDate;
  };

  // Validate and convert unitId
  const unitId = React.useMemo(() => {
    const id = params?.unitId;
    if (!id) {
      throw new Error("unitId is required");
    }
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new Error("unitId must be a number");
    }
    if (numId <= 0) {
      throw new Error("unitId must be a positive number");
    }
    if (!Number.isInteger(numId)) {
      throw new Error("unitId must be an integer number");
    }
    return numId;
  }, [params?.unitId]);

  // Fetch unit details if not provided
  useEffect(() => {
    if (!unitDetails && !isLoadingUnitDetails) {
      const fetchUnitDetails = async () => {
        setIsLoadingUnitDetails(true);
        try {
          const response = await axios.get<UnitDetails>(
            `${apiUrl}/storage/units/${unitId}`
          );
          setUnitDetails(response.data);

          if (response.data) {
          } else {
            router.push("/not-found");
          }
        } catch (err) {
          console.error("Failed to fetch unit details", err);
          setError("Failed to load unit details");
          router.push("/not-found");
        } finally {
          setIsLoadingUnitDetails(false);
        }
      };
      fetchUnitDetails();
    }
  }, [unitId, unitDetails, isLoadingUnitDetails, router]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${apiUrl}/customer/profile-customer`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserProfile(response.data);
          if (response.data) {
            setFormData(prev => ({
              ...prev,
              firstName: response.data.firstName || '',
              lastName: response.data.lastName || '',
              email: response.data.email || '',
              phone: response.data.phone || '',
              address: response.data.address || '',
              city: response.data.city || '',
              country: response.data.country || '',
              postalCode: response.data.postalCode || ''
            }));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch solde
  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const response = await axios.get<Solde>(`${apiUrl}/soldes`,);;
        setSolde(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du solde", error);
      }
    };

    fetchSolde();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    unitId: unitId,
    startDate: new Date().toISOString().split("T")[0],
    durationMonths: 1,
    monthlyPayment: false,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    serviceIds: [],
  });

  // Validate durationMonths
  const validateDurationMonths = (value: number) => {
    if (isNaN(value)) {
      throw new Error("durationMonths must be a number");
    }
    if (value <= 0) {
      throw new Error("durationMonths must be a positive number");
    }
    if (!Number.isInteger(value)) {
      throw new Error("durationMonths must be an integer number");
    }
    return value;
  };

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<Service[]>(
          `${apiUrl}/storage/services`
        );
        setServices(response.data);
      } catch (err) {
        console.error("Failed to fetch services", err);
        setError("Failed to load available services");
      }
    };

    fetchServices();
  }, []);

  // Calculate total price
  useEffect(() => {
    const calculatePrice = () => {
      if (!unitDetails) {
        setTotalPrice(0);
        return;
      }

      try {
        const duration = validateDurationMonths(formData.durationMonths);
        let basePrice = duration * unitDetails.pricePerMonth;

        // Calcul des services
        let servicesTotal = 0;
        if (formData.serviceIds.length > 0 && services.length > 0) {
          servicesTotal = services
            .filter((service) => formData.serviceIds.includes(service.id))
            .reduce((sum, service) => sum + Number(service.price), 0);
        }

        let finalTotal, prixApr, economie;

        if (formData.monthlyPayment && solde && solde.solde > 0) {
          prixApr = (basePrice * 12) + servicesTotal;
          economie = prixApr * solde.solde / 100;
          finalTotal = prixApr - economie;
          setPrefi(economie);
        } else if (formData.monthlyPayment) {
          finalTotal = (basePrice * 12) + servicesTotal;
          setPrefi(0);
        } else {
          finalTotal = basePrice + servicesTotal;
          setPrefi(0);
        }

        setTotalPrice(finalTotal);
      } catch (err) {
        console.error("Erreur de calcul du prix:", err);
        setTotalPrice(0);
        setPrefi(0);
      }
    };

    calculatePrice();
  }, [formData.durationMonths, formData.serviceIds, formData.monthlyPayment, unitDetails, services, solde]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    try {
      if (name === "startDate") {
        setFormData({ ...formData, [name]: value });
      } else if (name === "durationMonths") {
        const numValue = Number(value);
        validateDurationMonths(numValue);
        setFormData({ ...formData, [name]: numValue });
      } else {
        setFormData({ ...formData, [name]: value });
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleServiceToggle = (serviceId: number) => {
    const updatedServices = formData.serviceIds.includes(serviceId)
      ? formData.serviceIds.filter((id) => id !== serviceId)
      : [...formData.serviceIds, serviceId];

    setFormData({ ...formData, serviceIds: updatedServices });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      validateDurationMonths(formData.durationMonths);

      const bookingData = {
        unitId: formData.unitId,
        startDate: new Date(formData.startDate).toISOString(),
        durationMonths: formData.durationMonths,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        monthlyPayment: formData.monthlyPayment,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        serviceIds: formData.serviceIds,
      };

      const response = await axios.post(`${apiUrl}/bookings`, bookingData);

      if (response.data.paymentUrl) {
        const fullPaymentUrl = response.data.paymentUrl.startsWith("http")
          ? response.data.paymentUrl
          : `${apiUrl}${response.data.paymentUrl}`;

        const resPayment = await axios.post(fullPaymentUrl);
        setPaymentUrl(fullPaymentUrl);
        setCurrentStep(4);
        window.location.href = resPayment.data.checkoutUrl;
      } else {
        setSuccess(true);
        setCurrentStep(4);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        `Erreur lors de la réservation (${err.response?.status || "no-status"
        })`
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateSize = () => {
    if (!unitDetails) return "N/A";
    return `${unitDetails.volume}m³`;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md max-w-2xl w-full mx-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <FiCalendar className="mr-2 text-[#9f9911]" /> Détails de la
              location
            </h3>

            {isLoadingUnitDetails ? (
              <div className="text-center py-4">
                <p>Chargement des détails de l'unité...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Détails de l'unité</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Taille:</span>
                      <span className="font-medium ml-2">
                        {calculateSize()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Prix/mois:</span>
                      <span className="font-medium ml-2">
                        {unitDetails?.pricePerMonth
                          ? `${unitDetails.pricePerMonth}€`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                    Date de début
                  </label>
                  <div className="flex justify-center">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={(() => {
                        const minDate = new Date();
                        minDate.setDate(minDate.getDate());
                        return minDate.toISOString().split('T')[0];
                      })()}
                      className="w-full max-w-xs p-2 border rounded focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750]"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                    Durée
                  </label>
                  <div className="flex justify-center space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        checked={!formData.monthlyPayment}
                        onChange={() => {
                          setFormData({
                            ...formData,
                            durationMonths: 1,
                            monthlyPayment: false
                          });
                        }}
                        className="h-4 w-4 text-[#9f9911] focus:ring-[#dfd750]"
                      />
                      <span className="ml-2">1 mois</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        checked={formData.monthlyPayment}
                        onChange={() => {
                          setFormData({
                            ...formData,
                            durationMonths: 1,
                            monthlyPayment: true
                          });
                        }}
                        className="h-4 w-4 text-[#9f9911] focus:ring-[#dfd750]"
                      />
                      <span className="ml-2">
                        1 Annuelle {solde && solde.solde > 0 ? `(-${solde.solde}%)` : ""}
                      </span>
                    </label>
                  </div>
                  {formData.monthlyPayment && solde && solde.solde > 0 && (
                    <p className="text-green-600 text-sm text-center mt-2">
                      Vous avez économisé {((unitDetails?.pricePerMonth || 0) * 12 * solde.solde / 100).toFixed(2)}€ grâce à votre solde!
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <FiUser className="mr-2 text-[#9f9911]" /> Informations
                    personnelles
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Entrez votre prénom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Entrez votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Entrez votre email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Entrez votre numéro de téléphone"
                        required
                      />
                    </div>
                  </div>

                  <h4 className="text-lg font-medium mt-4 mb-3 flex items-center">
                    <FiMapPin className="mr-2 text-[#9f9911]" /> Adresse
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="123 Rue Exemple, Quartier, Immeuble n°..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Exemple : 20000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Exemple : Paris"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#9f9911] text-white px-6 py-2 rounded-md hover:bg-[#6e6a0c] flex items-center"
                    disabled={!!error || isLoadingUnitDetails}
                  >
                    Suivant: Services <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md max-w-2xl w-full mx-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <FiInfo className="mr-2 text-[#9f9911]" /> Services additionnels
            </h3>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-3 text-center">
                Améliorez votre expérience de stockage avec des services
                optionnels:
              </p>

              <div className="space-y-3 max-w-lg mx-auto">
                {services.length === 0 ? (
                  <p className="text-gray-500 italic text-center">
                    Aucun des services maintenant
                  </p>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className={`flex items-start p-4 border rounded-lg transition-all ${formData.serviceIds.includes(service.id)
                        ? "border-[#dfd750] bg-[#f9f8e6]"
                        : "border-gray-200 hover:border-[#d9d262]"
                        }`}
                    >
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        checked={formData.serviceIds.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="mt-1 mr-3 h-4 w-4 text-[#9f9911] focus:ring-[#dfd750]"
                      />
                      <div>
                        <label
                          htmlFor={`service-${service.id}`}
                          className="font-medium"
                        >
                          {service.name}
                        </label>
                        {service.description && (
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center text-[#9f9911] font-medium mt-1">
                          {service.price > 0 ? `${service.price}€` : "Gratuit"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-between max-w-lg mx-auto">
              <button
                type="button"
                onClick={prevStep}
                className="text-gray-600 px-4 py-2 border rounded hover:bg-gray-100 flex items-center"
              >
                <FiArrowLeft className="mr-1" /> Retour
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-[#9f9911] text-white px-6 py-2 rounded hover:bg-[#6e6a0c] flex items-center"
                disabled={!unitDetails}
              >
                Suivant: Paiement <FiArrowRight className="ml-1" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md max-w-2xl w-full mx-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <FiCreditCard className="mr-2 text-[#9f9911]" /> Récapitulatif
            </h3>

            <div className="mb-6 p-4 bg-[#f9f8e6] rounded-lg border border-[#f3f1cc] max-w-lg mx-auto">
              <h4 className="font-medium mb-3 text-gray-900 text-center">
                Détails de la réservation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unité:</span>
                  <span className="font-medium">
                    {unitDetails?.id || "N/A"} || ({calculateSize()})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix/mois:</span>
                  <span className="font-medium">
                    {unitDetails?.pricePerMonth
                      ? `${unitDetails.pricePerMonth}€`
                      : "N/A"}{" "}
                    / {formData.durationMonths}mois
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de début:</span>
                  <span className="font-medium">
                    {new Date(formData.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-medium">

                    {formData.monthlyPayment ? (
                      <div className=" text-sm mt-1">
                        1 Annuelle
                      </div>
                    ) : (<div className=" text-sm mt-1">
                      {formData.durationMonths} mois
                    </div>)}
                  </span>
                </div>
                {formData.serviceIds.length > 0 && (
                  <div>
                    <div className="flex justify-between font-medium mt-2">
                      <span className="text-gray-600">Services:</span>
                      <span></span>
                    </div>
                    {services
                      .filter((s) => formData.serviceIds.includes(s.id))
                      .map((service) => (
                        <div
                          key={service.id}
                          className="flex justify-between ml-4"
                        >
                          <span className="text-gray-600">
                            - {service.name}
                          </span>
                          <span>{service.price}€</span>
                        </div>
                      ))}
                  </div>
                )}
                <div className="border-t border-[#e6e297] pt-2 mt-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span className="text-[#6e6a0c]">
                      {typeof totalPrice === "number"
                        ? `${totalPrice.toFixed(2)}€`
                        : "Calcul en cours..."}
                    </span>
                  </div>
                  {solde && solde.solde > 0 && formData.monthlyPayment && (
                    <div className="text-green-600 text-sm mt-1">
                      Vous avez économisé {prefi.toFixed(2)}€ grâce à votre solde!
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="mb-5">
                <h4 className="text-lg font-medium mb-3 text-gray-900 text-center">
                  Informations personnelles
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-medium">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adresse:</span>
                    <span className="font-medium">
                      {formData.address}, {formData.city}, {formData.postalCode}
                      , {formData.country}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-md">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <strong>Contactez-nous !</strong>
                  </div>
                  <p className="mt-2 pl-8 mb-3">{error}</p>
                  <a
                    href="/contact"
                    className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    Contacter
                  </a>
                </div>
              )}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 px-4 py-2 border rounded hover:bg-gray-100 flex items-center"
                  disabled={loading}
                >
                  <FiArrowLeft className="mr-1" /> Retour
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center"
                  disabled={loading || !unitDetails}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span> Traitement...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiCheckCircle className="mr-2" /> Confirmer et payer
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md text-center max-w-2xl w-full mx-auto">
            {paymentUrl ? (
              <>
                <div className="text-[#dfd750] text-6xl mb-4">
                  <FiCreditCard className="inline" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Redirection vers le paiement
                </h3>
                <p className="mb-6 text-gray-600">
                  Vous allez être redirigé vers la page de paiement sécurisée.
                </p>
                <p className="mb-6">
                  <a
                    href={paymentUrl}
                    className="text-[#9f9911] hover:underline"
                  >
                    Cliquez ici si la redirection ne fonctionne pas
                  </a>
                </p>
              </>
            ) : (
              <>
                <div className="text-green-500 text-6xl mb-4">
                  <FiCheckCircle className="inline" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Réservation confirmée!
                </h3>
                <p className="mb-6 text-gray-600">
                  Votre unité de stockage a été réservée avec succès. Vous
                  recevrez un email de confirmation dans les plus brefs délais.
                </p>

                <div className="mb-8 p-5 bg-[#f9f8e6] rounded-lg border border-[#f3f1cc] text-left max-w-lg mx-auto">
                  <h4 className="font-medium mb-3 text-gray-500 text-center">
                    Détails de la réservation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FiHome className="text-[#9f9911] mr-2" size={16} />
                      <span className="font-medium">Unité:</span>
                      <span className="ml-2">
                        {unitDetails?.id || "N/A"} || ({calculateSize()})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="text-[#9f9911] mr-2" size={16} />
                      <span className="font-medium">Date de début:</span>
                      <span className="ml-2">
                        {new Date(formData.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-[#9f9911] mr-2" size={16} />
                      <span className="font-medium">Durée:</span>
                      <span className="ml-2">
                        {formData.durationMonths} mois
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiCreditCard className="text-[#9f9911] mr-2" size={16} />
                      <span className="font-medium">Total:</span>
                      <span className="ml-2">
                        {typeof totalPrice === "number"
                          ? `${totalPrice.toFixed(2)}€`
                          : "N/A"}
                        {solde && solde.solde > 0 && (
                          <span className="text-green-600 ml-2">(Réduction appliquée)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => router.push("/account")}
                    className="bg-[#9f9911] text-white px-5 py-2 rounded hover:bg-[#6e6a0c] flex items-center"
                  >
                    <FiUser className="mr-2" /> Voir mes réservations
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="text-gray-600 px-5 py-2 border rounded hover:bg-gray-100"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container my-28 mx-auto px-4 py-8 flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between mb-2">
          {["Détails", "Services", "Récapitulatif", "Confirmation"].map(
            (step, idx) => (
              <div
                key={idx}
                className={`text-xs font-medium ${currentStep > idx
                  ? "text-[#9f9911]"
                  : currentStep === idx + 1
                    ? "text-[#9f9911]"
                    : "text-gray-400"
                  }`}
              >
                {step}
              </div>
            )
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#9f9911] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}
    </div>
  );
};

export default BookingPage;