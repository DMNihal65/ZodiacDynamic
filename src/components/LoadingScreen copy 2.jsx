import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  Shield, 
  Rocket, 
  Code, 
  Cpu 
} from 'lucide-react'
import React from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState(0)

  const loadingStages = [
    { Icon: Shield, text: "Initializing Security..." },
    { Icon: Code, text: "Loading Resources..." },
    { Icon: Cpu, text: "Optimizing Systems..." },
    { Icon: Rocket, text: "Launching..." }
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

  // Generate positions for converging elements
  const elements = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 12
    const radius = 150
    return {
      initial: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        scale: 0,
        opacity: 0
      },
      animate: {
        x: 0,
        y: 0,
        scale: 1,
        opacity: [0, 1, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          delay: i * 0.2,
        }
      }
    }
  })

  // Calculate scattered and converged positions for particles
  const getParticleAnimations = (index, total) => {
    // Final converged position (circular formation around center)
    const angle = (index / total) * Math.PI * 2
    const finalRadius = 100 // Radius of final circle formation
    const finalX = Math.cos(angle) * finalRadius
    const finalY = Math.sin(angle) * finalRadius

    // Random scattered position
    const scatterRadius = Math.max(window.innerWidth, window.innerHeight) * 0.75
    const randomAngle = Math.random() * Math.PI * 2
    const scatterX = Math.cos(randomAngle) * scatterRadius
    const scatterY = Math.sin(randomAngle) * scatterRadius

    return {
      initial: {
        x: scatterX,
        y: scatterY,
        opacity: 0,
        scale: 0
      },
      animate: {
        x: [scatterX, finalX, finalX],
        y: [scatterY, finalY, finalY],
        opacity: [0, 1, 1],
        scale: [0, 1, 1],
        transition: {
          duration: 8,
          times: [0, 0.8, 1],
          ease: "easeInOut"
        }
      }
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(24)].map((_, i) => {
          const animations = getParticleAnimations(i, 24)
          return (
            <motion.div
              key={i}
              className="absolute w-4 h-4"
              initial={animations.initial}
              animate={animations.animate}
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
                  delay: i * 0.1
                }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Converging Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        {elements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full"
            initial={element.initial}
            animate={element.animate}
          />
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
        <div className="relative w-40 h-40">
          {/* Progress circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="74"
              className="stroke-white/10 fill-none"
              strokeWidth="4"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="74"
              className="stroke-white fill-none"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                strokeDasharray: "465",
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
                className="bg-white/10 p-6 rounded-full backdrop-blur-sm"
              >
                {React.createElement(loadingStages[loadingPhase].Icon, {
                  className: "w-12 h-12 text-white",
                  strokeWidth: 1.5
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress information */}
        <div className="flex flex-col items-center gap-6 w-full">
          <motion.h1
            className="text-4xl font-bold text-white tracking-wider"
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
            NexusForge
          </motion.h1>
          
          <div className="flex flex-col items-center gap-4 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={loadingPhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white/80 text-sm font-medium h-6"
              >
                {loadingStages[loadingPhase].text}
              </motion.div>
            </AnimatePresence>

            {/* Progress percentage */}
            <motion.div
              className="text-white/90 font-mono text-lg"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 
