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
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
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
        <title>AG Algo Lab - R&D en Trading Algorithmique & Deep Learning</title>
        <meta name="description" content="AG Algo Lab est spécialisé dans la recherche et développement en trading algorithmique utilisant le deep learning. Nous nous concentrons sur les prédictions et l'exécution de pipelines en Python." />
        <meta property="og:title" content="AG Algo Lab - R&D en Trading Algorithmique & Deep Learning" />
        <meta property="og:description" content="Expertise en recherche et développement pour le trading algorithmique avec intelligence artificielle et deep learning." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-x-hidden">
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AG Algo Lab
                </span>
              </motion.div>
              
              <div className="hidden md:flex space-x-8">
                {['Accueil', 'Services', 'Équipe', 'Projets', 'Contact'].map((item, index) => (
                  <motion.button
                    key={item}
                    whileHover={{ scale: 1.1, color: '#06b6d4' }}
                    onClick={() => scrollToSection(item.toLowerCase().replace('é', 'e'))}
                    className="text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section id="accueil" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
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
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AG Algo Lab
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                Recherche & Développement en <span className="text-cyan-400 font-semibold">Trading Algorithmique</span> 
                <br />utilisant le <span className="text-purple-400 font-semibold">Deep Learning</span>
              </p>
              <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
                Spécialisés dans les prédictions avancées et l'exécution de pipelines Python haute performance
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleContactClick}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Découvrir nos services
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleContactClick}
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-full"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Voir nos projets
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
                className="animate-bounce"
              >
                <ChevronDown className="w-8 h-8 text-white/60 hover:text-cyan-400 transition-colors" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Nos Services
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Solutions innovantes en intelligence artificielle pour le trading algorithmique
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "Deep Learning",
                  description: "Modèles d'apprentissage profond pour l'analyse prédictive des marchés financiers",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Prédictions Avancées",
                  description: "Algorithmes sophistiqués pour anticiper les mouvements de marché avec précision",
                  gradient: "from-cyan-500 to-blue-500"
                },
                {
                  icon: <Code className="w-8 h-8" />,
                  title: "Pipelines Python",
                  description: "Développement et optimisation de pipelines d'exécution haute performance",
                  gradient: "from-green-500 to-teal-500"
                },
                {
                  icon: <Database className="w-8 h-8" />,
                  title: "Analyse de Données",
                  description: "Traitement et analyse de volumes massifs de données financières en temps réel",
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  icon: <Cpu className="w-8 h-8" />,
                  title: "Optimisation Algorithmique",
                  description: "Amélioration continue des performances et de la précision des algorithmes",
                  gradient: "from-indigo-500 to-purple-500"
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Exécution Rapide",
                  description: "Systèmes d'exécution ultra-rapides pour saisir les opportunités de marché",
                  gradient: "from-yellow-500 to-orange-500"
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="group relative"
                >
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="equipe" className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Notre Équipe
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Des experts passionnés en intelligence artificielle et finance quantitative
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Alexandre Girard",
                  role: "Directeur R&D",
                  expertise: "Deep Learning & Finance Quantitative",
                  image: "Portrait professionnel d'un directeur R&D en costume"
                },
                {
                  name: "Sarah Chen",
                  role: "Lead Data Scientist",
                  expertise: "Machine Learning & Analyse Prédictive",
                  image: "Portrait professionnel d'une data scientist"
                },
                {
                  name: "Marc Dubois",
                  role: "Ingénieur Algorithmes",
                  expertise: "Optimisation & Trading Haute Fréquence",
                  image: "Portrait professionnel d'un ingénieur en algorithmes"
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 p-1">
                      <img  
                        className="w-full h-full rounded-full object-cover bg-gray-300"
                        alt={`Portrait de ${member.name}`}
                       src="https://images.unsplash.com/photo-1644424235476-295f24d503d9" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-purple-400 font-semibold mb-3">
                      {member.role}
                    </p>
                    <p className="text-white/70 text-sm">
                      {member.expertise}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projets" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Nos Projets
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Innovations révolutionnaires en trading algorithmique et intelligence artificielle
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "AlgoPredict Pro",
                  description: "Système de prédiction avancé utilisant des réseaux de neurones profonds pour anticiper les mouvements de marché avec une précision de 87%.",
                  tech: ["Python", "TensorFlow", "Pandas", "NumPy"],
                  image: "Interface de trading avec graphiques et données en temps réel"
                },
                {
                  title: "TradingBot AI",
                  description: "Bot de trading autonome capable d'exécuter des stratégies complexes en temps réel sur multiple marchés simultanément.",
                  tech: ["Python", "PyTorch", "FastAPI", "Redis"],
                  image: "Dashboard de bot de trading avec métriques de performance"
                },
                {
                  title: "MarketSense Analytics",
                  description: "Plateforme d'analyse de sentiment de marché utilisant le NLP pour traiter des millions de données textuelles quotidiennement.",
                  tech: ["Python", "BERT", "Elasticsearch", "Kafka"],
                  image: "Visualisation de données de sentiment de marché"
                },
                {
                  title: "QuantumRisk Engine",
                  description: "Moteur de gestion des risques utilisant des algorithmes quantiques pour optimiser les portefeuilles d'investissement.",
                  tech: ["Python", "Qiskit", "Scikit-learn", "PostgreSQL"],
                  image: "Interface de gestion des risques avec graphiques quantiques"
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="h-48 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 relative overflow-hidden">
                      <img  
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={`Capture d'écran du projet ${project.title}`}
                       src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-white/70 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-sm text-cyan-300 border border-cyan-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Contactez-nous
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Prêt à révolutionner votre approche du trading ? Discutons de votre projet
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-8 text-white">Informations de contact</h3>
                <div className="space-y-6">
                  {[
                    { icon: <Mail className="w-6 h-6" />, label: "Email", value: "contact@agalgolab.com" },
                    { icon: <Phone className="w-6 h-6" />, label: "Téléphone", value: "+33 1 23 45 67 89" },
                    { icon: <MapPin className="w-6 h-6" />, label: "Adresse", value: "123 Avenue de l'Innovation, 75001 Paris" }
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                  <h4 className="text-lg font-semibold mb-4 text-white">Suivez-nous</h4>
                  <div className="flex space-x-4">
                    {[
                      { icon: <Github className="w-5 h-5" />, label: "GitHub" },
                      { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
                      { icon: <Twitter className="w-5 h-5" />, label: "Twitter" }
                    ].map((social, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        onClick={handleContactClick}
                        className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 transition-all duration-300"
                      >
                        {social.icon}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-bold mb-6 text-white">Envoyez-nous un message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-2">Nom</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Sujet</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Message</label>
                    <textarea 
                      rows="5"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                      placeholder="Décrivez votre projet ou vos besoins..."
                    ></textarea>
                  </div>
                  <Button 
                    onClick={handleContactClick}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Envoyer le message
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AG Algo Lab
                </span>
              </div>
              <p className="text-white/60 text-center md:text-right">
                © 2024 AG Algo Lab. Tous droits réservés. | R&D en Trading Algorithmique & Deep Learning
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
