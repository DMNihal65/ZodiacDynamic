import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useTransform, useScroll } from 'framer-motion';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Code, Shield, Cloud, Rocket, Zap, ChevronDown } from 'lucide-react';

gsap.registerPlugin(TextPlugin);

// Define constellation patterns for zodiac signs (same as loading screen)
const CONSTELLATIONS = {
  aries: {
    name: 'Aries',
    // symbol: '♈',
    points: [[-1, 0, 0], [-0.5, 0.5, 0], [0, 0.8, 0], [0.5, 0.9, 0], [1, 0.7, 0], [1.5, 0.3, 0]]
  },
  taurus: {
    name: 'Taurus',
    // symbol: '♉',
    points: [[-1.5, -0.5, 0], [-0.8, -0.3, 0], [0, 0, 0], [0.8, 0.5, 0], [0.6, 1, 0], [1.5, 1, 0]]
  },
  cancer: {
    name: 'Cancer',
    // symbol: '♋',
    points: [[-1, 0, 0], [-0.5, 0.5, 0], [0, 0.8, 0], [0.5, 0.5, 0], [0.8, 0, 0], [0.5, -0.5, 0], [0, -0.8, 0]]
  },
  leo: {
    name: 'Leo',
    // symbol: '♌',
    points: [[-1.5, -0.5, 0], [-0.8, -0.2, 0], [0, 0, 0], [0.5, 0.5, 0], [1, 0.2, 0], [1.5, -0.3, 0], [1.8, -0.8, 0]]
  },
  virgo: {
    name: 'Virgo',
    // symbol: '♍',
    points: [[-1, -0.3, 0], [-0.5, 0, 0], [0, 0.5, 0], [0.5, 0.8, 0], [1, 0.5, 0], [1.3, 0, 0], [1, -0.5, 0], [0.5, -0.8, 0]]
  },
  libra: {
    name: 'Libra',
    // symbol: '♎',
    points: [[-1, 0.5, 0], [0, 0.5, 0], [1, 0.5, 0], [0, 0, 0], [-1, -0.5, 0], [0, -0.5, 0], [1, -0.5, 0]]
  },
  scorpio: {
    name: 'Scorpio',
    // symbol: '♏',
    points: [[-1.5, 0, 0], [-0.8, 0.2, 0], [0, 0.3, 0], [0.8, 0.2, 0], [1.5, 0, 0], [1.8, -0.3, 0], [2, -0.6, 0]]
  },
  sagittarius: {
    name: 'Sagittarius',
    // symbol: '♐',
    points: [[-1, -0.5, 0], [-0.5, 0, 0], [0, 0.5, 0], [0.5, 0.8, 0], [1, 0.5, 0], [1.5, 0, 0], [1.8, -0.5, 0]]
  },
  capricorn: {
    name: 'Capricorn',
    // symbol: '♑',
    points: [[-1.5, -0.3, 0], [-0.8, 0, 0], [0, 0.3, 0], [0.8, 0.1, 0], [1.3, -0.2, 0], [1.8, -0.5, 0]]
  },
  aquarius: {
    name: 'Aquarius',
    // symbol: '♒',
    points: [[-1.5, 0, 0], [-0.8, 0.2, 0], [0, 0, 0], [0.8, 0.2, 0], [1.5, 0, 0], [-0.8, -0.5, 0], [0, -0.7, 0], [0.8, -0.5, 0]]
  },
  pisces: {
    name: 'Pisces',
    // symbol: '♓',
    points: [[-1.5, 0.5, 0], [-0.8, 0.3, 0], [0, 0, 0], [0.8, -0.3, 0], [1.5, -0.5, 0], [-1, -0.5, 0], [-0.5, -0.3, 0], [0.5, 0.3, 0], [1, 0.5, 0]]
  }
};

// Constellation component for 3D scene
const Constellation = ({ constellation, visible, active, onEnter, onLeave }) => {
  const lineRef = useRef();
  const verticesRef = useRef([]);
  const symbolRef = useRef();
  const points = constellation.points;
  
  // Create line geometry for constellation
  const lineGeometry = useMemo(() => {
    const positions = points.flatMap(point => point);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  useEffect(() => {
    if (lineRef.current) {
      gsap.to(lineRef.current.material, {
        opacity: visible ? (active ? 0.9 : 0.4) : 0,
        duration: 0.8
      });
    }

    verticesRef.current.forEach((vertex, i) => {
      if (vertex) {
        gsap.to(vertex.material, {
          opacity: visible ? (active ? 0.9 : 0.6) : 0,
          delay: active ? i * 0.05 : 0,
          duration: 0.5
        });
        
        if (active) {
          gsap.to(vertex.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.3,
            yoyo: true,
            repeat: 1
          });
        }
      }
    });

    if (symbolRef.current && visible) {
      gsap.to(symbolRef.current.material, {
        opacity: active ? 0.9 : 0.3,
        emissiveIntensity: active ? 0.8 : 0.2,
        duration: 0.5
      });
    }
  }, [visible, active]);

  return (
    <group
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {/* Constellation lines */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          attach="material" 
          color="#4f70e5" 
          opacity={0} 
          transparent={true} 
          linewidth={1}
        />
      </line>
      
      {/* Vertices as stars */}
      {points.map((point, i) => (
        <mesh 
          key={i}
          position={point}
          ref={el => verticesRef.current[i] = el}
        >
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial 
            color="#70a9f7"
            transparent={true}
            opacity={0}
          />
        </mesh>
      ))}
      
      {/* Zodiac symbol */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <Text
          ref={symbolRef}
          position={[0, 0, 0.5]}
          fontSize={1.2}
          color="#60a5fa"
          font="Inter_28pt-Regular.ttf"
          anchorX="center"
          anchorY="middle"
        >
          {constellation.symbol}
          <meshStandardMaterial 
            attach="material" 
            color="#60a5fa" 
            emissive="#60a5fa"
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.1}
            transparent={true}
            opacity={0}
          />
        </Text>
      </Float>
    </group>
  );
};

// Star field component
const StarField = ({ mousePosition }) => {
  const starsRef = useRef();
  const particlesRef = useRef();
  
  useEffect(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x = mousePosition.y * 0.02;
      starsRef.current.rotation.y = mousePosition.x * 0.02;
    }
  }, [mousePosition]);
  
  // Create particle system for nebula
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const particleCount = 8000;
    const positions = [];
    const colors = [];
    const sizes = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Galaxy-like distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 * Math.random();
      const spiralOffset = Math.random() * 10;
      
      positions.push(
        Math.cos(angle + spiralOffset * radius * 0.01) * radius,
        (Math.random() - 0.5) * 15,
        Math.sin(angle + spiralOffset * radius * 0.01) * radius
      );
      
      // Color gradient from center to edge
      const distanceFromCenter = radius / 60;
      const r = 0.3 + 0.7 * (1 - distanceFromCenter);
      const g = 0.3 + 0.3 * (1 - distanceFromCenter);
      const b = 0.6 + 0.4 * (1 - distanceFromCenter);
      
      colors.push(r, g, b);
      sizes.push(0.5 + Math.random() * 2);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    particlesRef.current.geometry = geometry;
  }, []);
  
  return (
    <group ref={starsRef}>
      <Stars 
        radius={300} 
        depth={100} 
        count={1000} 
        factor={8} 
        saturation={0.5} 
        fade 
        speed={0.5} 
      />
      
      <points ref={particlesRef}>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// Feature card component
const FeatureCard = ({ feature, active }) => {
  return (
    <motion.div
      className={`flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 ${
        active ? 'bg-white/5 backdrop-blur-xl border border-white/10' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg ${feature.shadow}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ rotate: -5 }}
        animate={{ rotate: 0 }}
      >
        <feature.Icon className="w-6 h-6 text-white" />
      </motion.div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-300 text-sm lg:text-base">{feature.description}</p>
      </div>
    </motion.div>
  );
};

// Main Hero Component
const Hero = ({ onLoadComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeConstellation, setActiveConstellation] = useState('taurus');
  const [hoveredConstellation, setHoveredConstellation] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleConstellations, setVisibleConstellations] = useState({});
  const [activeFeature, setActiveFeature] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ target: containerRef });
  
  // Transform values for scroll animations
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  
  // Features list
  const features = [
    {
      Icon: Code,
      title: "Cosmic Code Architecture",
      description: "Meticulously crafted software solutions aligned with your business constellation.",
      color: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-600/20"
    },
    {
      Icon: Shield,
      title: "Celestial Security Systems",
      description: "Enterprise-grade protection powered by cosmic intelligence.",
      color: "from-indigo-600 to-purple-600",
      shadow: "shadow-indigo-600/20"
    },
    {
      Icon: Cloud,
      title: "Nebula Cloud Solutions",
      description: "Scalable infrastructure that expands like the universe itself.",
      color: "from-purple-600 to-pink-600",
      shadow: "shadow-purple-600/20"
    },
    {
      Icon: Rocket,
      title: "Stellar Digital Acceleration",
      description: "Propel your business to new dimensions with transformative technology.",
      color: "from-pink-600 to-blue-600",
      shadow: "shadow-pink-600/20"
    },
    {
      Icon: Zap,
      title: "Quantum Performance",
      description: "Lightning-fast solutions optimized for the speed of your business.",
      color: "from-blue-600 to-cyan-600",
      shadow: "shadow-blue-600/20"
    }
  ];

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      if (onLoadComplete) onLoadComplete();
    }, 8000); // Adjust timing to match your loading screen
    
    return () => clearTimeout(timer);
  }, [onLoadComplete]);
  
  // Initialize all constellations as hidden
  useEffect(() => {
    const constellationsState = {};
    Object.keys(CONSTELLATIONS).forEach(key => {
      constellationsState[key] = false;
    });
    setVisibleConstellations(constellationsState);
    
    // After a delay, start revealing constellations one by one
    const revealTimer = setTimeout(() => {
      Object.keys(CONSTELLATIONS).forEach((key, index) => {
        setTimeout(() => {
          setVisibleConstellations(prev => ({
            ...prev,
            [key]: true
          }));
        }, index * 300);
      });
    }, 1000);
    
    return () => clearTimeout(revealTimer);
  }, []);
  
  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 2,
        y: (clientY / innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cycle through constellations
  useEffect(() => {
    const constellationKeys = Object.keys(CONSTELLATIONS);
    
    const constellationInterval = setInterval(() => {
      const currentIndex = constellationKeys.indexOf(activeConstellation);
      const nextIndex = (currentIndex + 1) % constellationKeys.length;
      setActiveConstellation(constellationKeys[nextIndex]);
    }, 8000);
    
    return () => clearInterval(constellationInterval);
  }, [activeConstellation]);

  // Automatic feature cycling
  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(featureInterval);
  }, [features.length]);

  // Letter animation variants
  const titleVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 2.5,
        staggerChildren: 0.08,
        delayChildren: 0.5
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring",
        damping: 12
      }
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.215, 0.610, 0.355, 1.000] }
    }
  };

  // Handle constellation hover
  const handleConstellationEnter = (key) => {
    setHoveredConstellation(key);
    setIsRotating(false);
  };

  const handleConstellationLeave = () => {
    setHoveredConstellation(null);
    setIsRotating(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050A1F] to-[#0F172A]">
      {/* Loading overlay - transitions out once loaded */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-50 bg-[#050A1F] flex items-center justify-center"
            exit={{ 
              opacity: 0,
              transition: { duration: 1.5, ease: 'easeInOut' }
            }}
          >
            {/* Loading content would go here */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Background Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 0]} intensity={1} color="#60a5fa" />
            <pointLight position={[20, 20, 20]} intensity={0.5} color="#ec4899" />
            <pointLight position={[-20, -20, -20]} intensity={0.5} color="#8b5cf6" />
            
            <StarField mousePosition={mousePosition} />
            
            {/* Render all constellations */}
            <group>
              {Object.entries(CONSTELLATIONS).map(([key, constellation]) => (
                <Constellation 
                  key={key}
                  constellation={constellation}
                  visible={visibleConstellations[key]}
                  active={activeConstellation === key || hoveredConstellation === key}
                  onEnter={() => handleConstellationEnter(key)}
                  onLeave={handleConstellationLeave}
                />
              ))}
            </group>
            
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.1}
              autoRotate={isRotating}
              autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Dynamic glow overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-30 rounded-full"
          animate={{
            background: [
              'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)'
            ],
            left: ['-300px', '30%', '60%', '-300px'],
            top: ['-300px', '10%', '-300px', '-300px']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 w-[800px] h-[800px] opacity-30 rounded-full"
          animate={{
            background: [
              'radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)'
            ],
            right: ['-400px', '20%', '50%', '-400px'],
            bottom: ['-400px', '5%', '-400px', '-400px']
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Binary Code Particles Floating */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 font-mono text-xs"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              opacity: [0, Math.random() * 0.2, 0],
              y: `-=${50 + Math.random() * 100}vh`,
              x: `${Math.random() * 20 - 10}%`,
              transition: {
                duration: 8 + Math.random() * 12,
                repeat: Infinity,
                delay: Math.random() * 5
              }
            }}
          >
            {i % 5 === 0 ? `0x${Math.random().toString(16).slice(2, 10)}` : 
             i % 4 === 0 ? `<cosmic::${CONSTELLATIONS[activeConstellation].name}>` : 
             i % 3 === 0 ? 'function astral() => void' :
             i % 2 === 0 ? `{ type: "celestial", id: 0x${Math.floor(Math.random() * 1000)} }` :
             '/* zodiac dynamics */'}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 min-h-screen flex flex-col justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left Content Column */}
          <div className="space-y-8">
            {/* Animated Company Title */}
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="relative mb-6"
            >
              <h1 className="text-5xl xl:text-7xl font-light tracking-tighter text-white flex flex-wrap">
                <span className="font-bold overflow-hidden">
                  {/* Animated text reveal for "Zodiac" */}
                  <span className="inline-block">
                    {Array.from("Zodiac").map((char, i) => (
                      <motion.span
                        key={i}
                        variants={letterVariants}
                        className="inline-block bg-gradient-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </span>
                <span className="font-extralight opacity-80 ml-2 overflow-hidden">
                  {/* Animated text reveal for "Dynamics" */}
                  <span className="inline-block">
                    {Array.from("Dynamics").map((char, i) => (
                      <motion.span
                        key={i}
                        variants={letterVariants}
                        className="inline-block text-blue-100/90"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Currently Active Constellation Name */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <motion.div 
                className="text-blue-400 opacity-80"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <span className="text-3xl">
                  {CONSTELLATIONS[activeConstellation].symbol}
                </span>
              </motion.div>
              <motion.p 
                className="text-xl font-light tracking-wider text-blue-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {CONSTELLATIONS[activeConstellation].name}
              </motion.p>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                <motion.span 
                  className="block text-white"
                  animate={{ opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Celestial Software
                </motion.span>
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r 
                             from-blue-400 via-purple-400 to-pink-400"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  Engineering
                </motion.span>
              </h2>
              <motion.p 
                className="text-xl text-gray-300/90 max-w-xl leading-relaxed"
                variants={itemVariants}
              >
                Where cosmic inspiration meets technical precision. We craft digital solutions 
                that transcend the ordinary and propel your business into new dimensions.
              </motion.p>
            </motion.div>

            {/* Features Carousel */}
            <motion.div variants={itemVariants} className="relative h-48">
              <AnimatePresence mode="wait">
                <motion.div key={activeFeature}>
                  <FeatureCard feature={features[activeFeature]} active={true} />
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center mt-6 space-x-2">
                {features.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeFeature 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                        : 'bg-blue-500/20'
                    }`}
                    onClick={() => setActiveFeature(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      width: index === activeFeature ? 24 : 8,
                    }}
                    transition={{
                      width: { duration: 0.3 }
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* System Terminal */}
            <motion.div
              variants={itemVariants}
              className="bg-blue-900/10 backdrop-blur-sm p-3 rounded-md border border-blue-800/30 font-mono text-xs text-blue-400/80 w-full"
            >
              <div className="flex justify-between border-b border-blue-800/30 pb-2 mb-2">
                <span className="text-blue-300">$ zodiac.system.status</span>
                <motion.span 
                  className="text-blue-400/60 flex items-center gap-1"
                  animate={{ color: ['rgba(96,165,250,0.6)', 'rgba(139,92,246,0.6)', 'rgba(96,165,250,0.6)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-blue-400 rounded-full inline-block"
                  />
                  active
                </motion.span>
              </div>

              <div className="space-y-1.5">
                <div className="flex">
                  <span className="text-blue-400 mr-2">✓</span>
                  <span>Constellation: {CONSTELLATIONS[activeConstellation].name}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-300 mr-2">⚡</span>
                  <span>Cosmic connection: stable</span>
                </div>
                <div className="flex">
                  <span className="text-blue-300 mr-2">i</span>
                  <span>Astral coordinates synchronized</span>
                </div>
                <div className="flex">
                  <span className="text-blue-300 mr-2">$</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-6"
            >
              <motion.button 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                          rounded-lg relative overflow-hidden shadow-lg shadow-blue-600/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.span 
                  className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="relative text-white font-semibold flex items-center">
                  <span>Launch Project</span>
                  <motion.span 
                    className="ml-2 text-lg"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                </span>
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 border-2 border-blue-500/30 text-white font-semibold 
                          rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: 'rgba(96,165,250,0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Constellations</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right side - Interactive Constellation Viewer */}
          <motion.div 
            variants={itemVariants}
            className="relative hidden lg:block"
            whileHover={() => setIsRotating(false)}
            onMouseLeave={() => setIsRotating(true)}
          >
            {/* Main viewer with futuristic frame */}
            <motion.div
              className="relative h-[450px] rounded-3xl overflow-hidden border-2 border-blue-500/20 shadow-lg shadow-blue-600/10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Top controls bar */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-blue-900/30 backdrop-blur-sm z-10 border-b border-blue-800/30 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500/70" />
                  <div className="w-3 h-3 rounded-full bg-purple-500/70" />
                  <div className="w-3 h-3 rounded-full bg-pink-500/70" />
                </div>
                <div className="font-mono text-xs text-blue-300/80">
                  Cosmic Interface v4.2.1
                </div>
                <div className="flex items-center gap-2 text-blue-300/80">
                  <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs"
                  >●</motion.span>
                  <span className="text-xs">LIVE</span>
                </div>
              </div>
              
              {/* 3D Viewport */}
              <div className="absolute inset-0 bg-[#050A15]/70">
                {/* Constellation name */}
                <motion.div
                  className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 text-2xl font-light tracking-widest text-blue-300/90 backdrop-blur-sm px-4 py-1 rounded-full border border-blue-500/20 bg-blue-900/20"
                  animate={{
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {CONSTELLATIONS[activeConstellation].name.toUpperCase()}
                </motion.div>
                
                {/* Central Zodiac Symbol */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  <motion.div 
                    className="text-9xl font-bold text-blue-400/80"
                    animate={{ 
                      rotateY: [0, 10, 0],
                      scale: [0.95, 1, 0.95],
                      filter: ["drop-shadow(0 0 8px rgba(96,165,250,0.3))", "drop-shadow(0 0 12px rgba(96,165,250,0.5))", "drop-shadow(0 0 8px rgba(96,165,250,0.3))"]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {CONSTELLATIONS[activeConstellation].symbol}
                  </motion.div>
                </motion.div>
                
                {/* Star Pattern Visualization */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-96 h-96">
                    {/* Dynamic star connections based on constellation pattern */}
                    {CONSTELLATIONS[activeConstellation].points.map((point, index, array) => {
                      if (index < array.length - 1) {
                        return (
                          <motion.div 
                            key={`line-${index}`}
                            className="absolute top-1/2 left-1/2 h-0.5 bg-gradient-to-r from-blue-400/50 to-blue-300/30 origin-left z-10"
                            style={{
                              width: `${Math.random() * 40 + 60}px`,
                              transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ 
                              scaleX: 1, 
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ 
                              scaleX: { delay: index * 0.1, duration: 0.7 },
                              opacity: { duration: 3, repeat: Infinity, delay: index * 0.2 }
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                    
                    {/* Stars at vertices */}
                    {CONSTELLATIONS[activeConstellation].points.map((point, index) => (
                      <motion.div
                        key={`star-${index}`}
                        className="absolute w-3 h-3 rounded-full bg-blue-300 z-20"
                        style={{
                          top: `${50 + (point[1] * 20)}%`,
                          left: `${50 + (point[0] * 10)}%`,
                          boxShadow: "0 0 8px rgba(96,165,250,0.8)"
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1,
                          opacity: 1,
                          boxShadow: ["0 0 5px rgba(96,165,250,0.5)", "0 0 15px rgba(96,165,250,0.8)", "0 0 5px rgba(96,165,250,0.5)"]
                        }}
                        transition={{ 
                          scale: { delay: index * 0.05, duration: 0.5 },
                          opacity: { delay: index * 0.05, duration: 0.5 },
                          boxShadow: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                        }}
                      />
                    ))}
                    
                    {/* Background star particles */}
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={`bg-star-${i}`}
                        className="absolute rounded-full bg-blue-200"
                        style={{
                          width: `${Math.random() * 2 + 1}px`,
                          height: `${Math.random() * 2 + 1}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2 + Math.random() * 3,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Interactive instruction */}
              <motion.div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-blue-300/80 text-center font-mono bg-blue-900/20 backdrop-blur-sm px-4 py-1 rounded-full border border-blue-800/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                Hover to interact with constellation
              </motion.div>
            </motion.div>
            
            {/* Cosmic Data Terminal */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <motion.div
                className="bg-blue-900/10 backdrop-blur-sm rounded-lg border border-blue-800/30 p-3 font-mono text-xs relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <div className="text-blue-300/90 mb-2 flex justify-between items-center">
                  <span>$ cosmic-data</span>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs text-blue-400/60"
                  >
                    LIVE
                  </motion.span>
                </div>
                
                <div className="space-y-1 text-blue-400/70">
                  <div className="flex justify-between">
                    <span>Stars:</span>
                    <span>{CONSTELLATIONS[activeConstellation].points.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sector:</span>
                    <span>Alpha-{Math.floor(Math.random() * 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy:</span>
                    <motion.div
                      className="w-12 h-3 bg-blue-900/50 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        animate={{ width: ["30%", "80%", "60%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-blue-900/10 backdrop-blur-sm rounded-lg border border-blue-800/30 p-3 font-mono text-xs relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="text-blue-300/90 mb-2">$ zodiac-api</div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="text-blue-400/70"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">200</span>
                    <span>GET /api/constellations</span>
                  </div>
                  <div className="mt-1 bg-blue-900/30 p-1 rounded text-xs">
                    {`{name: "${CONSTELLATIONS[activeConstellation].name}", id: ${Math.floor(Math.random() * 1000)}}`}
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-blue-300 mr-1"></span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      █
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Cosmic Metrics Dashboard */}
            <motion.div
              className="mt-4 bg-blue-900/10 backdrop-blur-sm rounded-lg border border-blue-800/30 p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs text-blue-300/90">Cosmic Metrics</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-mono text-xs text-blue-300/70">Processing</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {["Performance", "Security", "Stability", "Velocity"].map((metric, i) => (
                  <div key={metric} className="bg-blue-900/20 rounded p-2 flex flex-col items-center">
                    <div className="text-xs text-blue-300/80 mb-1">{metric}</div>
                    <motion.div
                      className="font-mono text-blue-400 font-bold"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    >
                      {Math.floor(Math.random() * 50 + 50)}%
                    </motion.div>
                  </div>
                ))}
              </div>
              
              <motion.div
                className="mt-3 h-1 w-full bg-blue-900/30 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                    width: ["30%", "100%", "60%"]
                  }}
                  transition={{ 
                    backgroundPosition: { duration: 3, repeat: Infinity },
                    width: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.p 
          className="text-sm text-blue-300/80 font-mono tracking-wider"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to Navigate
        </motion.p>
        
        <motion.div 
          className="w-6 h-10 border-2 border-blue-500/30 rounded-full flex justify-center p-2"
          whileHover={{ borderColor: 'rgba(96,165,250,0.5)' }}
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-blue-400 rounded-full"
            animate={{
              y: [0, 16, 0],
              backgroundColor: ['#60A5FA', '#A78BFA', '#60A5FA'],
              boxShadow: ['0 0 0px rgba(96,165,250,0)', '0 0 8px rgba(96,165,250,0.8)', '0 0 0px rgba(96,165,250,0)']
            }}
            transition={{
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              backgroundColor: { duration: 2, repeat: Infinity },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-blue-300/80" />
        </motion.div>
      </motion.div>

      {/* Floating binary code overlay - mimicking loading screen */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="text-[0.6rem] font-mono text-blue-300/10 absolute"
            style={{
              left: `${i * 10}%`,
              bottom: `-${Math.random() * 20}px`
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: -200, 
              opacity: [0, 0.2, 0],
              x: i % 2 === 0 ? 20 : -20
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
          >
            {Math.random().toString(2).slice(2, 20)}
            <br/>
            {Math.random().toString(2).slice(2, 20)}
            <br/>
            {Math.random().toString(2).slice(2, 20)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Export with React.memo for better performance
export default React.memo(Hero);