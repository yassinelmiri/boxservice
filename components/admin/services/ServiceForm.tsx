import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface ServiceFormProps {
  selectedService: any;
  newServiceData: any;
  handleChange: (e: any) => void;
  handleSubmit: (e: any) => void;
  loading: boolean;
  setShowPopup: (show: boolean) => void;
}

const ServiceForm = ({
  selectedService,
  newServiceData,
  handleChange,
  handleSubmit,
  loading,
  setShowPopup,
}: ServiceFormProps) => {
  return (
    <div className="fixed inset-0 bg-[#00000031] flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-md w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedService ? "Modifier le Service" : "Créer un Service"}
          </h2>
          <button
            onClick={() => setShowPopup(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Nom du Service
            </label>
            <input
              type="text"
              name="name"
              value={newServiceData.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={newServiceData.description}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              rows={3}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Prix (€)
            </label>
            <input
              type="number"
              name="price"
              value={newServiceData.price}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#9f9911] text-white rounded-md hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750] disabled:opacity-50"
          >
            {loading
              ? "En cours..."
              : selectedService
                ? "Modifier"
                : "Créer"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceForm;