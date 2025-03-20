import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function ProductCard({ product }) {
  const { addItem, itemExists, getItemQuantity } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <div className="card group">
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0].url}
            alt={product.images[0].alt}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount?.percentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              {product.discount.percentage}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          
          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            {product.discount?.percentage > 0 ? (
              <>
                <span className="text-xl font-bold text-primary-600">
                  ${product.getFinalPrice().toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
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
            <span className="text-sm text-gray-500 ml-2">
              ({product.ratings.count})
            </span>
          </div>

          {/* Stock Status */}
          <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'} mb-4`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </p>

          {/* Add to Cart Button */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className={`w-full btn ${
                itemExists(product._id)
                  ? 'btn-secondary'
                  : 'btn-primary'
              }`}
              disabled={product.stock === 0}
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
          )}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;