import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, Text3D, Center } from '@react-three/drei'

import { 
  Globe, 
  Smartphone, 
  Blocks, 
  Cloud, 
  Cpu, 
  Brain,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'

const services = [
    {
        title: 'Web Development',
        description: 'Modern, responsive web applications built with cutting-edge technologies.',
        Icon: Globe,
        features: ['Full-Stack Development', 'Progressive Web Apps', 'E-commerce Solutions']
      },
      {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications for iOS and Android.',
        Icon: Smartphone,
        features: ['iOS & Android Apps', 'Cross-Platform Solutions', 'App Store Optimization']
      },
      {
        title: 'Web3 Solutions',
        description: 'Blockchain development and decentralized application solutions.',
        Icon: Blocks,
        features: ['Smart Contracts', 'DeFi Applications', 'NFT Platforms']
      },
      {
        title: 'Cloud Architecture',
        description: 'Scalable cloud solutions and infrastructure management.',
        Icon: Cloud,
        features: ['AWS & Azure', 'Cloud Migration', 'DevOps']
      },
      {
        title: 'IoT Software',
        description: 'Industrial IoT solutions for modern manufacturing.',
        Icon: Cpu,
        features: ['Industrial IoT', 'Sensor Integration', 'Real-time Analytics']
      },
      {
        title: 'AI Integration',
        description: 'Custom AI solutions and automation for your business.',
        Icon: Brain,
        features: ['Machine Learning', 'Process Automation', 'AI Consulting']
      }
    ]


// 3D Icon Component
function Icon3D({ icon, isHovered }) {
  return (
    <Float
      speed={2}
      rotationIntensity={isHovered ? 2 : 0.5}
      floatIntensity={isHovered ? 2 : 0.5}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#4F46E5"
          emissive="#2563EB"
          emissiveIntensity={isHovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  )
}
  
  const ServiceCard = ({ service, index, className }) => {
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
        className={`relative group p-8 bg-white/[0.03] hover:bg-white/[0.06]
                   backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300
                   border border-white/10 hover:border-white/20 ${className}`}
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
  
        {/* Icon */}
        <motion.div
          className="mb-4 p-3 bg-blue-500/10 rounded-xl w-fit"
          whileHover={{ scale: 1.05 }}
        >
          <service.Icon className="w-6 h-6 text-blue-400" />
        </motion.div>
  
        {/* Content */}
        <motion.h3 
          className="text-xl font-bold text-white mb-2"
          whileHover={{ x: 5 }}
        >
          {service.title}
        </motion.h3>
  
        <p className="text-gray-400 mb-4 line-clamp-2">
          {service.description}
        </p>
  
        {/* Features */}
        <motion.ul className="space-y-2">
          {service.features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 + idx * 0.1 }}
              className="flex items-center text-gray-300 text-sm"
            >
              <ArrowRight className="w-4 h-4 mr-2 text-blue-400" />
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    )
  }






export default function Services() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0F172A]">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/grid.svg)',
          
        }}
      />

      {/* Enhanced Background Effects */}
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
        {/* Header Section with enhanced styling */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-20 space-y-6"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full 
                       bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm
                       hover:bg-blue-500/15 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Our Services</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Comprehensive Solutions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transforming businesses through innovative technology and strategic solutions
          </p>
        </motion.div>

        {/* Enhanced Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title} 
              service={service} 
              index={index}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

