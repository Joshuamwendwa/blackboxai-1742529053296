import axios from 'axios';

const API_URL = '/api/auth/';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login`, credentials);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

const updateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}updateprofile`, profileData);
  return response.data;
};

const updatePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}updatepassword`, passwordData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
  updatePassword
};

export default authService;