import React, { useState, useEffect } from 'react';

const FilterBar = ({
  filters,
  onFiltersChange,
  onSearchChange,
  onSortChange,
  totalResults,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      rank: 'All',
      loginType: 'All',
      status: 'All',
      priceRange: { label: 'All', min: 0, max: Infinity },
      mythicCount: { label: 'All', min: 0, max: Infinity },
    });
    setLocalSearch('');
  };

  const hasActiveFilters = () => {
    return (
      filters.rank !== 'All' ||
      filters.loginType !== 'All' ||
      filters.status !== 'All' ||
      filters.priceRange?.label !== 'All' ||
      filters.mythicCount?.label !== 'All' ||
      localSearch.trim() !== ''
    );
  };

  return (
    <div className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300 font-medium">
                {isLoading ? 'Loading...' : `${totalResults} accounts found`}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
              >
                <span className="flex items-center space-x-2">
                  <span>🗑️</span>
                  <span>Clear Filters</span>
                </span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden px-4 py-2 text-sm font-medium bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-200 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 shadow-lg"
            >
              <span className="flex items-center space-x-2">
                <span>{isExpanded ? '👁️‍🗨️' : '🔍'}</span>
                <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search accounts by name, rank, or mythic weapons..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-600/50 text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Filters */}
        <div
          className={`space-y-6 transition-all duration-300 ${
            isExpanded ? 'block opacity-100' : 'hidden md:block opacity-100'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Enhanced Rank Filter */}
            <div className="group">
              <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
                <span>👑</span>
                <span>Rank</span>
              </label>
              <div className="relative">
                <select
                  value={filters.rank || 'All'}
                  onChange={(e) => handleFilterChange('rank', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Ranks</option>
                  <option value="Conqueror">👑 Conqueror</option>
                  <option value="Ace">💜 Ace</option>
                  <option value="Crown">👑 Crown</option>
                  <option value="Diamond">💎 Diamond</option>
                  <option value="Platinum">⚪ Platinum</option>
                  <option value="Gold">🥇 Gold</option>
                  <option value="Silver">🥈 Silver</option>
                  <option value="Bronze">🥉 Bronze</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
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

            {/* Enhanced Login Type Filter */}
            <div className="group">
              <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
                <span>🔐</span>
                <span>Login Type</span>
              </label>
              <div className="relative">
                <select
                  value={filters.loginType || 'All'}
                  onChange={(e) =>
                    handleFilterChange('loginType', e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Facebook">📘 Facebook</option>
                  <option value="Google">🔍 Google</option>
                  <option value="Twitter">🐦 Twitter</option>
                  <option value="Guest">👤 Guest</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
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

            {/* Enhanced Status Filter */}
            <div className="group">
              <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
                <span>📊</span>
                <span>Status</span>
              </label>
              <div className="relative">
                <select
                  value={filters.status || 'All'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Available">✅ Available</option>
                  <option value="Sold">❌ Sold</option>
                  <option value="Reserved">⏳ Reserved</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
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

            {/* Enhanced Price Range Filter */}
            <div className="group">
              <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
                <span>💰</span>
                <span>Price Range</span>
              </label>
              <div className="relative">
                <select
                  value={filters.priceRange?.label || 'All'}
                  onChange={(e) => {
                    const priceRanges = [
                      { label: 'All', min: 0, max: Infinity },
                      { label: 'Under ₹1000', min: 0, max: 1000 },
                      { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
                      { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
                      { label: 'Above ₹3000', min: 3000, max: Infinity },
                    ];
                    const selected = priceRanges.find(
                      (range) => range.label === e.target.value
                    );
                    handleFilterChange('priceRange', selected);
                  }}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Prices</option>
                  <option value="Under ₹1000">💚 Under ₹1000</option>
                  <option value="₹1000 - ₹2000">💛 ₹1000 - ₹2000</option>
                  <option value="₹2000 - ₹3000">🧡 ₹2000 - ₹3000</option>
                  <option value="Above ₹3000">❤️ Above ₹3000</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
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

            {/* Enhanced Mythic Count Filter */}
            <div className="group">
              <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
                <span>⚔️</span>
                <span>Mythic Count</span>
              </label>
              <div className="relative">
                <select
                  value={filters.mythicCount?.label || 'All'}
                  onChange={(e) => {
                    const mythicCounts = [
                      { label: 'All', min: 0, max: Infinity },
                      { label: '1-2 Mythics', min: 1, max: 2 },
                      { label: '3-4 Mythics', min: 3, max: 4 },
                      { label: '5+ Mythics', min: 5, max: Infinity },
                    ];
                    const selected = mythicCounts.find(
                      (count) => count.label === e.target.value
                    );
                    handleFilterChange('mythicCount', selected);
                  }}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Counts</option>
                  <option value="1-2 Mythics">⚔️ 1-2 Mythics</option>
                  <option value="3-4 Mythics">⚔️⚔️ 3-4 Mythics</option>
                  <option value="5+ Mythics">⚔️⚔️⚔️ 5+ Mythics</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
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
          </div>

          {/* Enhanced Sort Options */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-slate-300 flex items-center space-x-2">
                  <span>🔄</span>
                  <span>Sort by:</span>
                </span>
                <div className="relative">
                  <select
                    value={filters.sortBy || 'default'}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="px-4 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-500/50 appearance-none cursor-pointer pr-10"
                  >
                    <option value="default">📋 Default</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💰 Price: High to Low</option>
                    <option value="rank">👑 Rank: High to Low</option>
                    <option value="mythics">⚔️ Mythics: Most to Least</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
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
            </div>

            {/* Enhanced Active Filters Display */}
            {hasActiveFilters() && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-slate-400 flex items-center space-x-2">
                  <span>🏷️</span>
                  <span>Active filters:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {filters.rank !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-900/40 to-yellow-800/30 text-yellow-300 border border-yellow-700/40 shadow-lg backdrop-blur-sm">
                      👑 {filters.rank}
                    </span>
                  )}
                  {filters.loginType !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-blue-300 border border-blue-700/40 shadow-lg backdrop-blur-sm">
                      🔐 {filters.loginType}
                    </span>
                  )}
                  {filters.status !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-900/40 to-green-800/30 text-green-300 border border-green-700/40 shadow-lg backdrop-blur-sm">
                      📊 {filters.status}
                    </span>
                  )}
                  {filters.priceRange?.label !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-900/40 to-purple-800/30 text-purple-300 border border-purple-700/40 shadow-lg backdrop-blur-sm">
                      💰 {filters.priceRange.label}
                    </span>
                  )}
                  {filters.mythicCount?.label !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-900/40 to-red-800/30 text-red-300 border border-red-700/40 shadow-lg backdrop-blur-sm">
                      ⚔️ {filters.mythicCount.label}
                    </span>
                  )}
                  {localSearch.trim() !== '' && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-900/40 to-indigo-800/30 text-indigo-300 border border-indigo-700/40 shadow-lg backdrop-blur-sm">
                      🔍 &ldquo;{localSearch}&rdquo;
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
