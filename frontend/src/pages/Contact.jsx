// Contact.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-2">Econest Bedding Inc</p>
            <p className="mb-2">1935 30 Ave NE, Unit 7, Calgary, AB</p>
            <p className="mb-2">Phone: +1 825-883-0015</p>
            <p className="mb-4">Email: Albertamattress@gmail.com</p>

            <iframe
              title="Econest Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.9827458854197!2d-114.00653658454686!3d51.08089277956883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716fa246528a01%3A0xa81671d57041364e!2s1935%2030%20Ave%20NE%20Unit%207%2C%20Calgary%2C%20AB%20T2E%207P7%2C%20Canada!5e0!3m2!1sen!2sca!4v1713900000000!5m2!1sen!2sca"
              className="w-full h-64 mt-4 border rounded"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">Name</label>
              <input type="text" id="name" className="w-full border px-4 py-2 rounded" required />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium">Email</label>
              <input type="email" id="email" className="w-full border px-4 py-2 rounded" required />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium">Message</label>
              <textarea id="message" rows="5" className="w-full border px-4 py-2 rounded" required></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
