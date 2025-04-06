
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Leaf, Cloud, Mic, MessageSquare, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-4 text-white">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-kisan-text">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Assistant",
      description: "Get real-time assistance through voice in your local language."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Ask AI",
      description: "Type your farming questions and get instant answers."
    },
    {
      icon: <Crop className="w-6 h-6" />,
      title: "Crop Detection",
      description: "Identify crops with just a photo upload."
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Weather Updates",
      description: "Get localized weather reports for better planning."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-leaf-pattern bg-cover bg-center" />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="h-16 w-16 text-green-500" />
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-green-700 to-green-500 text-transparent bg-clip-text mb-6">
            Kisan AI
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Your digital farming assistant powered by AI, helping farmers thrive with voice and language support.
          </p>
          <Link to="/app">
            <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-6 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl group">
              Enter App
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center text-kisan-text mb-12">
          Smart Features for Farmers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-kisan-dark/90 backdrop-blur-sm text-white py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">Kisan AI - Digital buddy for farmers © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
