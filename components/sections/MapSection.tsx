import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
        <p className="text-gray-600">Chargement de la carte...</p>
      </div>
    </div>
  )
});

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance: number;
  minPrice: number;
  image: string;
  lat?: number;
  lng?: number;
  hasAvailableUnits?: boolean;
}

interface MapSectionProps {
  locations: Location[];
}

const MapSection = ({ locations }: MapSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[600px]">
      <div className="h-full">
        <MapComponent locations={locations} />
      </div>
    </div>
  );
};

export default MapSection;