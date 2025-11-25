import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "@/components/AdminLayout";

interface ServiceListProps {
  children: React.ReactNode;
  setShowPopup: (show: boolean) => void;
  setSelectedService: (service: null) => void;
  setNewServiceData: (data: any) => void;
}

const ServiceList = ({
  children,
  setShowPopup,
  setSelectedService,
  setNewServiceData,
}: ServiceListProps) => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Gestion des Services
          </h2>
          <button
            onClick={() => {
              setSelectedService(null);
              setNewServiceData({ name: "", description: "", price: 0 });
              setShowPopup(true);
            }}
            className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c]"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Créer un Service
          </button>
        </div>
        {children}
      </div>
    </AdminLayout>
  );
};

export default ServiceList;