import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen-75 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn-primary">
            <i className="fas fa-home mr-2"></i>
            Go Home
          </Link>
          <Link to="/products" className="btn-outline">
            <i className="fas fa-shopping-bag mr-2"></i>
            Browse Products
          </Link>
        </div>

        {/* Illustration */}
        <div className="mt-12 flex justify-center">
          <div className="relative">
            <div className="text-9xl text-gray-200">
              <i className="fas fa-ghost"></i>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="text-2xl">
                <span className="text-gray-400">¯\_(ツ)_/¯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-16">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Need Help?
          </h2>
          <div className="flex justify-center space-x-8">
            <a
              href="/contact"
              className="text-primary-600 hover:text-primary-500 flex items-center"
            >
              <i className="fas fa-envelope mr-2"></i>
              Contact Support
            </a>
            <a
              href="/faq"
              className="text-primary-600 hover:text-primary-500 flex items-center"
            >
              <i className="fas fa-question-circle mr-2"></i>
              FAQ
            </a>
            <a
              href="/sitemap"
              className="text-primary-600 hover:text-primary-500 flex items-center"
            >
              <i className="fas fa-sitemap mr-2"></i>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;