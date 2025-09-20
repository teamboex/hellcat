import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  products: [],
  orders: [],
  recentPurchases: [],
  loading: {
    products: false,
    orders: false,
    payment: false,
    admin: false,
  },
  error: null,
  filters: {
    rank: 'All',
    loginType: 'All',
    status: 'All',
    priceRange: { label: 'All', min: 0, max: Infinity },
    mythicCount: { label: 'All', min: 0, max: Infinity },
  },
  searchQuery: '',
  sortBy: 'default',
  currentPage: 1,
  totalResults: 0,
  realTimeUpdates: true,
  analytics: {
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    topProducts: [],
    recentSales: [],
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_ORDERS: 'SET_ORDERS',
  SET_RECENT_PURCHASES: 'SET_RECENT_PURCHASES',
  UPDATE_PRODUCT_STATUS: 'UPDATE_PRODUCT_STATUS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_FILTERS: 'SET_FILTERS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_REAL_TIME_UPDATES: 'SET_REAL_TIME_UPDATES',
  UPDATE_ANALYTICS: 'UPDATE_ANALYTICS',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: {
          products: false,
          orders: false,
          payment: false,
        },
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ActionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        totalResults: action.payload.total,
        loading: {
          ...state.loading,
          products: false,
        },
      };

    case ActionTypes.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: {
          ...state.loading,
          orders: false,
        },
      };

    case ActionTypes.SET_RECENT_PURCHASES:
      return {
        ...state,
        recentPurchases: action.payload,
      };

    case ActionTypes.UPDATE_PRODUCT_STATUS:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.productId
            ? { ...product, status: action.payload.status }
            : product
        ),
      };

    case ActionTypes.ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products],
        totalResults: state.totalResults + 1,
      };

    case ActionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };

    case ActionTypes.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
        totalResults: Math.max(0, state.totalResults - 1),
      };

    case ActionTypes.SET_REAL_TIME_UPDATES:
      return {
        ...state,
        realTimeUpdates: action.payload,
      };

    case ActionTypes.UPDATE_ANALYTICS:
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload },
      };

    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: action.payload,
        currentPage: 1, // Reset to first page when filters change
      };

    case ActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        currentPage: 1, // Reset to first page when search changes
      };

    case ActionTypes.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
        currentPage: 1, // Reset to first page when sort changes
      };

    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case ActionTypes.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case ActionTypes.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = useMemo(() => ({
    // Set loading state
    setLoading: (key, value) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { key, value } });
    },

    // Set error
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },

    // Clear error
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },

    // Load products
    loadProducts: async (filters = {}) => {
      try {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'products', value: true },
        });
        dispatch({ type: ActionTypes.CLEAR_ERROR });

        const response = await api.getProducts({
          ...state.filters,
          ...filters,
          search: state.searchQuery,
          sortBy: state.sortBy === 'default' ? null : state.sortBy,
          page: state.currentPage,
          limit: 12,
        });

        dispatch({ type: ActionTypes.SET_PRODUCTS, payload: response });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        // Handle error silently
      }
    },

    // Load orders
    loadOrders: async () => {
      try {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'orders', value: true },
        });
        const orders = await api.getOrders();
        dispatch({ type: ActionTypes.SET_ORDERS, payload: orders });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        // Handle error silently
      }
    },

    // Load recent purchases
    loadRecentPurchases: async () => {
      try {
        const purchases = await api.getRecentPurchases();
        dispatch({
          type: ActionTypes.SET_RECENT_PURCHASES,
          payload: purchases,
        });
        return purchases;
      } catch (error) {
        // Handle error silently
        return [];
      }
    },

    // Update filters
    updateFilters: (newFilters) => {
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    },

    // Update search query
    updateSearchQuery: (query) => {
      dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query });
    },

    // Update sort by
    updateSortBy: (sortBy) => {
      dispatch({ type: ActionTypes.SET_SORT_BY, payload: sortBy });
    },

    // Update current page
    updateCurrentPage: (page) => {
      dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page });
    },

    // Create order
    createOrder: async (orderData) => {
      try {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'payment', value: true },
        });

        const order = await api.createOrder(orderData);
        dispatch({ type: ActionTypes.ADD_ORDER, payload: order });

        return order;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'payment', value: false },
        });
      }
    },

    // Process payment
    processPayment: async (orderId, paymentData) => {
      try {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'payment', value: true },
        });

        const result = await api.processPayment(orderId, paymentData);

        // Update product status to sold
        dispatch({
          type: ActionTypes.UPDATE_PRODUCT_STATUS,
          payload: {
            productId: paymentData.productId,
            status: 'Sold Out',
          },
        });

        // Reload recent purchases for social proof
        actions.loadRecentPurchases();

        return result;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'payment', value: false },
        });
      }
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
      try {
        const updatedOrder = await api.updateOrderStatus(orderId, status);
        dispatch({ type: ActionTypes.UPDATE_ORDER, payload: updatedOrder });
        return updatedOrder;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // Export orders
    exportOrders: async () => {
      try {
        return await api.exportOrders();
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // Product Management Actions
    addProduct: async (productData) => {
      try {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'admin', value: true },
        });

        const newProduct = await api.addProduct(productData);
        dispatch({ type: ActionTypes.ADD_PRODUCT, payload: newProduct });

        toast.success('Product added successfully');
        return newProduct;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error('Failed to add product');
        throw error;
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'admin', value: false },
        });
      }
    },

    updateProduct: async (productId, productData) => {
      try {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'admin', value: true },
        });

        const updatedProduct = await api.updateProduct(productId, productData);
        dispatch({ type: ActionTypes.UPDATE_PRODUCT, payload: updatedProduct });

        toast.success('Product updated successfully');
        return updatedProduct;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error('Failed to update product');
        throw error;
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'admin', value: false },
        });
      }
    },

    deleteProduct: async (productId) => {
      try {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'admin', value: true },
        });

        await api.deleteProduct(productId);
        dispatch({ type: ActionTypes.DELETE_PRODUCT, payload: productId });

        toast.success('Product deleted successfully');
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error('Failed to delete product');
        throw error;
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { key: 'admin', value: false },
        });
      }
    },

    // Analytics Actions
    loadAnalytics: async () => {
      try {
        const analytics = await api.getAnalytics();
        dispatch({ type: ActionTypes.UPDATE_ANALYTICS, payload: analytics });
        return analytics;
      } catch (error) {
        // Handle error silently
        return null;
      }
    },

    // Real-time Updates
    enableRealTimeUpdates: () => {
      dispatch({ type: ActionTypes.SET_REAL_TIME_UPDATES, payload: true });
    },

    disableRealTimeUpdates: () => {
      dispatch({ type: ActionTypes.SET_REAL_TIME_UPDATES, payload: false });
    },
  }), [dispatch]);

  // Load initial data
  useEffect(() => {
    actions.loadProducts();
    actions.loadRecentPurchases();
    actions.loadAnalytics();
  }, [actions, state.filters, state.searchQuery, state.sortBy, state.currentPage]);

  // Real-time updates simulation
  useEffect(() => {
    if (!state.realTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      actions.loadRecentPurchases();
      actions.loadAnalytics();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [actions, state.realTimeUpdates]);

  const value = {
    state,
    actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
