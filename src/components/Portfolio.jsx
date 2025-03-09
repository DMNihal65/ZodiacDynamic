import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ExternalLink, Github, ArrowRight, Globe, Code2, Cpu, Star, 
  Users, BarChart3, Zap, Award, Clock, Sparkles, Rocket, 
  Lightbulb, ChevronRight, X, Eye, Smartphone, Server
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

// Enhanced project data with more details
const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management and AI-powered recommendations.",
    longDescription: "We developed a comprehensive e-commerce platform that integrates seamlessly with existing inventory systems while providing cutting-edge features like AI-powered product recommendations, real-time inventory tracking, and advanced analytics. The platform includes a responsive frontend, robust backend API, and secure payment processing.",
    image: "/portfolio/ecommerce.jpg",
    tags: ["React", "Node.js", "MongoDB", "AWS", "Redux", "Stripe"],
    link: "#",
    github: "#",
    category: "Web Development",
    stats: {
      users: "10K+",
      transactions: "50K+",
      uptime: "99.9%"
    },
    testimonial: {
      quote: "The platform increased our conversion rate by 35% within the first quarter.",
      author: "Jane Smith, CEO at RetailX",
      image: "/testimonials/jane.jpg"
    },
    features: [
      "AI-Powered Recommendations", 
      "Real-time Inventory Management", 
      "Secure Payment Processing", 
      "Advanced Analytics Dashboard",
      "Mobile-Responsive Design",
      "Multi-language Support"
    ],
    timeline: "12 weeks",
    challenge: "Creating a scalable system that could handle peak traffic periods while maintaining real-time inventory accuracy across multiple warehouses.",
    solution: "We implemented a microservices architecture with event-driven communication between services, ensuring data consistency while maintaining high performance."
  },
  {
    title: "FinTech Mobile App",
    description: "Cross-platform mobile application for personal finance management with blockchain integration.",
    longDescription: "Our team designed and developed a cutting-edge mobile application that revolutionizes personal finance management by leveraging blockchain technology for secure transactions and data integrity. The app provides users with comprehensive financial insights, automated savings features, and investment opportunities.",
    image: "/portfolio/fintech.jpg",
    tags: ["React Native", "Firebase", "Web3", "Redux", "GraphQL"],
    link: "#",
    github: "#",
    category: "Mobile Development",
    stats: {
      downloads: "25K+",
      rating: "4.8/5",
      transactions: "1M+"
    },
    testimonial: {
      quote: "This app transformed how our users interact with their finances. The intuitive design and powerful features exceeded our expectations.",
      author: "Michael Johnson, CTO at FinanceHub",
      image: "/testimonials/michael.jpg"
    },
    features: [
      "Blockchain Transaction Verification", 
      "Biometric Authentication", 
      "Automated Savings Goals", 
      "Investment Portfolio Tracking",
      "Expense Categorization",
      "Financial Insights & Reports"
    ],
    timeline: "16 weeks",
    challenge: "Ensuring secure blockchain integration while maintaining a smooth, intuitive user experience accessible to non-technical users.",
    solution: "We created a layered architecture that abstracts the complexity of blockchain operations behind an intuitive interface, with extensive user testing to refine the experience."
  },
  {
    title: "IoT Dashboard",
    description: "Real-time monitoring dashboard for industrial IoT sensors with predictive maintenance.",
    longDescription: "We built a sophisticated IoT monitoring system that collects and analyzes data from hundreds of industrial sensors in real-time. The dashboard provides actionable insights, predictive maintenance alerts, and comprehensive visualization tools that help operations teams maximize efficiency and minimize downtime.",
    image: "/portfolio/iot.jpg",
    tags: ["Vue.js", "Python", "TensorFlow", "Azure", "WebSockets", "D3.js"],
    link: "#",
    github: "#",
    category: "IoT Solutions",
    stats: {
      sensors: "500+",
      accuracy: "98%",
      alerts: "24/7"
    },
    testimonial: {
      quote: "The predictive maintenance feature alone saved us over $2M in potential downtime costs within the first year of implementation.",
      author: "Sarah Chen, Operations Director at IndustrialTech",
      image: "/testimonials/sarah.jpg"
    },
    features: [
      "Real-time Sensor Monitoring", 
      "Predictive Maintenance Alerts", 
      "Machine Learning Anomaly Detection", 
      "Interactive Data Visualization",
      "Automated Reporting",
      "Remote Configuration"
    ],
    timeline: "20 weeks",
    challenge: "Processing and analyzing massive amounts of sensor data in real-time while providing meaningful insights and predictions.",
    solution: "We implemented a stream processing architecture with edge computing components and used machine learning models to identify patterns and predict maintenance needs."
  },
  {
    title: "Enterprise CRM Solution",
    description: "Custom enterprise-grade customer relationship management system with AI-powered insights.",
    longDescription: "We developed a comprehensive CRM solution tailored to the specific needs of enterprise clients in the manufacturing sector. The system integrates with existing ERP systems while providing advanced customer analytics, sales forecasting, and automated workflow management.",
    image: "/portfolio/crm.jpg",
    tags: ["Angular", "Java", "Spring Boot", "PostgreSQL", "Docker", "Kubernetes"],
    link: "#",
    github: "#",
    category: "Enterprise Solutions",
    stats: {
      clients: "150+",
      efficiency: "+43%",
      ROI: "285%"
    },
    testimonial: {
      quote: "This CRM transformed our sales process. The custom workflows and AI insights have dramatically improved our team's efficiency and conversion rates.",
      author: "Robert Williams, VP of Sales at ManufacturePro",
      image: "/testimonials/robert.jpg"
    },
    features: [
      "Custom Sales Pipelines", 
      "AI-Powered Lead Scoring", 
      "Automated Workflow Management", 
      "Advanced Reporting & Analytics",
      "ERP System Integration",
      "Mobile Access"
    ],
    timeline: "24 weeks",
    challenge: "Creating a highly customizable system that could adapt to complex enterprise workflows while maintaining performance and security.",
    solution: "We designed a modular architecture with extensive configuration options and implemented a robust security model with role-based access control."
  }
]

// Enhanced categories with more options
const categories = [
  { name: "All", icon: Globe },
  { name: "Web Development", icon: Code2 },
  { name: "Mobile Development", icon: Smartphone },
  { name: "IoT Solutions", icon: Cpu },
  { name: "Enterprise Solutions", icon: Server }
]

// Custom cursor component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const updatePosition = (e) => {
      // Direct positioning without animation for immediate response
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Check if cursor is over a clickable element
      const target = e.target
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('group') ||
        target.closest('.group') ||
        getComputedStyle(target).cursor === 'pointer'
      
      setIsPointer(isClickable)
    }
    
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    
    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])
  
  return (
    <motion.div 
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{
        x: position.x - (isPointer ? 24 : 24),
        y: position.y - (isPointer ? 24 : 24),
        opacity: isVisible ? 1 : 0,
        scale: isPointer ? 0.8 : 1
      }}
    >
      {isPointer ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="#FFF" d="M22 11c-4.96 0-9-4.04-9-9 0-1.32-2-1.32-2 0 0 4.96-4.04 9-9 9-1.32 0-1.32 2 0 2 4.96 0 9 4.04 9 9 0 1.32 2 1.32 2 0 0-4.96 4.04-9 9-9 1.32 0 1.32-2 0-2Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="#FFF" stroke="#000" strokeWidth="2" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" />
        </svg>
      )}
    </motion.div>
  )
}

// Star component for background
const StarBackground = ({ delay = 0, duration = 3, size = 2, top, left }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`
      }}
      animate={{
        opacity: [0.1, 0.8, 0.1],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  )
}

StarBackground.propTypes = {
  delay: PropTypes.number,
  duration: PropTypes.number,
  size: PropTypes.number,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired
}

// Comet component for background
const Comet = ({ delay = 0, duration = 2, size = 2, top, left, angle = 45 }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${size * 10}px`,
        height: `${size}px`,
        background: `linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)`,
        borderRadius: `${size}px`,
        transform: `rotate(${angle}deg)`
      }}
      initial={{ x: -100, y: -100, opacity: 0 }}
      animate={{
        x: [0, 300],
        y: [0, 300],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeOut"
      }}
    />
  )
}

Comet.propTypes = {
  delay: PropTypes.number,
  duration: PropTypes.number,
  size: PropTypes.number,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  angle: PropTypes.number
}

// Project card component with enhanced animations and interactions
const ProjectCard = ({ project, index, setSelectedProject }) => {
  const cardRef = useRef(null)
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })
  
  // Enhanced mouse tracking for more responsive interactions
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 300 }
  const rotateX = useSpring(0, springConfig)
  const rotateY = useSpring(0, springConfig)
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // Calculate mouse position relative to card
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
    
    // Calculate rotation values based on mouse position
    const rotateXValue = ((e.clientY - rect.top) / rect.height - 0.5) * 10
    const rotateYValue = ((e.clientX - rect.left) / rect.width - 0.5) * -10
    
    mouseX.set(x)
    mouseY.set(y)
    rotateX.set(rotateXValue)
    rotateY.set(rotateYValue)
  }
  
  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    rotateX.set(0)
    rotateY.set(0)
  }

  // Enhanced card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }
  
  // Image animation variants
  const imageVariants = {
    hover: { scale: 1.08, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
  }
  
  // Tag animation variants
  const tagVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.3 + (i * 0.05),
        duration: 0.5
      } 
    })
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.1] backdrop-blur-xl
                 border border-white/10 hover:border-blue-500/40 transition-all duration-500 shadow-xl shadow-black/20"
      onClick={() => setSelectedProject(project)}
    >
      {/* Enhanced spotlight effect with smoother animation */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
        style={{
          background: `radial-gradient(
            800px circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(59, 130, 246, 0.15), 
            transparent 40%
          )`
        }}
      />
      
      {/* Subtle border glow effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        animate={{
          boxShadow: [
            "0 0 0 0px rgba(59, 130, 246, 0)",
            "0 0 0 3px rgba(59, 130, 246, 0.1)"
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          ref={ref}
          src={project.image}
          alt={project.title}
          variants={imageVariants}
          className="w-full h-full object-cover transition-all duration-700"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Enhanced category badge with animation */}
        <motion.div 
          className="absolute top-4 left-4 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.span 
            className="px-3 py-1 text-xs font-medium bg-blue-500/20 backdrop-blur-md rounded-full text-blue-300 border border-blue-500/30 flex items-center gap-1.5"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
          >
            {project.category === "Web Development" && <Code2 className="w-3 h-3" />}
            {project.category === "Mobile Development" && <Smartphone className="w-3 h-3" />}
            {project.category === "IoT Solutions" && <Cpu className="w-3 h-3" />}
            {project.category === "Enterprise Solutions" && <Server className="w-3 h-3" />}
            {project.category}
          </motion.span>
        </motion.div>
        
        {/* Project Links with enhanced animations */}
        <div className="absolute bottom-4 right-4 flex gap-3 z-20">
          <motion.a
            href={project.github}
            whileHover={{ scale: 1.15, y: -3 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
          >
            <Github className="w-4 h-4 text-white" />
          </motion.a>
          <motion.a
            href={project.link}
            whileHover={{ scale: 1.15, y: -3 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-2 bg-blue-500/20 backdrop-blur-md rounded-full hover:bg-blue-500/40 transition-all border border-blue-500/30"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
          >
            <ExternalLink className="w-4 h-4 text-blue-300" />
          </motion.a>
        </div>
      </div>

      <div className="p-6" style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}>
        <motion.h3 
          className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {project.title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-400 mb-4 text-sm line-clamp-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {project.description}
        </motion.p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, 4).map((tag, i) => (
            <motion.span
              key={tag}
              custom={i}
              variants={tagVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              className="px-2 py-0.5 text-xs bg-white/5 rounded-md text-gray-300 hover:bg-white/10 transition-colors"
            >
              {tag}
            </motion.span>
          ))}
          {project.tags.length > 4 && (
            <motion.span
              custom={4}
              variants={tagVariants}
              initial="initial"
              animate="animate"
              className="px-2 py-0.5 text-xs bg-white/5 rounded-md text-gray-300"
            >
              +{project.tags.length - 4}
            </motion.span>
          )}
        </div>

        {/* Enhanced Key Stats with animations */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(project.stats).map(([key, value], i) => (
            <motion.div 
              key={key} 
              className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
              whileHover={{ 
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(59, 130, 246, 0.3)",
                y: -2
              }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="text-blue-400 font-bold text-sm"
              >
                {value}
              </motion.div>
              <div className="text-xs text-gray-500 capitalize">{key}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center text-blue-400 text-sm font-medium group/btn"
        >
          View Details
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
          <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </motion.div>
        </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Define PropTypes for ProjectCard component
ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    link: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    stats: PropTypes.object.isRequired,
    testimonial: PropTypes.shape({
      quote: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired
    }),
    features: PropTypes.arrayOf(PropTypes.string),
    timeline: PropTypes.string,
    challenge: PropTypes.string,
    solution: PropTypes.string,
    longDescription: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
  setSelectedProject: PropTypes.func.isRequired
}

const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;
  
  // Enhanced modal animations
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3, delay: 0.1 }
    }
  };
  
  // Content animation sequence
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.3 + (i * 0.1),
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      } 
    })
  };
  
  // Icon animation for feature items
  const iconAnimation = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20 
      } 
    }
  };

  // Get appropriate icon for stats
  const getStatIcon = (key) => {
    switch(key.toLowerCase()) {
      case 'users': return <Users className="w-5 h-5 text-blue-400" />;
      case 'transactions': return <BarChart3 className="w-5 h-5 text-blue-400" />;
      case 'uptime': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'downloads': return <ArrowRight className="w-5 h-5 text-blue-400" />;
      case 'rating': return <Star className="w-5 h-5 text-blue-400" />;
      case 'sensors': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'accuracy': return <Award className="w-5 h-5 text-blue-400" />;
      case 'alerts': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'clients': return <Users className="w-5 h-5 text-blue-400" />;
      case 'efficiency': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'roi': return <BarChart3 className="w-5 h-5 text-blue-400" />;
      default: return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
          <motion.div 
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto
                      bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl border border-white/10 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
              {/* Close button with enhanced animation */}
              <motion.button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="text-white w-5 h-5" />
              </motion.button>
              
              {/* Enhanced header section with parallax effect */}
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0"
                >
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent" />
                </motion.div>
              
              <div className="absolute bottom-0 left-0 w-full p-8">
                  <motion.div
                    custom={0}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                <span className="px-3 py-1 text-sm bg-blue-500/20 backdrop-blur-md rounded-full text-blue-300 font-medium border border-blue-500/30 mb-4 inline-block">
                  {project.category}
                </span>
                  </motion.div>
                  
                  <motion.h2 
                    className="text-4xl font-bold text-white mb-3"
                    custom={1}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {project.title}
                  </motion.h2>
                  
                  <motion.div 
                    className="flex flex-wrap gap-2 mb-4"
                    custom={2}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-sm bg-white/10 rounded-full text-gray-300">
                      {tag}
                    </span>
                  ))}
                  </motion.div>
                  
                  {/* Timeline indicator */}
                  {project.timeline && (
                    <motion.div 
                      className="flex items-center gap-2 text-gray-400 text-sm"
                      custom={3}
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Project Timeline: <span className="text-blue-300">{project.timeline}</span></span>
                    </motion.div>
                  )}
              </div>
            </div>
            
            <div className="p-8">
                {/* Overview section with enhanced styling */}
                <motion.div 
                  className="mb-10"
                  custom={4}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-400" />
              </div>
                    <h3 className="text-xl font-semibold text-white">Overview</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{project.longDescription || project.description}</p>
                </motion.div>
                
                {/* Challenge & Solution section */}
                {(project.challenge || project.solution) && (
                  <motion.div 
                    className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6"
                    custom={5}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {project.challenge && (
                      <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-orange-400" />
                          </div>
                          <h4 className="text-lg font-medium text-white">The Challenge</h4>
                        </div>
                        <p className="text-gray-300">{project.challenge}</p>
                      </div>
                    )}
                    
                    {project.solution && (
                      <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Rocket className="w-5 h-5 text-green-400" />
                          </div>
                          <h4 className="text-lg font-medium text-white">Our Solution</h4>
                        </div>
                        <p className="text-gray-300">{project.solution}</p>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Key Features with enhanced animations */}
                {project.features && project.features.length > 0 && (
                  <motion.div 
                    className="mb-10"
                    custom={6}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Key Features</h3>
                    </div>
                    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors"
                          whileHover={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            y: -2,
                            transition: { duration: 0.2 }
                          }}
                          custom={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { 
                              opacity: 1, 
                              y: 0, 
                              transition: { 
                                delay: 0.7 + (index * 0.05),
                                duration: 0.5
                              } 
                            }
                          }}
                          initial="hidden"
                          animate="visible"
                        >
                          <motion.div 
                            className="p-2 bg-blue-500/20 rounded-lg"
                            variants={iconAnimation}
                            initial="hidden"
                            animate="visible"
                          >
                        <Zap className="w-5 h-5 text-blue-400" />
                          </motion.div>
                      <span className="text-gray-200">{feature}</span>
                        </motion.div>
                  ))}
                </div>
                  </motion.div>
                )}
                
                {/* Project Stats with enhanced visuals */}
                <motion.div 
                  className="mb-10"
                  custom={7}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                    <h3 className="text-xl font-semibold text-white">Project Stats</h3>
                    </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(project.stats).map(([key, value], index) => (
                      <motion.div 
                        key={key} 
                        className="flex flex-col items-center p-5 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all"
                        whileHover={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          y: -3,
                          transition: { duration: 0.2 }
                        }}
                        custom={index}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            transition: { 
                              delay: 0.8 + (index * 0.1),
                              duration: 0.5
                            } 
                          }
                        }}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div 
                          className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-3 border border-purple-500/20"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(168, 85, 247, 0)",
                              "0 0 0 4px rgba(168, 85, 247, 0.1)",
                              "0 0 0 0 rgba(168, 85, 247, 0)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                        >
                          {getStatIcon(key)}
                        </motion.div>
                        <div className="text-blue-400 font-bold text-2xl mb-1">{value}</div>
                        <div className="text-sm text-gray-400 capitalize">{key}</div>
                      </motion.div>
                  ))}
                </div>
                </motion.div>
              
                {/* Testimonial with enhanced styling */}
              {project.testimonial && (
                  <motion.div 
                    className="mb-10"
                    custom={8}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <motion.div 
                          className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-500/30"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1, duration: 0.5 }}
                        >
                      <img src={project.testimonial.image} alt={project.testimonial.author} className="w-full h-full object-cover" />
                        </motion.div>
                    <div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                          >
                            <div className="text-blue-400 mb-2">
                              <Star className="w-4 h-4 inline-block mr-1" />
                              <Star className="w-4 h-4 inline-block mr-1" />
                              <Star className="w-4 h-4 inline-block mr-1" />
                              <Star className="w-4 h-4 inline-block mr-1" />
                              <Star className="w-4 h-4 inline-block" />
                            </div>
                            <p className="text-gray-300 italic mb-3 text-lg">&ldquo;{project.testimonial.quote}&rdquo;</p>
                      <p className="text-sm text-blue-400 font-medium">{project.testimonial.author}</p>
                          </motion.div>
                    </div>
                  </div>
                </div>
                  </motion.div>
                )}
                
                {/* Project links with enhanced buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row justify-between gap-4"
                  custom={9}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.a 
                  href={project.github} 
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-white/20"
                    whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                    whileTap={{ y: 0 }}
                >
                  <Github className="w-5 h-5" />
                  View Code
                  </motion.a>
                  <motion.a 
                  href={project.link} 
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                    whileHover={{ y: -3, boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ y: 0 }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                  </motion.a>
                </motion.div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Define PropTypes for ProjectModal component
ProjectModal.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    longDescription: PropTypes.string,
    image: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
    github: PropTypes.string,
    category: PropTypes.string,
    stats: PropTypes.object,
    testimonial: PropTypes.shape({
      quote: PropTypes.string,
      author: PropTypes.string,
      image: PropTypes.string
    }),
    features: PropTypes.arrayOf(PropTypes.string),
    timeline: PropTypes.string,
    challenge: PropTypes.string,
    solution: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default function Portfolio() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef(null)

  // Enhanced parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])
  
  const handleMouseMove = () => {
    // Keep this function for event handling, but we don't need to track position anymore
  }
  
  const handleMouseLeave = () => {
    // Keep this function for event handling
  }
  
  // Handle project selection
  useEffect(() => {
    if (selectedProject) {
      setIsModalOpen(true)
    }
  }, [selectedProject])
  
  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  // Filter projects based on selected category
  const filteredProjects = projects.filter(
    project => selectedCategory === "All" || project.category === selectedCategory
  )
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  // Generate random stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }))
  
  // Hide default cursor
  useEffect(() => {
    document.body.classList.add('custom-cursor')
    
    return () => {
      document.body.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <style>{`
        .custom-cursor {
          cursor: none !important;
        }
        .custom-cursor * {
          cursor: none !important;
        }
      `}</style>
      
      <CustomCursor />
      
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="py-32 relative overflow-hidden"
        id="portfolio"
      >
        {/* FFFlurry SVG Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="/ffflurry.svg" 
            alt="Background pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {stars.map(star => (
            <StarBackground 
              key={star.id}
              top={star.top}
              left={star.left}
              size={star.size}
              delay={star.delay}
              duration={star.duration}
            />
          ))}
        </div>
        
        {/* Enhanced animated background elements */}
      <motion.div 
          className="absolute inset-0 opacity-20 pointer-events-none z-10"
          style={{ 
            y: backgroundY,
            opacity: backgroundOpacity
          }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("/grid.svg")',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 70%)',
        }} />
      </motion.div>

        {/* Rest of the component */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <motion.div
          ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-center mb-20"
          >
            {/* Enhanced section badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm
                       text-sm font-medium text-blue-300 mb-6"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4" />
            Our Portfolio
          </motion.div>
          
            {/* Enhanced title with gradient and animation */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Transforming Ideas into
                <div className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent"> Digital Reality</span>
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </h2>
            </motion.div>
            
            {/* Enhanced description */}
          <motion.p 
              className="text-lg text-gray-400 max-w-3xl mx-auto mb-16"
              variants={itemVariants}
          >
            Explore our showcase of successful projects that demonstrate our expertise
              in creating innovative, scalable, and user-centered digital solutions for businesses
              across various industries.
          </motion.p>

            {/* Enhanced Category Filter */}
          <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-20"
              variants={itemVariants}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: selectedCategory === category.name 
                      ? "0 15px 25px -5px rgba(59, 130, 246, 0.3)" 
                      : "0 10px 15px -5px rgba(0, 0, 0, 0.2)" 
                  }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-sm
                          transition-all duration-300 ${
                            selectedCategory === category.name
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                          }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

          {/* Enhanced Projects Grid with Animation */}
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.title} 
                  project={project} 
                  index={index} 
                  setSelectedProject={setSelectedProject}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-3 py-20 text-center"
              >
                  <div className="inline-block p-6 bg-white/5 rounded-xl border border-white/10 mb-4">
                    <Server className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg mb-2">No projects found in this category.</p>
                  <p className="text-gray-500">Please try selecting a different category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

          {/* Enhanced View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
            className="text-center mt-20"
        >
          <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.3)"
              }}
            whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full
                       hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 overflow-hidden"
            >
              {/* Button background animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  background: [
                    "linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%)",
                    "linear-gradient(90deg, rgba(37, 99, 235, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%)",
                    "linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Button shine effect */}
              <motion.div 
                className="absolute inset-0 translate-x-full"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
              </motion.div>
              
              <span className="relative flex items-center justify-center gap-2">
            Explore All Projects
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
          </motion.button>
        </motion.div>
          
          {/* Stats section */}
          <motion.div 
            className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[
              { label: "Projects Completed", value: "120+", icon: Rocket, color: "blue" },
              { label: "Happy Clients", value: "50+", icon: Users, color: "green" },
              { label: "Years Experience", value: "8+", icon: Award, color: "purple" },
              { label: "Team Members", value: "25+", icon: Star, color: "orange" }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="p-6 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center"
                whileHover={{ 
                  y: -5, 
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderColor: `rgba(${stat.color === 'blue' ? '59, 130, 246' : stat.color === 'green' ? '16, 185, 129' : stat.color === 'purple' ? '139, 92, 246' : '249, 115, 22'}, 0.3)`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (index * 0.1), duration: 0.5 }}
              >
                <div className={`p-3 rounded-full mb-4 bg-${stat.color}-500/20 border border-${stat.color}-500/30`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
        </motion.div>
      </div>
      
      {/* Project Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </section>
    </>
  )
}