import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products?featured=true&limit=8');
      setFeaturedProducts(response.data.data);
    } catch (err) {
      setError('Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 1,
      name: 'Health Supplements',
      description: 'Vitamins, minerals, and supplements for your daily health needs',
      image: '/images/categories/supplements.jpg',
      icon: 'fas fa-pills'
    },
    {
      id: 2,
      name: 'Medical Supplies',
      description: 'Essential medical equipment and supplies for home care',
      image: '/images/categories/medical-supplies.jpg',
      icon: 'fas fa-first-aid'
    },
    {
      id: 3,
      name: 'General Merchandise',
      description: 'Everyday health and wellness products',
      image: '/images/categories/general.jpg',
      icon: 'fas fa-shopping-basket'
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-primary-600">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Your Health & Wellness Destination
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-primary-100">
              Quality health supplements, medical supplies, and wellness products delivered to your doorstep.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link to="/products" className="btn bg-white text-primary-600 hover:bg-primary-50">
                Shop Now
              </Link>
              <Link to="/about" className="btn bg-primary-500 text-white hover:bg-primary-400">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <div className="h-48 bg-gray-200">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <div className="flex items-center mb-2">
                        <i className={`${category.icon} text-2xl`}></i>
                        <h3 className="text-xl font-bold ml-2">{category.name}</h3>
                      </div>
                      <p className="text-sm text-gray-200">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-500 font-medium flex items-center"
            >
              View All
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>

          {error ? (
            <Alert type="error" message={error} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: 'fas fa-truck',
                title: 'Fast Delivery',
                description: 'Free shipping on orders over $100'
              },
              {
                icon: 'fas fa-check-circle',
                title: 'Quality Assured',
                description: 'All products are quality tested'
              },
              {
                icon: 'fas fa-headset',
                title: '24/7 Support',
                description: 'Round the clock customer service'
              },
              {
                icon: 'fas fa-shield-alt',
                title: 'Secure Payment',
                description: 'Multiple secure payment options'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <i className={`${benefit.icon} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Subscribe to our newsletter for exclusive offers and health tips.
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-l-md border-0 px-4 py-2"
                />
                <button
                  type="submit"
                  className="bg-primary-800 text-white px-6 py-2 rounded-r-md hover:bg-primary-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;