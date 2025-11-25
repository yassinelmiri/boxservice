'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from 'cookies-next';

interface Volume {
  id: string;
  value: string;
}

interface VolumeFormModalProps {
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  volumeValue: number;
  setVolumeValue: (value: number) => void;
}

const VolumeFormModal: React.FC<VolumeFormModalProps> = ({
  showPopup,
  setShowPopup,
  handleSubmit,
  volumeValue,
  setVolumeValue
}) => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    if (showPopup) {
      fetchVolumes();
    }
  }, [showPopup]);

  const fetchVolumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu"}/storage/volumes/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolumes(response.data);
    } catch (err) {
      toast.error("Échec du chargement des tailles de stockage.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu"}/storage/volumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Taille supprimée avec succès !");
      fetchVolumes();
    } catch (err) {
      toast.error("Échec de la suppression de la taille.");
    }
  };

  const handleEdit = (volume: Volume) => {
    setEditingVolume(volume);
    setEditValue(volume.value);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVolume) return;

    try {
      const token = getCookie('token') || localStorage.getItem("token");
      if (!token) {
        toast.error("Authentification requise");
        return;
      }

      // Parse to INT (if editValue is a string)
      const parsedValue = parseInt(editValue, 10);
      if (isNaN(parsedValue)) {
        toast.error("La valeur doit être un nombre valide !");
        return;
      }

      console.log('Sending:', { value: parsedValue });

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu"}/storage/volumes/${editingVolume.id}`,
        { value: parsedValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success("Taille mise à jour avec succès !");
      setEditingVolume(null);
      setEditValue("");
      fetchVolumes();
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      toast.error("Erreur lors de la mise à jour de la taille.");
    }
  };

  if (!showPopup) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#00000049] flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-700">
            Gestion des Tailles
          </h3>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowPopup(false);
              setEditingVolume(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </motion.button>
        </div>

        {/* Liste des volumes existants */}
        <div className="mb-6 max-h-60 overflow-y-auto">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Tailles existantes</h4>
          {volumes.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune taille enregistrée</p>
          ) : (
            <ul className="space-y-2">
              {volumes.map((volume) => (
                <li key={volume.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  {editingVolume?.id === volume.id ? (
                    <form onSubmit={handleUpdate} className="flex-1 flex gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 p-1 border rounded"
                        required
                        min="0"
                        step="0.01"
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Valider
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingVolume(null)}
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Annuler
                      </button>
                    </form>
                  ) : (
                    <>
                      <span>{volume.value} m³</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(volume)}
                          className="text-[#dfd750] hover:text-[#6e6a0c]"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(volume.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulaire d'ajout */}
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }} className="space-y-4 border-t pt-4">
          <h4 className="text-lg font-medium text-gray-700">Ajouter une nouvelle taille</h4>
          <div>
            <label className="block text-gray-600">Valeur (en m³)</label>
            <input
              type="number"
              value={volumeValue}
              onChange={(e) => setVolumeValue(Number(e.target.value))}
              placeholder="Entrez la taille en m³"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setShowPopup(false);
                setEditingVolume(null);
              }}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all"
            >
              Fermer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-[#dfd750] text-white py-2 px-4 rounded-md hover:bg-[#9f9911] transition-all"
            >
              Ajouter
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VolumeFormModal;