import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { isAuthenticated, isBrand } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isBrand) {
      alert('Please login as a customer to purchase products');
      return;
    }
    navigate(`/product/${product._id}`);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Discount Badge */}
        {product.price > 50 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -20%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="inline-block text-xs font-semibold text-accent uppercase tracking-wider mb-2">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.price > 50 && (
            <span className="text-sm text-gray-400 line-through">
              ${(product.price * 1.25).toFixed(2)}
            </span>
          )}
        </div>

        {/* Brand */}
        <p className="text-sm text-gray-500 truncate mb-3">
          by {product.brand?.name || 'Unknown Brand'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleViewDetails}
            className="flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 px-3 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            {isAuthenticated && !isBrand ? 'Buy Now' : 'Login to Buy'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

