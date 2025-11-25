'use client';
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconLogo from "@/public/assets/image/logo.png";

const MapComponent = ({ mapCenter, marker, onMarkerMove }) => {
  const [map, setMap] = useState(null);
  
  useEffect(() => {
    // Create custom marker icon
    const customMarkerIcon = L.icon({
      iconUrl: iconLogo.src,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Initialize map
    const mapInstance = L.map('map').setView(mapCenter, 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);
    
    // Add marker if provided
    let mapMarker;
    if (marker) {
      mapMarker = L.marker(marker, { icon: customMarkerIcon, draggable: true }).addTo(mapInstance);
      
      if (onMarkerMove) {
        mapMarker.on('dragend', function(e) {
          const position = e.target.getLatLng();
          onMarkerMove([position.lat, position.lng]);
        });
      }
    }
    
    setMap(mapInstance);
    
    // Cleanup on unmount
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);
  
  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default MapComponent;