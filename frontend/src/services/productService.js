import axios from 'axios';

const API_URL = '/api/products/';

const getAllProducts = async (filters) => {
  const response = await axios.get(API_URL, { params: filters });
  return response.data;
};

const getProductById = async (productId) => {
  const response = await axios.get(`${API_URL}${productId}`);
  return response.data;
};

const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};

const updateProduct = async (productId, productData) => {
  const response = await axios.put(`${API_URL}${productId}`, productData);
  return response.data;
};

const deleteProduct = async (productId) => {
  const response = await axios.delete(`${API_URL}${productId}`);
  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productService;