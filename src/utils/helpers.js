// Utility functions for Hellcat Store

/**
 * Format currency in Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Get rank color based on rank name
 * @param {string} rank - The rank name
 * @returns {string} Tailwind CSS color class
 */
export const getRankColor = (rank) => {
  const rankColors = {
    Conqueror: 'text-red-500',
    Ace: 'text-purple-500',
    Crown: 'text-yellow-500',
    Diamond: 'text-blue-500',
    Platinum: 'text-green-500',
    Gold: 'text-yellow-400',
    Silver: 'text-gray-400',
    Bronze: 'text-orange-600',
  };
  return rankColors[rank] || 'text-gray-400';
};

/**
 * Get status color based on status
 * @param {string} status - The status
 * @returns {string} Tailwind CSS color class
 */
export const getStatusColor = (status) => {
  const statusColors = {
    Available: 'text-green-500',
    Sold: 'text-red-500',
    Reserved: 'text-yellow-500',
  };
  return statusColors[status] || 'text-gray-400';
};

/**
 * Get status badge variant
 * @param {string} status - The status
 * @returns {string} Badge variant class
 */
export const getStatusBadge = (status) => {
  const statusBadges = {
    Available: 'badge-success',
    Sold: 'badge-danger',
    Reserved: 'badge-warning',
  };
  return statusBadges[status] || 'badge-gray';
};

/**
 * Truncate text to specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate pagination info
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination info
 */
export const getPaginationInfo = (total, page = 1, limit = 12) => {
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    startIndex,
    endIndex,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Get mythic weapon rarity color
 * @param {string} weapon - Weapon name
 * @returns {string} Color class
 */
export const getMythicColor = (weapon) => {
  if (weapon.includes('Glacier')) return 'text-blue-400';
  if (weapon.includes('Red Action')) return 'text-red-400';
  if (weapon.includes('Golden Dragon')) return 'text-yellow-400';
  if (weapon.includes('Royal')) return 'text-purple-400';
  return 'text-gray-400';
};

/**
 * Sort products by various criteria
 * @param {Array} products - Array of products
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted products
 */
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rank': {
      const rankOrder = [
        'Conqueror',
        'Ace',
        'Crown',
        'Diamond',
        'Platinum',
        'Gold',
        'Silver',
        'Bronze',
      ];
      return sorted.sort(
        (a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)
      );
    }
    case 'mythics':
      return sorted.sort((a, b) => b.mythics.length - a.mythics.length);
    case 'level':
      return sorted.sort((a, b) => b.level - a.level);
    case 'kd':
      return sorted.sort((a, b) => b.kd - a.kd);
    case 'winRate':
      return sorted.sort((a, b) => b.winRate - a.winRate);
    default:
      return sorted;
  }
};

/**
 * Filter products based on criteria
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const filterProducts = (products, filters) => {
  return products.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm) ||
        product.rank.toLowerCase().includes(searchTerm) ||
        product.mythics.some((mythic) =>
          mythic.toLowerCase().includes(searchTerm)
        ) ||
        product.description.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;
    }

    // Rank filter
    if (filters.rank && filters.rank !== 'All') {
      if (product.rank !== filters.rank) return false;
    }

    // Login type filter
    if (filters.loginType && filters.loginType !== 'All') {
      if (product.loginType !== filters.loginType) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'All') {
      if (product.status !== filters.status) return false;
    }

    // Price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (product.price < min || product.price > max) return false;
    }

    // Mythic count filter
    if (filters.mythicCount) {
      const { min, max } = filters.mythicCount;
      if (product.mythics.length < min || product.mythics.length > max)
        return false;
    }

    return true;
  });
};

/**
 * Get device type based on screen width
 * @returns {string} Device type
 */
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Check if device is mobile
 * @returns {boolean} Is mobile device
 */
export const isMobile = () => {
  return getDeviceType() === 'mobile';
};

/**
 * Check if device is tablet
 * @returns {boolean} Is tablet device
 */
export const isTablet = () => {
  return getDeviceType() === 'tablet';
};

/**
 * Check if device is desktop
 * @returns {boolean} Is desktop device
 */
export const isDesktop = () => {
  return getDeviceType() === 'desktop';
};

export default {
  formatCurrency,
  formatNumber,
  getRankColor,
  getStatusColor,
  getStatusBadge,
  truncateText,
  generateId,
  debounce,
  getPaginationInfo,
  isValidEmail,
  isValidPhone,
  getMythicColor,
  sortProducts,
  filterProducts,
  getDeviceType,
  isMobile,
  isTablet,
  isDesktop,
};
