import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, AlertCircle, Sparkles } from 'lucide-react'
import Lenis from '@studio-freight/lenis'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Technologies from './components/Technologies'
import Portfolio from './components/Portfolio'
import AboutUs from './components/AboutUs'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

// Sarcastic Dark Mode Toggle Component
const DarkModeToggle = () => {
  const [showMessage, setShowMessage] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const messageTimeoutRef = useRef(null)
  const clickTimeoutRef = useRef(null)
  
  const handleToggleClick = () => {
    setShowMessage(true)
    setIsClicked(true)
    
    // Clear any existing timeouts
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current)
    }
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }
    
    // Set a new timeout to hide the message after 5 seconds
    messageTimeoutRef.current = setTimeout(() => {
      setShowMessage(false)
    }, 5000)
    
    // Set a timeout to reset the clicked state
    clickTimeoutRef.current = setTimeout(() => {
      setIsClicked(false)
    }, 1000)
  }
  
  // Random sarcastic messages
  const messages = [
    "Bro, it's already dark mode. You trying to summon the sun at midnight?",
    "Light mode? In THIS economy? Your retinas will thank me later.",
    "Sorry, the sun called in sick today. Try again tomorrow.",
    "You want light mode? What's next, Comic Sans as the website font?",
    "Dark mode is like the dress code here. We don't do 'business casual' lighting.",
    "Plot twist: this IS the light mode. The dark mode would make your screen turn off.",
    "Light mode is currently on vacation. Left no forwarding address.",
    "If I had a dollar for every time someone wanted light mode, I'd have exactly $0.",
    "Breaking news: Developer refuses to implement light mode, cites 'aesthetic principles'.",
    "Light mode is temporarily unavailable due to the laws of physics and good taste."
  ]
  
  // Get a random message
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]
  
  // Generate random stars for the button
  const stars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1
  }))
  
  return (
    <>
      <motion.button
        onClick={handleToggleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700
                 flex items-center justify-center shadow-lg shadow-blue-900/30 border border-blue-500/30
                 hover:shadow-xl hover:shadow-blue-900/40 transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9, rotate: -15 }}
        animate={isClicked ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Stars that appear on hover */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isHovered ? { 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0],
              y: [0, -10, -20]
            } : { opacity: 0, scale: 0 }}
            transition={{ 
              duration: star.duration, 
              repeat: Infinity, 
              delay: star.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Glow effect */}
        <motion.div 
          className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icons */}
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Moon className="w-6 h-6 text-white" />
        </motion.div>
        
        {/* Sparkle icon that appears on click */}
        <motion.div
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={isClicked ? { opacity: [0, 1, 0], scale: [0, 1.5, 0] } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-10 h-10 text-yellow-300" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed bottom-24 right-8 z-50 max-w-xs bg-gradient-to-r from-blue-900/90 to-indigo-900/90
                     backdrop-blur-md p-4 rounded-xl shadow-xl border border-blue-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1">Dark Mode Only</p>
                <p className="text-gray-300 text-sm">{randomMessage}</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const lenisRef = useRef()

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })
    
    lenisRef.current = lenis
    
    // RAF function for Lenis
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    // Start the animation frame loop
    requestAnimationFrame(raf)
    
    // Loading screen timeout
    const loadingTimeout = setTimeout(() => {
      setLoading(false)
    }, 8000)
    
    // Cleanup function
    return () => {
      clearTimeout(loadingTimeout)
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="font-inter">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : (
          <>
            <Navbar />
            <main>
              <Hero />
              <Services />
              <Technologies />
              <Portfolio />
              <AboutUs />
              <Testimonials />
              <Contact />
            </main>
            <Footer />
            <DarkModeToggle />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App



