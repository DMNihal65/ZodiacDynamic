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

export default function Technologies() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0F172A]">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("/grid.svg")',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
        }} />
      </div>

      <motion.div className="absolute inset-0"
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
        {/* Header */}
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
            Tech Stack
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our Technology Arsenal
          </h2>
        </motion.div>

        {/* Innovative Tech Display */}
        <div className="relative">
          {/* Central Hub */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-32 h-32 bg-blue-500/20 rounded-full backdrop-blur-xl
                       border border-blue-500/30 z-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-300 font-semibold">Core Tech</span>
            </div>
          </motion.div>

          {/* Orbital Tech Rings */}
          {Object.entries(technologies).map(([category, techs], categoryIndex) => (
            <motion.div
              key={category}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         rounded-full border border-white/10"
              style={{
                width: `${(categoryIndex + 2) * 200}px`,
                height: `${(categoryIndex + 2) * 200}px`,
              }}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + categoryIndex * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {techs.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${index * (360 / techs.length)}deg) translateX(${(categoryIndex + 2) * 100}px)
                               rotate(-${index * (360 / techs.length)}deg)`,
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  <motion.div 
                    className="flex flex-col items-center gap-2 p-2 rounded-xl
                               bg-white/[0.03] backdrop-blur-sm border border-white/10
                               hover:bg-white/[0.08] transition-colors cursor-pointer"
                    animate={{ rotate: [-360, 0] }}
                    transition={{
                      duration: 20 + categoryIndex * 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg p-2">
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <span className="text-xs text-gray-300 whitespace-nowrap">{tech.name}</span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Spacer for orbital system */}
        <div className="h-[800px]" />
      </div>
    </section>
  )
}