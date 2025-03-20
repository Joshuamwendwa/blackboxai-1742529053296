import axios from 'axios';

const API_URL = '/api/orders/';

const getAllOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}${orderId}`);
  return response.data;
};

const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(`${API_URL}${orderId}/status`, { status });
  return response.data;
};

const deleteOrder = async (orderId) => {
  const response = await axios.delete(`${API_URL}${orderId}`);
  return response.data;
};

const orderService = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
};

export default orderService;