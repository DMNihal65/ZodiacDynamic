import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import React from 'react'
import { 
  Code, 
  Rocket, 
  Server, 
  Smartphone, 
  Database, 
  Cpu, 
  Shield, 
  Zap 
} from 'lucide-react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentIcon, setCurrentIcon] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState(0)

  const loadingStages = [
    { Icon: Shield, text: "Securing Connection...", color: "from-blue-500 to-cyan-500" },
    { Icon: Database, text: "Loading Assets...", color: "from-cyan-500 to-teal-500" },
    { Icon: Cpu, text: "Initializing Systems...", color: "from-teal-500 to-emerald-500" },
    { Icon: Server, text: "Configuring Server...", color: "from-emerald-500 to-green-500" },
    { Icon: Code, text: "Compiling Resources...", color: "from-green-500 to-lime-500" },
    { Icon: Smartphone, text: "Optimizing Display...", color: "from-lime-500 to-yellow-500" },
    { Icon: Zap, text: "Powering Up...", color: "from-yellow-500 to-orange-500" },
    { Icon: Rocket, text: "Launching...", color: "from-orange-500 to-red-500" }
  ]

  useEffect(() => {
    const totalDuration = 4000 // 4 seconds total
    const smoothness = 60 // Updates per second
    const interval = totalDuration / smoothness
    const incrementPerStep = 100 / smoothness

    let currentTime = 0
    const progressInterval = setInterval(() => {
      currentTime += interval
      
      // Easing function for smoother progress
      const progress = Math.easeInOutQuad(currentTime / totalDuration) * 100
      setProgress(Math.min(progress, 100))

      // Update loading phase based on progress
      const phase = Math.floor((progress / 100) * loadingStages.length)
      setLoadingPhase(Math.min(phase, loadingStages.length - 1))
      
      if (currentTime >= totalDuration) {
        clearInterval(progressInterval)
      }
    }, interval)

    return () => clearInterval(progressInterval)
  }, [])

  // Custom easing function
  Math.easeInOutQuad = function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-[#070B14] to-[#0F172A] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dynamic gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${loadingStages[loadingPhase].color} opacity-20`}
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
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
        {/* Logo and progress circle */}
        <div className="relative w-40 h-40">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 border-4 border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
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
                strokeDasharray: "360",
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
                transition={{ duration: 0.5 }}
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
                className="text-white/80 text-sm font-medium"
              >
                {loadingStages[loadingPhase].text}
              </motion.div>
            </AnimatePresence>

            {/* Enhanced progress bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${loadingStages[loadingPhase].color.replace('from-', '').replace('to-', '')})`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Percentage display */}
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
