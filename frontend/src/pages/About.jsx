// About.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const aboutImg = "https://source.unsplash.com/800x600/?bedding,interior";

const About = () => {
  const team = [
    { name: 'Paras Malhotra', role: 'Founder & CEO', img: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Daniel White', role: 'Operations Manager', img: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'Natalie Chen', role: 'Creative Director', img: 'https://randomuser.me/api/portraits/women/13.jpg' }
  ];

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-10 flex-1">
        <motion.h1
          className="text-4xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Econest Bedding Inc
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <motion.img
            src={aboutImg}
            alt="About Econest Bedding"
            className="rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-lg mb-4">
              At Econest Bedding Inc, located in the heart of Calgary, we specialize in high-quality bedding solutions
              that blend comfort, sustainability, and design. With a passion for restful sleep, our team crafts each
              product with care and modern aesthetics.
            </p>
            <p className="text-lg">
              Our mission is to elevate your sleep experience and help Canadians create cozy, stylish homes. Whether
              it's a mattress, bed frame, or bedroom decor — we’ve got your comfort covered.
            </p>
          </motion.div>
        </div>

        {/* Meet the Team */}
        <div className="mb-16">
          <motion.h2
            className="text-3xl font-bold mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Meet the Team
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                className="text-center border rounded-lg p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i, duration: 0.5 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 mx-auto mb-4 rounded-full object-cover shadow"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Visit Us</h2>
          <p className="mb-1">Econest Bedding Inc</p>
          <p className="mb-1">1935 30 Ave NE, Unit 7, Calgary, AB</p>
          <p className="mb-1">Phone: +1 825-883-0015</p>
          <p className="mb-4">Email: Albertamattress@gmail.com</p>
          <iframe
            title="Econest Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.9827458854197!2d-114.00653658454686!3d51.08089277956883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716fa246528a01%3A0xa81671d57041364e!2s1935%2030%20Ave%20NE%20Unit%207%2C%20Calgary%2C%20AB%20T2E%207P7%2C%20Canada!5e0!3m2!1sen!2sca!4v1713900000000!5m2!1sen!2sca"
            className="w-full h-64 border rounded"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
