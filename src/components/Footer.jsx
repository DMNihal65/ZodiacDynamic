import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Code,
  Smartphone,
  Palette,
  Cloud,
  Cpu
} from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'

// Social icon component with modern hover effect
const SocialIcon = ({ Icon, href, label }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-0 
                    group-hover:opacity-30 transition-opacity duration-300 scale-125" />
      <div className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center
                    border border-white/10 group-hover:border-blue-500/50 group-hover:bg-white/10
                    transition-all duration-300 overflow-hidden">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
      </div>
    </motion.a>
  )
}

SocialIcon.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

// Footer link component with animated hover effect
const FooterLink = ({ href, children, icon: Icon }) => {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 5 }}
      className="flex items-center gap-2 text-gray-400 hover:text-white text-sm 
                transition-colors duration-300 py-1.5 group"
    >
      {Icon && (
        <div className="w-6 h-6 rounded-md flex items-center justify-center
                      bg-white/5 group-hover:bg-blue-500/20 transition-colors duration-300">
          <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
        </div>
      )}
      <span>{children}</span>
    </motion.a>
  )
}

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType
}

// Contact item component
const ContactItem = ({ Icon, content, href }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 5 }}
      className="flex items-center gap-3 group"
    >
      <div className="w-8 h-8 rounded-md flex items-center justify-center
                    bg-white/5 group-hover:bg-blue-500/20 transition-colors duration-300">
        <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
      </div>
      <span className="text-gray-400 text-sm group-hover:text-white transition-colors duration-300">
        {content}
      </span>
    </motion.a>
  )
}

ContactItem.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  content: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
}

export default function Footer() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const [year] = useState(new Date().getFullYear())
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className="relative overflow-hidden pt-20 pb-10">
      {/* Creative background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        {/* Base dark background */}
        <div className="absolute inset-0 bg-[#070B14]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("/grid.svg")',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 70%)',
        }} />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-blue-900/10" />
        
        {/* Top border glow effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-blue-500/10 to-transparent blur-sm" />
      </div>
      
      {/* Wave separator */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12 transform rotate-180" 
             viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="#0F172A" fillOpacity="0.3"></path>
        </svg>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Company Info - 4 columns */}
          <div className="lg:col-span-4">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <img src="/zodiac_logo.png" alt="Zodiac Dynamics Logo" className="h-14" />
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Crafting innovative digital experiences that transform ideas into reality. 
                We blend creativity with cutting-edge technology to build solutions that 
                stand out in the digital landscape.
              </p>
              
              <div className="flex space-x-3">
                <SocialIcon Icon={Github} href="https://github.com" label="GitHub" />
                <SocialIcon Icon={Twitter} href="https://twitter.com" label="Twitter" />
                <SocialIcon Icon={Linkedin} href="https://linkedin.com" label="LinkedIn" />
                <SocialIcon Icon={Instagram} href="https://instagram.com" label="Instagram" />
              </div>
            </motion.div>
          </div>
          
          {/* Quick Links - 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-white font-medium text-base mb-5 relative inline-block">
                Navigation
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></span>
              </h3>
              
              <nav className="space-y-1">
                <FooterLink href="#home" icon={null}>Home</FooterLink>
                <FooterLink href="#services" icon={null}>Services</FooterLink>
                <FooterLink href="#portfolio" icon={null}>Portfolio</FooterLink>
                <FooterLink href="#about" icon={null}>About Us</FooterLink>
                <FooterLink href="#testimonials" icon={null}>Testimonials</FooterLink>
                <FooterLink href="#contact" icon={null}>Contact</FooterLink>
              </nav>
            </motion.div>
          </div>
          
          {/* Services - 3 columns */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-white font-medium text-base mb-5 relative inline-block">
                Services
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></span>
              </h3>
              
              <nav className="space-y-1">
                <FooterLink href="#web-development" icon={Code}>Web Development</FooterLink>
                <FooterLink href="#mobile-apps" icon={Smartphone}>Mobile Applications</FooterLink>
                <FooterLink href="#ui-ux" icon={Palette}>UI/UX Design</FooterLink>
                <FooterLink href="#cloud-solutions" icon={Cloud}>Cloud Solutions</FooterLink>
                <FooterLink href="#ai-ml" icon={Cpu}>AI & Machine Learning</FooterLink>
              </nav>
            </motion.div>
          </div>
          
          {/* Contact - 3 columns */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-white font-medium text-base mb-5 relative inline-block">
                Contact Us
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></span>
              </h3>
              
              <div className="space-y-4">
                <ContactItem 
                  Icon={Mail} 
                  content="hello@nexusforge.com" 
                  href="mailto:hello@nexusforge.com" 
                />
                <ContactItem 
                  Icon={Phone} 
                  content="+1 (555) 123-4567" 
                  href="tel:+15551234567" 
                />
                <ContactItem 
                  Icon={MapPin} 
                  content="123 Innovation St, Tech City" 
                  href="https://maps.google.com" 
                />
              </div>
              
              <motion.button
                onClick={scrollToTop}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-5 py-2.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 
                         border border-blue-500/30 rounded-lg text-sm text-white flex items-center gap-2
                         hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Back to top</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom section with creative separator */}
        <div className="relative">
          {/* Creative separator */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-500 text-sm mb-4 md:mb-0"
            >
              © {year} Zodiac Dynamics. All rights reserved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-6 text-sm text-gray-500"
            >
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
} 