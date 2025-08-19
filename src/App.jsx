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

      <div className="min-h-screen bg-gradient-to-br from-[#3C0D66] via-[#6E2FCF] to-[#0D47A1] text-white overflow-x-hidden">
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
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />

                <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
                  Algo Lab
                </span>
              </motion.div>

              <div className="hidden md:flex space-x-8">
                {['Home', 'Services', 'Founder', 'Main Project', 'Knowledge Hub', 'Contact'].map((item) => (
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
                className="absolute w-2 h-2 bg-[#6E2FCF]/30 rounded-full"
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
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
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
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-[#9D7AF5] px-8 py-3 text-lg font-semibold rounded-full"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
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
                gradient: 'from-[#6E2FCF] to-[#2A3BB7]',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Advanced Predictions',
                description: 'Sophisticated algorithms to anticipate market movements with precision',
                gradient: 'from-[#6E2FCF] to-[#2A3BB7]',
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Python Pipelines',
                description: 'Development and optimization of high-performance execution pipelines',
                gradient: 'from-[#6E2FCF] to-[#2A3BB7]',
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: 'Data Management',
                description: 'Real‑time processing and analysis of massive volumes of financial data',
                gradient: 'from-[#6E2FCF] to-[#2A3BB7]',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Continuous Improvement',
                description: 'Continuous improvement of algorithm performance and precision',
                gradient: 'from-[#6E2FCF] to-[#2A3BB7]',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Rapid Execution',
                description: 'Ultra-fast execution systems to seize market opportunities',
                gradient: 'from-[#6E2FCF] to-[#2A3BB7]',
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

        {/* Founder Section */}
        <section id="founder" className="py-20 bg-black/20">
          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              Founder
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Artificial Intelligence & Quantitative Finance
            </p>
          </motion.div>
        
          {/* Grid : 1/3 (gauche) + 2/3 (droite) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        
            {/* Colonne Gauche — Card portrait + “data” */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20"
            >

            {/* Photo avec bordure gradient cyan-violet */}
            <div className="w-40 h-40 mx-auto rounded-xl overflow-hidden mb-4 p-[3px] bg-gradient-to-r from-cyan-400 to-violet-500 shadow-lg">
              <div className="w-full h-full rounded-xl overflow-hidden border border-black/80">
                <img
                  src="/founder.png"
                  alt="Portrait of Anthony Gocmen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
        
              {/* Nom / Rôle */}
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white">Anthony Gocmen</h3>
              </div>
        
      
              <div className="mt-6 rounded-lg bg-black p-3 border border-white/20 font-mono text-[13px] leading-6 text-green-400 space-y-1">
                <div className="flex items-center gap-2">
                  <span>[SKILLS] Python · Pandas · Numpy · TensorFlow</span>
                  <img src="/logos/python.png" alt="Python" className="w-5 h-5" />
                  <img src="/logos/pandas.png" alt="Pandas" className="w-5 h-5" />
                  <img src="/logos/numpy.png" alt="Numpy" className="w-5 h-5" />
                  <img src="/logos/tensorflow.png" alt="TensorFlow" className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span>[TOOLS] MetaTrader 5 · PyPi</span>
                  <img src="/logos/mt5.png" alt="MetaTrader 5" className="w-5 h-5" />
                  <img src="/logos/pypi.png" alt="PyPi" className="w-5 h-5" />
                </div>


              
              </div>


            </motion.div>
        
            {/* Colonne Droite — Bloc x2 avec la phrase */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#8B5CF6]/20 via-transparent to-[#3B82F6]/20 blur-3xl rounded-3xl" />
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/10 hover:border-white/20 shadow-xl">
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  <span className="block">
                    AG AlgoLab is currently led by its founder, Anthony Gocmen, who drives all research and development activities. <br /><br />
                    He is pursuing a Master’s degree in Finance at Université Paris Dauphine (PSL), with a strong academic foundation
                    in quantitative finance and artificial intelligence. <br /><br />
                    In 2025, he won the Space Hackathon organized by Arizona State University, showcasing his ability to combine innovation, data, and advanced modeling in real-world challenges.
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Projects Section */}
        <section id="Main Project" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              Main Project
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The main project is the development of a predictive AI model for financial markets. Although still in progress, it already delivers results that confirm its potential.
              For the moment, it remains confidential and not available for sale
              < br/>
              < br/>
              The project builds on a four-step cycle, structured as follows:
            </p>
          </motion.div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
            {[
              {
                title: '1. Exploration & Training',
                description: 'Exploring promising ideas and preparing the foundations of the predictive model. Different approaches are tested, financial data is preprocessed, and initial versions of the AI are trained to identify valuable directions.',
                tech: ['Scikit-learn', 'TensorFlow', 'Pandas', 'Joblib'],
                image: '/exploration.jpg',
              },
              {
                title: '2. Optimization & Validation',
                description: 'Once a candidate model shows potential, it is refined through hyperparameter optimization, robustness checks, and extensive backtests. Scenarios are simulated, stability is measured, and adaptability to changing market conditions is assessed.',
                tech: ['Matplotlib', 'Scikit-learn', 'TensorFlow'],
                image: '/opti.jpg',
              },
              {
                title: '3. Live Market Deployment',
                description: 'The model is connected directly to live markets and tested under real conditions. The bot operates autonomously, executing trades and adapting continuously to market dynamics.',
                tech: ['MetaTrader 5', 'TensorFlow', 'Joblib'],
                image: '/orderfilled.jpg',
              },
              {
                title: '4. Signal Transmission',
                description: 'The final step is the broadcasting of signals generated by the AI in real time. Predictions are transformed into actionable insights and delivered seamlessly through Telegram, APIs, or other platforms.',
                tech: ['Requests', 'Python-Telegram-Bot'],
                image: '/broadcasting.jpg',
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
                        className="px-3 py-1 bg-gradient-to-r from-[#6E2FCF]/20 to-[#2A3BB7]/20 rounded-full text-white text-xs"
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


        {/* Knowledge Hub */}
        <section id="knowledge hub" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              Knowledge Hub
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Latest videos on Algorithmic Trading, Python, and Deep Learning.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            {/* Chaîne 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">English Channel</h3>
                <a
                  href="https://www.youtube.com/@ag_algolab"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6E2FCF] hover:text-[#9D7AF5] hover:underline"
                >
                  Visit channel →
                </a>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/videoseries?list=UUto-h4A_cbDnivcjJWDuFxg&modestbranding=1&rel=0"
                  title="YouTube Uploads – Channel En"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>

            {/* Chaîne 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">French Channel</h3>
                <a
                  href="https://www.youtube.com/@ag_algolab_fr"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6E2FCF] hover:text-[#9D7AF5] hover:underline"
                >
                  Visit channel →
                </a>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/videoseries?list=UUl8YYrmlWMsemuq4TvXnkZQ&modestbranding=1&rel=0"
                  title="YouTube Uploads – Channel 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              Contact
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get in touch with us for collaborations or inquiries
            </p>
          </motion.div>

          {/* Deux cartes centrées : Phone (gauche) / Email (droite) */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Phone */}
              <motion.a
                href="tel:+33651871374"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="block p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Phone</p>
                    <p className="text-white font-semibold group-hover:text-emerald-400 transition">
                      +33 6 51 87 13 74
                    </p>
                  </div>
                </div>
              </motion.a>

              {/* Email */}
              <motion.a
                href="mailto:anthony.gocmen@gmail.com"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="block p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white font-semibold group-hover:text-emerald-400 transition">
                      anthony.gocmen@gmail.com
                    </p>
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Réseaux sociaux, centrés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <h4 className="text-lg font-semibold mb-4 text-white text-center">Follow us</h4>
              <div className="flex items-center justify-center space-x-5">
                {[
                  { icon: <Github className="w-5 h-5" />, url: 'https://github.com/ag-algolab' },
                  { icon: <Linkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/anthony-gocmen' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>


        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />

                <span className="text-lg font-bold bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
                  Algo Lab
                </span>
              </div>
              <p className="text-white/60 text-center md:text-right">
                © {new Date().getFullYear()} AG Algo Lab. All rights reserved. | Predict the Unpredictable
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
