import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    salesByCategory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: 'fas fa-shopping-cart',
            color: 'bg-blue-500'
          },
          {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: 'fas fa-box',
            color: 'bg-green-500'
          },
          {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: 'fas fa-users',
            color: 'bg-purple-500'
          },
          {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: 'fas fa-dollar-sign',
            color: 'bg-yellow-500'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                <i className={`${stat.icon} text-xl`}></i>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary-600 hover:text-primary-500">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map(order => (
                  <div key={order._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order._id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                      <p className={`text-sm ${
                        order.status === 'Delivered' ? 'text-green-600' : 
                        order.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No recent orders</p>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Low Stock Products</h2>
              <Link to="/admin/products" className="text-primary-600 hover:text-primary-500">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map(product => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="ml-4">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">{product.stock} left</p>
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="text-sm text-primary-600 hover:text-primary-500"
                      >
                        Update Stock
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No low stock products</p>
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">Sales by Category</h2>
          </div>
          <div className="p-6">
            {stats.salesByCategory.length > 0 ? (
              <div className="space-y-4">
                {stats.salesByCategory.map(category => (
                  <div key={category.name} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-gray-600">${category.total.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-primary-600 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No sales data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;