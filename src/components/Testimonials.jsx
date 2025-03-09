import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState, useEffect } from 'react'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechVision Inc",
    image: "/testimonials/sarah.jpg",
    content: "NexusForge transformed our digital presence completely. Their expertise in web development and AI integration helped us achieve remarkable results.",
    rating: 5,
    company: "TechVision"
  },
  {
    name: "Michael Chen",
    role: "Founder, BlockChain Solutions",
    image: "/testimonials/michael.jpg",
    content: "Their Web3 development expertise is unmatched. They delivered a complex DeFi platform that exceeded our expectations.",
    rating: 5,
    company: "BlockChain Solutions"
  },
  {
    name: "Emma Davis",
    role: "Product Manager, IoT Systems",
    image: "/testimonials/emma.jpg",
    content: "The IoT solution they developed revolutionized our manufacturing process. Exceptional technical skills and professional service.",
    rating: 5,
    company: "IoT Systems"
  },
  {
    name: "David Wilson",
    role: "CEO, Digital Innovators",
    image: "/testimonials/david.jpg",
    content: "Outstanding work on our AI-powered analytics platform. The team's technical prowess and dedication to quality are remarkable.",
    rating: 5,
    company: "Digital Innovators"
  },
  {
    name: "Lisa Zhang",
    role: "Director of Engineering",
    image: "/testimonials/lisa.jpg",
    content: "Their cloud architecture expertise helped us scale efficiently. Highly recommended for complex technical projects.",
    rating: 5,
    company: "CloudTech Solutions"
  }
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

AnimatedStar.propTypes = {
  size: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired
}

// Floating particle effect
const FloatingParticle = ({ color, size, top, left, duration }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        width: size,
        height: size,
        top: `${top}%`,
        left: `${left}%`,
        opacity: 0.3
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.5, 0.2]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

FloatingParticle.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired
}

const TestimonialCard = ({ testimonial, isActive }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? 
        { 
          opacity: isActive ? 1 : 0.5, 
          scale: isActive ? 1 : 0.9,
          y: isActive ? 0 : 20
        } : 
        { opacity: 0, scale: 0.9 }
      }
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden ${isActive ? 'z-10' : 'z-0'} 
                 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-2xl
                 border border-white/10 transition-all duration-500 h-full
                 ${isActive ? 'shadow-xl shadow-blue-500/10' : ''}`}
    >
      {/* Quote icon */}
      <div className="absolute -top-6 -left-6 text-blue-500/10">
        <Quote className="w-24 h-24" />
      </div>
      
      <div className="p-8 relative z-10 h-full flex flex-col">
        {/* Content */}
        <p className="text-gray-300 mb-6 leading-relaxed flex-grow text-lg italic">&ldquo;{testimonial.content}&rdquo;</p>
        
        {/* Divider */}
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6"></div>
        
        {/* Author info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10">
          <img 
            src={testimonial.image} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
            <h4 className="text-white font-semibold">
            {testimonial.name}
          </h4>
            <p className="text-gray-400 text-sm">{testimonial.role}</p>
          </div>
      </div>

        {/* Rating */}
        <div className="absolute top-8 right-8 flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star 
            key={i}
            className="w-4 h-4 text-blue-400 fill-blue-400"
          />
        ))}
        </div>
      </div>
    </motion.div>
  )
}

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    company: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired
}

export default function Testimonials() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef(null)
  
  // Generate random stars for background
  const stars = Array.from({ length: 30 }, () => ({
    size: Math.random() * 2 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }))
  
  // Generate floating particles
  const particles = Array.from({ length: 15 }, () => {
    const colors = [
      'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-cyan-500'
    ]
    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 5 + 5
    }
  })
  
  // Handle navigation
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
    if (autoplay) resetAutoplay()
  }
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    if (autoplay) resetAutoplay()
  }
  
  // Autoplay functionality
  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
    
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
  }
  
  useEffect(() => {
    if (autoplay) {
      resetAutoplay()
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay])
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => {
    setAutoplay(true)
    resetAutoplay()
  }

  return (
    <section 
      className="py-24 relative overflow-hidden"
      id="testimonials"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
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
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((particle, i) => (
          <FloatingParticle 
            key={i}
            color={particle.color}
            size={particle.size}
            top={particle.top}
            left={particle.left}
            duration={particle.duration}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
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
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-6">
            Client Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from our clients about their experience working with us
            and the results we&apos;ve delivered.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Cards */}
          <div className="relative h-[400px] md:h-[350px]">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.name}
                  className={`absolute inset-0 transition-all duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <TestimonialCard 
                    testimonial={testimonial} 
                    isActive={index === activeIndex}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
            
            {/* Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index)
                    if (autoplay) resetAutoplay()
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-blue-500 w-6' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}