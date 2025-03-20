import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    search: searchParams.get('search') || ''
  });

  const categories = [
    'All Categories',
    'Health Supplements',
    'Medical Supplies',
    'General Merchandise'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let queryString = '?';
      
      if (filters.category && filters.category !== 'All Categories') {
        queryString += `category=${encodeURIComponent(filters.category)}&`;
      }
      if (filters.minPrice) {
        queryString += `price[gte]=${filters.minPrice}&`;
      }
      if (filters.maxPrice) {
        queryString += `price[lte]=${filters.maxPrice}&`;
      }
      if (filters.search) {
        queryString += `search=${encodeURIComponent(filters.search)}&`;
      }

      // Handle sorting
      switch (filters.sort) {
        case 'newest':
          queryString += 'sort=-createdAt';
          break;
        case 'oldest':
          queryString += 'sort=createdAt';
          break;
        case 'price_asc':
          queryString += 'sort=price';
          break;
        case 'price_desc':
          queryString += 'sort=-price';
          break;
        case 'name_asc':
          queryString += 'sort=name';
          break;
        case 'name_desc':
          queryString += 'sort=-name';
          break;
        default:
          break;
      }

      const response = await axios.get(`/api/products${queryString}`);
      setProducts(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update URL search params
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      search: ''
    });
    setSearchParams({});
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="input"
                />
                <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Categories' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="input"
                  min="0"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="input"
                  min="0"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="btn-outline w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 mt-6 lg:mt-0">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <p className="text-gray-600 mb-4 sm:mb-0">
              Showing {products.length} results
            </p>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="input w-full sm:w-auto"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <Alert type="error" message={error} />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;