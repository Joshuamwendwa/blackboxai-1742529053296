import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/common/Alert';

function Cart() {
  const navigate = useNavigate();
  const { 
    items, 
    total, 
    updateQuantity, 
    removeItem, 
    clearCart,
    calculateShipping,
    calculateTax,
    calculateFinalTotal
  } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, parseInt(quantity));
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products" className="btn-primary">
            <i className="fas fa-shopping-bag mr-2"></i>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            {items.map(item => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow p-6 flex items-center space-x-4"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24">
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <Link
                    to={`/products/${item._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                  <div className="text-gray-600 mt-1">${item.price.toFixed(2)}</div>
                </div>

                {/* Quantity */}
                <div className="w-32">
                  <label htmlFor={`quantity-${item._id}`} className="sr-only">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`quantity-${item._id}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    min="1"
                    className="input"
                  />
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-800 text-sm mt-1"
                  >
                    <i className="fas fa-trash-alt mr-1"></i>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Actions */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="btn-outline text-red-600 hover:text-red-800"
            >
              <i className="fas fa-trash mr-2"></i>
              Clear Cart
            </button>
            <Link to="/products" className="btn-outline">
              <i className="fas fa-arrow-left mr-2"></i>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${calculateShipping().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-medium text-gray-900">
                  <span>Total</span>
                  <span>${calculateFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary w-full mt-6"
            >
              <i className="fas fa-lock mr-2"></i>
              Proceed to Checkout
            </button>

            {/* Payment Methods */}
            <div className="mt-6">
              <div className="text-sm text-gray-600 text-center mb-2">
                Secure Payment Methods
              </div>
              <div className="flex justify-center space-x-2">
                <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                <i className="fab fa-cc-amex text-2xl text-gray-400"></i>
                <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-green-50 rounded-lg p-4 mt-4">
            <div className="flex items-center text-green-800">
              <i className="fas fa-truck text-xl mr-2"></i>
              <span className="text-sm font-medium">Free shipping on orders over $100!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;