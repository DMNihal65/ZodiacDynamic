import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Star, 
  Users, 
  Code, 
  Award,
  ChevronDown,
  Rocket,
  ArrowRight,
  Globe,
  Zap,
  Check,
  Terminal,
  Hexagon,
  X
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import React from 'react'

// Company journey data
const journeySteps = [
  {
    id: 1,
    year: '2015',
    title: 'Foundation',
    description: 'Our company was founded with a vision to create innovative digital solutions that transform businesses.',
    icon: Rocket,
    color: 'blue'
  },
  {
    id: 2,
    year: '2017',
    title: 'Team Expansion',
    description: 'We expanded our team of developers and designers, broadening our expertise in mobile and cloud solutions.',
    icon: Users,
    color: 'purple'
  },
  {
    id: 3,
    year: '2019',
    title: 'Innovation Framework',
    description: 'Developed our proprietary development framework that accelerated project delivery by 40%.',
    icon: Zap,
    color: 'green'
  },
  {
    id: 4,
    year: '2021',
    title: 'Industry Recognition',
    description: 'Received multiple industry awards for our innovative solutions and exceptional client satisfaction.',
    icon: Award,
    color: 'orange'
  },
  {
    id: 5,
    year: '2023',
    title: 'Future Technologies',
    description: 'Expanded our services to include AI and blockchain solutions, pushing the boundaries of what is possible.',
    icon: Globe,
    color: 'pink'
  }
]

// Core values data
const values = [
  {
    title: 'Innovation',
    description: 'We constantly push boundaries with cutting-edge solutions and emerging technologies.',
    Icon: Zap,
    color: 'blue',
    highlights: ['AI/ML Integration', 'Blockchain Solutions', 'IoT Platforms']
  },
  {
    title: 'Client Focus',
    description: 'Your success is our primary mission, delivering excellence in every project we undertake.',
    Icon: Star,
    color: 'purple',
    highlights: ['24/7 Support', 'Agile Development', 'Regular Updates']
  },
  {
    title: 'Expert Team',
    description: 'Our skilled professionals are dedicated to crafting exceptional digital experiences.',
    Icon: Users,
    color: 'green',
    highlights: ['Senior Developers', 'UI/UX Experts', 'DevOps Engineers']
  },
  {
    title: 'Quality Assurance',
    description: 'We maintain uncompromising standards in code quality and project delivery.',
    Icon: Code,
    color: 'orange',
    highlights: ['Code Reviews', 'Testing', 'Performance']
  }
]

// Company stats
const stats = [
  { number: '150+', label: 'Projects Delivered', icon: Rocket },
  { number: '50+', label: 'Expert Developers', icon: Users },
  { number: '15+', label: 'Countries Served', icon: Globe },
  { number: '98%', label: 'Client Satisfaction', icon: Star }
]

// Animated star component for background
const AnimatedStar = ({ size, top, left, delay, duration }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        top: `${top}%`,
        left: `${left}%`,
      }}
      animate={{
        opacity: [0.1, 0.8, 0.1],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  )
}

// Interactive terminal component
const InteractiveTerminal = ({ activeStep }) => {
  const step = journeySteps[activeStep];
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = `> Loading ${step.year}_milestone.js\n> ${step.title}\n> ${step.description}`;
  
  useEffect(() => {
    setText('');
    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(typing);
      }
    }, 30);
    
    const cursorBlink = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => {
      clearInterval(typing);
      clearInterval(cursorBlink);
    };
  }, [activeStep, fullText]);
  
  return (
    <motion.div 
      className="bg-[#1E1E1E] rounded-xl border border-gray-700 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-sm font-mono">company-journey.js</div>
        <div></div>
      </div>
      
      {/* Terminal content */}
      <div className="p-6 font-mono text-sm text-green-400 h-[200px] overflow-y-auto">
        <pre className="whitespace-pre-wrap">
          {text}
          {cursorVisible && <span className="animate-pulse">▌</span>}
        </pre>
      </div>
    </motion.div>
  );
};

// Interactive journey map component
const JourneyMap = ({ activeStep, setActiveStep }) => {
  return (
    <div className="relative py-10">
      {/* Connection line - hidden on mobile, visible on larger screens */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 hidden md:block"></div>
      
      {/* Journey nodes */}
      <div className="flex flex-col md:flex-row justify-between relative space-y-8 md:space-y-0">
        {journeySteps.map((step, index) => (
          <motion.div 
            key={step.id}
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {/* Vertical connection line for mobile */}
            {index < journeySteps.length - 1 && (
              <div className="absolute h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 top-full left-1/2 transform -translate-x-1/2 md:hidden"></div>
            )}
            
            <motion.button
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeStep === index 
                  ? `bg-${step.color}-500 ring-4 ring-${step.color}-300 ring-opacity-50 shadow-lg shadow-${step.color}-500/30` 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setActiveStep(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {React.createElement(step.icon, { 
                className: `w-8 h-8 ${activeStep === index ? 'text-white' : 'text-gray-400'}` 
              })}
            </motion.button>
            <div className={`mt-4 text-center transition-all duration-300 ${activeStep === index ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`text-lg font-bold ${activeStep === index ? `text-${step.color}-400` : 'text-gray-400'}`}>
                {step.year}
              </div>
              <div className={`text-sm ${activeStep === index ? 'text-white' : 'text-gray-500'}`}>
                {step.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Interactive value card
const ValueCard = ({ value, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  const cardColors = {
    blue: 'from-blue-900/20 to-blue-700/5 border-blue-500/30',
    purple: 'from-purple-900/20 to-purple-700/5 border-purple-500/30',
    green: 'from-green-900/20 to-green-700/5 border-green-500/30',
    orange: 'from-orange-900/20 to-orange-700/5 border-orange-500/30'
  };
  
  const iconColors = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400'
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 group ${cardColors[value.color]}`}
    >
      {/* Card background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cardColors[value.color]} backdrop-blur-sm`}></div>
      
      {/* Animated particles */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1 + Math.random() }}
                className={`absolute w-1 h-1 rounded-full ${iconColors[value.color].split(' ')[2]}`}
                style={{
                  top: '50%',
                  left: '50%',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Card content */}
      <div className="relative z-10 p-6">
        <div className={`w-14 h-14 rounded-xl ${iconColors[value.color].split(' ')[0]} border ${iconColors[value.color].split(' ')[1]}
                        flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <value.Icon className={`w-7 h-7 ${iconColors[value.color].split(' ')[2]}`} />
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {value.title}
        </h3>
        <p className="text-gray-300 mb-6">{value.description}</p>
        
        {/* Highlights section */}
        <div className="space-y-0">
          <div 
            className="flex items-center justify-between text-sm font-medium text-blue-400 mb-2 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>Key Highlights</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {value.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center text-gray-400 group-hover:text-gray-300">
                      <Check className={`w-4 h-4 mr-2 ${iconColors[value.color].split(' ')[2]}`} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Interactive stat counter
const StatCounter = ({ stat, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const [count, setCount] = useState(0);
  const targetNumber = parseInt(stat.number.replace(/\D/g, ''));
  
  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = targetNumber / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [inView, targetNumber]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-6 bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10
                hover:border-blue-500/30 transition-all duration-300 group"
    >
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 
                      flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {React.createElement(stat.icon, { className: "w-7 h-7 text-white" })}
        </div>
        
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2 text-center">
          {count}{stat.number.includes('+') ? '+' : ''}
        </div>
        <div className="text-gray-300 font-medium text-center">{stat.label}</div>
      </div>
    </motion.div>
  );
};

// Interactive hexagon grid
const HexagonGrid = () => {
  return (
    <div className="relative h-[200px] overflow-hidden">
      <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-20">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: Math.random() * 360
            }}
            transition={{ 
              delay: i * 0.02, 
              duration: 0.5 
            }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Hexagon className="w-8 h-8 text-blue-500/30" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function AboutUs() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  // Generate random stars for background
  const stars = Array.from({ length: 30 }, () => ({
    size: Math.random() * 2 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }));

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden"
      id="about"
    >
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src="/ffflurry.svg" 
          alt="Background pattern" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {stars.map((star, i) => (
          <AnimatedStar 
            key={i}
            size={star.size}
            top={star.top}
            left={star.left}
            delay={star.delay}
            duration={star.duration}
          />
        ))}
      </div>
      
      {/* Hexagon grid */}
      <HexagonGrid />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl">
              <Terminal className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-6">
            Our Story
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are a team of passionate developers and designers dedicated to creating 
            innovative digital solutions that help businesses thrive in the digital age.
          </p>
        </motion.div>

        {/* Interactive Journey Section */}
        <div className="mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Journey</span>
          </motion.h3>
          
          {/* Interactive journey map */}
          <JourneyMap activeStep={activeStep} setActiveStep={setActiveStep} />
          
          {/* Terminal display */}
          <div className="mt-16">
            <InteractiveTerminal activeStep={activeStep} />
          </div>
        </div>

        {/* Values Grid */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-3xl font-bold text-white text-center mb-12"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Values</span>
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>

        {/* Stats Section */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-3xl font-bold text-white text-center mb-12"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Impact</span>
        </motion.h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <StatCounter key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl
                     hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 overflow-hidden"
          >
            {/* Button shine effect */}
            <motion.div 
              className="absolute inset-0 translate-x-full"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
            </motion.div>
            
            <span className="relative flex items-center justify-center gap-2">
              Join Our Team
              <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50 
                        bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl border border-white/10 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <X className="text-white w-5 h-5" />
              </button>
              
              <div className="p-8">
                {modalContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}