import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, ArrowLeft, Truck, Minus, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState('');

  // Variant & Quantity States
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // API URL
  const API_BASE = 'https://brozento-backend.vercel.app/api';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) setSelectedVariant(data.variants[0]);
        setLoading(false);
      } catch (error) { console.error(error); setLoading(false); }
    };
    const fetchReviews = async () => {
      try { const res = await fetch(`${API_BASE}/reviews/${id}`); const data = await res.json(); setReviews(data); } catch (error) { console.error(error); }
    };
    fetchProduct(); fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newReview, productId: id }) });
      if (res.ok) {
        setReviewStatus('success'); setNewReview({ userName: '', rating: 5, comment: '' });
        const reviewsRes = await fetch(`${API_BASE}/reviews/${id}`); const reviewsData = await reviewsRes.json(); setReviews(reviewsData);
      } else setReviewStatus('error');
    } catch (error) { console.error(error); setReviewStatus('error'); }
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      _id: product._id,
      price: selectedVariant ? selectedVariant.price : product.price,
      oldPrice: selectedVariant ? selectedVariant.oldPrice : product.oldPrice,
      variantName: selectedVariant ? selectedVariant.name : null,
      quantity: quantity
    };
    addToCart(productToAdd);
  };

  if (loading) return <div><Navbar /><p className="text-center py-20">Loading...</p></div>;
  if (!product) return <div><Navbar /><p className="text-center py-20">Product not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>{product.title} - Brozento Pakistan</title>
        <meta name="description" content={product.metaDescription || product.description || 'Premium quality restaurant-grade masala.'} />
        <meta property="og:title" content={`${product.title} - Brozento`} />
        <meta property="og:image" content={product.image} />
      </Helmet>

      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-brozentoRed mb-6"><ArrowLeft size={18} /> Back to Shop</Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="w-full h-96 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center relative mb-4">
              {product.video ? (<video controls className="w-full h-full object-contain"><source src={product.video} type="video/mp4" /></video>) : (<img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />)}
              {product.discount && <span className="absolute top-4 left-4 bg-brozentoRed text-white text-sm font-bold px-3 py-1 rounded-md z-10">{product.discount}</span>}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-brozentoDark mb-2">{product.title}</h1>
            <div className="flex text-brozentoGold mb-4"><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /></div>
            
            <div className="flex items-center gap-3 mb-6">
              {(selectedVariant ? selectedVariant.oldPrice : product.oldPrice) > 0 && <span className="text-gray-400 line-through text-lg">Rs {selectedVariant ? selectedVariant.oldPrice : product.oldPrice}</span>}
              <span className="text-brozentoRed font-extrabold text-3xl">Rs {selectedVariant ? selectedVariant.price : product.price}</span>
            </div>

            <p className="text-gray-600 mb-6 text-lg">{product.description || "Premium quality restaurant-grade masala."}</p>

            {/* VARIANTS BUTTONS */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Size/Weight:</label>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v, i) => (
                    <button key={i} onClick={() => { setSelectedVariant(v); setQuantity(1); }} className={`px-4 py-2 border rounded-lg font-semibold transition ${selectedVariant?.name === v.name ? 'bg-brozentoRed text-white border-brozentoRed' : 'bg-white text-gray-700 border-gray-300 hover:border-brozentoRed'}`}>
                      {v.name} - Rs {v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY SELECTOR */}
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200"><Minus size={16} /></button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.maxOrderQuantity || 10, quantity + 1))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200"><Plus size={16} /></button>
              </div>
              <span className="text-xs text-gray-500">Min: {product.minOrderQuantity || 1}, Max: {product.maxOrderQuantity || 10}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center gap-3 text-sm text-gray-700"><Truck size={20} className="text-brozentoRed" /> Delivery charges applied at checkout based on your city.</div>

            <button onClick={handleAddToCart} className="w-full bg-brozentoRed text-white font-bold py-4 rounded-xl hover:bg-red-700 transition flex justify-center items-center gap-2 text-lg shadow-lg"><ShoppingCart size={22} /> Add to Cart</button>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews ({reviews.length})</h2>
          <div className="space-y-4 mb-8">
            {reviews.length === 0 ? (<p className="text-gray-500">No reviews yet.</p>) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brozentoRed text-white rounded-full flex items-center justify-center font-bold">{review.userName.charAt(0).toUpperCase()}</div>
                    <div><p className="font-semibold text-gray-800">{review.userName}</p><div className="flex text-brozentoGold text-xs">{[...Array(5)].map((_, i) => (<Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-brozentoGold" : "text-gray-300"} />))}</div></div>
                    <p className="text-xs text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Write a Review</h3>
            {reviewStatus === 'success' && <p className="text-green-600 text-sm mb-2">Review submitted!</p>}
            {reviewStatus === 'error' && <p className="text-red-600 text-sm mb-2">Something went wrong.</p>}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" value={newReview.userName} onChange={(e) => setNewReview({...newReview, userName: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg">
                  <option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
                </select>
              </div>
              <textarea placeholder="Your Review" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required rows="3" className="w-full px-4 py-2 border rounded-lg"></textarea>
              <button type="submit" className="bg-brozentoRed text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 transition">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;