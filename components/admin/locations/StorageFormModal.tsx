'use client';
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import LocationSearch from "./LocationSearch";
import LocationPicker from "./LocationPicker";
import "leaflet/dist/leaflet.css";

interface StorageFormModalProps {
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  editStoreData: any | null;
  newStoreData: any;
  setNewStoreData: React.Dispatch<React.SetStateAction<any>>;
  setEditStoreData: React.Dispatch<React.SetStateAction<any | null>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  mapCenter: [number, number];
  customIcon: L.Icon;
}

const StorageFormModal: React.FC<StorageFormModalProps> = ({
  showPopup,
  setShowPopup,
  editStoreData,
  newStoreData,
  setNewStoreData,
  setEditStoreData,
  handleChange,
  handleSubmit,
  mapCenter,
  customIcon
}) => {
  useEffect(() => {
    if (showPopup) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [showPopup]);
  const mapRef = React.useRef<L.Map | null>(null);

  if (!showPopup) return null;

  const currentData = editStoreData || newStoreData;
  const setCurrentData = editStoreData ? setEditStoreData : setNewStoreData;

  const position: [number, number] = [
    currentData.lat ? parseFloat(currentData.lat) : mapCenter[0],
    currentData.lng ? parseFloat(currentData.lng) : mapCenter[1]
  ];

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
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-700">
            {editStoreData ? "Modifier un Stockage" : "Ajouter un Stockage"}
          </h3>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPopup(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Nom du Stockage</label>
            <input
              type="text"
              name="name"
              value={currentData.name || ""}
              onChange={handleChange}
              placeholder="Nom du Stockage"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Description</label>
            <input
              type="text"
              name="description"
              value={currentData.description || ""}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
            />
          </div>
          <div>
            <label className="block text-gray-600">Adresse</label>
            <input
              type="text"
              name="address"
              value={currentData.address || ""}
              onChange={handleChange}
              placeholder="Adresse"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Ville</label>
            <input
              type="text"
              name="city"
              value={currentData.city || ""}
              onChange={handleChange}
              placeholder="Ville"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Pays</label>
            <input
              type="text"
              name="country"
              value={currentData.country || ""}
              onChange={handleChange}
              placeholder="Pays"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Code Postal</label>
            <input
              type="text"
              name="postalCode"
              value={currentData.postalCode || ""}
              onChange={handleChange}
              placeholder="Code Postal"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Code de la Porte</label>
            <input
              type="text"
              name="codeGate"
              value={currentData.codeGate || ""}
              onChange={handleChange}
              placeholder="Code d'accès à la porte"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-600 mb-2">
              Localisation (Cliquez sur la carte ou recherchez une adresse)
            </label>
            <div className="h-[300px] w-full relative border rounded-md overflow-hidden">
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                ref={(map) => {
                  mapRef.current = map;
                  if (map) {
                    map.invalidateSize();
                  }
                }}
              >
                <LocationSearch
                  setStoreData={setCurrentData}
                  isEditMode={!!editStoreData}
                />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker setNewStoreData={setCurrentData} />
                {currentData.lat && currentData.lng && (
                  <Marker
                    position={[
                      parseFloat(currentData.lat),
                      parseFloat(currentData.lng),
                    ]}
                    icon={customIcon}
                  >
                    <Popup>
                      {currentData.address || "Emplacement sélectionné"} <br />
                      Latitude: {currentData.lat} <br />
                      Longitude: {currentData.lng}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
          <div className="col-span-2 flex justify-end space-x-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowPopup(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all"
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-[#dfd750] text-white py-2 px-4 rounded-md hover:bg-[#9f9911] transition-all"
            >
              {editStoreData ? "Modifier" : "Créer"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StorageFormModal;