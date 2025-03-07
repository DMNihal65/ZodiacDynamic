import React, { useEffect, useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls as DreiOrbitControls, Html, Text, Trail, Billboard, useTexture } from '@react-three/drei';

// Technology data with orbit parameters
const technologies = {
  frontend: [
    { name: 'React', color: '#61DAFB', description: 'A JavaScript library for building user interfaces', orbitalPeriod: 70, distance: 10, size: 1.2 },
    { name: 'Vue', color: '#42B883', description: 'Progressive JavaScript framework for building UIs', orbitalPeriod: 85, distance: 10, size: 1.0 },
    { name: 'Angular', color: '#DD0031', description: 'Platform for building mobile & desktop web apps', orbitalPeriod: 100, distance: 10, size: 1.1 },
    { name: 'Next.js', color: '#000000', description: 'React framework for production-grade apps', orbitalPeriod: 115, distance: 10, size: 1.0 },
    { name: 'Tailwind', color: '#38B2AC', description: 'Utility-first CSS framework', orbitalPeriod: 130, distance: 10, size: 0.9 }
  ],
  backend: [
    { name: 'Node.js', color: '#8CC84B', description: 'JavaScript runtime built on Chromes V8 engine', orbitalPeriod: 90, distance: 20, size: 1.2 },
    { name: 'Python', color: '#3776AB', description: 'Interpreted high-level programming language', orbitalPeriod: 110, distance: 20, size: 1.3 },
    { name: 'Java', color: '#007396', description: 'Object-oriented programming language', orbitalPeriod: 130, distance: 20, size: 1.1 },
    { name: 'Go', color: '#00ADD8', description: 'Statically typed language by Google', orbitalPeriod: 150, distance: 20, size: 1.0 },
    { name: 'GraphQL', color: '#E535AB', description: 'Query language for APIs', orbitalPeriod: 170, distance: 20, size: 0.9 }
  ],
  mobile: [
    { name: 'React Native', color: '#61DAFB', description: 'Framework for building native apps with React', orbitalPeriod: 80, distance: 30, size: 1.2 },
    { name: 'Flutter', color: '#0175C2', description: 'Googles UI toolkit for multi-platform apps', orbitalPeriod: 110, distance: 30, size: 1.1 },
    { name: 'Swift', color: '#FA7343', description: 'Powerful language for iOS development', orbitalPeriod: 140, distance: 30, size: 1.0 },
    { name: 'Kotlin', color: '#7F52FF', description: 'Modern language for Android development', orbitalPeriod: 170, distance: 30, size: 1.0 }
  ],
  cloud: [
    { name: 'AWS', color: '#FF9900', description: 'Comprehensive cloud platform by Amazon', orbitalPeriod: 120, distance: 40, size: 1.4 },
    { name: 'Azure', color: '#0078D4', description: 'Microsofts cloud computing service', orbitalPeriod: 150, distance: 40, size: 1.3 },
    { name: 'GCP', color: '#4285F4', description: 'Googles suite of cloud computing services', orbitalPeriod: 180, distance: 40, size: 1.3 },
    { name: 'Docker', color: '#2496ED', description: 'Platform for developing, shipping, and running apps', orbitalPeriod: 210, distance: 40, size: 1.0 },
    { name: 'Kubernetes', color: '#326CE5', description: 'Container orchestration system', orbitalPeriod: 240, distance: 40, size: 1.1 }
  ]
};

// Category theme mapping
const categoryThemes = {
  frontend: {
    color: '#4F70E5',
    orbitColor: 0x4F70E5,
    gradient: 'from-blue-500/20 to-indigo-500/20',
    distance: 15
  },
  backend: {
    color: '#5E9BF2',
    orbitColor: 0x5E9BF2,
    gradient: 'from-blue-400/20 to-blue-600/20',
    distance: 25
  },
  mobile: {
    color: '#4AA8FF',
    orbitColor: 0x4AA8FF,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    distance: 35
  },
  cloud: {
    color: '#70C5F8',
    orbitColor: 0x70C5F8,
    gradient: 'from-blue-300/20 to-indigo-400/20',
    distance: 45
  }
};

// Orbital Tech Sphere Component - Fixed version without using SVG textures
const TechSphere = ({ tech, distance, category, index, totalTechs, setSelectedTech }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const theme = categoryThemes[category];
  
  // Calculate angle for distributed placement
  const angle = (index / totalTechs) * Math.PI * 2;
  const xPos = Math.cos(angle) * distance;
  const zPos = Math.sin(angle) * distance;
  
  // Animation speed based on orbital period
  const speed = 0.0005 / (tech.orbitalPeriod / 100);
  
  // Create a colored material instead of using textures
  const techColor = new THREE.Color(tech.color);
  
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData = { ...tech, category };
    }
  }, [tech, category]);
  
  return (
    <group>
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
        <meshBasicMaterial
          color={theme.orbitColor}
          transparent={true}
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Tech sphere */}
      <group position={[xPos, 0, zPos]}>
        <Trail
          width={0.5}
          color={new THREE.Color(theme.color)}
          length={5}
          decay={1}
          attenuation={(width) => width}
          visible={hovered}
        >
          <Billboard
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
          >
            <mesh
              ref={meshRef}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={() => setSelectedTech({ ...tech, category })}
              scale={hovered ? 1.2 : 1}
            >
              <sphereGeometry args={[tech.size, 32, 32]} />
              <meshStandardMaterial
                color={techColor}
                emissive={techColor}
                emissiveIntensity={hovered ? 0.8 : 0.3}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            
            {/* Text label for the tech */}
            <Text
              position={[0, -tech.size * 1.5, 0]}
              fontSize={0.8}
              color="white"
              anchorX="center"
              anchorY="middle"
              depthTest={false}
              outlineWidth={0.05}
              outlineColor="#000000"
            >
              {tech.name}
            </Text>
            
            {/* Hover info card */}
            {hovered && (
              <Html distanceFactor={15} position={[0, tech.size * 2.5, 0]} center>
                <div className="bg-[#050A1F]/80 backdrop-blur-md px-3 py-2 rounded-lg border border-blue-500/30 text-white text-xs whitespace-nowrap">
                  Click for details
                </div>
              </Html>
            )}
          </Billboard>
        </Trail>
      </group>
    </group>
  );
};

// Core sun component
const CoreSun = () => {
  const meshRef = useRef();
  const glowRef = useRef();
  
  useEffect(() => {
    if (!meshRef.current || !glowRef.current) return;
    
    const pulseCore = () => {
      const time = Date.now() * 0.001;
      const scale = 1 + Math.sin(time * 2) * 0.05;
      
      if (glowRef.current) {
        glowRef.current.scale.set(scale, scale, scale);
      }
      
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }
      
      requestAnimationFrame(pulseCore);
    };
    
    const animationId = requestAnimationFrame(pulseCore);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <group>
      {/* Inner core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color="#4F70E5"
          emissive="#4F70E5"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color="#4F70E5"
          emissive="#4F70E5"
          emissiveIntensity={1}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Core light */}
      <pointLight color="#4F70E5" intensity={4} distance={100} />
      <ambientLight intensity={0.5} />
    </group>
  );
};

// TechSolarSystem as a React component using @react-three/fiber
const TechSolarSystem = () => {
  const containerRef = useRef();
  const [selectedTech, setSelectedTech] = useState(null);
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    const rotateOrbits = () => {
      setOrbitRotation((prev) => prev + 0.0005);
      requestAnimationFrame(rotateOrbits);
    };
    
    const animationId = requestAnimationFrame(rotateOrbits);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const categoryColors = {
    all: '#4F70E5',
    frontend: '#4F70E5',
    backend: '#5E9BF2',
    mobile: '#4AA8FF',
    cloud: '#70C5F8'
  };
  
  return (
    <div className="relative flex flex-col space-y-4">
      {/* Category filter buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 z-20">
        {['all', 'frontend', 'backend', 'mobile', 'cloud'].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category 
                ? 'bg-blue-500/20 text-blue-100 border border-blue-500/50' 
                : 'bg-blue-900/20 text-blue-200/70 border border-blue-500/10 hover:border-blue-500/30'
            }`}
          >
            {category === 'all' ? 'All Technologies' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      <div 
        ref={(node) => {
          containerRef.current = node;
          ref(node);
        }}
        className="relative w-full h-[550px] md:h-[600px] lg:h-[650px]"
      >
        <Canvas 
          camera={{ position: [0, 30, 70], fov: 55 }}
          dpr={[1, 2]}
          className="bg-gradient-to-b from-[#020817] to-[#050a24]"
          style={{ 
            borderRadius: '1rem',
            boxShadow: '0 0 40px -5px rgba(79, 112, 229, 0.2)'
          }}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={['#070d2d', 30, 90]} />
              
            {/* Stars background */}
            <Stars 
              radius={300} 
              depth={100} 
              count={5000} 
              factor={5} 
              fade={true}
              speed={1}
            />
            
            {/* Camera controls */}
            <DreiOrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              zoomSpeed={0.5}
              rotateSpeed={0.3}
              autoRotate={!selectedTech}
              autoRotateSpeed={0.4}
              minDistance={15}
              maxDistance={100}
            />
            
            {/* Core sun */}
            <CoreSun />
            
            {/* Frontend Tech - only show if activeCategory is 'all' or 'frontend' */}
            {(activeCategory === 'all' || activeCategory === 'frontend') && (
              <group rotation={[0, orbitRotation, 0]}>
                {technologies.frontend.map((tech, i) => (
                  <TechSphere
                    key={tech.name}
                    tech={tech}
                    distance={categoryThemes.frontend.distance}
                    category="frontend"
                    index={i}
                    totalTechs={technologies.frontend.length}
                    setSelectedTech={setSelectedTech}
                  />
                ))}
              </group>
            )}
            
            {/* Backend Tech - only show if activeCategory is 'all' or 'backend' */}
            {(activeCategory === 'all' || activeCategory === 'backend') && (
              <group rotation={[0, -orbitRotation * 0.7, 0]}>
                {technologies.backend.map((tech, i) => (
                  <TechSphere
                    key={tech.name}
                    tech={tech}
                    distance={categoryThemes.backend.distance}
                    category="backend"
                    index={i}
                    totalTechs={technologies.backend.length}
                    setSelectedTech={setSelectedTech}
                  />
                ))}
              </group>
            )}
            
            {/* Mobile Tech - only show if activeCategory is 'all' or 'mobile' */}
            {(activeCategory === 'all' || activeCategory === 'mobile') && (
              <group rotation={[0, orbitRotation * 0.5, 0]}>
                {technologies.mobile.map((tech, i) => (
                  <TechSphere
                    key={tech.name}
                    tech={tech}
                    distance={categoryThemes.mobile.distance}
                    category="mobile"
                    index={i}
                    totalTechs={technologies.mobile.length}
                    setSelectedTech={setSelectedTech}
                  />
                ))}
              </group>
            )}
            
            {/* Cloud Tech - only show if activeCategory is 'all' or 'cloud' */}
            {(activeCategory === 'all' || activeCategory === 'cloud') && (
              <group rotation={[0, -orbitRotation * 0.3, 0]}>
                {technologies.cloud.map((tech, i) => (
                  <TechSphere
                    key={tech.name}
                    tech={tech}
                    distance={categoryThemes.cloud.distance}
                    category="cloud"
                    index={i}
                    totalTechs={technologies.cloud.length}
                    setSelectedTech={setSelectedTech}
                  />
                ))}
              </group>
            )}
          </Suspense>
        </Canvas>
        
        {/* Small loading indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-blue-400/20 animate-ping" />
        </div>
        
        {/* Tech details popup */}
        {selectedTech && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 lg:right-8 top-4 lg:top-8 max-w-sm bg-[#070B14]/90 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30 shadow-2xl z-10"
          >
            <button 
              onClick={() => setSelectedTech(null)}
              className="absolute top-3 right-3 text-blue-300 hover:text-blue-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-blue-500/20 p-2 flex items-center justify-center">
                <div 
                  className="w-8 h-8 rounded-full" 
                  style={{ backgroundColor: selectedTech.color }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedTech.name}</h3>
                <p className="text-xs text-blue-300">{selectedTech.category.charAt(0).toUpperCase() + selectedTech.category.slice(1)}</p>
              </div>
            </div>
            
            <p className="text-blue-100/80 text-sm mb-4">{selectedTech.description}</p>
            
            <div 
              className="w-full h-[3px] rounded-full mb-4 overflow-hidden bg-blue-900/30"
            >
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '100%' }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full"
                style={{ background: `linear-gradient(90deg, ${categoryThemes[selectedTech.category].color}, #60A5FA)` }}
              />
            </div>
            
            <button 
              className="w-full py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-sm font-medium transition-colors duration-300"
            >
              Explore Technology
            </button>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-[#070B14]/80 backdrop-blur-xl p-3 md:p-4 rounded-xl border border-blue-500/20 text-xs md:text-sm text-blue-100/90 max-w-xs z-10">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Interactive Space</span>
        </div>
        <ul className="space-y-1.5 text-xs md:text-sm">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Click on any sphere for details
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Drag to explore the cosmos
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Use filters to focus view
          </li>
        </ul>
      </div>
    </div>
  );
};

// Enhanced Tech Category Card with interactive elements
const TechCategoryCard = ({ category, title, icon, description, techs, color, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const [isHovered, setIsHovered] = useState(false);
  
  const variantContainer = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: index * 0.1 + 0.3
      }
    }
  };
  
  const variantItem = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <motion.div
      ref={ref}
      variants={variantContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-gradient-to-b from-[#090F28]/90 to-[#070B14]/90 backdrop-blur-xl 
                 border border-blue-500/20 rounded-2xl p-6 overflow-hidden
                 hover:border-blue-500/40 transition-all duration-300 group"
    >
      {/* Gradient background effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 60%)`
        }}
      />
      
      <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} 
      />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <motion.div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ 
            background: `linear-gradient(45deg, ${color}30, ${color}10)`,
            boxShadow: isHovered ? `0 0 20px ${color}30` : 'none',
            transition: 'box-shadow 0.3s ease'
          }}
          whileHover={{ rotate: 5, scale: 1.05 }}
        >
          {icon.svg}
        </motion.div>
        <div>
          <motion.h3 
            className="text-xl font-bold"
            style={{ 
              color: isHovered ? color : 'white',
              transition: 'color 0.3s ease' 
            }}
          >
            {title}
          </motion.h3>
          <div className="w-0 h-0.5 group-hover:w-full transition-all duration-500" 
               style={{ background: color }} />
        </div>
      </div>
      
      {/* Description */}
      <p className="text-blue-100/70 mb-5 leading-relaxed">
        {description}
      </p>
      
      {/* Tech tags with animation */}
      <div className="flex gap-2 flex-wrap mt-auto">
        {techs.map((tech, i) => (
          <motion.span 
            key={tech.name}
            variants={variantItem}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
                     transition-colors duration-300 hover:bg-blue-500/20
                     bg-blue-500/10 text-blue-200"
            whileHover={{ y: -2, x: 2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tech.color }} 
            />
            {tech.name}
          </motion.span>
        ))}
      </div>
      
      {/* Corner decorative element */}
      <div className="absolute top-3 right-3 w-10 h-10 opacity-10 rotate-45">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill={color} />
        </svg>
      </div>
    </motion.div>
  );
};

// Main Technologies component
export default function Technologies() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  
  const [mainRef, mainInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Enhanced category card data with icons
  const categoryCards = [
    { 
      category: 'frontend',
      title: 'Frontend Excellence',
      icon: { 
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
      },
      description: 'Creating stellar user interfaces with modern frameworks that deliver exceptional experiences across all devices.',
      techs: technologies.frontend,
      color: '#4F70E5'
    },
    {
      category: 'backend',
      title: 'Robust Backend',
      icon: {
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
      },
      description: 'Powering applications with scalable, secure backend solutions that ensure performance and reliability.',
      techs: technologies.backend,
      color: '#5E9BF2'
    },
    {
      category: 'mobile',
      title: 'Celestial Mobile',
      icon: {
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
      },
      description: 'Building native and cross-platform mobile applications that extend your digital reach to every user device.',
      techs: technologies.mobile,
      color: '#4AA8FF'
    },
    {
      category: 'cloud',
      title: 'Nebula Cloud',
      icon: {
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
      },
      description: 'Deploying and scaling with modern cloud infrastructure that ensures your solutions reach cosmic scale.',
      techs: technologies.cloud,
      color: '#70C5F8'
    }
  ];

  return (
    <section id="technologies" className="py-32 relative overflow-hidden bg-gradient-to-b from-[#030617] to-[#050A1F]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#030617] opacity-90" />
      
      {/* Enhanced animated nebula effects */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(ellipse at 10% 90%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 90% 10%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, rgba(79, 112, 229, 0.2) 0%, transparent 60%)',
            'radial-gradient(ellipse at 10% 90%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Animated stars/particles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          style={{
            backgroundImage: 'url("/stars-bg.svg")', // Assuming you have this asset
            backgroundSize: 'cover',
            opacity: 0.3
          }}
        />
      </div>
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundSize: '50px 50px',
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div
          ref={mainRef}
          style={{ opacity }}
          className="text-center mb-20 space-y-6"
        >
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={mainInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                     bg-gradient-to-r from-blue-500/20 to-blue-600/10
                     border border-blue-500/30 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
              Our Technology Cosmos
            </span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={mainInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-blue-300 bg-clip-text text-transparent"
          >
            Cosmic Tech Arsenal
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mainInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our interstellar technology ecosystem that powers digital transformation across the universe
          </motion.p>
          
          {/* Animated accent elements */}
          <div className="relative h-10 w-full flex items-center justify-center">
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
              initial={{ width: 0 }}
              animate={mainInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={mainInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -left-10 top-0 w-4 h-4"
            >
              <div className="w-full h-full rounded-full bg-blue-300 animate-ping opacity-75" />
              <div className="absolute inset-0 rounded-full bg-blue-400" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={mainInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -right-5 top-5 w-2 h-2"
            >
              <div className="w-full h-full rounded-full bg-blue-300 animate-ping opacity-75" />
              <div className="absolute inset-0 rounded-full bg-blue-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Solar System Display in a dedicated card with border */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mx-auto mb-24 max-w-5xl"
        >
          <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-[#030617]/90 backdrop-blur-lg">
            <div className="py-6 px-4">
              <h3 className="text-xl font-semibold text-center text-blue-200 mb-1">Our Technology Universe</h3>
              <p className="text-blue-300/70 text-sm text-center mb-4">Explore our interactive solar system of technologies</p>
              
              <TechSolarSystem />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30"></div>
        </motion.div>
        
        {/* Technology Category Cards - Enhanced Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
        >
          {categoryCards.map((card, index) => (
            <TechCategoryCard
              key={card.category}
              {...card}
              index={index}
            />
          ))}
        </motion.div>
        
        {/* Enhanced Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { value: "20+", label: "Core Technologies", color: "#4F70E5", icon: "🚀" },
            { value: "100+", label: "Projects Delivered", color: "#5E9BF2", icon: "🌟" },
            { value: "99%", label: "Client Satisfaction", color: "#4AA8FF", icon: "❤️" },
            { value: "24/7", label: "Stellar Support", color: "#70C5F8", icon: "🛠️" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5, boxShadow: `0 15px 30px -8px ${stat.color}40` }}
              className="text-center p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-lg
                       border border-white/10 flex flex-col items-center justify-center
                       hover:border-blue-500/30 transition-all duration-300"
            >
              <span className="text-2xl mb-2">{stat.icon}</span>
              <h4 
                className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              >
                {stat.value}
              </h4>
              <p className="text-blue-200/70 text-sm">{stat.label}</p>
              <div className="w-0 group-hover:w-full h-0.5 mt-2 transition-all duration-300" 
                  style={{ background: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030617] to-transparent pointer-events-none" />
    </section>
  );
}
