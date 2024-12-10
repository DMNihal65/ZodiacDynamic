import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, ArrowRight, Globe, Code2, Cpu, Blocks } from 'lucide-react'
import { useState } from 'react'

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management and AI-powered recommendations.",
    image: "/portfolio/ecommerce.jpg",
    tags: ["React", "Node.js", "MongoDB", "AWS"],
    link: "#",
    github: "#",
    category: "Web Development",
    stats: {
      users: "10K+",
      transactions: "50K+",
      uptime: "99.9%"
    }
  },
  {
    title: "FinTech Mobile App",
    description: "Cross-platform mobile application for personal finance management with blockchain integration.",
    image: "/portfolio/fintech.jpg",
    tags: ["React Native", "Firebase", "Web3"],
    link: "#",
    github: "#",
    category: "Mobile Development",
    stats: {
      downloads: "25K+",
      rating: "4.8/5",
      transactions: "1M+"
    }
  },
  {
    title: "IoT Dashboard",
    description: "Real-time monitoring dashboard for industrial IoT sensors with predictive maintenance.",
    image: "/portfolio/iot.jpg",
    tags: ["Vue.js", "Python", "TensorFlow", "Azure"],
    link: "#",
    github: "#",
    category: "IoT Solutions",
    stats: {
      sensors: "500+",
      accuracy: "98%",
      alerts: "24/7"
    }
  }
]

const categories = [
  { name: "All", icon: Globe },
  { name: "Web Development", icon: Code2 },
  { name: "Mobile Development", icon: Blocks },
  { name: "IoT Solutions", icon: Cpu }
]

const ProjectCard = ({ project, index }) => {
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
      transition={{ duration: 0.5, delay: index * 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-xl
                 border border-white/10 hover:border-white/20 transition-all duration-500"
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

      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Project Links - Floating on image */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <motion.a
            href={project.github}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all"
          >
            <Github className="w-5 h-5 text-white" />
          </motion.a>
          <motion.a
            href={project.link}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all"
          >
            <ExternalLink className="w-5 h-5 text-white" />
          </motion.a>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 text-sm bg-blue-500/10 rounded-full text-blue-400 font-medium">
            {project.category}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-6 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-white/5 rounded-full text-gray-300 hover:bg-white/10 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
          {Object.entries(project.stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-blue-400 font-bold">{value}</div>
              <div className="text-xs text-gray-400 capitalize">{key}</div>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center text-blue-400 font-medium group/btn"
        >
          View Case Study
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })
  const [selectedCategory, setSelectedCategory] = useState("All")

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
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                     bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm
                     text-sm font-medium text-blue-300 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Our Work
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Explore our portfolio of successful projects that showcase our expertise
            in delivering innovative digital solutions.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm
                          transition-all duration-300 ${
                            selectedCategory === category.name
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects
            .filter(project => selectedCategory === "All" || project.category === selectedCategory)
            .map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-full
                     hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25"
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}