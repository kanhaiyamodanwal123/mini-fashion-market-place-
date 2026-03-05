import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [dealEndTime, setDealEndTime] = useState(null);

  // Category icons with emoji - similar to Flipkart style
  const categories = [
    { value: '', label: 'All', icon: '🏠', iconBg: 'bg-blue-100' },
    { value: 'clothing', label: 'Fashion', icon: '👕', iconBg: 'bg-pink-100' },
    { value: 'shoes', label: 'Shoes', icon: '👟', iconBg: 'bg-orange-100' },
    { value: 'bags', label: 'Bags', icon: '👜', iconBg: 'bg-yellow-100' },
    { value: 'watches', label: 'Watches', icon: '⌚', iconBg: 'bg-purple-100' },
    { value: 'jewelry', label: 'Jewelry', icon: '💎', iconBg: 'bg-cyan-100' },
    { value: 'accessories', label: 'Accessories', icon: '👓', iconBg: 'bg-green-100' },
    { value: 'other', label: 'More', icon: '➕', iconBg: 'bg-gray-100' },
  ];

  // Quick stats data
  const quickStats = [
    { icon: '🚚', title: 'Free Shipping', desc: 'On orders above $50' },
    { icon: '🔄', title: 'Easy Returns', desc: '30-day return policy' },
    { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: '💬', title: '24/7 Support', desc: 'Round-the-clock assistance' },
  ];

  // Featured categories for visual section
  const featuredCategories = [
    { name: 'Clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop', count: '500+ Products' },
    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', count: '300+ Products' },
    { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop', count: '200+ Products' },
    { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', count: '150+ Products' },
  ];

  useEffect(() => {
    fetchProducts();
    // Set deal end time to 24 hours from now
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    setDealEndTime(endTime);
  }, [search, category, page]);

  useEffect(() => {
    if (!dealEndTime) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = dealEndTime - now;
      if (diff <= 0) {
        // Reset for next day
        const newEnd = new Date();
        newEnd.setHours(newEnd.getHours() + 24);
        setDealEndTime(newEnd);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dealEndTime]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('page', page);
      params.append('limit', 12);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleCategoryClick = (catValue) => {
    // Use React state to filter without page refresh - same as featured categories
    setCategory(catValue);
    setPage(1);
    // Scroll to products section smoothly
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format countdown timer
  const formatTimeLeft = () => {
    if (!dealEndTime) return { hours: '00', minutes: '00', seconds: '00' };
    const now = new Date();
    const diff = dealEndTime - now;
    if (diff <= 0) return { hours: '00', minutes: '00', seconds: '00' };
    
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const [timeLeft, setTimeLeft] = useState(formatTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [dealEndTime]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Banner */}
      <section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-block bg-white text-yellow-600 px-4 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">
                🔥 MEGA SALE - Up to 70% OFF
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
                Fashion <span className="text-yellow-600">Festival</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-800 max-w-xl mb-6">
                Discover the latest trends from top brands. Your destination for curated fashion at unbeatable prices.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => handleCategoryClick('')}
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Shop Now
                </button>
                <button 
                  onClick={() => handleCategoryClick('')}
                  className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-8xl">🛍️</span>
                </div>
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-bounce">
                  HOT DEAL! 🔥
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons - Below Hero Banner (Flipkart Style) */}
      <div className="bg-white shadow-md border-b -mt-2 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`flex flex-col items-center justify-center min-w-[70px] p-2 px-3 rounded-lg transition-all duration-200 hover:shadow-md ${
                  category === cat.value 
                    ? 'bg-accent text-white shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-2xl mb-1 ${category === cat.value ? '' : cat.iconBg} p-1.5 rounded-full`}>
                  {cat.icon}
                </span>
                <span className={`text-xs font-medium whitespace-nowrap ${category === cat.value ? 'text-white' : 'text-gray-700'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filters - Professional Style */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 md:p-3 mb-8 -mt-10 relative z-20">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            {/* Search Input - Professional Style */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                className="w-full pl-14 pr-4 py-3.5 text-gray-700 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all shadow-inner text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* Voice Search Icon */}
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-amber-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>

            {/* Category Select - Styled */}
            <div className="relative min-w-[180px]">
              <select
                className="w-full px-4 py-3.5 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer text-gray-700"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label === 'All' ? 'All Categories' : cat.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Button - Prominent */}
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
          
          {/* Quick Links in Search Bar */}
          
        </div>

        {/* Featured Categories Section */}
        {!search && !category && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Featured Categories</h2>
              <Link to="#" className="text-accent font-medium hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredCategories.map((cat, index) => (
                <Link 
                  key={index}
                  to="#"
                  onClick={() => handleCategoryClick(cat.name.toLowerCase())}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                    <p className="text-gray-200 text-sm">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Deals of the Day Section */}
        {!search && !category && products.length > 0 && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 md:p-6 text-white mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    ⚡ Deals of the Day
                  </h2>
                  <p className="text-red-100 mt-1">Limited time offers - Grab them before they're gone!</p>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-mono text-xl font-bold">
                    {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Section Header */}
            <div id="products-section" className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {category 
                  ? `${categories.find(c => c.value === category)?.label || category} Products`
                  : search 
                    ? `Search Results for "${search}"`
                    : 'All Products'
                }
              </h2>
              <span className="text-gray-500 text-sm">
                {products.length} products found
              </span>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <button 
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                    setPage(1);
                    fetchProducts();
                  }}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-12">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum 
                        ? 'bg-primary text-white border-primary' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Why Choose Us Section */}
      {!search && !category && (
        <section className="bg-white py-12 border-t">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-serif font-bold text-gray-900 text-center mb-8">
              Why Choose MarketNest?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">We curate only the finest products from trusted brands worldwide.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Best Prices</h3>
                <p className="text-gray-600">Competitive pricing with regular discounts and deals.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Global Shipping</h3>
                <p className="text-gray-600">Fast and reliable shipping to over 100+ countries.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {!search && !category && (
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Get the latest updates on new products and upcoming sales. Don't miss out on exclusive deals!
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Footer Links Section */}
      {!search && !category && (
        <section className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="#" className="hover:text-accent">About Us</Link></li>
                  <li><Link to="#" className="hover:text-accent">Contact</Link></li>
                  <li><Link to="#" className="hover:text-accent">FAQs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="#" onClick={() => handleCategoryClick('clothing')} className="hover:text-accent">Clothing</Link></li>
                  <li><Link to="#" onClick={() => handleCategoryClick('shoes')} className="hover:text-accent">Shoes</Link></li>
                  <li><Link to="#" onClick={() => handleCategoryClick('bags')} className="hover:text-accent">Bags</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Customer Service</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="#" className="hover:text-accent">Shipping Policy</Link></li>
                  <li><Link to="#" className="hover:text-accent">Returns & Refunds</Link></li>
                  <li><Link to="#" className="hover:text-accent">Track Order</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Connect With Us</h4>
                <div className="flex justify-center md:justify-start gap-3">
                  <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">📘</a>
                  <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">📸</a>
                  <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">🐦</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
