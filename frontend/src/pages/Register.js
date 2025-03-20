import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register({
        name,
        email,
        password
      });
      
      // Redirect to home page after successful registration
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen-75 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            type="error" 
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              value={name}
              onChange={handleChange}
              required
              icon="fas fa-user"
              placeholder="Enter your full name"
              autoComplete="name"
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              required
              icon="fas fa-envelope"
              placeholder="Enter your email"
              autoComplete="email"
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              required
              icon="fas fa-lock"
              placeholder="Create a password"
              helpText="Password must be at least 6 characters long"
              autoComplete="new-password"
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              required
              icon="fas fa-lock"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex justify-center py-3"
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <i className="fas fa-user-plus mr-2"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Social Registration */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="btn-outline w-full"
            >
              <i className="fab fa-google mr-2"></i>
              Google
            </button>
            <button
              type="button"
              className="btn-outline w-full"
            >
              <i className="fab fa-facebook-f mr-2"></i>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;