import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'
import PropTypes from 'prop-types'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechVision Inc",
    image: "/testimonials/sarah.jpg",
    content: "NexusForge transformed our digital presence completely. Their expertise in web development and AI integration helped us achieve remarkable results.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Founder, BlockChain Solutions",
    image: "/testimonials/michael.jpg",
    content: "Their Web3 development expertise is unmatched. They delivered a complex DeFi platform that exceeded our expectations.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Product Manager, IoT Systems",
    image: "/testimonials/emma.jpg",
    content: "The IoT solution they developed revolutionized our manufacturing process. Exceptional technical skills and professional service.",
    rating: 5
  }
]

const TestimonialCard = ({ testimonial, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 relative"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
        className="absolute -top-4 -right-4 bg-primary rounded-full p-2"
      >
        <Quote className="w-4 h-4 text-white" />
      </motion.div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img 
            src={testimonial.image} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-white font-semibold">{testimonial.name}</h4>
          <p className="text-gray-300 text-sm">{testimonial.role}</p>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{testimonial.content}</p>

      <div className="flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star 
            key={i}
            className="w-4 h-4 text-yellow-400 fill-yellow-400"
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
    rating: PropTypes.number.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
}

export default function Testimonials() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gradient-start to-gradient-end relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Client Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from our clients about their experience working with us
            and the results we've delivered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.name} 
              testimonial={testimonial} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}