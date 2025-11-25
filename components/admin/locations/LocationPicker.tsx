'use client';
import React from "react";
import { useMapEvents } from "react-leaflet";

interface LocationPickerProps {
  setNewStoreData: React.Dispatch<React.SetStateAction<any>>;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ setNewStoreData }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
          const addressDetails = data.address || {};
          
          setNewStoreData((prev: any) => ({
            ...prev,
            lat: lat.toString(),
            lng: lng.toString(),
            address: addressDetails.road ? `${addressDetails.road}, ${addressDetails.house_number || ''}`.trim() : data.display_name.split(',')[0],
            city: addressDetails.city || addressDetails.town || addressDetails.village || '',
            country: addressDetails.country || '',
            postalCode: addressDetails.postcode || '',
          }));
        })
        .catch(err => {
          console.error("Erreur lors du géocodage inverse:", err);
          setNewStoreData((prev: any) => ({
            ...prev,
            lat: lat.toString(),
            lng: lng.toString(),
          }));
        });
    },
  });

  return null;
};

export default LocationPicker;