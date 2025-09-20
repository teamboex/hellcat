import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import Navigation from './Navigation';
import ProductManagement from './ProductManagement';
import Analytics from './Analytics';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Use orders from global state
  const orders = useMemo(() => state.orders || [], [state.orders]);
  const loading = state.loading.orders;

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      await actions.loadOrders();
    } catch (error) {
      toast.error('Failed to load orders');
    }
  }, [actions]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Filter orders
  useEffect(() => {
    if (!orders || orders.length === 0) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await actions.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Export orders
  const exportOrders = async () => {
    try {
      const csvData = await actions.exportOrders();

      // Convert to CSV format
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          headers.map((header) => `"${row[header]}"`).join(',')
        ),
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bgmi-orders-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Orders exported successfully');
    } catch (error) {
      toast.error('Failed to export orders');
    }
  };

  // View order details
  const viewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-900/20 border-slate-500/30';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate stats
  const stats = {
    total: orders?.length || 0,
    completed: orders?.filter((o) => o.status === 'completed').length || 0,
    pending: orders?.filter((o) => o.status === 'pending').length || 0,
    revenue:
      orders
        ?.filter((o) => o.status === 'completed')
        ?.reduce((sum, o) => sum + o.amount, 0) || 0,
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  if (loading && activeTab === 'orders') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 truncate">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-slate-400 truncate">
                  Manage your Hellcat store
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={loadOrders}
                className="px-3 py-2 sm:px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {activeTab === 'orders' && (
                <button
                  onClick={exportOrders}
                  className="px-3 py-2 sm:px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Content */}
        {activeTab === 'orders' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-slate-100">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      {stats.completed}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">
                      Revenue
                    </p>
                    <p className="text-2xl font-bold text-slate-100">
                      ₹{stats.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 mb-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
                  Showing {filteredOrders?.length || 0} of {orders?.length || 0}{' '}
                  orders
                </div>
              </div>
            </div>

            {/* Orders - Desktop Table View */}
            <div className="hidden md:block bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredOrders?.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-100">
                            {order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-200">
                            {order.product.title}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.product.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-200">
                            {order.buyer.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.buyer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-100">
                            ₹{order.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => viewOrder(order)}
                              className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                              title="View order"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {order.status === 'pending' && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.id, 'completed')
                                }
                                className="text-green-400 hover:text-green-300 transition-colors p-1"
                                title="Mark as completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {order.status === 'pending' && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.id, 'cancelled')
                                }
                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                                title="Cancel order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders - Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredOrders?.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-4"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-slate-100">
                      {order.id}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="mb-3">
                    <div className="text-sm font-medium text-slate-200 mb-1">
                      {order.product.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      Rank: {order.product.rank}
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="mb-3">
                    <div className="text-sm text-slate-200 mb-1">
                      {order.buyer.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {order.buyer.email}
                    </div>
                  </div>

                  {/* Amount and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-green-400">
                      ₹{order.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => viewOrder(order)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete</span>
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(!filteredOrders || filteredOrders.length === 0) && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-100 mb-2">
                  No orders found
                </h3>
                <p className="text-slate-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'analytics' && <Analytics />}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowOrderModal(false)}
            />
            <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-100">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">
                        Order ID
                      </label>
                      <p className="text-slate-100 font-mono">
                        {selectedOrder.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-400">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">
                          {selectedOrder.status}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      Product
                    </label>
                    <div className="mt-1 p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-100 font-medium">
                        {selectedOrder.product.title}
                      </p>
                      <p className="text-sm text-slate-400">
                        {selectedOrder.product.rank} •{' '}
                        {selectedOrder.product.loginType}
                      </p>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      Buyer Information
                    </label>
                    <div className="mt-1 p-3 bg-slate-700/50 rounded-lg space-y-2">
                      <p className="text-slate-100">
                        <strong>Name:</strong> {selectedOrder.buyer.name}
                      </p>
                      <p className="text-slate-100">
                        <strong>Email:</strong> {selectedOrder.buyer.email}
                      </p>
                      <p className="text-slate-100">
                        <strong>Phone:</strong> {selectedOrder.buyer.phone}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      Payment Information
                    </label>
                    <div className="mt-1 p-3 bg-slate-700/50 rounded-lg space-y-2">
                      <p className="text-slate-100">
                        <strong>Amount:</strong> ₹
                        {selectedOrder.amount.toLocaleString()}
                      </p>
                      {selectedOrder.paymentId && (
                        <p className="text-slate-100">
                          <strong>Payment ID:</strong> {selectedOrder.paymentId}
                        </p>
                      )}
                      <p className="text-slate-100">
                        <strong>Order Date:</strong>{' '}
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                      {selectedOrder.deliveredAt && (
                        <p className="text-slate-100">
                          <strong>Delivered:</strong>{' '}
                          {new Date(selectedOrder.deliveredAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Credentials */}
                  {selectedOrder.credentials && (
                    <div>
                      <label className="text-sm font-medium text-slate-400">
                        Account Credentials
                      </label>
                      <div className="mt-1 p-3 bg-green-900/20 border border-green-500/30 rounded-lg space-y-2">
                        <p className="text-slate-100">
                          <strong>Account ID:</strong>{' '}
                          {selectedOrder.credentials.id}
                        </p>
                        <p className="text-slate-100">
                          <strong>Password:</strong>{' '}
                          {selectedOrder.credentials.password}
                        </p>
                        <p className="text-slate-100">
                          <strong>Login Type:</strong>{' '}
                          {selectedOrder.credentials.loginType}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
