import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Blocks, 
  Cloud, 
  Cpu, 
  Brain,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

// Enhanced service data with cosmic themes
const services = [
  {
    title: 'Stellar Web Development',
    description: 'Create captivating digital experiences with our cutting-edge web solutions that transcend ordinary boundaries.',
    Icon: Globe,
    color: '#4F70E5',
    features: ['Full-Stack Engineering', 'Progressive Web Applications', 'Cosmic E-commerce Solutions'],
    iconBg: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    title: 'Celestial Mobile Applications',
    description: 'Expand your reach with native and cross-platform mobile apps that deliver seamless user experiences across devices.',
    Icon: Smartphone,
    color: '#5E9BF2',
    features: ['iOS & Android Navigation', 'Cross-Platform Harmony', 'Stellar User Experience Design'],
    iconBg: 'from-blue-400/20 to-blue-600/20'
  },
  {
    title: 'Quantum Web3 Solutions',
    description: 'Embrace the future with decentralized applications and blockchain solutions that position you at the forefront of digital evolution.',
    Icon: Blocks,
    color: '#4AA8FF',
    features: ['Intelligent Smart Contracts', 'DeFi Ecosystems', 'NFT Universe Creation'],
    iconBg: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    title: 'Nebula Cloud Architecture',
    description: 'Scale infinitely with cloud solutions engineered for performance, security, and seamless operation across the digital cosmos.',
    Icon: Cloud,
    color: '#70C5F8',
    features: ['Multi-Cloud Orchestration', 'Cosmic Cloud Migration', 'DevOps Acceleration'],
    iconBg: 'from-blue-300/20 to-indigo-400/20'
  },
  {
    title: 'Galactic IoT Systems',
    description: 'Connect the physical and digital realms with IoT solutions that transform data into actionable intelligence.',
    Icon: Cpu,
    color: '#3D9DFF',
    features: ['Industrial IoT Constellations', 'Sensor Integration Matrices', 'Real-time Analytics Portals'],
    iconBg: 'from-blue-600/20 to-blue-400/20'
  },
  {
    title: 'Astral AI Integration',
    description: 'Harness the power of artificial intelligence to automate processes and uncover insights that drive your business forward.',
    Icon: Brain,
    color: '#3B82F6',
    features: ['Cognitive Machine Learning', 'Neural Process Automation', 'Predictive Intelligence Systems'],
    iconBg: 'from-indigo-400/20 to-blue-500/20'
  }
];

// Star Component for backgrounds
const Star = ({ top, left, size, delay, duration }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    style={{ 
      top: `${top}%`, 
      left: `${left}%`, 
      width: size, 
      height: size,
      boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`
    }}
    animate={{ 
      opacity: [0.1, 0.8, 0.1] 
    }}
    transition={{ 
      duration: duration || 3,
      delay: delay || 0,
      repeat: Infinity,
      repeatType: "reverse"
    }}
  />
);

const ServiceCard = ({ service, index, className }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  return (
    <motion.div
      ref={(node) => {
        // Combine refs
        ref(node);
        cardRef.current = node;
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group h-full flex flex-col 
                 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300
                 border border-blue-500/20 hover:border-blue-400/40 ${className}`}
      style={{
        backgroundColor: 'rgba(8, 14, 30, 0.9)',
        boxShadow: isHovered 
          ? `0 0 25px -5px ${service.color}30, 0 0 10px rgba(4, 9, 21, 0.3)` 
          : '0 4px 20px rgba(2, 6, 15, 0.2)'
      }}
    >
      {/* Card Background with Gradient */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(120deg, rgba(8, 14, 30, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)`
        }}
      />
      
      {/* Animated Hover Gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(
            500px circle at 50% 50%, 
            ${service.color}10,
            transparent 40%
          )`
        }}
      />
      
      {/* Top edge glow */}
      <div 
        className="absolute top-0 left-5 right-5 h-[1px] opacity-40 group-hover:opacity-70 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${service.color}, transparent)`
        }}
      />
      
      {/* Content Container with padding */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Service Icon with Gradient Background */}
        <div 
          className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.iconBg}`}
          style={{
            boxShadow: isHovered ? `0 0 15px -5px ${service.color}60` : 'none',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <service.Icon 
            className="w-7 h-7 transition-colors duration-300"
            style={{ color: service.color }}
          />
        </div>
        
        {/* Decorative Stars */}
        <div className="absolute top-6 right-6 w-12 h-12 opacity-60">
          <Star top={20} left={30} size={2} />
          <Star top={50} left={70} size={2} delay={0.5} />
          <Star top={80} left={40} size={2} delay={1} />
        </div>
        
        {/* Title with animated underline effect */}
        <div className="mb-4 relative">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
            {service.title}
          </h3>
          <motion.div 
            className="h-[2px] mt-2 w-0 group-hover:w-[80px]"
            initial={{ width: 0 }}
            animate={isHovered ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
          />
        </div>
        
        {/* Description with line height for readability */}
        <p className="text-blue-100/80 mb-6 leading-relaxed">
          {service.description}
        </p>
        
        {/* Features list with animated reveal */}
        <div className="mt-auto">
          <ul className="space-y-3">
            {service.features.map((feature, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.3 + idx * 0.1, 
                  duration: 0.5 
                }}
                className="flex items-start group/feature"
              >
                <motion.div
                  animate={isHovered ? { x: 2 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: service.color }}
                  className="mr-3 mt-1 flex-shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5 group-hover/feature:translate-x-1 transition-transform duration-300" />
                </motion.div>
                <span className="text-blue-100/80 text-sm group-hover/feature:text-blue-100 transition-colors duration-300">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        {/* Learn More Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 self-start flex items-center text-sm font-medium rounded-full px-4 py-2 transition-colors duration-300 group/btn"
          style={{ 
            background: isHovered ? `${service.color}20` : 'rgba(15, 23, 42, 0.5)',
            color: isHovered ? service.color : '#94a3b8',
            border: `1px solid ${isHovered ? service.color + '40' : 'rgba(59, 130, 246, 0.1)'}`
          }}
        >
          Explore Solutions
          <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Animated background stars
const StarField = () => {
  // Generate random positions for stars
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map(star => (
        <Star 
          key={star.id}
          top={star.top}
          left={star.left}
          size={star.size}
          delay={star.delay}
          duration={star.duration}
        />
      ))}
    </div>
  );
};

export default function Services() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  return (
    <section id="services" className="relative py-32 overflow-hidden bg-gradient-to-b from-[#030617] to-[#050A1F]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#030617] opacity-90" />
      
      {/* Starfield Background */}
      <StarField />
      
      {/* Animated nebula effects */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(ellipse at 10% 90%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 90% 10%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 10% 90%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundSize: '50px 50px',
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          {/* Services Pill */}
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
                     bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Cosmic Solutions</span>
          </motion.div>
          
          {/* Main Title with Gradient */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-blue-300 bg-clip-text text-transparent">
            Digital Constellation Services
          </h2>
          
          {/* Description with enhanced typography */}
          <p className="text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            Transforming visions into digital realities with celestial precision. 
            Our universe of services powers your journey beyond conventional boundaries.
          </p>
          
          {/* Decorative accent line */}
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-300 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        {/* Responsive Service Grid with improved spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title} 
              service={service} 
              index={index}
              className="min-h-[400px]"
            />
          ))}
        </div>
        
        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 
                       text-white py-4 px-10 rounded-full font-medium tracking-wide shadow-lg 
                       transition-all duration-300 group"
          >
            Discover Full Capabilities
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030617] to-transparent pointer-events-none" />
    </section>
  );
}