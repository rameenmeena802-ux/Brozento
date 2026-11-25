import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom'; // YEH NAYA IMPORT HAI
import { useCart } from '../context/CartContext';

const ProductCard = ({ id, title, price, oldPrice, discount, image }) => {
  const { addToCart } = useCart();

  const numericPrice = typeof price === 'string' ? Number(price.replace(/[^0-9.-]+/g,"")) : price;
  const numericOldPrice = oldPrice && typeof oldPrice === 'string' ? Number(oldPrice.replace(/[^0-9.-]+/g,"")) : oldPrice;

  const productObj = { 
    _id: id, 
    title, 
    price: numericPrice, 
    oldPrice: numericOldPrice, 
    discount, 
    image 
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 relative group border border-gray-100">
      {discount && (
        <span className="absolute top-3 left-3 bg-brozentoRed text-white text-xs font-bold px-2.5 py-1 rounded-md z-10 shadow-sm">{discount}</span>
      )}
      <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-brozentoRed z-10 transition">
        <Heart size={18} />
      </button>

      {/* IMAGE PAR LINK LAGAYA HAI */}
      <Link to={`/product/${id}`} className="block w-full h-52 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
        <img src={image} alt={title} className="h-full object-contain group-hover:scale-105 transition duration-500 mix-blend-multiply" />
      </Link>

      <div className="text-center px-2">
        {/* TITLE PAR LINK LAGAYA HAI */}
        <Link to={`/product/${id}`}>
          <h3 className="font-bold text-gray-800 text-lg mb-1 truncate hover:text-brozentoRed transition">{title}</h3>
        </Link>
        
        <div className="flex justify-center text-brozentoGold text-sm mb-3">
          <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
        </div>
        <div className="flex justify-center items-center gap-2 mb-5">
          {oldPrice && <span className="text-gray-400 line-through text-sm">{oldPrice}</span>}
          <span className="text-brozentoDark font-extrabold text-xl">{price}</span>
        </div>
      </div>
      
      <button 
        onClick={() => addToCart(productObj)} 
        className="w-full bg-gray-50 text-brozentoDark font-bold py-3 rounded-xl hover:bg-brozentoRed hover:text-white transition duration-300 flex justify-center items-center gap-2 border border-gray-200 hover:border-brozentoRed"
      >
        <ShoppingCart size={18} /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;