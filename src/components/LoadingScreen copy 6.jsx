import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Database, Server, 
  Cloud, Cpu, Globe,
  Shield, Sparkles, Layers,
  Binary
} from 'lucide-react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showTip, setShowTip] = useState(false);

  // Tech-focused loading phases with cosmic theme
  const loadingPhases = [
    { 
      Icon: Code,
      text: "Initializing Development Environment...",
      color: "from-indigo-600 to-blue-600",
      tip: "Our code quality score is in the top 1% of software agencies!"
    },
    { 
      Icon: Database,
      text: "Connecting to Quantum Database...",
      color: "from-blue-600 to-cyan-600",
      tip: "We process over 1M transactions daily with 99.99% uptime"
    },
    { 
      Icon: Cloud,
      text: "Deploying Cloud Infrastructure...",
      color: "from-cyan-600 to-teal-500",
      tip: "Our cloud solutions scale automatically with your needs"
    },
    { 
      Icon: Shield,
      text: "Establishing Security Protocols...",
      color: "from-teal-500 to-emerald-500",
      tip: "Enterprise-grade security with real-time threat detection"
    },
    { 
      Icon: Globe,
      text: "Optimizing Global Network...",
      color: "from-emerald-500 to-purple-500",
      tip: "Serving clients across 30+ countries worldwide"
    }
  ];

  useEffect(() => {
    const totalDuration = 5000;
    const interval = 50;
    const incrementPerStep = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + incrementPerStep, 100);
        const newPhase = Math.floor((newProgress / 100) * loadingPhases.length);
        setCurrentPhase(Math.min(newPhase, loadingPhases.length - 1));
        return newProgress;
      });
    }, interval);

    const tipTimer = setInterval(() => {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 1500);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, []);

  // Interactive tech particles effect
  const createTechParticle = (e) => {
    if (interactionCount < 5) {
      setInteractionCount(prev => prev + 1);
    }
  };

  const { Icon, text, color, tip } = loadingPhases[currentPhase];

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-b from-black to-blue-950 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={createTechParticle}
    >
      {/* Enhanced star field with binary code particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/30 text-xs font-mono"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random(),
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {Math.random() > 0.5 ? "0" : "1"}
          </motion.div>
        ))}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Circuit board pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Enhanced progress circle */}
        <div className="relative w-48 h-48">
          {/* Tech rings with data flow effect */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 rounded-full"
              style={{ 
                scale: 1 - i * 0.1,
                borderImage: `linear-gradient(${45 + i * 30}deg, transparent, ${loadingPhases[currentPhase].color.split(' ')[1]}, transparent) 1`
              }}
              animate={{ 
                rotate: 360,
                scale: [1 - i * 0.1, 1 - i * 0.05, 1 - i * 0.1]
              }}
              transition={{ 
                rotate: { duration: 10 - i * 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))}

          {/* Progress circle with tech glow */}
          <svg className="w-full h-full -rotate-90">
            <defs>
              <linearGradient id={`gradient-${currentPhase}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="from-color" />
                <stop offset="100%" className="to-color" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="96"
              cy="96"
              r="92"
              className="stroke-white/10 fill-none"
              strokeWidth="2"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="92"
              className="fill-none"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              style={{
                stroke: `url(#gradient-${currentPhase})`,
                filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
                strokeDasharray: "360",
                strokeDashoffset: "0",
              }}
            />
          </svg>

          {/* Animated center icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-black/80 to-blue-900/80 p-8 rounded-full backdrop-blur-xl border border-white/10">
                <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced company name */}
        <motion.h1
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
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
          ZodiacDynamics
        </motion.h1>

        {/* Loading status with enhanced animations */}
        <div className="flex flex-col items-center gap-4 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              className="text-white/80 text-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {text}
            </motion.div>
          </AnimatePresence>

          {/* Tech-styled progress bar */}
          <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
              }}
            />
          </div>

          {/* Enhanced tip display */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-white/60 text-sm text-center italic"
              >
                {tip}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tech-styled progress percentage */}
          <motion.div
            className="text-white/90 font-mono text-xl tracking-wider"
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
      </motion.div>
    </motion.div>
  );
}