const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrder);

// Admin routes
router.use(authorize('admin')); // Apply admin authorization to all routes below
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/payment', updatePaymentStatus);

module.exports = router;