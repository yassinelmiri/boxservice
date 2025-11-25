"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSearch,
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp,
  faPrint,
  faEnvelope,
  faSpinner,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FiRefreshCw } from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";

interface WaitingListItem {
  id: number;
  email: string;
  phone: string;
  description: string;
  startDate: string;
  endDate: string;
  unitId: number;
}

interface Filters {
  startDateFrom: string;
  startDateTo: string;
  endDateFrom: string;
  endDateTo: string;
  unitId: string;
}

const WaitingListPage: React.FC = () => {
  const [waitingList, setWaitingList] = useState<WaitingListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage] = useState<number>(5);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sendingMessages, setSendingMessages] = useState<boolean>(false);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
    unitId: "",
  });
  const printRef = useRef<HTMLTableElement>(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";
  useEffect(() => {
    fetchWaitingList();
  }, []);
  useEffect(() => {
    if (showMessageModal && messageTextareaRef.current) {
      messageTextareaRef.current.focus();
    }
  }, [showMessageModal]);

  const fetchWaitingList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/waiting-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedList = response.data.sort(
        (a: WaitingListItem, b: WaitingListItem) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setWaitingList(sortedList);
      setError(null);
    } catch (err) {
      console.error("Error fetching waiting list:", err);
      setError("Failed to fetch waiting list data.");
      toast.error("Failed to fetch waiting list data.");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/waiting-list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
      }
      await fetchWaitingList();
      toast.success("Item removed from waiting list successfully!");
    } catch (error) {
      console.error("Error deleting waiting list item:", error);
      toast.error("Failed to remove item from waiting list.");
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast.info("No items selected.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedItems.map((id) =>
          axios.delete(`${apiUrl}/waiting-list/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setSelectedItems([]);
      setSelectAll(false);
      await fetchWaitingList();
      toast.success(`${selectedItems.length} items removed successfully!`);
    } catch (error) {
      console.error("Error deleting selected items:", error);
      toast.error("Failed to remove selected items.");
    }
  };
  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error(
        "Could not open print window. Please check your popup settings."
      );
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Waiting List</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .date { text-align: right; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Waiting List Report</h1>
          </div>
          <div class="date">
            <p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  const openMessageModal = () => {
    if (selectedItems.length === 0) {
      toast.info("No items selected.");
      return;
    }
    setShowMessageModal(true);
  };
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageText("");
  };
  const handleSendMessages = async () => {
    if (selectedItems.length === 0) {
      toast.info("No items selected.");
      return;
    }

    if (!messageText.trim()) {
      toast.error("Veuillez entrer un message avant d'envoyer.");
      return;
    }

    try {
      setSendingMessages(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${apiUrl}/waiting-list/send-email`,
        {
          id: selectedItems,
          message: messageText.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessageText("");
      setShowMessageModal(false);
      toast.success(
        `Messages envoyés à ${selectedItems.length} clients avec succès!`
      );
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error sending messages:", error);
      toast.error("Échec de l'envoi des messages.");
    } finally {
      setSendingMessages(false);
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setCurrentPage(0);
    toast.success("Filters applied!");
  };

  const resetFilters = async () => {
    setFilters({
      startDateFrom: "",
      startDateTo: "",
      endDateFrom: "",
      endDateTo: "",
      unitId: "",
    });

    await fetchWaitingList();
    setCurrentPage(0);
    toast.success("Filters reset!");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const filteredItems = waitingList.filter((item) => {
    const matchesSearch =
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDates = true;
    if (
      filters.startDateFrom &&
      new Date(item.startDate) < new Date(filters.startDateFrom)
    ) {
      matchesDates = false;
    }
    if (
      filters.startDateTo &&
      new Date(item.startDate) > new Date(filters.startDateTo)
    ) {
      matchesDates = false;
    }
    if (
      filters.endDateFrom &&
      new Date(item.endDate) < new Date(filters.endDateFrom)
    ) {
      matchesDates = false;
    }
    if (
      filters.endDateTo &&
      new Date(item.endDate) > new Date(filters.endDateTo)
    ) {
      matchesDates = false;
    }
    const matchesUnit =
      !filters.unitId || item.unitId.toString() === filters.unitId;

    return matchesSearch && matchesDates && matchesUnit;
  });
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  if (loading && waitingList.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#dfd750]"></div>
      </div>
    );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <ToastContainer />

        {/* Modal de Message */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-[#0000003d] z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Envoyer un message
                </h3>
                <button
                  onClick={closeMessageModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                Envoi à {selectedItems.length} client(s) sélectionné(s)
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="message"
                >
                  Votre message:
                </label>
                <textarea
                  id="message"
                  ref={messageTextareaRef}
                  className="w-full h-40 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dfd750]"
                  placeholder="Entrez votre message ici..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeMessageModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendMessages}
                  disabled={sendingMessages || !messageText.trim()}
                  className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center ${!messageText.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {sendingMessages ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="mr-2 animate-spin"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  )}
                  Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Gestion de la Liste d&apos;Attente
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}

              className="justify-center text-sm font-medium border border-transparent bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center shadow-lg transition-all duration-300 hover:scale-105"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Imprimer la Liste
            </button>
            <button
              onClick={openMessageModal}
              disabled={selectedItems.length === 0 || sendingMessages}
              className={`justify-center text-sm font-medium border border-transparent bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center shadow-lg transition-all duration-300 hover:scale-105 ${selectedItems.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Envoyer des Messages
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className=" justify-center text-sm font-medium border border-transparent bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center shadow-lg transition-all duration-300 hover:scale-105"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Supprimer la Sélection ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
        {/* Carte des Statistiques */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total des Éléments en Liste d&apos;Attente
            </h3>
            <p className="text-3xl font-bold text-[#9f9911]">
              {waitingList.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Éléments Filtrés
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {filteredItems.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Éléments Sélectionnés
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {selectedItems.length}
            </p>
          </div>
        </div>
        <div className="my-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Rechercher par email, téléphone ou description..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-md ${showFilters ? "bg-[#f3f1cc] border-[#d9d262]" : ""
                }`}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-600" />
              <span className="text-gray-700">Filtres</span>
              <FontAwesomeIcon
                icon={showFilters ? faChevronUp : faChevronDown}
                className="ml-2 text-gray-600"
              />
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center shadow-md"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Réinitialiser
            </button>
            <button
              onClick={fetchWaitingList}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2" size={16} />
              Actualiser
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Date de Début (De)
                      </label>
                      <input
                        type="date"
                        name="startDateFrom"
                        value={filters.startDateFrom}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Date de Début (À)
                      </label>
                      <input
                        type="date"
                        name="startDateTo"
                        value={filters.startDateTo}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        ID de l&apos;Unité
                      </label>
                      <input
                        type="text"
                        name="unitId"
                        value={filters.unitId}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#dfd750]"
                        placeholder="Entrez l'ID de l'unité"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={applyFilters}
                      className="bg-[#9f9911] text-white px-4 py-2 rounded-lg hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750] transition-colors"
                    >
                      Appliquer les Filtres
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="overflow-x-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full divide-y divide-gray-200" ref={printRef}>
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-py-4 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="form-checkbox h-5 w-5 text-[#9f9911] rounded"
                  />
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                >Email</th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                >Téléphone</th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                >Description</th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                >Date de Début</th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                >ID de l&apos;Unité</th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="p-4 text-center text-gray-700">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />
                    Chargement des données...
                  </td>
                </tr>
              )}

              {!loading && currentItems.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500">
                    Aucun élément trouvé correspondant à vos critères.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b even:bg-gray-100 odd:bg-white hover:bg-gray-200 transition-colors"
                  >
                    <td className="p-4 text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="form-checkbox h-5 w-5 text-[#9f9911] rounded"
                      />
                    </td>
                    <td className="p-4 text-gray-700">{item.email}</td>
                    <td className="p-4 text-gray-700">{item.phone}</td>
                    <td className="p-4 text-gray-700">
                      {item.description.length > 50
                        ? `${item.description.substring(0, 20)}...`
                        : item.description}
                    </td>
                    <td className="p-4 text-gray-700">
                      {formatDate(item.startDate)}
                    </td>
                    <td className="p-4 text-gray-700">{item.unitId}</td>
                    <td className="p-4 text-gray-700">
                      <div className="flex space-x-4">
                        <button
                          className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex justify-center mt-6">
            <ReactPaginate
            previousLabel={"Précédent"}
            nextLabel={"Suivant"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex space-x-2 items-center"}
            pageLinkClassName={
              "px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-[#f3f1cc] hover:border-[#d9d262] transition-colors duration-200"
            }
            previousLinkClassName={
              "px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-[#f3f1cc] hover:border-[#d9d262] transition-colors duration-200"
            }
            nextLinkClassName={
              "px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-[#f3f1cc] hover:border-[#d9d262] transition-colors duration-200"
            }
            disabledClassName={"opacity-50 cursor-not-allowed hover:bg-transparent"}
            activeClassName={"bg-[#f9f8e6] border-[#e6e297] text-[#9f9911]"}
          />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default WaitingListPage;
