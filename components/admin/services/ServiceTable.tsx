import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface ServiceTableProps {
  currentServices: any[];
  handleModify: (service: any) => void;
  handleDelete: (id: number) => void;
}

const ServiceTable = ({
  currentServices,
  handleModify,
  handleDelete,
}: ServiceTableProps) => {
  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Nom
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Prix
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentServices.length > 0 ? (
            currentServices.map((service, index) => (
              <motion.tr
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b even:bg-gray-100 odd:bg-white hover:bg-gray-200 transition-colors"
              >
                <td className="p-4 text-gray-700">{service.id}</td>
                <td className="p-4 text-gray-700 font-medium">
                  {service.name}
                </td>
                <td className="p-4 text-gray-700">
                  {service.description || "Aucune description"}
                </td>
                <td className="p-4 text-green-600 font-bold">
                  {service.price}€
                </td>
                <td className="p-4">
                  <div className="flex space-x-4">
                    <button
                      className="text-[#dfd750] hover:text-[#6e6a0c] transition-transform transform hover:scale-110"
                      onClick={() => handleModify(service)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
                      onClick={() => handleDelete(service.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td className="p-4 text-center text-gray-500">
                Aucun service trouvé correspondant à vos critères.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;