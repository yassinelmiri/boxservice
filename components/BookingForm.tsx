import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
} from "react-icons/fi";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface UnitDetails {
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

interface BookingFormProps {
  unitId: string;
  unitDetails: UnitDetails;
  onBookingComplete: (data: any) => void;
}

interface FormData {
  unitId: string;
  startDate: string;
  durationMonths: number;
  serviceIds: number[];
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

const BookingForm = ({
  unitId,
  unitDetails,
  onBookingComplete,
}: BookingFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    unitId: unitId,
    startDate: new Date().toISOString().split("T")[0],
    durationMonths: 1,
    serviceIds: [],
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${apiUrl}/services`);
        setServices(response.data);
      } catch (err) {
        console.error("Échec de la récupération des services", err);
        setError("Échec du chargement des services disponibles");
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [formData.durationMonths, formData.serviceIds]);

  const calculatePrice = () => {
    if (!unitDetails || !formData.durationMonths) return;

    try {
      let basePrice = unitDetails.pricePerMonth || 0;
      let totalPrice = basePrice * formData.durationMonths;

      if (formData.serviceIds.length > 0 && services.length > 0) {
        const selectedServices = services.filter((service) =>
          formData.serviceIds.includes(service.id)
        );

        const servicesTotal = selectedServices.reduce(
          (sum, service) => sum + (service.price || 0),
          0
        );

        totalPrice += servicesTotal;
      }

      setTotalPrice(totalPrice);
    } catch (err) {
      console.error("Erreur lors du calcul du prix:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const token = localStorage.getItem("token");
      if (!token) {
        router.push({
          pathname: "/login",
          query: {
            redirectAfterLogin: router.pathname,
            bookingData: JSON.stringify(formData),
          },
        });
        return;
      }

      const userResponse = await axios.get(`${apiUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dataToSend = {
        ...formData,
        userId: userResponse.data.id,
      };

      delete dataToSend.cardName;
      delete dataToSend.cardNumber;
      delete dataToSend.cardExpiry;
      delete dataToSend.cardCVC;

      const response = await axios.post(`${apiUrl}/bookings`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setCurrentStep(4);

      if (onBookingComplete) {
        onBookingComplete(response.data);
      }
    } catch (err: any) {
      console.error("Erreur de réservation:", err);
      setError(
        err.response?.data?.message ||
          "Échec de la finalisation de la réservation. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FiCalendar className="mr-2 text-[#9f9911]" /> Détails de la
              réservation
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (mois)
              </label>
              <select
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750]"
                required
              >
                {[1, 2, 3, 6, 12, 24].map((months) => (
                  <option key={months} value={months}>
                    {months} {months === 1 ? "mois" : "mois"}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Les réservations plus longues peuvent bénéficier de remises
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-[#9f9911] text-white px-6 py-2 rounded-md hover:bg-[#6e6a0c] flex items-center"
              >
                Suivant: Services <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FiInfo className="mr-2 text-[#9f9911]" /> Services additionnels
            </h3>
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-3">
                Améliorez votre expérience de stockage avec des services
                optionnels:
              </p>
              <div className="space-y-3">
                {services.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Chargement des services disponibles...
                  </p>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className={`flex items-start p-4 border rounded-lg transition-all ${
                        formData.serviceIds.includes(service.id)
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
                        <div className="flex items-center text-[#9f9911] font-medium mb-1">
                          {service.price > 0 ? `${service.price}€` : "Inclus"}
                        </div>
                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-between">
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
              >
                Suivant: Paiement <FiArrowRight className="ml-1" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FiCreditCard className="mr-2 text-[#9f9911]" /> Détails de
              paiement
            </h3>
            <div className="mb-6 p-4 bg-[#f9f8e6] rounded-lg border border-[#f3f1cc]">
              <h4 className="font-medium mb-3 text-gray-900">
                Récapitulatif de réservation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unité:</span>
                  <span className="font-medium">
                    {unitDetails?.name || "Box sélectionné"} (
                    {unitDetails?.size || "N/A"}m²)
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
                    {formData.durationMonths} mois
                  </span>
                </div>
                {formData.serviceIds.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services:</span>
                    <span className="font-medium">
                      {services
                        .filter((s) => formData.serviceIds.includes(s.id))
                        .map((s) => s.name)
                        .join(", ")}
                    </span>
                  </div>
                )}
                <div className="border-t border-[#e6e297] pt-2 mt-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span className="text-[#6e6a0c]">
                      {totalPrice.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <h4 className="text-lg font-medium mb-3 text-gray-900">
                  Informations de carte
                </h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#dfd750]"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#dfd750]"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#dfd750]"
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      name="cardCVC"
                      value={formData.cardCVC}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#dfd750]"
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                  {error}
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
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span> Traitement...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiCheckCircle className="mr-2" /> Finaliser réservation
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-green-500 text-6xl mb-4">
              <FiCheckCircle className="inline" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">
              Réservation confirmée!
            </h3>
            <p className="mb-6 text-gray-600">
              Votre unité de stockage a été réservée avec succès. Vous recevrez
              un email de confirmation dans les plus brefs délais.
            </p>
            <div className="mb-8 p-5 bg-[#f9f8e6] rounded-lg border border-[#f3f1cc] text-left">
              <h4 className="font-medium mb-3 text-gray-900">
                Détails de la réservation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FiHome className="text-[#9f9911] mr-2" size={16} />
                  <span className="font-medium">Unité:</span>
                  <span className="ml-2">
                    {unitDetails?.name || "Box sélectionné"} (
                    {unitDetails?.size || "N/A"}m²)
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
                  <span className="ml-2">{formData.durationMonths} mois</span>
                </div>
                <div className="flex items-center">
                  <FiCreditCard className="text-[#9f9911] mr-2" size={16} />
                  <span className="font-medium">Montant payé:</span>
                  <span className="ml-2">{totalPrice.toFixed(2)}€</span>
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-2xl mt-28 mx-auto my-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Détails réservation", "Services", "Paiement", "Confirmation"].map(
              (step, idx) => (
                <div
                  key={idx}
                  className={`text-xs font-medium ${
                    currentStep > idx
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
        {renderStep()}
      </div>
    </>
  );
};

export default BookingForm;