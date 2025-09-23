import React, { useState } from 'react';
import { Settings, Heart, Package, Star, LogOut, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.showOrders ? 'orders' : 'profile'
  );

  const mockOrders = [
    {
      id: '1',
      date: '2024-01-15',
      total: 129.99,
      status: 'Delivered',
      items: ['Wireless Earbuds Pro'],
    },
    {
      id: '2',
      date: '2024-01-10',
      total: 299.99,
      status: 'Shipped',
      items: ['Smart Fitness Watch'],
    },
  ];

  const mockFavorites = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      price: 129.99,
      image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      price: 299.99,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Please sign in</h2>
          <button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Edit },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full overflow-hidden">
            <img
              src={user.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face`}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">@{user.username}</h1>
            <p className="text-white/80">{user.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{user.loyalty_points} points</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 bg-white/20 rounded-full"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                activeTab === id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 space-y-4">
              <h2 className="font-semibold text-gray-900">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user.username}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 space-y-4">
              <h2 className="font-semibold text-gray-900">Stats</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{user.loyalty_points}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <p key={index} className="text-sm text-gray-700">• {item}</p>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="font-semibold text-purple-600">${order.total}</span>
                  <button className="text-purple-600 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-2 gap-4">
            {mockFavorites.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-purple-600 font-semibold mt-1">${item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}