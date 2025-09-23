import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Heart, ShoppingCart, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export function LiveShopping() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', user: 'user1', message: 'This looks amazing! 🔥', timestamp: Date.now() - 60000 },
    { id: '2', user: 'user2', message: 'How much is it?', timestamp: Date.now() - 45000 },
    { id: '3', user: 'host', message: 'Only $129.99 today!', timestamp: Date.now() - 30000 },
    { id: '4', user: 'user3', message: 'Just ordered one! ❤️', timestamp: Date.now() - 15000 },
  ]);
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(234);

  const featuredProduct = {
    id: '1',
    name: 'Wireless Earbuds Pro',
    price: 129.99,
    originalPrice: 199.99,
    description: 'Premium sound quality with noise cancellation',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=500',
  };

  useEffect(() => {
    // Simulate live messages
    const interval = setInterval(() => {
      const randomMessages = [
        'Love this product!',
        'Great quality 👍',
        'When will you restock?',
        'Amazing deal!',
        'Just added to cart 🛒',
      ];
      
      const newMessage = {
        id: Date.now().toString(),
        user: `user${Math.floor(Math.random() * 100)}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev.slice(-20), newMessage]);
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: 'you',
        message: message,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleBuyNow = () => {
    addToCart({
      id: featuredProduct.id,
      name: featuredProduct.name,
      description: featuredProduct.description,
      price: featuredProduct.price,
      image_url: featuredProduct.image,
      images: [featuredProduct.image],
      variants: [],
      likes_count: 1234,
      user_id: '1',
      user: {
        id: '1',
        email: 'host@example.com',
        username: 'livehost',
        loyalty_points: 1000,
        created_at: '2024-01-01',
      },
      created_at: '2024-01-01',
    });
    navigate('/cart');
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-black/50 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-red-500 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">LIVE</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm">{viewerCount}</span>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Simulated video background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold">Live Shopping Demo</h2>
            <p className="text-white/80">Experience the future of shopping</p>
          </div>
        </div>

        {/* Product Overlay */}
        <div className="absolute bottom-32 left-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex space-x-4">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{featuredProduct.name}</h3>
                <p className="text-gray-600 text-sm">{featuredProduct.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-purple-600">
                    ${featuredProduct.price}
                  </span>
                  <span className="text-gray-500 line-through">
                    ${featuredProduct.originalPrice}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                    35% OFF
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Buy Now - Limited Time!</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Chat */}
      <div className="bg-black/80 backdrop-blur-sm text-white p-4 space-y-4">
        <div className="h-24 overflow-y-auto space-y-2 scrollbar-hide">
          {messages.slice(-4).map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className={`font-semibold ${
                msg.user === 'host' ? 'text-purple-400' : 
                msg.user === 'you' ? 'text-blue-400' : 'text-gray-300'
              }`}>
                {msg.user}:{' '}
              </span>
              <span className="text-white">{msg.message}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <div className="flex-1 flex space-x-2 bg-white/10 rounded-full px-4 py-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Say something..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            />
            <button
              onClick={sendMessage}
              className="text-purple-400 hover:text-purple-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <button className="p-2 bg-red-500/20 rounded-full">
            <Heart className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}