// Categories.jsx
import React, { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading categories...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Explore Our Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            name={category.name}
            image={`http://localhost:5000/uploads/${category.image}`}
          />
        ))}
      </div>
    </div>
  );
}
