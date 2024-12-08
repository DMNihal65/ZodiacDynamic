import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Target, 
  Users, 
  Lightbulb,
  Award,
  ChevronRight,
  Rocket,
  Code,
  Puzzle
} from 'lucide-react'

const values = [
  {
    title: 'Innovation First',
    description: 'Pushing boundaries with cutting-edge solutions',
    Icon: Lightbulb
  },
  {
    title: 'Client Success',
    description: 'Your success is our primary mission',
    Icon: Target
  },
  {
    title: 'Expert Team',
    description: 'Skilled professionals dedicated to excellence',
    Icon: Users
  },
  {
    title: 'Quality Driven',
    description: 'Uncompromising standards in every project',
    Icon: Award
  }
]

const stats = [
  { number: '150+', label: 'Projects Completed' },
  { number: '50+', label: 'Expert Developers' },
  { number: '15+', label: 'Countries Served' },
  { number: '98%', label: 'Client Satisfaction' }
]

const ValueCard = ({ value, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4"
      >
        <value.Icon className="w-6 h-6 text-white" />
      </motion.div>
      <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
      <p className="text-gray-300">{value.description}</p>
    </motion.div>
  )
}

const StatCounter = ({ stat, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1 + 0.2 }
        } : {}}
        className="text-4xl font-bold text-white mb-2"
      >
        {stat.number}
      </motion.div>
      <div className="text-gray-300">{stat.label}</div>
    </motion.div>
  )
}

export default function AboutUs() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section id="about-us" className="py-20 bg-gradient-to-b from-gradient-end to-gradient-start relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-white/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

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
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3">
              <Rocket className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Journey of Innovation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Building the future of digital technology with passion, expertise, and 
            unwavering commitment to excellence.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Join Our Team
            <ChevronRight className="ml-2 w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}