const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      message: '{VALUE} is not a valid order status'
    },
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['Pending', 'Completed', 'Failed', 'Refunded'],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['Credit Card', 'Debit Card', 'PayPal'],
      message: '{VALUE} is not a valid payment method'
    }
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date
  },
  shippingMethod: {
    type: String,
    required: [true, 'Shipping method is required'],
    enum: {
      values: ['Standard', 'Express', 'Next Day'],
      message: '{VALUE} is not a valid shipping method'
    }
  },
  shippingCost: {
    type: Number,
    required: true,
    min: [0, 'Shipping cost cannot be negative']
  },
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total amount before saving
orderSchema.pre('save', async function(next) {
  if (this.isModified('products') || this.isNew) {
    let total = 0;
    for (const item of this.products) {
      total += item.price * item.quantity;
    }
    this.totalAmount = total + this.shippingCost;
  }
  next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Age in days
});

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['Pending', 'Processing'].includes(this.status);
};

// Method to check if order can be modified
orderSchema.methods.canBeModified = function() {
  return this.status === 'Pending';
};

// Ensure virtuals are included in JSON output
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);