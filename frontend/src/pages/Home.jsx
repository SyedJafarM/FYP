// Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryCard from "../components/CategoryCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/products")
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/collection?categoryId=${categoryId}`);
  };

  return (
    <div className="bg-background text-gray-900">
      <Navbar />

      {/* Hero Slider */}
      <Swiper
        autoplay={{ delay: 4000 }}
        loop={true}
        className="h-[80vh]"
        modules={[Autoplay]}
      >
        {[
          "/assets/beds.jpg",
          "/assets/chairs.jpg",
          "/assets/mattresses.jpg"
        ].map((img, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
              style={{ backgroundImage: `url(${img})` }}
            >
              <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Econest Bedding Inc</h1>
                <p className="text-lg md:text-xl mb-6">Comfort that lasts. Style that impresses.</p>
                <a href="/collection" className="bg-white text-black font-semibold px-6 py-3 rounded hover:bg-gray-200">Shop Now</a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Featured Products */}
      <section className="container mx-auto my-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <Swiper
          autoplay={{ delay: 3000 }}
          loop={true}
          modules={[Autoplay]}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="rounded mb-4 w-full h-48 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-blue-600 font-bold">CAD ${product.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Our Categories</h2>
          {loading ? (
            <p className="text-center text-lg">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="cursor-pointer"
                >
                  <CategoryCard
                    title={cat.name}
                    image={`http://localhost:5000/uploads/${cat.image}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <Swiper
          autoplay={{ delay: 3000 }}
          loop={true}
          modules={[Autoplay]}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >
          {[
            { name: "Emma McDonald", photo: "https://randomuser.me/api/portraits/women/72.jpg", review: "Absolutely love my new bed!" },
            { name: "Liam Bennett", photo: "https://randomuser.me/api/portraits/men/76.jpg", review: "Amazing service and fast delivery." },
            { name: "Olivia Smith", photo: "https://randomuser.me/api/portraits/women/52.jpg", review: "The mattress quality is top-notch." },
            { name: "Noah Taylor", photo: "https://randomuser.me/api/portraits/men/78.jpg", review: "Very satisfied with my purchase!" },
            { name: "Ava Martin", photo: "https://randomuser.me/api/portraits/women/81.jpg", review: "Friendly customer support, highly recommend." },
            { name: "Ethan Lee", photo: "https://randomuser.me/api/portraits/men/66.jpg", review: "Super comfortable and stylish products." }
          ].map((t, i) => (
            <SwiperSlide key={i}>
              <div className="border p-6 rounded-lg shadow text-center max-w-md mx-auto">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-16 h-16 mx-auto mb-4 rounded-full object-cover"
                />
                <p className="italic mb-2">“{t.review}”</p>
                <div className="font-semibold">{t.name}</div>
                <div className="text-yellow-400 text-lg">★★★★★</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-blue-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
          <p className="mb-6">Get exclusive deals and updates straight to your inbox</p>
          <form className="flex flex-col sm:flex-row justify-center gap-4">
            <input type="email" placeholder="Enter your email" className="p-3 rounded w-full sm:w-1/3" />
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Visit Us</h2>
          <div className="w-full h-[400px]">
            <iframe
              title="Econest Bedding Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2512.820431137005!2d-114.0157584!3d51.0798374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716e155e733c2f%3A0x82ad46b3d0b0e899!2s1935%2030%20Ave%20NE%20Unit%207%2C%20Calgary%2C%20AB%20T2E%207B9!5e0!3m2!1sen!2sca!4v1682450000000!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
