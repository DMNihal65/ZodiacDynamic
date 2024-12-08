import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Stars } from '@react-three/drei'
import { Sphere, Box } from '@react-three/drei'
import Spline from './SplineScene'
import { Code, Rocket, Globe2, Cpu } from 'lucide-react'
import { Sparkles } from 'lucide-react'



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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0F172A]">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <BackgroundSpheres />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Animated gradient overlays */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070B14]/50 to-[#070B14]"
        style={{
          backgroundPosition: `${mousePosition.x * 50}px ${mousePosition.y * 50}px`
        }}
      />
      
      {/* Animated glow effects */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, #3B82F6 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, #3B82F6 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, #3B82F6 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Main content with improved layout */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left content with enhanced styling */}
          <motion.div className="text-left space-y-10">
            {/* Enhanced badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full 
                         bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm
                         hover:bg-blue-500/15 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 
                             text-transparent bg-clip-text">
                Next Generation Technology
              </span>
            </motion.div>

            {/* Enhanced heading with gradient animation */}
            <motion.div className="space-y-4">
              <motion.h1 
                className="text-6xl md:text-7xl font-bold leading-tight tracking-tight"
                variants={itemVariants}
              >
                <motion.span 
                  className="text-white block"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  Transforming
                </motion.span>
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r 
                             from-blue-400 via-purple-400 to-pink-400"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Digital Visions
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Enhanced description */}
            <motion.p 
              className="text-xl text-gray-300/90 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              Pioneering the future of technology with innovative solutions 
              that transform imagination into reality.
            </motion.p>

            {/* Feature cards with enhanced styling
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={itemVariants}
            >
              {[
                { Icon: Code, label: "Clean Code", color: "from-blue-400 to-blue-600" },
                { Icon: Rocket, label: "Fast Performance", color: "from-purple-400 to-purple-600" },
                { Icon: Globe2, label: "Global Scale", color: "from-pink-400 to-pink-600" },
                { Icon: Cpu, label: "Smart Solutions", color: "from-indigo-400 to-indigo-600" }
              ].map(({ Icon, label, color }, index) => (
                <motion.div
                  key={label}
                  className="group relative p-4 rounded-xl bg-white/5 backdrop-blur-sm
                           border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      className={`p-3 rounded-lg bg-gradient-to-r ${color} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white
                                   transition-colors duration-300">
                      {label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div> */}

            {/* Enhanced buttons */}
            <motion.div 
              className="flex flex-wrap gap-6"
              variants={itemVariants}
            >
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                          font-semibold rounded-lg transition-all duration-300
                          hover:shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Building
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold 
                          rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Enhanced stats */}
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
                  className="group p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                              text-transparent bg-clip-text"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-400 group-hover:text-gray-300
                                transition-colors duration-300">
                    {stat.label}
                  </div>
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

      {/* Enhanced scroll indicator */}
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
        <span className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors">
          Scroll to explore
        </span>
        <motion.div 
          className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2
                     hover:border-white/40 transition-colors"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{
              y: [0, 16, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
} 



