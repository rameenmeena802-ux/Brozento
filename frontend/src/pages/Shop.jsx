import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import { getProducts } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Special', 'Broast', 'Fries', 'Injectors', 'Combos'];

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // URL se search query update karein
    const querySearch = searchParams.get('search') || '';
    setSearchTerm(querySearch);
  }, [searchParams]);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(prod => 
        prod.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(prod => 
        prod.category === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setSearchParams({ search: e.target.value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-brozentoDark mb-3">Shop All Products</h1>
          <p className="text-gray-500">Discover our premium range of restaurant-grade masalas and injectors.</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/3">
            <Search size={20} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent outline-none ml-2 w-full text-sm text-gray-700"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-brozentoRed text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found matching your search.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSearchParams({}); }} 
              className="mt-4 text-brozentoRed font-semibold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard 
                key={prod._id} 
                id={prod._id} 
                title={prod.title} 
                price={`Rs ${prod.price}`} 
                oldPrice={prod.oldPrice ? `Rs ${prod.oldPrice}` : null} 
                discount={prod.discount} 
                image={prod.image} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;