import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const technologies = {
  frontend: [
    { name: 'React', icon: '/tech/react.svg' },
    { name: 'Vue', icon: '/tech/vue.svg' },
    { name: 'Angular', icon: '/tech/angular.svg' },
    { name: 'Next.js', icon: '/tech/nextjs.svg' },
  ],
  backend: [
    { name: 'Node.js', icon: '/tech/nodejs.svg' },
    { name: 'Python', icon: '/tech/python.svg' },
    { name: 'Java', icon: '/tech/java.svg' },
    { name: 'Go', icon: '/tech/go.svg' },
  ],
  mobile: [
    { name: 'React Native', icon: '/tech/react-native.svg' },
    { name: 'Flutter', icon: '/tech/flutter.svg' },
    { name: 'Swift', icon: '/tech/swift.svg' },
    { name: 'Kotlin', icon: '/tech/kotlin.svg' },
  ],
  cloud: [
    { name: 'AWS', icon: '/tech/aws.svg' },
    { name: 'Azure', icon: '/tech/azure.svg' },
    { name: 'Google Cloud', icon: '/tech/gcp.svg' },
    { name: 'Docker', icon: '/tech/docker.svg' },
  ]
}

const TechIcon = ({ tech, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-white/10 rounded-xl p-3 backdrop-blur-lg">
        <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
      </div>
      <span className="mt-2 text-sm text-gray-300">{tech.name}</span>
    </motion.div>
  )
}

const TechCategory = ({ title, techs }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      className="mb-12"
    >
      <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {techs.map((tech, index) => (
          <TechIcon key={tech.name} tech={tech} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Technologies() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section id="technologies" className="py-20 bg-gradient-to-b from-gradient-start to-gradient-end relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Technologies We Master
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our expertise spans across various technologies, enabling us to choose
            the perfect stack for your specific needs.
          </p>
        </motion.div>

        <div className="space-y-12">
          <TechCategory title="Frontend Development" techs={technologies.frontend} />
          <TechCategory title="Backend Development" techs={technologies.backend} />
          <TechCategory title="Mobile Development" techs={technologies.mobile} />
          <TechCategory title="Cloud & DevOps" techs={technologies.cloud} />
        </div>
      </div>
    </section>
  )
}