import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, itemExists, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.post(`/api/products/${id}/reviews`, {
        rating,
        comment: reviewText
      });
      await fetchProduct(); // Refresh product data to show new review
      setReviewText('');
      setRating(5);
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!product) return <Alert type="error" message="Product not found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary-500' : 'border-transparent'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-8 lg:mt-0">
          {/* Category */}
          <div className="text-sm text-gray-500 mb-2">{product.category}</div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            {product.discount?.percentage > 0 ? (
              <>
                <span className="text-3xl font-bold text-primary-600">
                  ${product.getFinalPrice().toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  {product.discount.percentage}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`fas fa-star ${
                    index < Math.floor(product.ratings.average)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.ratings.count} reviews)
            </span>
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex">
                    <dt className="w-1/3 text-gray-600">{spec.name}:</dt>
                    <dd className="w-2/3 text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-1/3">
                <label htmlFor="quantity" className="sr-only">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stock}
                  className="input"
                />
              </div>
              <div className="text-gray-600">
                {product.stock} units available
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.stock}
                className={`btn ${
                  itemExists(product._id)
                    ? 'btn-secondary'
                    : 'btn-primary'
                }`}
              >
                {itemExists(product._id) ? (
                  <>
                    <i className="fas fa-shopping-cart mr-2"></i>
                    In Cart ({getItemQuantity(product._id)})
                  </>
                ) : (
                  <>
                    <i className="fas fa-cart-plus mr-2"></i>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.stock}
                className="btn-primary"
              >
                <i className="fas fa-bolt mr-2"></i>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

        {/* Review Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[5, 4, 3, 2, 1].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="text-2xl focus:outline-none"
                  >
                    <i
                      className={`fas fa-star ${
                        value <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    ></i>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Review
              </label>
              <textarea
                id="review"
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="input"
                placeholder="Share your thoughts about this product..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="btn-primary"
            >
              {submittingReview ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-8">
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;