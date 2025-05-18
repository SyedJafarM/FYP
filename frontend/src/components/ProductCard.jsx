// frontend/src/components/ProductCard.jsx

import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg p-4 bg-white">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600 mt-1">{product.description}</p>
      <p className="text-green-700 font-bold mt-2">CAD ${product.price}</p>
    </div>
  );
};

export default ProductCard;
