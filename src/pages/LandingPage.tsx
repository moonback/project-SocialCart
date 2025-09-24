import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  Heart, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Camera,
  Gift,
  Shield,
  Zap,
  TrendingUp,
  Award,
  Clock,
  Target,
  Rocket,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingNavigation } from '../components/LandingNavigation';
import { ProductService, Product } from '../lib/products';
import { Constellation } from '../components/Constellation';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Refs pour les animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Scroll et parallaxe
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Animations spring
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const ySpring = useSpring(y, springConfig);
  
  // Intersection Observer pour les animations
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  
  // Effet de souris pour les interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Récupérer les produits tendance
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoadingProducts(true);
        const products = await ProductService.getProducts();
        // Prendre les 4 premiers produits les plus populaires (par likes_count et views_count)
        const trending = products
          .sort((a, b) => (b.likes_count + b.views_count) - (a.likes_count + a.views_count))
          .slice(0, 4);
        setTrendingProducts(trending);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        // En cas d'erreur, utiliser des produits par défaut
        setTrendingProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: "Shopping Social",
      description: "Découvrez des produits recommandés par votre communauté",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      stats: "10K+ produits partagés"
    },
    {
      icon: Camera,
      title: "Stories Produits",
      description: "Partagez vos achats et inspirez vos amis",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      stats: "50K+ stories créées"
    },
    {
      icon: Heart,
      title: "Wishlist Collaborative",
      description: "Créez des listes de souhaits avec vos proches",
      color: "from-red-500 to-rose-500",
      gradient: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
      stats: "25K+ wishlists actives"
    },
    {
      icon: Gift,
      title: "Système de Fidélité",
      description: "Gagnez des points et des récompenses exclusives",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      stats: "1M+ points distribués"
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Rejoignez des milliers d'utilisateurs passionnés",
      color: "from-indigo-500 to-blue-500",
      gradient: "bg-gradient-to-br from-indigo-500/20 to-blue-500/20",
      stats: "10K+ utilisateurs actifs"
    },
    {
      icon: Shield,
      title: "Sécurisé & Fiable",
      description: "Vos données sont protégées avec les meilleures pratiques",
      color: "from-gray-500 to-slate-500",
      gradient: "bg-gradient-to-br from-gray-500/20 to-slate-500/20",
      stats: "99.9% uptime"
    }
  ];

  const stats = [
    { 
      number: "10K+", 
      label: "Utilisateurs actifs",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      description: "Communauté grandissante"
    },
    { 
      number: "50K+", 
      label: "Produits partagés",
      icon: ShoppingBag,
      color: "from-purple-500 to-pink-500",
      description: "Découvertes quotidiennes"
    },
    { 
      number: "98%", 
      label: "Satisfaction client",
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      description: "Expérience exceptionnelle"
    },
    { 
      number: "24/7", 
      label: "Support disponible",
      icon: Clock,
      color: "from-green-500 to-emerald-500",
      description: "Toujours à votre écoute"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Influenceuse Mode",
      content: "SocialCart a révolutionné ma façon de découvrir de nouveaux produits. La communauté est incroyable et les recommandations sont toujours spot-on !",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      verified: true,
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Marc L.",
      role: "Tech Enthusiast",
      content: "L'interface est intuitive et les recommandations sont toujours pertinentes. Je recommande vivement cette plateforme !",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      verified: true,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Emma K.",
      role: "Maman Active",
      content: "Parfait pour organiser mes achats et découvrir des produits testés par d'autres mamans. Une vraie communauté !",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      verified: true,
      color: "from-green-500 to-emerald-500"
    }
  ];

  // Fonction pour obtenir l'image par défaut si aucune image n'est disponible
  const getProductImage = (product: Product) => {
    if (product.primary_image_url) {
      return product.primary_image_url;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Image par défaut selon la catégorie
    return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop";
  };

  // Images d'interface pour la démonstration
  const interfaceImages = [
    {
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=600&fit=crop",
      title: "Interface Mobile",
      description: "Application mobile intuitive"
    },
    {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      title: "Dashboard Web",
      description: "Tableau de bord complet"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Constellation interactive */}
      <Constellation />
      
      {/* Background decorations avec effets glassmorphism cohérents */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Formes géométriques flottantes avec couleurs de marque bleue cohérente */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl"
          style={{ y: ySpring }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl"
          style={{ y: ySpring }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/25 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Effet de souris interactif avec couleurs de marque */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3,
            y: mousePosition.y * 0.3,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
        
        {/* Particules avec couleurs de marque bleue cohérente */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-300/80 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Grille de fond subtile avec couleur bleue cohérente */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Navigation */}
      <LandingNavigation />

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        id="hero"
        className="relative z-10 px-6 py-20 pt-32"
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge de nouveauté avec design cohérent */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center text-white px-6 py-3 bg-white/10 backdrop-blur-xl border border-blue-200/40 rounded-2xl text-blue-100 text-sm font-semibold mb-6 shadow-2xl shadow-blue-500/20"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 8px 32px rgba(59, 130, 246, 0.3)",
                  "0 12px 40px rgba(59, 130, 246, 0.4)",
                  "0 8px 32px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 mr-2 text-white" />
              Nouveau : Stories Produits
              <Rocket className="w-4 h-4 ml-2 text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              animate={heroInView ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                background: "linear-gradient(45deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Shopping{' '}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                animate={heroInView ? {
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Social
              </motion.span>
              <br />
              <motion.span
                className="text-white"
                animate={heroInView ? {
                  textShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.6)",
                    "0 0 40px rgba(59, 130, 246, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.6)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Réinventé
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Découvrez, partagez et achetez avec votre communauté. 
              Une expérience shopping unique où chaque produit raconte une histoire.
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center space-x-3 transition-all duration-300 overflow-hidden"
              animate={heroInView ? {
                boxShadow: [
                  "0 8px 32px rgba(59, 130, 246, 0.3)",
                  "0 12px 40px rgba(59, 130, 246, 0.4)",
                  "0 8px 32px rgba(59, 130, 246, 0.3)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Effet de brillance */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
            
           
          </motion.div>


          {/* Démonstration de produits avec images */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white mb-8 text-center"
              animate={heroInView ? {
                textShadow: [
                  "0 0 20px rgba(14, 165, 233, 0.3)",
                  "0 0 30px rgba(14, 165, 233, 0.5)",
                  "0 0 20px rgba(14, 165, 233, 0.3)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Découvrez nos produits tendance
            </motion.h3>
            
            {loadingProducts ? (
              <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                {[...Array(4)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="relative w-48 h-64 rounded-2xl bg-white/10 backdrop-blur-xl border border-blue-200/30 animate-pulse"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  >
                    <div className="w-full h-full bg-gray-300 rounded-2xl" />
                  </motion.div>
                ))}
              </div>
            ) : trendingProducts.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                {trendingProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group relative cursor-pointer"
                    initial={{ opacity: 0, y: 20, rotateY: -15 }}
                    animate={heroInView ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 20, rotateY: -15 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      rotateY: 5
                    }}
                    style={{ perspective: "1000px" }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative w-48 h-64 rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl border border-blue-200/30">
                      <img 
                        src={getProductImage(product)} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badge de prix */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {product.price.toFixed(2)}€
                      </div>
                      
                      {/* Overlay avec informations du produit */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="text-sm font-semibold mb-1 line-clamp-2">{product.name}</div>
                        <div className="flex items-center justify-between text-xs opacity-80">
                          <span>{product.seller?.username || 'Vendeur'}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{product.rating_average.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span>{product.likes_count}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-3 h-3 text-blue-400" />
                            <span>{product.views_count}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Effet de brillance au hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    
                    {/* Effet de halo */}
                    <motion.div
                      className="absolute inset-0 w-48 h-64 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-blue-200">
                <p>Aucun produit disponible pour le moment</p>
              </div>
            )}
          </motion.div>

          {/* Stats améliorées */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5
                }}
              >
                <motion.div
                  className="relative mb-4"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Effet de halo au hover */}
                  <motion.div
                    className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto blur-xl opacity-0 group-hover:opacity-35 transition-opacity duration-300"
                  />
                </motion.div>
                
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  animate={heroInView ? {
                    textShadow: [
                      "0 0 10px rgba(59, 130, 246, 0.4)",
                      "0 0 20px rgba(59, 130, 246, 0.6)",
                      "0 0 10px rgba(59, 130, 246, 0.4)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-blue-200 text-sm md:text-base font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-blue-300 text-xs opacity-80">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section améliorée */}
      <motion.section 
        ref={featuresRef}
        id="features"
        className="relative z-10 px-6 py-20"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-blue-200/40 rounded-2xl text-blue-100 text-sm font-semibold mb-6 shadow-2xl shadow-blue-500/20"
              animate={featuresInView ? {
                boxShadow: [
                  "0 8px 32px rgba(59, 130, 246, 0.3)",
                  "0 12px 40px rgba(59, 130, 246, 0.4)",
                  "0 8px 32px rgba(59, 130, 246, 0.3)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target className="w-4 h-4 mr-2 text-blue-400" />
              Fonctionnalités Premium
              <Award className="w-4 h-4 ml-2 text-blue-400" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl text-white font-bold mb-6">
              Pourquoi choisir{' '}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
                animate={featuresInView ? {
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                SocialCart
              </motion.span> ?
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Une plateforme complète qui transforme votre expérience d'achat en aventure sociale
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="relative bg-white/10 backdrop-blur-xl border border-blue-200/30 rounded-3xl p-8 h-full transition-all duration-300 hover:bg-white/15 hover:border-blue-300/40 overflow-hidden shadow-2xl shadow-blue-500/10"
                  animate={hoveredFeature === index ? {
                    boxShadow: [
                      "0 8px 32px rgba(59, 130, 246, 0.2)",
                      "0 12px 40px rgba(59, 130, 246, 0.3)",
                      "0 8px 32px rgba(59, 130, 246, 0.2)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Effet de brillance au hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/15 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={hoveredFeature === index ? { x: "100%" } : { x: "-100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <motion.div
                    className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                    {/* Effet de halo */}
                    <motion.div
                      className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-35 transition-opacity duration-300"
                    />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-blue-200 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Statistique de la fonctionnalité */}
                  <motion.div
                    className="flex items-center text-sm text-blue-400 opacity-80"
                    initial={{ opacity: 0 }}
                    animate={hoveredFeature === index ? { opacity: 1 } : { opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {feature.stats}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interface Demo Section */}
      <motion.section 
        id="demo"
        className="relative z-10 px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-blue-200/40 rounded-2xl text-blue-100 text-sm font-semibold mb-6 shadow-2xl shadow-blue-500/20"
              animate={{
                boxShadow: [
                  "0 8px 32px rgba(59, 130, 246, 0.3)",
                  "0 12px 40px rgba(59, 130, 246, 0.4)",
                  "0 8px 32px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Monitor className="w-4 h-4 mr-2 text-blue-400" />
              Interface Démo
              <Smartphone className="w-4 h-4 ml-2 text-blue-400" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Découvrez l'interface{' '}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                SocialCart
              </motion.span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Une expérience utilisateur moderne et intuitive, disponible sur tous vos appareils
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Mobile */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            >
              <motion.div
                className="relative mx-auto w-80 h-96 bg-white/10 backdrop-blur-xl border border-blue-200/30 rounded-3xl p-4 shadow-2xl"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5
                }}
                style={{ perspective: "1000px" }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img 
                    src={interfaceImages[0].url} 
                    alt={interfaceImages[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Effet de brillance */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
              
              {/* Effet de halo */}
              <motion.div
                className="absolute inset-0 w-80 h-96 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl mx-auto blur-2xl opacity-25"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold text-white mb-2">{interfaceImages[0].title}</h3>
                <p className="text-blue-200">{interfaceImages[0].description}</p>
              </div>
            </motion.div>

            {/* Image Desktop */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              <motion.div
                className="relative mx-auto w-full max-w-lg h-64 bg-white/10 backdrop-blur-xl border border-blue-200/30 rounded-3xl p-4 shadow-2xl"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5
                }}
                style={{ perspective: "1000px" }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img 
                    src={interfaceImages[1].url} 
                    alt={interfaceImages[1].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Effet de brillance */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                />
              </motion.div>
              
              {/* Effet de halo */}
              <motion.div
                className="absolute inset-0 w-full max-w-lg h-64 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl mx-auto blur-2xl opacity-25"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
              
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold text-white mb-2">{interfaceImages[1].title}</h3>
                <p className="text-blue-200">{interfaceImages[1].description}</p>
              </div>
            </motion.div>
          </div>

          {/* Features de l'interface */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
          >
            <motion.div
              className="text-center group"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mobile First</h3>
              <p className="text-blue-200">Interface optimisée pour mobile avec gestes intuitifs</p>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Responsive Design</h3>
              <p className="text-blue-200">Adaptation parfaite sur tous les écrans</p>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Performance</h3>
              <p className="text-blue-200">Chargement rapide et animations fluides</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials"
        className="relative z-10 px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ce que disent nos{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                utilisateurs
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Effet de brillance au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Avatar avec image */}
                <div className="relative mb-6">
                  <motion.div
                    className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-white/20 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Badge de vérification */}
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                  
                  {/* Effet de halo */}
                  <motion.div
                    className="absolute inset-0 w-16 h-16 bg-gradient-primary rounded-full mx-auto blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  />
                </div>
                
                {/* Étoiles de notation */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 2.2 + index * 0.1 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-blue-100 mb-6 leading-relaxed text-center">
                  "{testimonial.content}"
                </p>
                
                <div className="text-center">
                  <div className="text-white font-semibold mb-1">{testimonial.name}</div>
                  <div className="text-blue-300 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about"
        className="relative z-10 px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-blue-200/30 rounded-3xl p-12 shadow-2xl shadow-blue-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              À propos de{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SocialCart
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              SocialCart révolutionne l'expérience d'achat en ligne en créant une communauté 
              où chaque produit raconte une histoire. Notre mission est de rendre le shopping 
              plus social, plus authentique et plus engageant.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.6 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Communauté</h3>
                <p className="text-blue-200">Plus de 10 000 utilisateurs actifs</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.8 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Qualité</h3>
                <p className="text-blue-200">98% de satisfaction client</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 3.0 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sécurité</h3>
                <p className="text-blue-200">Données protégées et sécurisées</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative z-10 px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.2 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-blue-200/30 rounded-3xl p-12 shadow-2xl shadow-blue-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à rejoindre la{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                révolution
              </span> ?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui transforment déjà leur façon de shopper
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-xl shadow-2xl shadow-blue-500/30 flex items-center space-x-3 mx-auto transition-all duration-300"
            >
              <Sparkles className="w-6 h-6" />
              <span>Créer mon compte gratuit</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>

            <div className="mt-8 flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Gratuit pour toujours</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Support 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 px-6 py-12 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.6 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-white text-lg font-semibold">SocialCart</span>
          </div>
          <p className="text-blue-200 text-sm">
            © 2024 SocialCart. Tous droits réservés. Révolutionnez votre shopping.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
