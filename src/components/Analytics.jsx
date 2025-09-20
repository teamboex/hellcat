import React, { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Analytics = () => {
  const { state, actions } = useApp();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      await actions.loadAnalytics();
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  }, [actions]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics, timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
  };


  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
    changeType,
  }) => (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {change && (
            <div
              className={`flex items-center mt-1 text-sm ${
                changeType === 'positive'
                  ? 'text-green-400'
                  : changeType === 'negative'
                  ? 'text-red-400'
                  : 'text-slate-400'
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  changeType === 'negative' ? 'rotate-180' : ''
                }`}
              />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            color === 'text-green-400'
              ? 'bg-green-600/20'
              : color === 'text-blue-400'
              ? 'bg-blue-600/20'
              : color === 'text-purple-400'
              ? 'bg-purple-600/20'
              : color === 'text-yellow-400'
              ? 'bg-yellow-600/20'
              : 'bg-slate-600/20'
          }`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = '' }) => (
    <div
      className={`bg-slate-800 rounded-xl p-6 border border-slate-700 ${className}`}
    >
      <h3 className="text-lg font-semibold text-slate-100 mb-4">{title}</h3>
      {children}
    </div>
  );

  const SimpleBarChart = ({ data, color = 'blue' }) => {
    const maxValue = Math.max(...data.map((item) => item.value));

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 truncate">{item.label}</span>
              <span className="text-slate-400">{item.value}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${
                  color === 'blue'
                    ? 'from-blue-500 to-blue-600'
                    : color === 'green'
                    ? 'from-green-500 to-green-600'
                    : color === 'purple'
                    ? 'from-purple-500 to-purple-600'
                    : 'from-yellow-500 to-yellow-600'
                }`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RecentSalesTable = () => (
    <div className="space-y-3">
      {state.analytics.recentSales?.slice(0, 5).map((sale, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">
                {sale.product}
              </p>
              <p className="text-xs text-slate-400">{formatDate(sale.date)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-400">
              {formatCurrency(sale.amount)}
            </p>
          </div>
        </div>
      ))}
      {(!state.analytics.recentSales ||
        state.analytics.recentSales.length === 0) && (
        <div className="text-center py-8 text-slate-400">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <p>No recent sales</p>
        </div>
      )}
    </div>
  );

  const TopProductsChart = () => {
    const topProducts = state.analytics.topProducts || [];

    if (topProducts.length === 0) {
      return (
        <div className="text-center py-8 text-slate-400">
          <Star className="w-8 h-8 mx-auto mb-2" />
          <p>No product data available</p>
        </div>
      );
    }

    const chartData = topProducts.map((product) => ({
      label: product.product.title,
      value: product.revenue,
    }));

    return <SimpleBarChart data={chartData} color="purple" />;
  };

  const RevenueChart = () => {
    // Mock data for revenue over time
    const revenueData = [
      { label: 'Mon', value: 15000 },
      { label: 'Tue', value: 22000 },
      { label: 'Wed', value: 18000 },
      { label: 'Thu', value: 25000 },
      { label: 'Fri', value: 30000 },
      { label: 'Sat', value: 28000 },
      { label: 'Sun', value: 20000 },
    ];

    return <SimpleBarChart data={revenueData} color="green" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Analytics Dashboard
          </h2>
          <p className="text-slate-400">
            Track your sales performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={loadAnalytics}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(state.analytics.totalRevenue || 0)}
          icon={DollarSign}
          color="text-green-400"
          change="+12.5%"
          changeType="positive"
        />
        <StatCard
          title="Total Orders"
          value={state.analytics.totalOrders || 0}
          icon={ShoppingCart}
          color="text-blue-400"
          change="+8.2%"
          changeType="positive"
        />
        <StatCard
          title="Completed Orders"
          value={state.analytics.completedOrders || 0}
          icon={Users}
          color="text-purple-400"
          change="+15.3%"
          changeType="positive"
        />
        <StatCard
          title="Pending Orders"
          value={state.analytics.pendingOrders || 0}
          icon={Calendar}
          color="text-yellow-400"
          change="-5.1%"
          changeType="negative"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend">
          <RevenueChart />
        </ChartCard>

        <ChartCard title="Top Products by Revenue">
          <TopProductsChart />
        </ChartCard>
      </div>

      {/* Recent Sales and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Recent Sales" className="lg:col-span-2">
          <RecentSalesTable />
        </ChartCard>

        <ChartCard title="Quick Stats">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Conversion Rate</span>
              </div>
              <span className="text-sm font-semibold text-slate-100">
                68.5%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Avg Order Value</span>
              </div>
              <span className="text-sm font-semibold text-slate-100">
                {formatCurrency(1850)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-slate-300">
                  Best Selling Rank
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-100">
                Conqueror
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Peak Sales Time</span>
              </div>
              <span className="text-sm font-semibold text-slate-100">
                8-10 PM
              </span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Performance Metrics */}
      <ChartCard title="Performance Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">94.2%</div>
            <div className="text-sm text-slate-400">Uptime</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">2.3s</div>
            <div className="text-sm text-slate-400">Avg Response Time</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">1,247</div>
            <div className="text-sm text-slate-400">Active Users</div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default Analytics;
