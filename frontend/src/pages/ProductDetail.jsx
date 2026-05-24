import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, AlertCircle, CheckCircle2, XCircle, Star, MessageSquare, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { addToCartLogic } from '../services/cartService';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stockQuantity, setStockQuantity] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Identity Profiles
  const [sbUser, setSbUser] = useState(null);       // Supabase Auth Context
  const [dbUserId, setDbUserId] = useState(null);   // Public.users relational bigint ID

  // Review states 
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    syncUserIdentity();
  }, [id]);

  // Fetches Supabase session and matches it to your database users (id)
  const syncUserIdentity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setSbUser(user);

      const { data: dbUser, error: dbErr } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (dbUser) {
        setDbUserId(dbUser.id);
      } else if (!dbErr) {
        // Fallback registration handler if profile records are missing
        const { data: newUser } = await supabase
          .from('users')
          .insert([{
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            role: 'customer'
          }])
          .select('id')
          .maybeSingle();

        if (newUser) setDbUserId(newUser.id);
      }
    } catch (err) {
      console.error("Identity syncing error:", err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data) {
        setProduct(res.data);
        setStockQuantity(res.data.stockQuantity !== undefined ? res.data.stockQuantity : 10);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await api.get(`/reviews/product/${id}`);
      // Sort reviews descending by id natively
      const sortedReviews = (res.data || []).sort((a, b) => b.id - a.id);
      setReviews(sortedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0 || !reviewText.trim()) return;

    if (!sbUser || !dbUserId) {
      window.showToast?.("Please login to submit a review.", "info");
      return;
    }

    try {
      const reviewPayload = {
        // Add these for standard Java DTO mapping
        productId: Number(id),
        userId: Number(dbUserId),
        userName: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],

        // Keep these for direct database column matching 
        product_id: Number(id),
        user_id: Number(dbUserId),
        user_name: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],

        comment: reviewText,
        rating: Number(rating)
      };
      await api.post(`/reviews/add/${id}`, reviewPayload);

      window.showToast?.("Review submitted successfully!", "success");
      await fetchReviews();
      setRating(0);
      setReviewText('');
    } catch (err) {
      console.error("Error submitting review:", err);
      window.showToast?.("Could not submit review. Error: " + err.message, "error");
    }
  };

  const handleDeleteReview = async (review) => {
    if (!sbUser || !dbUserId) {
      window.showToast?.("Please login to remove a review.", "info");
      return;
    }

    // Explicitly check matching database bigint values instead of names
    if (Number(dbUserId) !== Number(review.user_id)) {
      window.showToast?.("Action unauthorized. You can only remove your own comments.", "error");
      return;
    }

    try {
      await api.delete(`/reviews/delete/${review.id}`);
      window.showToast?.("Review deleted successfully!", "success");
      await fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      window.showToast?.("Could not delete review. Error: " + err.message, "error");
    }
  };

  const handleIncrement = () => {
    if (quantity < stockQuantity) setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const addToCart = async () => {
    if (!sbUser) {
      window.showToast?.("Please login", "info");
      return;
    }
    try {
      await addToCartLogic(sbUser, product.id, quantity);
      window.showToast?.("Added to cart!", "success");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
      window.showToast?.(err.message || "Error adding to cart", "error");
    }
  };

  const addToWishlist = async () => {
    if (!sbUser || !dbUserId) {
      window.showToast?.("Please login to add items to your wishlist.", "info");
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert([{ user_id: dbUserId, product_id: product.id }]);

      if (error) {
        if (error.code === '23505') {
          window.showToast?.("This item is already in your wishlist!", "warning");
        } else {
          window.showToast?.("Could not add to wishlist. Error: " + error.message, "error");
        }
      } else {
        window.showToast?.("Added to wishlist successfully!", "success");
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (err) {
      console.error(err);
      window.showToast?.("Could not add to wishlist.", "error");
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xl font-bold text-slate-500">Loading Product Details...</div>;
  }

  if (error || !product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xl font-bold text-red-500">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-8 bg-slate-50 flex items-center justify-center min-h-[500px]">
            <div className="w-full h-full max-w-md max-h-md bg-white rounded-2xl shadow-inner flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl.startsWith('http') || product.imageUrl.startsWith('/') ? product.imageUrl : `/${product.imageUrl}`} alt={product.name} className="w-full h-full object-contain p-4" />
              ) : (
                <span className="text-slate-400 font-medium text-lg">No Image</span>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
            <p className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-2">{product.category || 'General'}</p>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center mb-6">
              <div className="flex text-amber-400 text-lg mr-3">
                {(() => {
                  const calculatedRating = reviews.length > 0
                    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                    : Math.round(product.rating || 5);
                  return '★'.repeat(calculatedRating) + '☆'.repeat(5 - calculatedRating);
                })()}
              </div>
              <span className="text-slate-500 font-medium underline cursor-pointer">{reviews.length} Reviews</span>
            </div>

            <div className="mb-6 flex items-end">
              <span className="text-4xl font-black text-slate-900">₹{product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-slate-400 line-through ml-4 mb-1">₹{product.original_price}</span>
                  {product.discount && (
                    <span className="ml-4 mb-2 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Save {product.discount}%</span>
                  )}
                </>
              )}
            </div>

            {/* Stock Validation */}
            <div className="mb-6">
              {stockQuantity === 0 ? (
                <div className="flex items-center text-red-500 bg-red-50 w-fit px-3 py-1.5 rounded-lg border border-red-100">
                  <XCircle className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">Out of Stock</span>
                </div>
              ) : stockQuantity <= 5 ? (
                <div className="flex items-center text-orange-600 bg-orange-50 w-fit px-3 py-1.5 rounded-lg border border-orange-100 animate-pulse">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">Limited Stock - Only {stockQuantity} left!</span>
                </div>
              ) : (
                <div className="flex items-center text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">In Stock</span>
                </div>
              )}
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              {product.description || 'Experience unparalleled quality with this premium product.'}
            </p>

            <div className="flex items-center space-x-4 mb-10">
              <div className={`flex items-center border-2 rounded-xl bg-slate-50 ${stockQuantity === 0 ? 'border-slate-100 opacity-50' : 'border-slate-200'}`}>
                <button
                  onClick={handleDecrement}
                  disabled={stockQuantity === 0 || quantity <= 1}
                  className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xl transition-colors"
                >-</button>
                <span className="px-4 font-bold text-slate-900 text-lg">{stockQuantity === 0 ? 0 : quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={stockQuantity === 0 || quantity >= stockQuantity}
                  className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xl transition-colors"
                >+</button>
              </div>
              <button
                onClick={addToCart}
                disabled={stockQuantity === 0}
                className={`flex-1 font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all flex items-center justify-center text-lg ${stockQuantity === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-500/30 hover:-translate-y-1'
                  }`}
              >
                <ShoppingCart className="mr-3 h-6 w-6" /> {stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={addToWishlist} className="p-4 border-2 border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                <Heart className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
              <div className="flex items-center text-slate-600">
                <Truck className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center text-slate-600">
                <RotateCcw className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium">30-Day Returns</span>
              </div>
              <div className="flex items-center text-slate-600">
                <ShieldCheck className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium">1 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 mt-8">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Form Box */}
          <div className="lg:w-1/3">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="text-orange-500 w-6 h-6" /> Write a Review
            </h2>
            <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-700 mb-3">Overall Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-9 h-9 cursor-pointer transition-all hover:scale-110 ${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
                <textarea
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none bg-white"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={rating === 0 || !reviewText.trim()}
                className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Review Stream List */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Customer Reviews ({reviews.length})</h2>
              <div className="text-amber-400 flex items-center text-xl font-bold">
                <Star className="fill-amber-400 w-6 h-6 mr-2" /> {
                  reviews.length > 0
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '5.0'
                }
              </div>
            </div>

            <div className="space-y-6">
              {loadingReviews ? (
                <div className="text-slate-500 py-4">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-slate-400 italic py-4">No reviews yet for this product. Be the first to write one!</div>
              ) : (
                reviews.map((review) => {
                  const reviewDisplayName = review.user_name || review.userName || 'Anonymous';
                  const isOwner = dbUserId && Number(dbUserId) === Number(review.user_id);

                  return (
                    <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 uppercase">
                            {reviewDisplayName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{reviewDisplayName}</p>
                            <div className="flex text-amber-400 mt-1 gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Verified Purchase</span>

                          {isOwner && (
                            <button
                              onClick={() => handleDeleteReview(review)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600 mt-4 leading-relaxed">{review.comment}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;