"use client";

import { useState } from "react";
import { X, Bell, Info } from "lucide-react";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

interface NotifyModalProps {
  show: boolean;
  onHide: () => void;
  unit: Unit;
  onSubmit: (data: {
    email: string;
    phone: string;
    startDate: string;
    description: string;
    unitId: number;
  }) => Promise<void>;
}

// Schéma de validation
const notificationSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  phone: yup.string()
    .matches(/^(\+?\d{1,3}[- ]?)?\d{9,15}$/, 'Numéro de téléphone invalide')
    .required('Téléphone requis'),
  startDate: yup.string()
    .required('Date requise')
    .test('is-future-date', 'La date doit être dans le futur', (value) => {
      return new Date(value) > new Date();
    }),
  description: yup.string().max(500, 'Description trop longue (max 500 caractères)'),
});

const NotifyModal = ({ show, onHide, unit, onSubmit }: NotifyModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(notificationSchema),
    defaultValues: {
      email: '',
      phone: '',
      startDate: '',
      description: '',
    }
  });

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const formattedStartDate = new Date(data.startDate).toISOString();

      await onSubmit({
        email: data.email,
        phone: data.phone,
        startDate: formattedStartDate,
        description: data.description,
        unitId: Number(unit.id),
      });

      onHide();
      reset();
      toast.success("Votre demande a été enregistrée. Nous vous préviendrons lorsque l'unité sera disponible.");
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#00000046] z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="border-b-0 z-50 bg-[#9f9911] text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-xl font-semibold flex items-center">
                <Bell className="mr-2" size={24} />
                Me prévenir lorsque l&apos;unité {unit.id} sera disponible
              </h3>
              <button
                onClick={onHide}
                className="text-white hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 z-50">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="bg-[#f3f1cc] rounded-full p-2 mr-3">
                    <Info className="text-[#9f9911]" size={20} />
                  </div>
                  <p className="text-gray-700">
                    Cette unité est actuellement indisponible. Inscrivez-vous sur la liste d&apos;attente pour être notifié dès qu&apos;elle sera disponible.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            type="email"
                            placeholder="votre@email.com"
                            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            type="tel"
                            placeholder="+33 6 12 34 56 78"
                            className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début souhaitée</label>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            type="datetime-local"
                            min={new Date().toISOString().slice(0, 16)}
                            className={`w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]`}
                          />
                          {errors.startDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description de vos besoins</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <>
                        <textarea
                          {...field}
                          rows={3}
                          placeholder="Décrivez vos besoins de stockage..."
                          className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#dfd750] focus:border-[#dfd750]`}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-4 bg-[#9f9911] hover:bg-[#6e6a0c] text-white py-3 px-4 rounded-md transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Envoi en cours...' : "S'inscrire sur la liste d'attente"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotifyModal;