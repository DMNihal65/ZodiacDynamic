import { motion, useScroll, useTransform, useAnimationFrame } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, MessageCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'

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

// Double the testimonials array for infinite scroll effect
const infiniteTestimonials = [...testimonials, ...testimonials]

const TestimonialCard = ({ testimonial, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group min-w-[300px] md:min-w-[400px] p-6 mx-4 h-[400px]
                 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl rounded-3xl
                 border border-white/10 hover:border-white/20 transition-all duration-300
                 flex flex-col"
    >
      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{
          background: `radial-gradient(
            600px circle at ${isHovered ? 'var(--mouse-x, 50%)' : '50%'} ${
            isHovered ? 'var(--mouse-y, 50%)' : '50%'
          }%, 
          rgba(59, 130, 246, 0.1), 
          transparent 40%
          )`
        }}
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-3
                   group-hover:scale-110 transition-transform duration-300"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </motion.div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10">
          <img 
            src={testimonial.image} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
            {testimonial.name}
          </h4>
          <p className="text-gray-400">{testimonial.role}</p>
          <p className="text-blue-500 text-sm">{testimonial.company}</p>
        </div>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed flex-grow">{testimonial.content}</p>

      <div className="flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star 
            key={i}
            className="w-4 h-4 text-blue-400 fill-blue-400"
          />
        ))}
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
  index: PropTypes.number.isRequired
}

export default function Testimonials() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  // Infinite scroll logic
  const containerRef = useRef(null)
  const [scrollX, setScrollX] = useState(0)

  useAnimationFrame(() => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current
      
      // Reset scroll position when reaching the end
      if (scrollX >= (scrollWidth - clientWidth) / 2) {
        setScrollX(0)
        containerRef.current.scrollLeft = 0
      } else {
        setScrollX(prev => prev + 0.5) // Adjust speed by changing this value
        containerRef.current.scrollLeft = scrollX
      }
    }
  })

  // Parallax effect for background
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0F172A]">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("/grid.svg")',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
        }} />
      </div>

      {/* Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-white to-gray-300 mb-6">
            Client Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from our clients about their experience working with us
            and the results we've delivered.
          </p>
        </motion.div>

        {/* Infinite Scroll Container */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#070B14] via-[#070B14]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#070B14] via-[#070B14]/80 to-transparent z-10 pointer-events-none" />
          
          {/* Testimonials Slider */}
          <div 
            ref={containerRef}
            className="flex overflow-x-hidden scrollbar-hide py-8"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex">
              {infiniteTestimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={`${testimonial.name}-${index}`}
                  testimonial={testimonial} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}