import { X } from "lucide-react";
import BookingForm from "./BookingForm";
import { useEffect } from "react";

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
  size: number;
  code: string; // Add this required property
  [key: string]: any;
}


interface BookingModalProps {
  show: boolean;
  onHide: () => void;
  selectedUnit?: Unit | null;
  onBookingComplete: (data: any) => void;
}

const BookingModal = ({ show, onHide, selectedUnit, onBookingComplete }: BookingModalProps) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const formattedUnit = selectedUnit ? {
    id: selectedUnit.id,
    name: selectedUnit.name || "Unité de stockage",
    size: selectedUnit.volume.toString(),
    volume: selectedUnit.volume,
    pricePerMonth: selectedUnit.pricePerMonth,
    available: selectedUnit.available !== false,
    storageCenterId: selectedUnit.storageCenterId, 
    code: selectedUnit.name || selectedUnit.id,
    images: selectedUnit.images || [],
    features: selectedUnit.features || []
  } : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onHide}></div>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Réserver une unité de stockage
            </h3>
            <button
              type="button"
              onClick={onHide}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-md"
            >
              <X size={24} />
            </button>
          </div>
          <div className="px-6 py-4">
            {selectedUnit && formattedUnit && (
              <BookingForm
              unitId={selectedUnit.id}
              unitDetails={formattedUnit}
              onBookingComplete={onBookingComplete}
            />
            )}
          </div>
          <div className="bg-gray-50 border-t px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onHide}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;