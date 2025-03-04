import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Sparkles as ThreeSparkles, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Sparkles, Code, Rocket, Cloud, Shield, Zap, ChevronDown } from 'lucide-react'

// Zodiac sign components with enhanced glow effect
const ZodiacSign = ({ position = [0, 0, 0], symbol, rotation = [0, 0, 0], scale = 1, color = "#60a5fa" }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        font="Inter_28pt-Regular.ttf"
        fontSize={3 * scale}
        color={color}
        position={position}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
        <meshStandardMaterial 
          attach="material" 
          color={color} 
          metalness={0.7} 
          roughness={0.1} 
          emissive={color} 
          emissiveIntensity={0.8} // Increased glow
        />
      </Text>
    </Float>
  )
}

// Enhanced cosmic background with more dynamic elements
const CosmicBackground = ({ mousePosition, isLoaded }) => {
  const signs = [
    { symbol: '♈', position: [-20, 15, -40], rotation: [0.2, 0.1, 0], scale: 1.5, color: "#4f46e5" },
    { symbol: '♉', position: [25, -10, -30], rotation: [-0.3, 0.2, 0.1], scale: 1.2, color: "#8b5cf6" },
    { symbol: '♊', position: [-15, -20, -45], rotation: [0.1, -0.2, 0], scale: 1.3, color: "#60a5fa" },
    { symbol: '♋', position: [30, 20, -50], rotation: [-0.1, 0.3, 0.1], scale: 1.1, color: "#a78bfa" },
    { symbol: '♌', position: [0, 25, -35], rotation: [0.2, 0, -0.1], scale: 1.4, color: "#ec4899" },
    { symbol: '♍', position: [-25, 5, -40], rotation: [0, -0.2, 0.1], scale: 1.2, color: "#3b82f6" },
    { symbol: '♎', position: [15, -15, -30], rotation: [0.3, 0.1, 0], scale: 1.1, color: "#6366f1" },
    { symbol: '♏', position: [-10, 10, -25], rotation: [-0.1, -0.3, 0], scale: 1, color: "#8b5cf6" },
    { symbol: '♐', position: [10, 30, -45], rotation: [0.2, 0.1, 0.1], scale: 1.3, color: "#0ea5e9" },
    { symbol: '♑', position: [-30, -5, -35], rotation: [0, 0.2, -0.1], scale: 1.5, color: "#a855f7" },
    { symbol: '♒', position: [20, 0, -20], rotation: [-0.2, 0, 0.2], scale: 1.2, color: "#60a5fa" },
    { symbol: '♓', position: [0, -25, -30], rotation: [0.1, -0.1, 0], scale: 1.4, color: "#3b82f6" }
  ]

  return (
    <>
      <Stars 
        radius={300} 
        depth={100} 
        count={7000} 
        factor={8} 
        saturation={0.5} 
        fade 
        speed={1}
      />
      <ThreeSparkles 
        count={400} 
        speed={0.4} 
        size={4} 
        color="#8b5cf6" 
        scale={[30, 30, 30]} 
        opacity={0.6}
      />
      
      <group rotation={[mousePosition.y * 0.05, mousePosition.x * 0.05, 0]}>
        {signs.map((sign, index) => (
          <motion.group key={index} initial={{ scale: 0 }} animate={{ scale: isLoaded ? 1 : 0 }} transition={{ delay: index * 0.1 }}>
            <ZodiacSign {...sign} />
          </motion.group>
        ))}
      </group>
      
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[20, 20, 20]} intensity={0.6} color="#ec4899" />
      <pointLight position={[-20, -20, -20]} intensity={0.6} color="#8b5cf6" />

      <Nebula mousePosition={mousePosition} />
    </>
  )
}

// Enhanced nebula effect with more dynamic particles
const Nebula = ({ mousePosition }) => {
  const nebula = useRef()
  
  useEffect(() => {
    if (!nebula.current) return
    
    nebula.current.rotation.x = mousePosition.y * 0.05
    nebula.current.rotation.y = mousePosition.x * 0.05
  }, [mousePosition])

  return (
    <group ref={nebula}>
      <mesh>
        <sphereGeometry args={[100, 64, 64]} />
        <meshBasicMaterial 
          color="#070B14" 
          transparent={true} 
          opacity={0.9} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      <NebulaParticles />
    </group>
  )
}

// Enhanced particle system with more complex distribution
const NebulaParticles = () => {
  const particles = useRef()
  const positions = []
  const colors = []
  const sizes = []
  
  for (let i = 0; i < 10000; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 80 * Math.random()
    const spiralOffset = Math.random() * 15
    
    positions.push(
      Math.cos(angle + spiralOffset * radius * 0.01) * radius,
      (Math.random() - 0.5) * 20,
      Math.sin(angle + spiralOffset * radius * 0.01) * radius
    )
    
    const distanceFromCenter = radius / 80
    const r = 0.4 + 0.6 * (1 - distanceFromCenter)
    const g = 0.3 + 0.3 * (1 - distanceFromCenter)
    const b = 0.7 + 0.3 * (1 - distanceFromCenter)
    
    colors.push(r, g, b)
    sizes.push(0.5 + Math.random() * 3)
  }
  
  useEffect(() => {
    if (!particles.current) return
    particles.current.rotation.z += 0.0001
  })
  
  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={new Float32Array(colors)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={new Float32Array(sizes)}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        vertexColors
        transparent
        size={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Enhanced feature card with more interactive elements
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
        className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg shadow-${feature.shadowColor}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ rotate: -5 }}
        animate={{ rotate: 0 }}
      >
        <feature.Icon className="w-6 h-6 text-white" />
      </motion.div>
      <div className="flex-1">
        <motion.h3 
          className="text-xl font-bold text-white mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p 
          className="text-gray-300 text-sm lg:text-base"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {feature.description}
        </motion.p>
      </div>
    </motion.div>
  )
}

// Main hero component with enhanced animations and transitions
export default function Hero() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll({ target: containerRef })
  const [activeFeature, setActiveFeature] = useState(0)
  const [isRotating, setIsRotating] = useState(true)
  const [currentZodiac, setCurrentZodiac] = useState('♈')
  const [isLoaded, setIsLoaded] = useState(false)

  // Enhanced transform values for scroll animations
  const y = useTransform(scrollY, [0, 1000], [0, 300])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])
  
  // Enhanced feature list with more cosmic theme
  const features = [
    {
      Icon: Code,
      title: "Cosmic Code Architecture",
      description: "Meticulously crafted software solutions that align with your business constellation",
      color: "from-blue-600 to-indigo-600",
      shadowColor: "blue-600/20"
    },
    {
      Icon: Shield,
      title: "Celestial Security Systems",
      description: "Enterprise-grade protection powered by cosmic intelligence",
      color: "from-indigo-600 to-purple-600",
      shadowColor: "indigo-600/20"
    },
    {
      Icon: Cloud,
      title: "Nebula Cloud Solutions",
      description: "Scalable infrastructure that expands like the universe itself",
      color: "from-purple-600 to-pink-600",
      shadowColor: "purple-600/20"
    },
    {
      Icon: Rocket,
      title: "Stellar Digital Acceleration",
      description: "Propel your business to new dimensions with transformative technology",
      color: "from-pink-600 to-blue-600",
      shadowColor: "pink-600/20"
    },
    {
      Icon: Zap,
      title: "Quantum Performance",
      description: "Lightning-fast solutions optimized for the speed of your business",
      color: "from-blue-600 to-cyan-600",
      shadowColor: "blue-600/20"
    }
  ]

  // Zodiac signs array
  const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

  // Enhanced mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 2,
        y: (clientY / innerHeight - 0.5) * 2
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Automatic feature cycling with smooth transitions
  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 5000)
    
    return () => clearInterval(featureInterval)
  }, [features.length])

  // Enhanced zodiac sign cycling
  useEffect(() => {
    const zodiacInterval = setInterval(() => {
      setCurrentZodiac(prev => {
        const currentIndex = zodiacSigns.indexOf(prev)
        return zodiacSigns[(currentIndex + 1) % zodiacSigns.length]
      })
    }, 3000)
    
    return () => clearInterval(zodiacInterval)
  }, [zodiacSigns])

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    return () => clearInterval(timer)
  }, [])

  // Enhanced animation variants
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
      transition: { duration: 0.7, ease: [0.215, 0.610, 0.355, 1.000] }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0F172A]">
      {/* Enhanced 3D Background Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
          <Suspense fallback={null}>
            <CosmicBackground mousePosition={mousePosition} isLoaded={isLoaded} />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.1}
            autoRotate={isRotating}
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

      {/* Enhanced dynamic glow overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-[800px] h-[800px] opacity-30 rounded-full"
          animate={{
            background: [
              'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)'
            ],
            left: ['-400px', '30%', '60%', '-400px'],
            top: ['-400px', '10%', '-400px', '-400px']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 w-[1000px] h-[1000px] opacity-30 rounded-full"
          animate={{
            background: [
              'radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)',
              'radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)'
            ],
            right: ['-500px', '20%', '50%', '-500px'],
            bottom: ['-500px', '5%', '-500px', '-500px']
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Enhanced Main Content */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 min-h-screen flex flex-col justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Enhanced Left Content Column */}
          <div className="space-y-12">
            {/* Enhanced animated badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full 
                         bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                         border border-blue-500/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.div className="relative">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <motion.span 
                    className="absolute text-lg font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {currentZodiac}
                  </motion.span>
                </motion.div>
              </motion.div>
              <motion.span 
                className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 
                           text-transparent bg-clip-text"
                animate={{
                  backgroundPosition: ['0% center', '100% center', '0% center']
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% auto' }}
              >
                Zodiac Dynamics
              </motion.span>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
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
              </h1>
              <motion.p 
                className="text-xl text-gray-300/90 max-w-xl leading-relaxed"
                variants={itemVariants}
              >
                Where cosmic inspiration meets technical precision. We craft digital solutions 
                that transcend the ordinary and propel your business into new dimensions.
              </motion.p>
            </motion.div>

            {/* Enhanced Features Carousel */}
            <motion.div 
              variants={itemVariants}
              className="relative h-48"
            >
              <AnimatePresence mode="wait">
                <motion.div key={activeFeature}>
                  <FeatureCard 
                    feature={features[activeFeature]} 
                    active={true}
                  />
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center mt-6 space-x-2">
                {features.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === activeFeature 
                        ? 'bg-blue-500 w-6' 
                        : 'bg-gray-500/50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      width: index === activeFeature ? 24 : 8,
                      backgroundColor: index === activeFeature 
                        ? ['#3b82f6', '#8b5cf6', '#3b82f6'] 
                        : '#6b7280'
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
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
                <span className="relative text-white font-semibold">
                  Begin Journey
                </span>
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold 
                          rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: 'rgba(255,255,255,0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Services
              </motion.button>
            </motion.div>
          </div>

          {/* Enhanced Right side - 3D Visualization */}
          <motion.div 
            variants={itemVariants}
            className="relative h-[600px] hidden lg:block rounded-3xl overflow-hidden"
            whileHover={() => setIsRotating(false)}
            onHoverEnd={() => setIsRotating(true)}
          >
            <motion.div 
              className="absolute inset-0 w-full h-full border-2 border-white/10 rounded-3xl backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Interactive Element - Mouse hover shows different zodiac constellation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [0.9, 1, 0.9]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {currentZodiac}
              </motion.div>
            </div>
            
            {/* Interactive instructions */}
            <motion.div 
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-white/60 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              Hover to explore the cosmic constellation
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Scroll indicator */}
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
          className="text-sm text-white/60"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to Explore
        </motion.p>
        
        <motion.div 
          className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2"
          whileHover={{ borderColor: 'rgba(255,255,255,0.4)' }}
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-blue-400 rounded-full"
            animate={{
              y: [0, 16, 0],
              backgroundColor: ['#60A5FA', '#A78BFA', '#60A5FA']
            }}
            transition={{
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              backgroundColor: { duration: 2, repeat: Infinity }
            }}
          />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.div>
    </div>
  )
}