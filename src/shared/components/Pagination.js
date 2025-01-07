import { ChevronRightIcon, ChevronLeftIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/20/solid';
import React from 'react';

const Pagination = ({ totalRecords, pageSize, currentSkip, onPageChange }) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const currentPage = Math.floor(currentSkip / pageSize) + 1;

  const handlePageClick = (pageNumber) => {
    const newSkip = (pageNumber - 1) * pageSize;
    onPageChange({ skip: newSkip, pageSize });
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPageChange({ skip: 0, pageSize: newPageSize }); // Reset to the first page
  };

  return (
    <nav aria-label="Page navigation" className="w-full flex items-center justify-between mt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{currentSkip + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentSkip + pageSize, totalRecords)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalRecords}</span> results
        </span>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md p-2 text-sm focus:outline-none"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <button
              onClick={() => handlePageClick(1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="sr-only">First</span>
              <ChevronDoubleLeftIcon aria-hidden="true" className="size-5" />
            </button>
          </li>
          <li>
            <button
              onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => handlePageClick(page)}
                className={`flex items-center justify-center px-3 h-8 leading-tight border ${page === currentPage
                  ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>
          </li>
          <li>
            <button
              onClick={() => handlePageClick(totalPages)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="sr-only">Last</span>
              <ChevronDoubleRightIcon aria-hidden="true" className="size-5" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Pagination;
