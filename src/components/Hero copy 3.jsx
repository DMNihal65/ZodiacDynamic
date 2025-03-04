import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Spline from './SplineScene'
import { 
  Sparkles, 
  Brain,
  Cloud,
  Shield,
  Workflow
} from 'lucide-react'

const BackgroundStars = () => (
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

const FeatureCard = ({ feature }) => (
  <div className="flex items-start gap-4">
    <motion.div
      className={`p-4 rounded-xl bg-gradient-to-br ${feature.color}`}
      whileHover={{ scale: 1.05 }}
    >
      <feature.Icon className="w-6 h-6 text-white" />
    </motion.div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-gray-300">{feature.description}</p>
    </div>
  </div>
)

export default function Hero() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const [activeFeature, setActiveFeature] = useState(0)

  const y = useTransform(scrollY, [0, 1000], [0, 300])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const features = [
    {
      Icon: Brain,
      title: "AI-Powered Solutions",
      description: "Leveraging cutting-edge artificial intelligence for smarter applications",
      color: "from-blue-500 to-indigo-500"
    },
    {
      Icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade protection for your mission-critical systems",
      color: "from-indigo-500 to-purple-500"
    },
    {
      Icon: Cloud,
      title: "Cloud Architecture",
      description: "Scalable infrastructure that grows with your business",
      color: "from-purple-500 to-pink-500"
    },
    {
      Icon: Workflow,
      title: "Digital Transformation",
      description: "Modernizing businesses for the digital age",
      color: "from-pink-500 to-blue-500"
    }
  ]

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0F172A]">
      {/* Background with interactive particles */}
      <div className="absolute inset-0">
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <BackgroundStars />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>

      {/* Dynamic gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            'radial-gradient(600px circle at 0% 0%, rgba(59,130,246,0.4), transparent)',
            'radial-gradient(600px circle at 100% 100%, rgba(59,130,246,0.4), transparent)',
            'radial-gradient(600px circle at 0% 0%, rgba(59,130,246,0.4), transparent)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Main content */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen flex items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left content */}
          <motion.div className="space-y-12">
            {/* Enhanced badge */}
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
                <Sparkles className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 
                             text-transparent bg-clip-text">
                Innovating Tomorrow's Technology
              </span>
            </motion.div>

            {/* Enhanced heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <motion.span 
                  className="block text-white"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Building Digital
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
                  Excellence
                </motion.span>
              </h1>
              <motion.p 
                className="text-xl text-gray-300/90 max-w-xl leading-relaxed"
                variants={itemVariants}
              >
                Empowering businesses with cutting-edge software solutions that 
                drive innovation, efficiency, and growth in the digital era.
              </motion.p>
            </motion.div>

            {/* Rotating features showcase */}
            <motion.div 
              variants={itemVariants}
              className="relative h-32 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <FeatureCard feature={features[activeFeature]} />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Enhanced CTA buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-6"
            >
              <motion.button 
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 
                          rounded-lg relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute inset-0 bg-white"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 2, opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative text-white font-semibold">
                  Start Your Project
                </span>
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold 
                          rounded-lg backdrop-blur-sm hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Our Work
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right content - 3D Scene */}
          <motion.div 
            variants={itemVariants}
            className="relative h-[600px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Spline />
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
      </motion.div>
    </div>
  )
}