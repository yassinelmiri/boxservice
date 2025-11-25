'use client';
import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import iconLogo from "@/public/assets/image/logo.png";
import Image from "next/image";

interface StorageCenterCardProps {
  center: any;
  onEdit: (center: any) => void;
  onDelete: (id: string) => void;
  loadingImages: Record<string, boolean>;
}

const StorageCenterCard: React.FC<StorageCenterCardProps> = ({
  center,
  onEdit,
  onDelete,
  loadingImages
}) => {
  const borderColor = center.available ? "border-green-500" : "border-red-500";
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${borderColor}`}
    >
      <div className="relative h-48 overflow-hidden bg-gray-50">
        {loadingImages[center.city] ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ccc32d]"></div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full transition-transform duration-400"
          >
            <Image
              src={iconLogo}
              alt={center.name}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <h4 className="text-white text-lg font-semibold drop-shadow-md">{center.city}</h4>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-gray-800">{center.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${center.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {center.available ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {center.description
            ? "Description : " + center.description.slice(0, 50) + " ..."
            : "Pas de description disponible."}
        </p>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{center.address}, {center.postalCode}</span>
        </div>
        <div className="flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(center)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f9f8e6] text-[#9f9911] hover:bg-[#f3f1cc] transition-colors"
            aria-label="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(center.id)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            aria-label="Supprimer"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StorageCenterCard;