import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import CheckoutModal from '../components/CheckoutModal';
import Navigation from '../components/Navigation';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const StorePage = () => {
  // Context
  const { state, actions } = useApp();

  // Local state
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Helper function for rank colors
  const getRankColor = (rank) => {
    const rankColors = {
      Conqueror:
        'text-yellow-400 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-yellow-500/40 shadow-yellow-500/20',
      Ace: 'text-purple-400 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-purple-500/40 shadow-purple-500/20',
      Crown:
        'text-orange-400 bg-gradient-to-r from-orange-900/30 to-orange-800/20 border-orange-500/40 shadow-orange-500/20',
      Diamond:
        'text-blue-400 bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-blue-500/40 shadow-blue-500/20',
      Platinum:
        'text-gray-300 bg-gradient-to-r from-gray-700/30 to-gray-600/20 border-gray-500/40',
      Gold: 'text-yellow-300 bg-gradient-to-r from-yellow-800/30 to-yellow-700/20 border-yellow-600/40',
      Silver:
        'text-gray-400 bg-gradient-to-r from-gray-600/30 to-gray-500/20 border-gray-500/40',
      Bronze:
        'text-orange-300 bg-gradient-to-r from-orange-800/30 to-orange-700/20 border-orange-600/40',
    };
    return (
      rankColors[rank] ||
      'text-gray-400 bg-gradient-to-r from-gray-700/30 to-gray-600/20 border-gray-500/40'
    );
  };

  // Items per page
  const itemsPerPage = 12;

  // Load recent purchases for social proof
  useEffect(() => {
    actions.loadRecentPurchases();
  }, [actions]);

  // Event handlers
  const handleFiltersChange = (newFilters) => {
    actions.updateFilters(newFilters);
  };

  const handleSearchChange = (query) => {
    actions.updateSearchQuery(query);
  };

  const handleSortChange = (sort) => {
    actions.updateSortBy(sort);
  };

  const handlePageChange = (page) => {
    actions.updateCurrentPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleBuyNow = (product) => {
    if (product.status === 'Sold' || product.status === 'Sold Out') {
      toast.error('This account is no longer available');
      return;
    }

    setSelectedProduct(product);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // Create order
      const orderData = {
        productId: selectedProduct.id,
        product: selectedProduct,
        buyer: {
          name: paymentResult.buyerName || 'Anonymous',
          email: paymentResult.buyerEmail || '',
          phone: paymentResult.buyerPhone || '',
        },
        amount: selectedProduct.price,
      };

      const order = await actions.createOrder(orderData);

      // Process payment
      await actions.processPayment(order.id, {
        productId: selectedProduct.id,
        paymentMethod: 'razorpay',
        ...paymentResult,
      });

      toast.success('Payment successful! Account delivered.');

      // Reload recent purchases
      await actions.loadRecentPurchases();
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="product-grid">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <div key={index} className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="h-48 bg-slate-700"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-slate-700 rounded"></div>
              <div className="h-8 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-10 bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-slate-900">
        <FilterBar
          filters={state.filters}
          onFiltersChange={handleFiltersChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          totalResults={0}
          isLoading={false}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              Error Loading Products
            </h2>
            <p className="text-slate-400 mb-6">{state.error}</p>
            <button
              onClick={() => actions.loadProducts()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <Navigation />

      {/* Filter Bar */}
      <FilterBar
        filters={state.filters}
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        totalResults={state.totalResults}
        isLoading={state.loading.products}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Header */}
        {!state.loading.products && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-slate-100">
                  {state.searchQuery
                    ? `Search Results for "${state.searchQuery}"`
                    : 'All Hellcat Accounts'}
                </h1>
                <p className="text-slate-400">
                  {state.totalResults}{' '}
                  {state.totalResults === 1 ? 'account' : 'accounts'} found
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <span>🎮</span>
                  <span>
                    {
                      state.products.filter((p) => p.status === 'Available')
                        .length
                    }{' '}
                    Available
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>
                    {
                      state.products.filter((p) => p.rank === 'Conqueror')
                        .length
                    }{' '}
                    Conqueror
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>💎</span>
                  <span>
                    {state.products.filter((p) => p.mythics.length >= 5).length}{' '}
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Status Indicator */}
        {state.realTimeUpdates && (
          <div className="mb-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">
                  Live Updates Active
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-500">
                  Real-time inventory tracking
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* Recent Purchases Social Proof */}
        {state.recentPurchases && state.recentPurchases.length > 0 && (
          <div className="mb-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center space-x-2">
              <span>🔥</span>
              <span>Recent Purchases</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.recentPurchases.map((purchase, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-green-900/20 border border-green-500/30 rounded-full text-sm text-green-300"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span>{purchase.buyerName}</span>
                  <span className="mx-1">•</span>
                  <span>{purchase.productName}</span>
                  <span className="mx-1">•</span>
                  <span className="text-green-400 font-semibold">
                    ₹{purchase.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {state.loading.products ? (
          <LoadingSkeleton />
        ) : state.products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              No Accounts Found
            </h2>
            <p className="text-slate-400 mb-6">
              Try adjusting your filters or search terms to find more accounts.
            </p>
            <button
              onClick={() => {
                actions.updateFilters({
                  rank: 'All',
                  loginType: 'All',
                  status: 'All',
                  priceRange: { label: 'All', min: 0, max: Infinity },
                  mythicCount: { label: 'All', min: 0, max: Infinity },
                });
                actions.updateSearchQuery('');
                actions.updateSortBy('default');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="hidden md:block">
              <div className="product-grid">
                {state.products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyNow={handleBuyNow}
                    onViewDetails={handleViewDetails}
                    index={index}
                    isRealTime={state.realTimeUpdates}
                  />
                ))}
              </div>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-3">
              {state.products.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-4"
                >
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">🎮</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-100 truncate">
                          {product.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {product.loginType} • Level {product.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRankColor(
                          product.rank
                        )}`}
                      >
                        {product.rank}
                      </span>
                    </div>
                  </div>

                  {/* Product Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-400">K/D</div>
                      <div className="text-sm font-semibold text-slate-200">
                        {product.kd}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Win Rate</div>
                      <div className="text-sm font-semibold text-slate-200">
                        {product.winRate}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Mythics</div>
                      <div className="text-sm font-semibold text-slate-200">
                        {product.mythics.length}
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-green-400">
                      ₹{product.price.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-xs"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        disabled={
                          product.status === 'Sold' ||
                          product.status === 'Sold Out'
                        }
                        className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                          product.status === 'Sold' ||
                          product.status === 'Sold Out'
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {product.status === 'Sold' ||
                        product.status === 'Sold Out'
                          ? 'Sold Out'
                          : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!state.loading.products && state.products.length > 0 && (
          <Pagination
            currentPage={state.currentPage}
            totalPages={Math.ceil(state.totalResults / itemsPerPage)}
            onPageChange={handlePageChange}
            totalItems={state.totalResults}
            itemsPerPage={itemsPerPage}
            isLoading={state.loading.products}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Hellcat Store
            </h3>
            <p className="text-slate-400 text-sm">
              Professional Hellcat account marketplace • Secure transactions •
              24/7 support
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-sm text-slate-500">
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
              <span>Contact Support</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <ProductDetailsModal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedProduct && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default StorePage;
