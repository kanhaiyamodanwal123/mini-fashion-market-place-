import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isBrand, isCustomer } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
          {error || 'Product not found'}
        </div>
        <Link to="/" className="mt-4 inline-block text-accent hover:text-accent-hover">
          &larr; Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-accent mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="p-6 lg:p-8 bg-gray-50">
              <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-accent' : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="text-3xl font-bold text-accent mb-6">
                ₹{product.price.toFixed(2)}
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Sold by</p>
                <p className="font-semibold text-gray-900">{product.brand?.name}</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Action Button */}
              <div className="space-y-4">
                {isAuthenticated && isCustomer ? (
                  <>
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-gray-700 font-medium">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 hover:bg-gray-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/checkout', { state: { product, quantity } })}
                      className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
                    >
                      Buy Now - ₹{product.price * quantity}
                    </button>
                  </>
                ) : isBrand ? (
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">Switch to a customer account to purchase products</p>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="block w-full px-6 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors shadow-lg text-center"
                  >
                    Login to Buy
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

