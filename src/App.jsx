import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, Cpu, BarChart3, Users, Mail, Phone, MapPin,
  Github, Linkedin, Twitter, ChevronDown, Play, Code, Database, Zap
} from 'lucide-react';
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

  // Navigation IDs propres (pas d'espaces)
  const NAV = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'founder', label: 'Founder' },
    { id: 'main-project', label: 'Main Project' },
    { id: 'knowledge-hub', label: 'Knowledge Hub' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>AG Algo Lab - Predict the Unpredictable</title>
        <meta
          name="description"
          content="AG Algo Lab specializes in research and development in algorithmic trading using deep learning. We focus on advanced predictions and high-performance Python execution pipelines."
        />
        <meta property="og:title" content="AG Algo Lab - Predict the Unpredictable" />
        <meta property="og:description" content="Expertise in research and development for algorithmic trading with artificial intelligence and deep learning." />
      </Helmet>

      {/* Fond global : gradient violet → bleu */}
      <div className="min-h-screen bg-gradient-to-br from-brand.purpleDark via-brand.purple to-brand.blueDeep text-white overflow-x-hidden">

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
                <span className="text-xl font-bold bg-gradient-to-r from-brand.purpleLite to-brand.blue bg-clip-text text-transparent">
                  Algo Lab
                </span>
              </motion.div>

              <div className="hidden md:flex space-x-8">
                {NAV.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.1, color: 'hsl(var(--accent))' }}
                    onClick={() => scrollToSection(id)}
                    className="text-white/80 hover:text-accent transition-colors duration-300 font-medium"
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
          {/* léger overlay pour le contraste */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand.purpleDark/20 to-black/20"></div>

          {/* Particules */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: i % 2 ? 'hsl(var(--brand-purple) / 0.30)' : 'hsl(var(--brand-blue) / 0.30)' }}
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
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-brand.purpleLite via-brand.purple to-brand.blue bg-clip-text text-transparent">
                AG Algo Lab
              </h1>
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-white/90">
                Predict the Unpredictable
              </h2>
              <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
                Specializing in advanced predictions and the execution of high-performance Python pipelines
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* CTA principal plein (gradient) */}
                <Button
                  onClick={handleContactClick}
                  className="bg-gradient-to-r from-brand.purple to-brand.blue hover:from-brand.purpleLite hover:to-brand.blueDeep text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Discover our services
                </Button>

                {/* CTA secondaire outline */}
                <Button
                  variant="outline"
                  onClick={handleContactClick}
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-accent px-8 py-3 text-lg font-semibold rounded-full"
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
                className="w-8 h-8 text-white/60 hover:text-accent transition-colors"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand.purpleLite to-brand.blue bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Innovative solutions in artificial intelligence for algorithmic trading
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="w-8 h-8" />, title: 'Deep Learning', description: 'Deep learning models for predictive analysis of financial markets', gradient: 'from-brand.purple to-brand.blue' },
              { icon: <TrendingUp className="w-8 h-8" />, title: 'Advanced Predictions', description: 'Sophisticated algorithms to anticipate market movements with precision', gradient: 'from-brand.purple to-brand.blue' },
              { icon: <Code className="w-8 h-8" />, title: 'Python Pipelines', description: 'Development and optimization of high-performance execution pipelines', gradient: 'from-brand.purple to-brand.blue' },
              { icon: <Database className="w-8 h-8" />, title: 'Data Management', description: 'Real-time processing and analysis of massive volumes of financial data', gradient: 'from-brand.purple to-brand.blue' },
              { icon: <BarChart3 className="w-8 h-8" />, title: 'Continuous Improvement', description: 'Continuous improvement of algorithm performance and precision', gradient: 'from-brand.purple to-brand.blue' },
              { icon: <Zap className="w-8 h-8" />, title: 'Rapid Execution', description: 'Ultra-fast execution systems to seize market opportunities', gradient: 'from-brand.purple to-brand.blue' },
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
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
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
        <section id="founder" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand.purpleLite to-brand.blue bg-clip-text text-transparent">
              Founder
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Passionate experts in artificial intelligence and quantitative finance
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Anthony Gocmen', role: 'Founder', expertise: 'Deep Learning & Quantitative Finance', image: '/founder.png' },
              { name: 'Sarah Chen', role: 'Lead Data Scientist', expertise: 'Machine Learning & Predictive Analysis', image: 'https://images.unsplash.com/photo-1644424235476-295f24d5030d' },
              { name: 'Marc Dubois', role: 'Algorithm Engineer', expertise: 'Optimization & High-Frequency Trading', image: 'https://images.unsplash.com/photo-1644424235476-295f24d5030d' },
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
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
                  {member.name}
                </h3>
                <p className="text-brand.purpleLite font-semibold mb-3">
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
        <section id="main-project" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand.purpleLite to-brand.blue bg-clip-text text-transparent">
              Main Project
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The main project is the development of a predictive AI model for financial markets. Although still in progress, it already delivers results that confirm its potential.
              For the moment, it remains confidential and not available for sale
              <br />
              <br />
              The project builds on a four-step cycle, structured as follows:
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
                title: '4. Signal Transmission',
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
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gradient-to-r from-brand.purple/20 to-brand.blue/20 rounded-full text-white text-xs"
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
        <section id="knowledge-hub" className="py-20 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand.purpleLite to-brand.blue bg-clip-text text-transparent">
              Knowledge Hub
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Latest videos on Algorithmic Trading, Python, and Deep Learning.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            {/* Chaine 1 */}
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
                  className="text-brand.purple hover:text-brand.purpleLite hover:underline"
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

            {/* Chaine 2 */}
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
                  className="text-brand.purple hover:text-brand.purpleLite hover:underline"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand.purpleLite to-brand.blue bg-clip-text text-transparent">
              Contact
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get in touch with us for collaborations or inquiries
            </p>
          </motion.div>

          {/* Deux cartes centrées : Phone / Email */}
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
                    <p className="text-white font-semibold group-hover:text-accent transition">
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
                    <p className="text-white font-semibold group-hover:text-accent transition">
                      anthony.gocmen@gmail.com
                    </p>
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Réseaux sociaux */}
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
                  { icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand.purple transition"
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
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                <span className="text-lg font-bold bg-gradient-to-r from-brand.purpleLite to-brand.blue bg-clip-text text-transparent">
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
