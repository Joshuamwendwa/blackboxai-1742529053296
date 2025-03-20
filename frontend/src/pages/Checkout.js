import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';

function Checkout() {
  const navigate = useNavigate();
  const { items, total, calculateShipping, calculateTax, calculateFinalTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    shippingAddress: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    },
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const { shippingAddress, cardNumber, cardExpiry, cardCVC } = formData;
    
    if (!shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode || 
        !shippingAddress.country) {
      setError('Please fill in all shipping address fields');
      return false;
    }

    if (formData.paymentMethod === 'Credit Card') {
      if (!cardNumber || !cardExpiry || !cardCVC) {
        setError('Please fill in all payment details');
        return false;
      }
      
      // Basic card validation
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        setError('Invalid card number');
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setError('Invalid expiry date (MM/YY)');
        return false;
      }
      
      if (!/^\d{3,4}$/.test(cardCVC)) {
        setError('Invalid CVC');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create order
      const orderData = {
        products: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod
      };

      const response = await axios.post('/api/orders', orderData);

      // Clear cart after successful order
      clearCart();

      // Redirect to order confirmation
      navigate(`/orders/${response.data.data._id}`, {
        state: { success: true }
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {error && (
        <Alert 
          type="error" 
          message={error}
          onClose={() => setError('')}
        />
      )}

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Street Address"
                  name="shippingAddress.street"
                  value={formData.shippingAddress.street}
                  onChange={handleChange}
                  required
                  icon="fas fa-map-marker-alt"
                />
                <FormInput
                  label="City"
                  name="shippingAddress.city"
                  value={formData.shippingAddress.city}
                  onChange={handleChange}
                  required
                  icon="fas fa-city"
                />
                <FormInput
                  label="State"
                  name="shippingAddress.state"
                  value={formData.shippingAddress.state}
                  onChange={handleChange}
                  required
                  icon="fas fa-map"
                />
                <FormInput
                  label="ZIP Code"
                  name="shippingAddress.zipCode"
                  value={formData.shippingAddress.zipCode}
                  onChange={handleChange}
                  required
                  icon="fas fa-mail-bulk"
                />
                <FormInput
                  label="Country"
                  name="shippingAddress.country"
                  value={formData.shippingAddress.country}
                  onChange={handleChange}
                  required
                  icon="fas fa-globe"
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Shipping Method
              </h2>
              <div className="space-y-4">
                {[
                  { id: 'Standard', label: 'Standard Shipping (3-5 business days)', price: 10 },
                  { id: 'Express', label: 'Express Shipping (2-3 business days)', price: 15 },
                  { id: 'Next Day', label: 'Next Day Delivery', price: 25 }
                ].map(method => (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.id}
                      checked={formData.shippingMethod === method.id}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {method.label}
                      </span>
                      <span className="block text-sm text-gray-500">
                        ${method.price.toFixed(2)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Payment Method
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  {['Credit Card', 'PayPal'].map(method => (
                    <label
                      key={method}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {method}
                      </span>
                    </label>
                  ))}
                </div>

                {formData.paymentMethod === 'Credit Card' && (
                  <div className="space-y-4">
                    <FormInput
                      label="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      icon="fas fa-credit-card"
                      placeholder="1234 5678 9012 3456"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Expiry Date"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                      />
                      <FormInput
                        label="CVC"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleChange}
                        required
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item._id} className="flex justify-between">
                  <div>
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-500 text-sm block">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
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
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <i className="fas fa-lock mr-2"></i>
                  Place Order
                </>
              )}
            </button>

            {/* Security Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <i className="fas fa-shield-alt mr-1"></i>
              Secure checkout powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;