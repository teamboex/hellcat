import React, { useState } from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading = false,
  onLoadMore,
  hasMore = false,
}) => {
  const [showLoadMore, setShowLoadMore] = useState(false);

  if (totalPages <= 1 && !hasMore) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-6 py-8">
      {/* Enhanced Results Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700/50">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span>Loading accounts...</span>
                </span>
              ) : (
                `Showing ${startItem}-${endItem} of ${totalItems} accounts`
              )}
            </span>
          </div>

          {/* Load More Toggle for Mobile */}
          <button
            onClick={() => setShowLoadMore(!showLoadMore)}
            className="md:hidden px-3 py-2 text-xs font-medium bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors border border-slate-600/50"
          >
            {showLoadMore ? 'Hide' : 'Show'} Load More
          </button>
        </div>

        {/* Load More Button (Mobile) */}
        {hasMore && onLoadMore && (
          <div className={`md:hidden ${showLoadMore ? 'block' : 'hidden'}`}>
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center space-x-2">
                <span>📱</span>
                <span>Load More Accounts</span>
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Pagination Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
        {/* Desktop Pagination */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform ${
              currentPage === 1 || isLoading
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-slate-100 border border-slate-600/50 hover:border-slate-500/50 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            <span className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Previous</span>
            </span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-slate-400 font-medium">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/25 scale-105'
                        : isLoading
                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-slate-100 border border-slate-600/50 hover:border-slate-500/50 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform ${
              currentPage === totalPages || isLoading
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-slate-100 border border-slate-600/50 hover:border-slate-500/50 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>Next</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Quick Jump (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-400 flex items-center space-x-2">
            <span>🎯</span>
            <span>Go to:</span>
          </span>
          <div className="relative">
            <select
              value={currentPage}
              onChange={(e) => onPageChange(parseInt(e.target.value))}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50 appearance-none cursor-pointer pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <option key={page} value={page}>
                    Page {page}
                  </option>
                )
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Load More Button (Desktop) */}
        {hasMore && onLoadMore && (
          <div className="hidden md:block">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Load More</span>
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
