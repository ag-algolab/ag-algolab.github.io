import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Cpu,
  BarChart3,
  Users,
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter,
  ChevronDown,
  Play,
  Code,
  Database,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

function App() {
  const handleContactClick = () => {
    toast({
      title: "We're building something here...",
      description: "This page will be live very soon!",
    });
  };

  const NAV = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "founder", label: "Founder" },
    { id: "main-project", label: "Main Project" },
    { id: "knowledge-hub", label: "Knowledge Hub" },
    { id: "contact", label: "Contact" },
  ];

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>AG Algo Lab - Predict the Unpredictable</title>
        <meta
          name="description"
          content="AG Algo Lab specializes in research and development in algorithmic trading using deep learning."
        />
      </Helmet>

      {/* Fond global clair */}
      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center py-4">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Algo Lab
                </span>
              </motion.div>

              <div className="hidden md:flex space-x-8">
                {NAV.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => scrollToSection(id)}
                    className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
          {/* Particules flottantes */}
          <div className="absolute inset-0">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i % 2 ? "rgba(147, 51, 234, 0.25)" : "rgba(59, 130, 246, 0.25)",
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  x: [0, Math.random() * 800],
                  y: [0, Math.random() * 600],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 12 + 6,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                AG Algo Lab
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-gray-800">
                Predict the Unpredictable
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                Specializing in advanced predictions and the execution of high-performance Python pipelines
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleContactClick}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-md"
                >
                  Discover our services
                </Button>
                <Button
                  variant="outline"
                  onClick={handleContactClick}
                  className="border-2 border-purple-400 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold rounded-full"
                >
                  <Play className="w-5 h-5 mr-2" />
                  See our projects
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-16"
            >
              <button
                onClick={() => scrollToSection("services")}
                className="w-10 h-10 text-purple-500 hover:text-blue-500 transition-colors"
              >
                <ChevronDown className="w-10 h-10" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Innovative solutions in artificial intelligence for algorithmic trading
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="w-8 h-8" />, title: "Deep Learning", description: "Models for predictive analysis of financial markets" },
              { icon: <TrendingUp className="w-8 h-8" />, title: "Advanced Predictions", description: "Algorithms to anticipate market movements with precision" },
              { icon: <Code className="w-8 h-8" />, title: "Python Pipelines", description: "Development and optimization of execution pipelines" },
              { icon: <Database className="w-8 h-8" />, title: "Data Management", description: "Real-time processing and analysis of massive datasets" },
              { icon: <BarChart3 className="w-8 h-8" />, title: "Continuous Improvement", description: "Ongoing refinement of algorithmic performance" },
              { icon: <Zap className="w-8 h-8" />, title: "Rapid Execution", description: "Ultra-fast systems to seize market opportunities" },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl flex items-center justify-center mb-4 text-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 bg-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-4">
              Contact
            </h2>
            <p className="text-lg text-gray-600">Get in touch with us</p>
          </motion.div>

          <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8">
            <a href="tel:+33651871374" className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800 font-semibold">+33 6 51 87 13 74</p>
                </div>
              </div>
            </a>
            <a href="mailto:anthony.gocmen@gmail.com" className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-semibold">anthony.gocmen@gmail.com</p>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Algo Lab
              </span>
            </div>
            <p>© {new Date().getFullYear()} AG Algo Lab. All rights reserved.</p>
          </div>
        </footer>

        <Toaster />
      </div>
    </>
  );
}

export default App;
