import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Target, 
  Users, 
  Lightbulb,
  Award,
  ChevronRight,
  Rocket,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'

const values = [
  {
    title: 'Innovation First',
    description: 'Pushing boundaries with cutting-edge solutions and emerging technologies.',
    Icon: Lightbulb,
    highlights: ['AI/ML Integration', 'Blockchain Solutions', 'IoT Platforms']
  },
  {
    title: 'Client Success',
    description: 'Your success is our primary mission, delivering excellence in every project.',
    Icon: Target,
    highlights: ['24/7 Support', 'Agile Development', 'Regular Updates']
  },
  {
    title: 'Expert Team',
    description: 'Skilled professionals dedicated to crafting exceptional digital experiences.',
    Icon: Users,
    highlights: ['Senior Developers', 'UI/UX Experts', 'DevOps Engineers']
  },
  {
    title: 'Quality Driven',
    description: 'Uncompromising standards in code quality and project delivery.',
    Icon: Award,
    highlights: ['Code Reviews', 'Testing', 'Performance']
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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group p-8 bg-white/[0.03] hover:bg-white/[0.06]
                 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300
                 border border-white/10 hover:border-white/20"
    >
      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 
                      flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <value.Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {value.title}
        </h3>
        <p className="text-gray-300 mb-6">{value.description}</p>
        
        <div className="space-y-2">
          {value.highlights.map((highlight, i) => (
            <div key={i} className="flex items-center text-gray-400 group-hover:text-gray-300">
              <ChevronRight className="w-4 h-4 mr-2 text-blue-400" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
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
      className="relative p-6 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10
                hover:border-white/20 transition-all duration-300"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1 + 0.2 }
        } : {}}
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2 text-center"
      >
        {stat.number}
      </motion.div>
      <div className="text-gray-300 font-medium text-center">{stat.label}</div>
    </motion.div>
  )
}

export default function AboutUs() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

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
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-white to-gray-300 mb-6">
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
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl
                     hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 inline-flex items-center
                     shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Join Our Team
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}