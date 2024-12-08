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
  
  const ServiceCard = ({ service, index }) => {
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
        transition={{ duration: 0.8, delay: index * 0.2 }}
        whileHover={{ scale: 1.05, translateY: -10 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group bg-gradient-to-br from-white/10 to-white/5 
                   backdrop-blur-xl rounded-2xl p-8 overflow-hidden"
      >
        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 
                     group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          animate={isHovered ? { scale: 1.2, rotate: 45 } : { scale: 1, rotate: 0 }}
        />
  
        {/* 3D Icon Container */}
        <div className="h-40 mb-6">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Icon3D isHovered={isHovered} />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={isHovered ? 4 : 2}
            />
          </Canvas>
        </div>
  
        <motion.h3 
          className="text-2xl font-bold text-white mb-4"
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        >
          {service.title}
        </motion.h3>
  
        <motion.p 
          className="text-gray-300 mb-6"
          animate={isHovered ? { opacity: 0.8 } : { opacity: 1 }}
        >
          {service.description}
        </motion.p>
  
        {/* Features List with Enhanced Animations */}
        <motion.ul className="space-y-3">
          {service.features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 + idx * 0.1 }}
              className="flex items-center text-gray-300 group/item"
            >
              <motion.div
                className="mr-3 text-primary"
                animate={isHovered ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
              <span className="group-hover/item:text-white transition-colors">
                {feature}
              </span>
            </motion.li>
          ))}
        </motion.ul>
  
        {/* Interactive Button */}
        <motion.button
          className="mt-6 px-6 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg
                     text-white font-medium flex items-center gap-2 group/button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.div>
    )
  }






export default function Services() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gradient-end to-gradient-start relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-white/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3">
              <Globe className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Expertise
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to transform your business
            with cutting-edge technology and innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

