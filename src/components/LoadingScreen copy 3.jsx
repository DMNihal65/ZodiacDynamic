import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  Shield, 
  Rocket, 
  Code, 
  Cpu,
  Orbit,
  Sparkles
} from 'lucide-react'
import React from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState(0)

  const loadingStages = [
    { Icon: Shield, text: "Securing Channels...", color: "text-blue-400" },
    { Icon: Code, text: "Initializing Protocols...", color: "text-green-400" },
    { Icon: Cpu, text: "Calibrating Systems...", color: "text-purple-400" },
    { Icon: Rocket, text: "Launching Nexus...", color: "text-orange-400" }
  ]

  useEffect(() => {
    const totalDuration = 5000 // 5 seconds total
    const phaseInterval = totalDuration / loadingStages.length
    let startTime = null
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsedTime = timestamp - startTime
      const currentProgress = Math.min((elapsedTime / totalDuration) * 100, 100)
      
      const currentPhase = Math.min(
        Math.floor((elapsedTime / phaseInterval)),
        loadingStages.length - 1
      )

      setProgress(currentProgress)
      setLoadingPhase(currentPhase)

      if (currentProgress < 100) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  // Generate scattered particle positions
  const generateScatteredParticles = (count) => {
    return Array.from({ length: count }, (_, i) => {
      // Calculate random scattered position
      const angle = Math.random() * Math.PI * 2
      const radius = Math.max(window.innerWidth, window.innerHeight) * 0.8
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      return {
        id: i,
        initial: {
          x: x,
          y: y,
          opacity: 0,
          scale: 0.5
        },
        animate: {
          x: [x, 0],
          y: [y, 0],
          opacity: [0, 1, 0.8],
          scale: [0.5, 1, 0.8],
          transition: {
            duration: 5,
            times: [0, 0.8, 1],
            ease: "easeInOut",
            delay: i * 0.1
          }
        }
      }
    })
  }

  const particles = generateScatteredParticles(36)

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-4 h-4"
            initial={particle.initial}
            animate={particle.animate}
          >
            <motion.div
              className="w-full h-full bg-white/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: particle.id * 0.1
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content container */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-12 max-w-md w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress circle and icon */}
        <div className="relative w-48 h-48">
          {/* Progress circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="90"
              className="stroke-white/10 fill-none"
              strokeWidth="6"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="90"
              className="stroke-white/50 fill-none"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                strokeDasharray: "565",
                strokeDashoffset: "0",
              }}
            />
          </svg>

          {/* Center icon container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={loadingPhase}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 p-8 rounded-full backdrop-blur-sm"
              >
                {React.createElement(loadingStages[loadingPhase].Icon, {
                  className: `w-16 h-16 text-white ${loadingStages[loadingPhase].color}`,
                  strokeWidth: 1.5
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress information */}
        <div className="flex flex-col items-center gap-6 w-full">
          <motion.h1
            className="text-5xl font-bold text-white tracking-wider flex items-center gap-2"
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Nexus
            <Sparkles 
              className="text-yellow-400 animate-pulse" 
              strokeWidth={2} 
            />
            Forge
          </motion.h1>
          
          <div className="flex flex-col items-center gap-4 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={loadingPhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white/80 text-sm font-medium h-6 text-center"
              >
                {loadingStages[loadingPhase].text}
              </motion.div>
            </AnimatePresence>

            {/* Progress percentage */}
            <motion.div
              className="text-white/90 font-mono text-xl flex items-center gap-2"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Orbit 
                className="text-white/50 animate-spin" 
                size={20} 
                strokeWidth={1.5} 
              />
              {Math.round(progress)}%
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}