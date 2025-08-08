import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  LogOut, 
  Search, 
  Grid, 
  List,
  Star,
  Heart,
  Zap,
  Smartphone,
  Headphones,
  Monitor,
  Tablet,
  Tv,
  Laptop,
  User,
  Menu,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import { useNavigate } from 'react-router';
import {
  collection,
  getDocs,
  where,
  query,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';

const PAGE_LIMIT = 8; // Products per page

export default function Homepage() {
  // State management
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Pagination state
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const categories = [
    { id: '', name: 'All Products', icon: Grid },
    { id: 'smartphone', name: 'Smartphones', icon: Smartphone },
    { id: 'laptop', name: 'Laptops', icon: Laptop },
    { id: 'tablet', name: 'Tablets', icon: Tablet },
    { id: 'audio', name: 'Audio', icon: Headphones },
    { id: 'tv', name: 'TVs & Monitors', icon: Tv },
    { id: 'wearable', name: 'Wearables', icon: Monitor }
  ];

  // Pagination functions
  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage((prevState) => prevState - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPage) {
      setCurrentPage((prevState) => prevState + 1);
    }
  }

  // Logout function
  async function handleLogout() {
    try {
      await signOut(auth);
      navigate('/auth/login');
    } catch (error) {
      console.log(error);
    }
  }

  // Clear filters function
  function clearFilter() {
    setFilter('');
    setSort('');
    setSearchTerm('');
  }

  // Fetch filtered and paginated data
  useEffect(() => {
    async function fetchFilteredData() {
      try {
        setIsLoading(true);
        setError('');
        
        let q = query(collection(db, 'products'));

        // Apply category filter
        if (filter) {
          q = query(q, where('category', '==', filter));
        }

        // Apply search filter (this would need to be implemented differently in production)
        // For now, we'll filter after fetching due to Firestore limitations with text search
        
        // Apply sorting
        if (sort === 'price-asc') {
          q = query(q, orderBy('price', 'asc'));
        } else if (sort === 'price-desc') {
          q = query(q, orderBy('price', 'desc'));
        } else {
          q = query(q, orderBy('name', 'asc'));
        }

        // Get total count for pagination
        const totalItems = (await getDocs(q)).size;
        const currentTotalPage = Math.ceil(totalItems / PAGE_LIMIT);
        setTotalPage(currentTotalPage);
        
        if (currentPage > currentTotalPage && currentTotalPage > 0) {
          setCurrentPage(1);
          return;
        }

        // Apply pagination
        q = query(q, limit(PAGE_LIMIT));

        if (currentPage > 1) {
          const offsetQuery = query(q, limit((currentPage - 1) * PAGE_LIMIT));
          const documentSnapshots = await getDocs(offsetQuery);
          const lastVisible = documentSnapshots.docs.at(-1);
          
          if (lastVisible) {
            q = query(q, limit(PAGE_LIMIT), startAfter(lastVisible));
          }
        }

        const querySnapshot = await getDocs(q);
        let result = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // Apply search filter to results (client-side filtering)
        if (searchTerm) {
          result = result.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setFilteredProducts(result);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFilteredData();
  }, [filter, sort, currentPage]);

  // Handle search (with debounce effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Navigation Bar */}
      <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl mr-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Sumsang Tech
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Categories</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Deals</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="hidden md:flex items-center space-x-2 text-gray-300">
                <User className="w-5 h-5" />
                <span className="text-sm">Welcome, Customer</span>
              </div>

              {/* Cart */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4">
              <div className="space-y-2">
                <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white">Home</a>
                <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white">Categories</a>
                <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white">Deals</a>
                <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white">Support</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Samsung Galaxy
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Innovation
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the latest Samsung technology. From smartphones to smart TVs, experience innovation at its finest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
                Shop Galaxy S24
              </button>
              <button className="border border-white/20 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-2xl transition-all duration-300">
                View All Products
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:50px_50px] opacity-30"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Samsung products..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Categories</option>
                <option value="smartphone">Smartphones</option>
                <option value="laptop">Laptops</option>
                <option value="tablet">Tablets</option>
                <option value="audio">Audio</option>
                <option value="tv">TVs</option>
                <option value="wearable">Wearables</option>
              </select>

              {/* Sort Filter */}
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Sort by Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* Clear Filter Button */}
              <button
                onClick={clearFilter}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Clear Filters
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  filter === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 max-w-md mx-auto">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:scale-105 ${
                  viewMode === 'list' ? 'flex gap-6 items-center' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden rounded-xl ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-square mb-4'}`}>
                  <img
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-black/50 rounded-full backdrop-blur-sm text-white hover:text-red-400 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  {product.stock <= 5 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Only {product.stock} left
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-white">
                      Rp. {product.price?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">
                      Stock: {product.stock}
                    </span>
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        product.stock === 0
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-blue-500/25'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilter}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPage > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Page</span>
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg font-semibold">
                {currentPage}
              </span>
              <span className="text-gray-300">of {totalPage}</span>
            </div>

            <button
              disabled={currentPage === totalPage}
              onClick={handleNextPage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentPage === totalPage
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Store Info Section */}
        <div className="mt-16 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Why Choose Sumsang Tech?
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Your trusted Samsung partner for the latest technology and innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Fast Delivery</h4>
              <p className="text-gray-400">Free shipping on orders over $500 with same-day delivery available</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Expert Support</h4>
              <p className="text-gray-400">24/7 customer service with Samsung certified technicians</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibant text-white mb-2">Quality Guarantee</h4>
              <p className="text-gray-400">All products come with manufacturer warranty and quality assurance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}