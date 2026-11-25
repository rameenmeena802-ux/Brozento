import React from 'react';

const categories = [
  { name: 'Restaurant Masalas', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200&auto=format&fit=crop' },
  { name: 'Injectors', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=200&auto=format&fit=crop' },
  { name: 'Fries Masala', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=200&auto=format&fit=crop' },
  { name: 'Combos (VAAHE)', img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=200&auto=format&fit=crop' },
  { name: 'Whole Spices', img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=200&auto=format&fit=crop' },
];

const CategoryCircles = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex overflow-x-auto gap-8 justify-start md:justify-center pb-4 scrollbar-hide">
        {categories.map((cat, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer group min-w-[110px]">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-transparent group-hover:border-brozentoRed transition-all duration-300 shadow-md group-hover:shadow-xl">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <p className="mt-4 font-bold text-gray-800 text-sm md:text-base group-hover:text-brozentoRed transition text-center">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCircles;