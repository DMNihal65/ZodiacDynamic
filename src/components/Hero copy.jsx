import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Stars } from '@react-three/drei'
import { Sphere, Box } from '@react-three/drei'
import Spline from './SplineScene'



// Animated Background Spheres
function BackgroundSpheres() {
  return (
    <Stars
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()

  // Parallax effects
  const y = useTransform(scrollY, [0, 1000], [0, 300])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Mouse move effect
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  }

 // Update the itemVariants object
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut" // Changed from custom cubic-bezier
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/90 to-primary-dark">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <BackgroundSpheres />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-primary-dark"
        style={{
          backgroundPosition: `${mousePosition.x * 50}px ${mousePosition.y * 50}px`
        }}
      />

      {/* Main content */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div className="text-left space-y-8">
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <motion.span 
                className="inline-block px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm font-medium text-blue-200"
                whileHover={{ scale: 1.05 }}
              >
                Innovating the Future
              </motion.span>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold leading-tight"
                variants={itemVariants}
              >
                <span className="text-white">Transforming</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Digital Visions
                </span>
              </motion.h1>
            </motion.div>

            <motion.p 
              className="text-xl text-gray-300 max-w-xl"
              variants={itemVariants}
            >
              Pioneering the future of technology with cutting-edge solutions 
              that bridge imagination and reality.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <motion.button 
                className="px-8 py-4 bg-white text-primary font-semibold rounded-lg 
                          hover:bg-blue-50 transition-all shadow-lg shadow-white/20
                          backdrop-blur-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start Building
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold 
                          rounded-lg hover:bg-white/10 transition-all backdrop-blur-lg"
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
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
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - 3D Scene */}
          <motion.div 
            className="relative h-[600px] hidden lg:block"
            variants={itemVariants}
          >
            <Spline/>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      // Update scroll indicator animation
<motion.div 
  className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
  animate={{
    y: [0, 10, 0],
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut" // Valid easing function
  }}
>
  <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
    <motion.div 
      className="w-1 h-1 bg-white rounded-full"
      animate={{
        y: [0, 16, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" // Valid easing function
      }}
    />
  </div>
</motion.div>
    </div>
  )
} 



