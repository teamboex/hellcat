import React, { useEffect, useState } from 'react';
import {
  X,
  ShoppingCart,
  Star,
  Shield,
  Zap,
  Trophy,
  Target,
  Users,
  Car,
  Heart,
  Crown,
  Flame,
} from 'lucide-react';

const ProductDetailsModal = ({ isOpen, onClose, product, onBuyNow }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

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

  const isSoldOut =
    product?.status === 'Sold' || product?.status === 'Sold Out';
  const isHot = product?.isHot || product?.mythics?.length >= 6;
  const isLimited = product?.isLimited || product?.price > 2500;
  const isExclusive =
    product?.isExclusive ||
    (product?.rank === 'Conqueror' && product?.mythics?.length >= 5);

  if (!isOpen || !product) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 modal-mobile ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl transition-all duration-300 transform modal-content-mobile ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50 modal-header-mobile">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Title and Badges */}
          <div className="pr-12">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {isHot && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse">
                  <Flame className="w-3 h-3 mr-1" />
                  HOT
                </span>
              )}
              {isLimited && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  LIMITED
                </span>
              )}
              {isExclusive && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg">
                  <Crown className="w-3 h-3 mr-1" />
                  EXCLUSIVE
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              {product.title}
            </h2>

            {/* Price and Level */}
            <div className="flex items-center justify-between">
              <div className="relative">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-500">
                  ₹{product.price.toLocaleString()}
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-500/20 rounded-lg blur-sm -z-10"></div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-slate-300">
                  Level {product.level}
                </div>
                <div className="text-sm text-slate-400">
                  RP: {product.rp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] modal-body-mobile">
          <div className="p-6 space-y-6">
            {/* Rank and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-slate-300">
                    Rank
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border shadow-lg backdrop-blur-sm ${getRankColor(
                    product.rank
                  )}`}
                >
                  {product.rank}
                </span>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-slate-300">
                    Status
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border shadow-lg backdrop-blur-sm ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            {/* Game Stats */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>Game Statistics</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {product.kd}
                  </div>
                  <div className="text-sm text-slate-400">K/D Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {product.winRate}%
                  </div>
                  <div className="text-sm text-slate-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {product.matches}
                  </div>
                  <div className="text-sm text-slate-400">Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {product.rp.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">RP</div>
                </div>
              </div>
            </div>

            {/* Mythic Weapons */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span>Mythic Weapons ({product.mythics.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.mythics.map((mythic, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-700/30"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⚔️</span>
                    </div>
                    <span className="text-slate-200 font-medium">{mythic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicles and Pets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vehicles */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                  <Car className="w-5 h-5 text-blue-400" />
                  <span>Vehicles ({product.vehicles.length})</span>
                </h3>
                <div className="space-y-2">
                  {product.vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg"
                    >
                      <span className="text-blue-400 text-lg">🚗</span>
                      <span className="text-slate-200 font-medium">
                        {vehicle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pets */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span>Pets ({product.pets.length})</span>
                </h3>
                <div className="space-y-2">
                  {product.pets.map((pet, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg"
                    >
                      <span className="text-pink-400 text-lg">🐾</span>
                      <span className="text-slate-200 font-medium">{pet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Login Type */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-400" />
                <span>Account Details</span>
              </h3>
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <span className="text-2xl">
                  {getLoginTypeIcon(product.loginType)}
                </span>
                <div>
                  <div className="text-slate-200 font-semibold">Login Type</div>
                  <div className="text-slate-400">{product.loginType}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Buy Button */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/30 modal-footer-mobile">
          <button
            onClick={() => onBuyNow(product)}
            disabled={isSoldOut}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              isSoldOut
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              {isSoldOut ? (
                <>
                  <span className="text-xl">❌</span>
                  <span>Sold Out</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>Buy Now - ₹{product.price.toLocaleString()}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
