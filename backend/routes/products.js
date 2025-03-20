const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  updateStock
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect); // Apply protection middleware to all routes below

// User routes (protected)
router.post('/:id/reviews', addProductReview);

// Admin routes (protected + admin only)
router.use(authorize('admin')); // Apply admin authorization to all routes below
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/stock', updateStock);

module.exports = router;