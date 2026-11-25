import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pages/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        } else {
          setPage(null);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchPage();
  }, [slug]);

  if (loading) return <div><Navbar /><p className="text-center py-20">Loading...</p></div>;
  if (!page) return <div><Navbar /><p className="text-center py-20">Page Not Found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-brozentoDark mb-6 border-b pb-4">{page.title}</h1>
          
          {/* Content render karein (HTML support ke saath) */}
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;