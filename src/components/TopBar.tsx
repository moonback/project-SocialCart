import React from 'react';
import { Search, ShoppingCart, Bell } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SocialCart
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/search')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          
          <button 
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {itemCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}