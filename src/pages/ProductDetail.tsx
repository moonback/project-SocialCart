import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    // Mock product data
    const mockProduct: Product = {
      id: id || '1',
      name: 'Wireless Earbuds Pro',
      description: 'Experience premium sound quality with our latest wireless earbuds. Features advanced noise cancellation, crystal clear audio, and up to 30 hours of battery life with the charging case.',
      price: 129.99,
      image_url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      images: [
        'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      variants: [
        { id: '1', name: 'Color', options: ['Black', 'White', 'Blue'] },
        { id: '2', name: 'Size', options: ['Regular', 'Large'] }
      ],
      likes_count: 1234,
      user_id: '1',
      user: {
        id: '1',
        email: 'user@example.com',
        username: 'techguru',
        loyalty_points: 500,
        created_at: '2024-01-01',
      },
      created_at: '2024-01-01',
    };

    const mockSuggestions: Product[] = [
      {
        id: '2',
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging',
        price: 49.99,
        image_url: 'https://images.pexels.com/photos/4790613/pexels-photo-4790613.jpeg?auto=compress&cs=tinysrgb&w=500',
        images: [],
        variants: [],
        likes_count: 567,
        user_id: '1',
        user: mockProduct.user,
        created_at: '2024-01-01',
      },
      {
        id: '3',
        name: 'Phone Case Premium',
        description: 'Protect your device',
        price: 29.99,
        image_url: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
        images: [],
        variants: [],
        likes_count: 892,
        user_id: '1',
        user: mockProduct.user,
        created_at: '2024-01-01',
      }
    ];

    setProduct(mockProduct);
    setSuggestions(mockSuggestions);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedVariants);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, selectedVariants);
      navigate('/cart');
    }
  };

  if (!product) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-24">
        {/* Image Gallery */}
        <div className="space-y-4 mb-6">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <span className="text-2xl font-bold text-purple-600">${product.price}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span>by @{product.user.username}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 (324 reviews)</span>
              </div>
            </div>
          </div>

          {/* Variants */}
          {product.variants.map((variant) => (
            <div key={variant.id} className="space-y-3">
              <h3 className="font-semibold text-gray-900">{variant.name}</h3>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedVariants[variant.name] === option
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">You might also like</h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
                <ProductCard key={suggestion.id} product={suggestion} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <div className="flex space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyNow}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold"
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}