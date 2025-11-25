import ReactPaginate from "react-paginate";

interface ServicePaginationProps {
  pageCount: number;
  currentPage: number;
  handlePageClick: (selected: { selected: number }) => void;
}

const ServicePagination = ({
  pageCount,
  currentPage,
  handlePageClick,
}: ServicePaginationProps) => {
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <ReactPaginate
        previousLabel={"Précédent"}
        nextLabel={"Suivant"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        forcePage={currentPage}
        containerClassName={"pagination flex space-x-2 items-center"}
        pageLinkClassName={
          "pagination__link px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-[#dfd750] hover:text-white transition-colors duration-200"
        }
        previousLinkClassName={
          "pagination__link px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-[#dfd750] hover:text-white transition-colors duration-200"
        }
        nextLinkClassName={
          "pagination__link px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-[#dfd750] hover:text-white transition-colors duration-200"
        }
        disabledClassName={
          "pagination__link--disabled opacity-50 cursor-not-allowed"
        }
        activeClassName={"pagination__link--active bg-[#dfd750] text-white"}
      />
    </div>
  );
};

export default ServicePagination;