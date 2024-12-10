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
        <div className="relative w-full h-[800px] flex items-center justify-center">
          {/* Central Hub */}
          <motion.div 
            className="absolute w-32 h-32 bg-blue-500/20 rounded-full backdrop-blur-xl
                       border border-blue-500/30 z-10 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-blue-300 font-semibold">Core Tech</span>
          </motion.div>

          {/* Orbital Tech Rings */}
          {Object.entries(technologies).map(([category, techs], categoryIndex) => (
            <motion.div
              key={category}
              className="absolute rounded-full border border-white/10"
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
              {techs.map((tech, index) => {
                const angle = (index * 360) / techs.length;
                const radius = (categoryIndex + 2) * 100;
                return (
                  <motion.div
                    key={tech.name}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `rotate(${angle}deg) translateX(${radius}px)`,
                    }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <motion.div 
                      className="flex flex-col items-center gap-2 p-2 rounded-xl
                                bg-white/[0.03] backdrop-blur-sm border border-white/10
                                hover:bg-white/[0.08] transition-colors cursor-pointer"
                      style={{
                        transform: `rotate(-${angle}deg)`,
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
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Technology Insights Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Frontend Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6
                     hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Frontend Excellence</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Creating stunning user interfaces with modern frameworks like React, Vue, and Angular.
              Our frontend stack ensures responsive and performant applications.
            </p>
            <div className="flex gap-2 flex-wrap">
              {technologies.frontend.map(tech => (
                <span key={tech.name} 
                      className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300">
                  {tech.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Backend Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6
                     hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Robust Backend</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Powering applications with scalable and secure backend solutions.
              From Node.js to Python, we choose the right tool for each job.
            </p>
            <div className="flex gap-2 flex-wrap">
              {technologies.backend.map(tech => (
                <span key={tech.name} 
                      className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-300">
                  {tech.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Mobile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6
                     hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Mobile Innovation</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Building native and cross-platform mobile experiences.
              From React Native to Flutter, we deliver on all devices.
            </p>
            <div className="flex gap-2 flex-wrap">
              {technologies.mobile.map(tech => (
                <span key={tech.name} 
                      className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300">
                  {tech.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Cloud Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6
                     hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Cloud Infrastructure</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Deploying and scaling with modern cloud solutions.
              Leveraging AWS, Azure, and GCP for optimal performance.
            </p>
            <div className="flex gap-2 flex-wrap">
              {technologies.cloud.map(tech => (
                <span key={tech.name} 
                      className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-300">
                  {tech.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/[0.02] backdrop-blur-sm 
                     border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center">
            <h4 className="text-3xl font-bold text-blue-400 mb-2">15+</h4>
            <p className="text-gray-400">Technologies</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-green-400 mb-2">100+</h4>
            <p className="text-gray-400">Projects Delivered</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-purple-400 mb-2">99%</h4>
            <p className="text-gray-400">Client Satisfaction</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-orange-400 mb-2">24/7</h4>
            <p className="text-gray-400">Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}