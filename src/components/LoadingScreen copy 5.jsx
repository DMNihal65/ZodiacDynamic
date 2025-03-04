import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stars, Moon, Sun, 
  Sparkles, Orbit,
  ArrowRight, Hourglass,
  
} from 'lucide-react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const zodiacSigns = [
    "♈ Aries", "♉ Taurus", "♊ Gemini", "♋ Cancer",
    "♌ Leo", "♍ Virgo", "♎ Libra", "♏ Scorpio",
    "♐ Sagittarius", "♑ Capricorn", "♒ Aquarius", "♓ Pisces"
  ];

  const loadingPhases = [
    { 
      Icon: Stars,
      text: "Aligning the Stars...",
      color: "from-purple-600 to-blue-600",
      tip: "Did you know? We've completed over 1000+ successful projects!"
    },
    { 
      Icon: Moon,
      text: "Harnessing Cosmic Energy...",
      color: "from-blue-600 to-cyan-600",
      tip: "Our average project completion time is 30% faster than industry standard"
    },
    { 
      Icon: Sun,
      text: "Channeling Solar Power...",
      color: "from-cyan-600 to-yellow-500",
      tip: "We use cutting-edge technology to ensure optimal performance"
    },
    { 
      Icon: Orbit,
      text: "Stabilizing Orbit...",
      color: "from-yellow-500 to-orange-500",
      tip: "Your project is in good hands - we maintain 99.9% uptime"
    },
    { 
      Icon: Stars,
      text: "Mapping Your Success...",
      color: "from-orange-500 to-red-500",
      tip: "Almost there! Final optimizations in progress..."
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

    // Show random tips every 2 seconds
    const tipTimer = setInterval(() => {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 1500);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, []);

  // Interactive Stars effect
  const createStars = (e) => {
    if (interactionCount < 5) {
      setInteractionCount(prev => prev + 1);
    }
  };

  const { Icon, text, color, tip } = loadingPhases[currentPhase];

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={createStars}
    >
      {/* Animated star field background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random(),
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

      {/* Zodiac ring */}
      <motion.div
        className="absolute w-96 h-96"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {zodiacSigns.map((sign, index) => (
          <motion.div
            key={sign}
            className="absolute text-white/30 text-sm"
            style={{
              transform: `rotate(${index * 30}deg) translateY(-11rem)`,
            }}
            whileHover={{ scale: 1.2, color: "rgba(255,255,255,0.8)" }}
          >
            {sign}
          </motion.div>
        ))}
      </motion.div>

      {/* Main content container */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Logo and progress circle */}
        <div className="relative w-48 h-48">
          {/* Animated rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-white/20 rounded-full"
              style={{ scale: 1 - i * 0.1 }}
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

          {/* Progress circle */}
          <svg className="w-full h-full -rotate-90">
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
              className={`fill-none bg-gradient-to-r ${color}`}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              style={{
                stroke: `url(#${color})`,
                strokeDasharray: "360",
                strokeDashoffset: "0",
              }}
            />
          </svg>

          {/* Center icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/10 p-8 rounded-full backdrop-blur-md">
                <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Company name */}
        <motion.h1
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
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

        {/* Loading status */}
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

          {/* Enhanced progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* Interactive tip display */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-white/60 text-sm text-center italic"
              >
                {loadingPhases[currentPhase].tip}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress percentage */}
          <motion.div
            className="text-white/90 font-mono text-xl"
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