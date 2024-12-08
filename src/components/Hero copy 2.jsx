import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import Spline from './SplineScene'

// Enhanced Background Spheres with more dynamic movement
function BackgroundSpheres() {
  return (
    <Stars
      radius={150}
      depth={100}
      count={6000}
      factor={4}
      saturation={0}
      fade
      speed={2}
    />
  )
}

export default function ImprovedHero() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const [isHovered, setIsHovered] = useState({
    startBuilding: false,
    learnMore: false,
    stats: {}
  })

  // Enhanced parallax and scroll effects
  const y = useTransform(scrollY, [0, 1000], [0, 400])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.2])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])

  // Improved mouse move effect with more subtle transformation
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

  // Enhanced variants with more sophisticated animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotate: -5
    },
    visible: {
      opacity: 1, 
      y: 0,
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 }
    }
  }

  // Glitch text effect component
  const GlitchText = ({ children, className }) => {
    return (
      <motion.span 
        className={`relative inline-block ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.7, 1, 0.8] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {children}
        <motion.span 
          className="absolute top-0 left-0 text-blue-400 opacity-30 mix-blend-screen"
          initial={{ x: -2, y: -2 }}
          animate={{ 
            x: [2, -2, 1],
            y: [-2, 2, -1]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {children}
        </motion.span>
      </motion.span>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e]">
      {/* Enhanced 3D Background with more depth */}
      <div className="absolute inset-0 opacity-70">
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#4a4a6a" />
          <BackgroundSpheres />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      {/* Animated gradient overlay with mouse-reactive parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a2e]/40 to-[#0a0a1a]"
        style={{
          backgroundPosition: `${mousePosition.x * 70}px ${mousePosition.y * 70}px`
        }}
      />

      {/* Main content with enhanced animations */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          y, 
          opacity, 
          scale 
        }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content with more interactive elements */}
          <motion.div className="text-left space-y-10">
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              <motion.span 
                className="inline-block px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm font-medium text-blue-200"
                whileHover="hover"
                variants={itemVariants}
              >
                <GlitchText>Innovating the Future</GlitchText>
              </motion.span>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold leading-tight"
                variants={itemVariants}
              >
                <GlitchText className="text-white">Transforming</GlitchText>
                <GlitchText className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Digital Visions
                </GlitchText>
              </motion.h1>
            </motion.div>

            <motion.p 
              className="text-xl text-gray-300 max-w-xl"
              variants={itemVariants}
            >
              Pioneering the future of technology with{' '}
              <GlitchText className="text-blue-300 inline-block">
                cutting-edge solutions
              </GlitchText>{' '}
              that bridge imagination and reality.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              {['Start Building', 'Learn More'].map((buttonText, index) => (
                <motion.button 
                  key={buttonText}
                  className={`
                    px-8 py-4 font-semibold rounded-lg 
                    transition-all shadow-lg backdrop-blur-lg
                    ${index === 0 
                      ? 'bg-white text-primary hover:bg-blue-50' 
                      : 'border-2 border-white/30 text-white hover:bg-white/10'}
                  `}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 25px -5px rgba(255, 255, 255, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovered(prev => ({
                    ...prev, 
                    [buttonText.replace(' ', '').toLowerCase()]: true
                  }))}
                  onHoverEnd={() => setIsHovered(prev => ({
                    ...prev, 
                    [buttonText.replace(' ', '').toLowerCase()]: false
                  }))}
                >
                  {buttonText}
                  <AnimatePresence>
                    {isHovered[buttonText.replace(' ', '').toLowerCase()] && (
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </motion.div>

            {/* Enhanced Stats Section */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
              variants={itemVariants}
            >
              {[
                { value: "98%", label: "Client Satisfaction" },
                { value: "250+", label: "Projects Delivered" },
                { value: "15+", label: "Years Experience" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center relative overflow-hidden p-4 rounded-lg"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.05)"
                  }}
                  onHoverStart={() => setIsHovered(prev => ({
                    ...prev, 
                    stats: { ...prev.stats, [index]: true }
                  }))}
                  onHoverEnd={() => setIsHovered(prev => ({
                    ...prev, 
                    stats: { ...prev.stats, [index]: false }
                  }))}
                >
                  <div className="text-2xl font-bold text-white">
                    <GlitchText>{stat.value}</GlitchText>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <AnimatePresence>
                    {isHovered.stats?.[index] && (
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - 3D Scene with enhanced float */}
          <motion.div 
            className="relative h-[600px] hidden lg:block"
            variants={itemVariants}
          >
            <Float
              speed={1.5}
              rotationIntensity={0.5}
              floatIntensity={0.5}
            >
              <Spline/>
            </Float>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator with more dynamic animation */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-70"
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center p-2">
          <motion.div 
            className="w-1.5 h-1.5 bg-white/80 rounded-full"
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}