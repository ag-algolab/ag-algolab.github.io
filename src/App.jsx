import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Cpu, BarChart3, Users, Mail, Phone, MapPin, Github, Linkedin, Twitter, ChevronDown, Play, Code, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

function App() {
  const handleContactClick = () => {
    toast({
      title: "We're building something here...",
      description: "This page will be live very soon!"
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>AG Algo Lab - Predict the Unpredictable</title>
        <meta
          name="description"
          content="AG Algo Lab specializes in research and development in algorithmic trading using deep learning. We focus on advanced predictions and high‑performance Python execution pipelines."
        />
        <meta property="og:title" content="AG Algo Lab - Predict the Unpredictable" />
        <meta property="og:description" content="Expertise in research and development for algorithmic trading with artificial intelligence and deep learning." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-black text-white overflow-x-hidden">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-lg border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />

                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Algo Lab
                </span>
              </motion.div>

              <div className="hidden md:flex space-x-8">
                {['Home', 'Services', 'Team', 'Projects', 'Contact'].map((item) => (
                  <motion.button
                    key={item}
                    whileHover={{ scale: 1.1, color: '#10b981' }}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-white/80 hover:text-emerald-400 transition-colors duration-300 font-medium"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-black/20"></div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
                animate={{
                  x: [0, Math.random() * 1000],
                  y: [0, Math.random() * 800],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                AG Algo Lab
              </h1>
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-white/90">
                Predict the Unpredictable
              </h2>
              <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
                Specializing in advanced predictions and the execution of high-performance Python pipelines
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleContactClick}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Discover our services
                </Button>
                <Button
                  variant="outline"
                  onClick={handleContactClick}
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-full"
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
                onClick={() => scrollToSection('services')}
                className="w-8 h-8 text-white/60 hover:text-emerald-400 transition-colors"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Innovative solutions in artificial intelligence for algorithmic trading
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'Deep Learning',
                description: 'Deep learning models for predictive analysis of financial markets',
                gradient: 'from-emerald-500 to-emerald-700',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Advanced Predictions',
                description: 'Sophisticated algorithms to anticipate market movements with precision',
                gradient: 'from-emerald-500 to-emerald-700',
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Python Pipelines',
                description: 'Development and optimization of high-performance execution pipelines',
                gradient: 'from-emerald-500 to-emerald-700',
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: 'Data Management',
                description: 'Real‑time processing and analysis of massive volumes of financial data',
                gradient: 'from-emerald-500 to-emerald-700',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Continuous Improvement',
                description: 'Continuous improvement of algorithm performance and precision',
                gradient: 'from-emerald-500 to-emerald-700',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Rapid Execution',
                description: 'Ultra-fast execution systems to seize market opportunities',
                gradient: 'from-emerald-500 to-emerald-700',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 3 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Our Team
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Passionate experts in artificial intelligence and quantitative finance
            </p>
          </motion.div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Anthony Gocmen',
                role: 'Founder',
                expertise: 'Deep Learning & Quantitative Finance',
                image: '/founder.png',
              },
              {
                name: 'Sarah Chen',
                role: 'Lead Data Scientist',
                expertise: 'Machine Learning & Predictive Analysis',
                image: 'https://images.unsplash.com/photo-1644424235476-295f24d5030d',
              },
              {
                name: 'Marc Dubois',
                role: 'Algorithm Engineer',
                expertise: 'Optimization & High-Frequency Trading',
                image: 'https://images.unsplash.com/photo-1644424235476-295f24d5030d',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-4">
                  <img src={member.image} alt={`Portrait of ${member.name}`} className="w-full h-full object-cover bg-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-emerald-400 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-white/70 text-sm">
                  {member.expertise}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Main Project
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The main project is the development of a predictive AI model for financial markets. Although still in progress, it already delivers results that confirm its potential. 
              For the moment, it remains confidential and not available for sale
            </p>
          </motion.div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
            {[
              {
                title: '1. Exploration & Training',
                description: 'Exploring promising ideas and preparing the foundations of the predictive model. Different approaches are tested, financial data is preprocessed, and initial versions of the AI are trained to identify valuable directions.',
                tech: ['Scikit-learn', 'TensorFlow', 'Pandas', 'Joblib'],
                image: '/exploration.png',
              },
              {
                title: '2. Optimization & Validation',
                description: 'Once a candidate model shows potential, it is refined through hyperparameter optimization, robustness checks, and extensive backtests. Scenarios are simulated, stability is measured, and adaptability to changing market conditions is assessed.',
                tech: ['Matplotlib', 'Scikit-learn', 'TensorFlow'],
                image: '/opti.png',
              },
              {
                title: '3. Live Market Deployment',
                description: 'The model is connected directly to live markets and tested under real conditions. The bot operates autonomously, executing trades and adapting continuously to market dynamics.',
                tech: ['MetaTrader 5', 'TensorFlow', 'Joblib'],
                image: '/orderfilled.png',
              },
              {
                title: 'Signal Transmission',
                description: 'The final step is the broadcasting of signals generated by the AI in real time. Predictions are transformed into actionable insights and delivered seamlessly through Telegram, APIs, or other platforms.',
                tech: ['Requests', 'Python-Telegram-Bot'],
                image: '/broadcasting.png',
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-700/20 rounded-full text-white text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Contact
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get in touch with us for collaborations or inquiries
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-8 text-white">Contact Information</h3>
              <div className="space-y-6">
                {[
                  { icon: <Mail className="w-6 h-6" />, label: 'Email', value: 'anthony.gocmen@gmail.com' },
                  { icon: <Phone className="w-6 h-6" />, label: 'Phone', value: '+33 6 51 87 13 74' },
                  { icon: <MapPin className="w-6 h-6" />, label: 'Address', value: '123 Avenue de l’Innovation, Paris' },
                ].map((contact, index) => (
                  <motion.div key={index} whileHover={{ x: 10 }} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">{contact.label}</p>
                      <p className="text-white font-semibold">{contact.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-white">Follow us</h4>
                <div className="flex space-x-5">
                  {[
                    { icon: <Github className="w-5 h-5" />, url: 'https://github.com/ag-algolab' },
                    { icon: <Linkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/anthony-gocmen' },
                    { icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com' },
                  ].map((social, index) => (
                    <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-8 text-white">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2">Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-emerald-600" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-emerald-600" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Subject</label>
                  <input type="text" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-emerald-600" placeholder="Subject of your message" />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Message</label>
                  <textarea rows="5" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-emerald-600" placeholder="Describe your project or your needs..."></textarea>
                </div>
                <Button
                  onClick={handleContactClick}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Send the message
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />

                <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Algo Lab
                </span>
              </div>
              <p className="text-white/60 text-center md:text-right">
                © {new Date().getFullYear()} AG Algo Lab. All rights reserved. | R&D in Algo Trading
              </p>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </>
  );
}

export default App;
