import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ShahMat from "./pages/ShahMat"; 
import FraudRiskScoring from "./pages/FraudRiskScoring";

import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ChevronDown, ExternalLink, Play } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

/* ================= TECH ORBIT COMPONENT ================= */
function TechOrbit() {
  const techs = [
    { name: "Python", logo: "/logos/python.png" },
    { name: "TensorFlow", logo: "/logos/tensorflow.png" },
    { name: "Pandas", logo: "/logos/pandas.png" },
    { name: "NumPy", logo: "/logos/numpy.png" },
    { name: "MetaTrader", logo: "/logos/mt5.png" },
    { name: "PyPI", logo: "/logos/pypi.png" },
  ];

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)]">
          <img src="/logo.jpg" alt="AG Algo Lab" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain" />
        </div>
      </div>
      
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '30s' }}>
        {techs.map((tech, i) => {
          const angle = (i / techs.length) * 360;
          const radius = 120;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={tech.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center shadow-lg hover:border-white/30 transition-all duration-300 hover:scale-110"
                style={{ animation: 'counter-spin 30s linear infinite' }}
              >
                <img src={tech.logo} alt={tech.name} className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute inset-[30px] rounded-full border border-white/5" />
      <div className="absolute inset-[60px] rounded-full border border-dashed border-white/5" />
      
      <style>{`
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}

/* ================= PROJECT CARD ================= */
function ProjectCard({ title, description, tech, image, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-[#141f38] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141f38] via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[#b7c3e6] text-sm leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tech.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================= FEATURE CARD ================= */
function FeatureCard({ title, description, href, icon, color }) {
  const colorClasses = {
    green: {
      border: "hover:border-green-500/50",
      glow: "group-hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]",
      icon: "bg-green-500/20 text-green-400 group-hover:bg-green-500/30",
      text: "group-hover:text-green-400"
    },
    blue: {
      border: "hover:border-blue-500/50",
      glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
      icon: "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30",
      text: "group-hover:text-blue-400"
    },
  };
  
  const c = colorClasses[color] || colorClasses.blue;

  return (
    <Link to={href} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`relative bg-[#141f38] rounded-2xl p-6 border border-white/10 ${c.border} ${c.glow} transition-all duration-500`}
      >
        <div className={`w-14 h-14 rounded-xl ${c.icon} flex items-center justify-center mb-4 transition-all duration-300`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold mb-2 text-white ${c.text} transition-colors duration-300`}>
          {title}
        </h3>
        <p className="text-[#b7c3e6] text-sm leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
          <span className="text-sm font-medium">Explore</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}

/* ================= KAGGLE ICON ================= */
function KaggleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.075.339"/>
    </svg>
  );
}

/* ================= HOME PAGE ================= */
function Home() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', to: 'home' },
    { label: 'Founder', to: 'founder' },
    { label: 'Projects', to: 'projects' },
    { label: 'Knowledge Hub', to: 'knowledge-hub' },
    { label: 'Contact', to: 'contact' },
  ];

  return (
    <>
      <Helmet>
        <title>AG Algo Lab - Predict the Unpredictable</title>
        <meta name="description" content="AG Algo Lab specializes in research and development in algorithmic trading using deep learning." />
        <link rel="icon" type="image/jpg" href="/logo.jpg" />
      </Helmet>

      <div className="min-h-screen bg-[#0e1424] text-[#e7ecff]">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-[#0e1424]/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AG Algo Lab
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.to)}
                    className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 text-sm font-medium text-white/80">
                    AI · Trading · Deep Learning
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    AG Algo Lab
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl font-light text-white/70 italic mb-8">
                  Predict the Unpredictable
                </p>
                
                <p className="text-lg text-[#b7c3e6] max-w-xl mb-10 leading-relaxed">
                  Research and development in algorithmic trading using deep learning. 
                  Building advanced prediction models and high-performance execution pipelines.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/shahmat"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-300 font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      ♟️ ShahMat Chess
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                  <Link
                    to="/fraud-risk-scoring"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      📊 Fraud Risk Scoring
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <TechOrbit />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <button
                onClick={() => scrollToSection('founder')}
                className="text-white/30 hover:text-white/60 transition-colors animate-bounce"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Founder Section */}
        <section id="founder" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                Founder
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#141f38] rounded-2xl p-8 md:p-10 border border-white/10 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                    <img 
                      src="/founder.png" 
                      alt="Anthony Gocmen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">Anthony Gocmen</h3>
                  <div className="space-y-3 text-[#b7c3e6] leading-relaxed">
                    <p>
                      AG AlgoLab is led by Anthony Gocmen, Master in Finance student at <span className="text-white font-medium">Université Paris Dauphine (PSL)</span>, specializing in Python-based ML, deep learning, and quantitative modeling.
                    </p>
                    <p>
                      Work focuses on risk and financial applications, including insurance fraud detection, and has been recognized in competitions such as the <span className="text-white font-medium">'2025 Space Hackathon 4 Sustainability'</span> (1st Place).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
                Main Project
              </h2>
              <p className="text-lg text-[#b7c3e6] max-w-3xl mx-auto leading-relaxed">
                The main project is the development of a predictive AI model for financial markets. 
                Although still in progress, it already delivers results that confirm its potential.
              </p>
              <p className="text-white/50 mt-4 text-sm">
                For the moment, it remains confidential and not available for sale.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-20">
              {[
                {
                  title: '1. Exploration & Training',
                  description: 'Exploring promising ideas and preparing the foundations of the predictive model. Different approaches are tested, financial data is preprocessed, and initial versions of the AI are trained.',
                  tech: ['Scikit-learn', 'TensorFlow', 'Pandas'],
                  image: '/exploration.jpg',
                },
                {
                  title: '2. Optimization & Validation',
                  description: 'Once a candidate model shows potential, it is refined through hyperparameter optimization, robustness checks, and extensive backtests.',
                  tech: ['Matplotlib', 'Scikit-learn', 'TensorFlow'],
                  image: '/opti.jpg',
                },
                {
                  title: '3. Live Market Deployment',
                  description: 'The model is connected directly to live markets and tested under real conditions. The bot operates autonomously, executing trades.',
                  tech: ['MetaTrader 5', 'TensorFlow', 'Joblib'],
                  image: '/orderfilled.jpg',
                },
                {
                  title: '4. Signal Transmission',
                  description: 'The final step is the broadcasting of signals generated by the AI in real time through Telegram, APIs, or other platforms.',
                  tech: ['Requests', 'Python-Telegram-Bot'],
                  image: '/broadcasting.jpg',
                },
              ].map((project, index) => (
                <ProjectCard key={index} {...project} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Other Projects
              </h3>
              <p className="text-[#b7c3e6]">
                Explore our open-source projects and research
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                title="ShahMat Chess Engine"
                description="A custom-built chess engine showcasing algorithmic thinking and game theory implementation."
                href="/shahmat"
                icon={<span className="text-2xl">♟️</span>}
                color="green"
              />
              <FeatureCard
                title="Fraud Risk Scoring"
                description="AI-driven insurance fraud detection combining CatBoost with isotonic calibration for reliable risk scores."
                href="/fraud-risk-scoring"
                icon={<span className="text-2xl">📊</span>}
                color="blue"
              />
            </div>
          </div>
        </section>

        {/* Knowledge Hub Section */}
        <section id="knowledge-hub" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                Knowledge Hub
              </h2>
              <p className="text-2xl italic text-white/80 mb-6">
                "Make finance tech accessible to everyone"
              </p>
              <p className="text-lg text-[#b7c3e6] max-w-2xl mx-auto">
                I share videos on YouTube in both French and English, covering Python for Finance, Algorithmic Trading, and Deep Learning applied to Finance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-white text-lg font-semibold">English Channel</h3>
                  </div>
                  <a
                    href="https://www.youtube.com/@ag_algolab"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden border border-white/5">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/CSs9krvlyj4"
                    title="YouTube Uploads – English"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-white text-lg font-semibold">French Channel</h3>
                  </div>
                  <a
                    href="https://www.youtube.com/@ag_algolab_fr"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden border border-white/5">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/1T5wj09N0nE"
                    title="YouTube Uploads – French"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                Contact
              </h2>
              <p className="text-lg text-[#b7c3e6]">
                Get in touch for collaborations or inquiries
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <motion.a
                href="tel:+21655906954"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Phone (WhatsApp)</p>
                    <p className="text-white font-semibold group-hover:text-green-400 transition-colors">
                      +216 55 906 954
                    </p>
                  </div>
                </div>
              </motion.a>

              <motion.a
                href="mailto:anthony.gocmen@gmail.com"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="group bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      anthony.gocmen@gmail.com
                    </p>
                  </div>
                </div>
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-white/50 text-sm mb-4">Follow & Connect</p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://github.com/ag-algolab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <Github className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/in/anthony-gocmen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <Linkedin className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                </a>
                <a
                  href="https://www.kaggle.com/anthonygocmen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <KaggleIcon className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                <span className="text-sm text-[#b7c3e6]">AG Algo Lab — Building intelligent systems</span>
              </div>
              <div className="text-white/40 text-sm text-center md:text-right">
                <p>© {new Date().getFullYear()} AG Algo Lab. All rights reserved.</p>
                <p>Registered in France – Company Registration No. 935 081 703</p>
              </div>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shahmat" element={<ShahMat />} />
      <Route path="/fraud-risk-scoring" element={<FraudRiskScoring />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
