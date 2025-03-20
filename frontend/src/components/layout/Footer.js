import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">HealthStore</h3>
            <p className="text-gray-300 text-sm">
              Your trusted source for health supplements, medical supplies, and general merchandise.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" className="text-gray-300 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white text-sm">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white text-sm">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white text-sm">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Health Supplements" className="text-gray-300 hover:text-white text-sm">
                  Health Supplements
                </Link>
              </li>
              <li>
                <Link to="/products?category=Medical Supplies" className="text-gray-300 hover:text-white text-sm">
                  Medical Supplies
                </Link>
              </li>
              <li>
                <Link to="/products?category=General Merchandise" className="text-gray-300 hover:text-white text-sm">
                  General Merchandise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <i className="fas fa-map-marker-alt w-5"></i>
                <span>123 Health Street, Medical City, MC 12345</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <i className="fas fa-phone w-5"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <i className="fas fa-envelope w-5"></i>
                <span>support@healthstore.com</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <i className="fas fa-clock w-5"></i>
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} HealthStore. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-gray-300 hover:text-white text-sm">
                Shipping Info
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <img src="/payment/visa.png" alt="Visa" className="h-8" />
              <img src="/payment/mastercard.png" alt="Mastercard" className="h-8" />
              <img src="/payment/paypal.png" alt="PayPal" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;