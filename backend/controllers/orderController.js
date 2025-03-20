const Order = require('../models/Order');
const Product = require('../models/Product');
const { APIError, catchAsync } = require('../middleware/errorHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    products,
    shippingAddress,
    paymentMethod,
    shippingMethod
  } = req.body;

  if (!products || products.length === 0) {
    throw new APIError('No order items', 400);
  }

  // Verify products and calculate total
  let totalAmount = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      throw new APIError(`Product not found with ID: ${item.product}`, 404);
    }

    if (product.stock < item.quantity) {
      throw new APIError(`Insufficient stock for product: ${product.name}`, 400);
    }

    // Calculate price (considering any active discounts)
    const price = product.getFinalPrice();
    
    orderProducts.push({
      product: item.product,
      quantity: item.quantity,
      price: price
    });

    totalAmount += price * item.quantity;
  }

  // Calculate shipping cost based on shipping method
  const shippingCost = calculateShippingCost(shippingMethod, totalAmount);
  totalAmount += shippingCost;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    shippingCost,
    totalAmount
  });

  // Update product stock
  for (const item of orderProducts) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    await product.save();
  }

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('products.product', 'name images');

  if (!order) {
    throw new APIError('Order not found', 404);
  }

  // Check if user is authorized to view this order
  if (order.user._id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    throw new APIError('Not authorized to access this order', 403);
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('products.product', 'name images')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
  // Copy req.query
  const queryObj = { ...req.query };

  // Fields to exclude from filtering
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = Order.find(JSON.parse(queryStr))
    .populate('user', 'name email')
    .populate('products.product', 'name images');

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Order.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const orders = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination,
    data: orders
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new APIError('Order not found', 404);
  }

  if (order.status === 'Delivered') {
    throw new APIError('Order has already been delivered', 400);
  }

  // Update status
  order.status = req.body.status;
  
  // If order is cancelled, restore product stock
  if (req.body.status === 'Cancelled' && order.status !== 'Cancelled') {
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }
  }

  // If order is delivered, update delivery date
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new APIError('Order not found', 404);
  }

  order.paymentStatus = req.body.paymentStatus;
  order.paymentDetails = {
    ...order.paymentDetails,
    ...req.body.paymentDetails,
    paymentDate: Date.now()
  };

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// Helper function to calculate shipping cost
const calculateShippingCost = (shippingMethod, totalAmount) => {
  switch (shippingMethod) {
    case 'Standard':
      return totalAmount >= 100 ? 0 : 10; // Free shipping over $100
    case 'Express':
      return 15;
    case 'Next Day':
      return 25;
    default:
      return 10;
  }
};