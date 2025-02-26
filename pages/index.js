import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { SiTryhackme } from 'react-icons/si';
import dynamic from 'next/dynamic';

// Dynamically import Three.js components with ssr: false to avoid hydration errors
const ThreeScene = dynamic(() => import('../components/ThreeScene'), { ssr: false });

// GitHub Fork Card component
const ForkCard = ({ fork }) => {
  return (
    <motion.div
      className="bg-white/20 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center mb-2">
        <img src={fork.owner.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
        <a href={fork.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
          {fork.owner.login}
        </a>
      </div>
      <p className="text-gray-700 text-sm truncate">
        {fork.description || "No description provided"}
      </p>
      <div className="mt-2 flex items-center text-xs text-gray-600">
        <span className="mr-2">⭐ {fork.stargazers_count}</span>
        <span>🍴 {fork.forks_count}</span>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [forks, setForks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fetch GitHub forks - using a placeholder approach to avoid 404 errors
    const fetchForks = async () => {
      try {
        // For a real implementation, replace with your actual repository path
        // Using a placeholder instead of making a real API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setForks([]);
        setError(null);
      } catch (error) {
        console.error('Error fetching forks:', error);
        setError('Could not fetch repository forks');
      } finally {
        setLoading(false);
      }
    };

    fetchForks();
  }, []);

  const features = [
    "AI-Powered Chat Responses",
    "Automatic PDF Generation",
    "User Authentication & Profile Management",
    "Clean & Modern Interface"
  ];

  // Only render the client-specific content when component has mounted
  if (!mounted) {
    return null; // Return null on first render to avoid hydration issues
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-blue-950">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-100 to-blue-200"></div>
        
        {/* Animated blue circles */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-blue-200/30 blur-3xl"
          animate={{ 
            x: [0, 70, 0], 
            y: [0, -50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25,
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* 3D Header Section */}
        <div className="h-64 sm:h-80">
          {mounted && <ThreeScene />}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
              PDFolio
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-800 mb-8">
              A Next.js full-stack application that combines AI-powered chat interactions with instant PDF generation capabilities.
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <motion.button 
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg text-lg font-medium shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
              
              <Link href="/signup">
                <motion.button 
                  className="px-8 py-3 bg-white bg-opacity-80 border border-blue-300 text-blue-700 rounded-lg text-lg font-medium shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(219, 234, 254, 0.8)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/50"
                  whileHover={{ y: -10, boxShadow: "0px 10px 20px rgba(59, 130, 246, 0.2)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                >
                  <div className="text-blue-500 text-4xl mb-4">
                    {index === 0 && "💬"}
                    {index === 1 && "📄"}
                    {index === 2 && "🔐"}
                    {index === 3 && "✨"}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-900">{feature}</h3>
                  <p className="text-blue-700">
                    {index === 0 && "Get intelligent responses from AI models through a simple chat interface."}
                    {index === 1 && "Instantly convert AI-generated content into downloadable PDF documents."}
                    {index === 2 && "Securely manage your account with JWT-based authentication."}
                    {index === 3 && "Enjoy a responsive and intuitive user experience throughout the app."}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* GitHub Forks Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">GitHub Forks</h2>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center p-12 bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl border border-white/50">
                <FaGithub className="mx-auto text-6xl mb-4 text-blue-400" />
                <p className="text-xl mb-4 text-blue-800">Could not load repository information</p>
              </div>
            ) : forks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {forks.map(fork => (
                  <ForkCard key={fork.id} fork={fork} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl border border-white/50">
                <FaGithub className="mx-auto text-6xl mb-4 text-blue-400" />
                <p className="text-xl mb-4 text-blue-800">No forks yet!</p>
                <a 
                  href="https://github.com/darkside4x" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg text-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Visit GitHub Profile
                </a>
              </div>
            )}
          </motion.div>

          {/* GitHub Repository Link */}
          <motion.div 
            className="text-center mb-16"
            whileHover={{ scale: 1.05 }}
          >
            <a 
              href="https://github.com/darkside4x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white bg-opacity-70 text-blue-700 rounded-lg text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-200"
            >
              <FaGithub className="mr-2 text-2xl" />
              Check out My GitHub Profile
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-md py-10 border-t border-blue-100">
          <div className="container mx-auto px-4">
            <motion.h3 
              className="text-2xl font-bold text-center mb-6 text-blue-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Connect with Me
            </motion.h3>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <a href="https://instagram.com/sakthivel_unknown" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-700 hover:text-blue-900">
                <FaInstagram className="text-2xl mr-2" />
                <span>sakthivel_unknown</span>
              </a>
              
              <a href="https://linkedin.com/in/sakthivel-azhakiamanavalan" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-700 hover:text-blue-900">
                <FaLinkedin className="text-2xl mr-2" />
                <span>sakthivel-azhakiamanavalan</span>
              </a>
              
              <a href="https://github.com/darkside4x" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-700 hover:text-blue-900">
                <FaGithub className="text-2xl mr-2" />
                <span>darkside4x</span>
              </a>
              
              <a href="https://tryhackme.com/p/ds4x" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-700 hover:text-blue-900">
                <SiTryhackme className="text-2xl mr-2" />
                <span>ds4x</span>
              </a>
            </motion.div>
            
            <motion.div 
              className="text-center text-blue-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <div className="mb-2">
                <FaEnvelope className="inline mr-2" />
                <a href="mailto:v.a.sakthivel21@gmail.com" className="hover:text-blue-800">v.a.sakthivel21@gmail.com</a>
                {' • '}
                <a href="mailto:br7570@cbsebhel.onmicrosoft.com" className="hover:text-blue-800">br7570@cbsebhel.onmicrosoft.com</a>
              </div>
              <p>© {new Date().getFullYear()} PDFolio. Made with 💙 by Sakthivel (Cyberwork LLC 🏢)</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}