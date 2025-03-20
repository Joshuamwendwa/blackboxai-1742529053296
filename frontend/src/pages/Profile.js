import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Profile() {
  const { user, updateProfile, updatePassword } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(profileData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-user mr-2"></i>
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-lock mr-2"></i>
            Security
          </button>
        </nav>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error}
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Alert 
          type="success" 
          message={success}
          onClose={() => setSuccess('')}
        />
      )}

      {activeTab === 'profile' ? (
        // Profile Information Form
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
                icon="fas fa-user"
              />
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                icon="fas fa-envelope"
              />
              <FormInput
                label="Phone Number"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleProfileChange}
                icon="fas fa-phone"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Street Address"
                  name="address.street"
                  value={profileData.address.street}
                  onChange={handleProfileChange}
                  icon="fas fa-map-marker-alt"
                />
                <FormInput
                  label="City"
                  name="address.city"
                  value={profileData.address.city}
                  onChange={handleProfileChange}
                  icon="fas fa-city"
                />
                <FormInput
                  label="State"
                  name="address.state"
                  value={profileData.address.state}
                  onChange={handleProfileChange}
                  icon="fas fa-map"
                />
                <FormInput
                  label="ZIP Code"
                  name="address.zipCode"
                  value={profileData.address.zipCode}
                  onChange={handleProfileChange}
                  icon="fas fa-mail-bulk"
                />
                <FormInput
                  label="Country"
                  name="address.country"
                  value={profileData.address.country}
                  onChange={handleProfileChange}
                  icon="fas fa-globe"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Security Form
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <FormInput
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              icon="fas fa-lock"
            />
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              icon="fas fa-key"
              helpText="Password must be at least 6 characters long"
            />
            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              icon="fas fa-key"
            />

            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                <i className="fas fa-key mr-2"></i>
                Update Password
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;