const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { APIError, catchAsync } = require('../middleware/errorHandler');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new APIError('User already exists', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } else {
    throw new APIError('Invalid user data', 400);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    throw new APIError('Please provide email and password', 400);
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError('Invalid credentials', 401);
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new APIError('Invalid credentials', 401);
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user.getPublicProfile()
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = catchAsync(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: user.getPublicProfile()
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new APIError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new APIError('There is no user with that email', 404);
  }

  // Get reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // TODO: Send email with reset token

  res.status(200).json({
    success: true,
    message: 'Password reset email sent'
  });
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new APIError('Invalid or expired reset token', 400);
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }
  });
});