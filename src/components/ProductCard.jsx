import React, { useState } from 'react';
import { ShoppingCart, CheckCircle } from 'lucide-react';

const ProductCard = ({
  product,
  onBuyNow,
  onViewDetails,
  index = 0,
  showRecentPurchase = false,
  isRealTime = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isSoldOut = product.status === 'Sold' || product.status === 'Sold Out';
  const isHot = product.isHot || product.mythics.length >= 6;
  const isLimited = product.isLimited || product.price > 2500;
  const isExclusive =
    product.isExclusive ||
    (product.rank === 'Conqueror' && product.mythics.length >= 5);
  const isRecentlyAdded =
    product.createdAt &&
    new Date() - new Date(product.createdAt) < 24 * 60 * 60 * 1000; // 24 hours

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

  const getLoginTypeIcon = (loginType) => {
    const icons = {
      Facebook: '📘',
      Google: '🔍',
      Guest: '👤',
      Twitter: '🐦',
    };
    return icons[loginType] || '👤';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Available:
        'text-green-400 bg-gradient-to-r from-green-900/30 to-green-800/20 border-green-500/40 shadow-green-500/20',
      Sold: 'text-red-400 bg-gradient-to-r from-red-900/30 to-red-800/20 border-red-500/40',
      'Sold Out':
        'text-red-400 bg-gradient-to-r from-red-900/30 to-red-800/20 border-red-500/40',
      Reserved:
        'text-yellow-400 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-yellow-500/40',
    };
    return (
      statusColors[status] ||
      'text-gray-400 bg-gradient-to-r from-gray-700/30 to-gray-600/20 border-gray-500/40'
    );
  };

  // Real-time status change animation
  React.useEffect(() => {
    if (isRealTime && product.status) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [product.status, isRealTime]);

  return (
    <div
      className={`group relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:scale-[1.02] ${
        isSoldOut ? 'opacity-60' : ''
      } ${
        isExclusive ? 'ring-2 ring-yellow-500/30 shadow-yellow-500/10' : ''
      } ${isHot ? 'ring-1 ring-red-500/30' : ''} ${
        isAnimating ? 'animate-pulse' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {isHot && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse">
            🔥 HOT
          </span>
        )}
        {isLimited && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            ⭐ LIMITED
          </span>
        )}
        {isExclusive && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg">
            👑 EXCLUSIVE
          </span>
        )}
        {isRecentlyAdded && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg animate-bounce">
            ✨ NEW
          </span>
        )}
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-lg backdrop-blur-sm ${getStatusColor(
            product.status
          )}`}
        >
          {product.status}
        </span>
      </div>

      {/* Product Image with Enhanced Effects */}
      <div className="relative h-52 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-7xl opacity-30 group-hover:opacity-50 transition-opacity duration-300">
            🎮
          </div>
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        </div>

        {/* Rank Badge with Enhanced Styling */}
        <div className="absolute bottom-3 left-3 z-20">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-lg backdrop-blur-sm ${getRankColor(
              product.rank
            )}`}
          >
            {product.rank}
          </span>
        </div>

        {/* Hover Overlay with Additional Stats */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-30 flex items-end p-4 transition-all duration-300">
            <div className="text-white text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⚡</span>
                <span>RP: {product.rp.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">🎯</span>
                <span>KD: {product.kd}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">🏆</span>
                <span>WR: {product.winRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Title with Enhanced Typography */}
        <h3 className="text-xl font-bold text-slate-100 line-clamp-1 group-hover:text-blue-300 transition-colors duration-300">
          {product.title}
        </h3>

        {/* Price with Premium Styling */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-500">
              ₹{product.price.toLocaleString()}
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-500/20 rounded-lg blur-sm -z-10"></div>
          </div>
          <div className="text-sm text-slate-400 font-medium">
            Level {product.level}
          </div>
        </div>

        {/* Enhanced Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center justify-center space-x-1 bg-slate-800/50 rounded-lg py-2 px-3">
            <span className="text-yellow-400">🎯</span>
            <span className="text-slate-300 font-semibold">{product.kd}</span>
          </div>
          <div className="flex items-center justify-center space-x-1 bg-slate-800/50 rounded-lg py-2 px-3">
            <span className="text-green-400">🏆</span>
            <span className="text-slate-300 font-semibold">
              {product.winRate}%
            </span>
          </div>
          <div className="flex items-center justify-center space-x-1 bg-slate-800/50 rounded-lg py-2 px-3">
            <span className="text-blue-400">⚡</span>
            <span className="text-slate-300 font-semibold">
              {product.matches}
            </span>
          </div>
        </div>

        {/* Enhanced Mythics Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-300">
              Mythic Weapons
            </div>
            <div className="text-xs text-slate-500">
              {product.mythics.length} total
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.mythics.slice(0, 3).map((mythic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-blue-300 border border-blue-700/40 shadow-lg backdrop-blur-sm"
              >
                {mythic}
              </span>
            ))}
            {product.mythics.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                +{product.mythics.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Vehicles & Pets */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-blue-400">🚗</span>
              <div className="text-slate-400 text-xs font-medium">Vehicles</div>
            </div>
            <div className="text-slate-200 font-bold text-lg">
              {product.vehicles.length}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-purple-400">🐾</span>
              <div className="text-slate-400 text-xs font-medium">Pets</div>
            </div>
            <div className="text-slate-200 font-bold text-lg">
              {product.pets.length}
            </div>
          </div>
        </div>

        {/* Login Type with Enhanced Styling */}
        <div className="flex items-center justify-between bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <span className="text-lg">
              {getLoginTypeIcon(product.loginType)}
            </span>
            <span className="font-medium">{product.loginType}</span>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            RP: {product.rp.toLocaleString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* View Details Button */}
          <button
            onClick={() => onViewDetails(product)}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 text-slate-200 hover:shadow-lg hover:shadow-slate-500/20 hover:scale-[1.02] active:scale-[0.98] border border-slate-600/50 hover:border-slate-500/70"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">👁️</span>
              <span>View Details</span>
            </div>
          </button>

          {/* Enhanced Buy Now Button */}
          <button
            onClick={() => onBuyNow(product)}
            disabled={isSoldOut}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 transform ${
              isSoldOut
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {isSoldOut ? (
                <>
                  <span>❌</span>
                  <span>Sold Out</span>
                </>
              ) : showRecentPurchase ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Recently Purchased</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Now</span>
                  <span className="text-xs opacity-80">
                    ₹{product.price.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      {/* Premium Glow Effect for Exclusive Items */}
      {isExclusive && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
      )}
    </div>
  );
};

export default ProductCard;
