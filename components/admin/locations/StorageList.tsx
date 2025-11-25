'use client';
import React from "react";
import { motion } from "framer-motion";
import StorageCenterCard from "./StorageCenterCard";
import ReactPaginate from "react-paginate";

interface StorageListProps {
  currentItems: any[];
  loading: boolean;
  error: string | null;
  loadingImages: Record<string, boolean>;
  handleEdit: (center: any) => void;
  handleDelete: (id: string) => void;
  pageCount: number;
  handlePageClick: ({ selected }: { selected: number }) => void;
}

const StorageList: React.FC<StorageListProps> = ({
  currentItems,
  loading,
  error,
  loadingImages,
  handleEdit,
  handleDelete,
  pageCount,
  handlePageClick
}) => {
  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ccc32d]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold mb-6 text-gray-800"
      >
        Stockages Existants
      </motion.h3>

      {currentItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun stockage disponible</h3>
          <p className="mt-1 text-gray-500">Ajoutez un nouveau stockage pour commencer.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentItems.map((center) => (
            <StorageCenterCard
              key={center.id}
              center={center}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loadingImages={loadingImages}
            />
          ))}
        </motion.div>
      )}

      {pageCount > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-8"
        >
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
        </motion.div>
      )}
    </div>
  );
};

export default StorageList;