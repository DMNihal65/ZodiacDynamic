import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, Globe } from 'lucide-react'

const menuItems = [
  { name: 'Services', icon: Globe },
  { name: 'Portfolio', icon: Globe },
  { name: 'About Us', icon: Globe },
  { name: 'Technologies', icon: Globe },
  { name: 'Contact', icon: Globe }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = menuItems.map(item => 
        document.querySelector(`#${item.name.toLowerCase().replace(' ', '-')}`)
      )

      const currentSection = sections.find(section => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#070B14]/80 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 
                           bg-clip-text text-transparent">
              Zodiac Dynamics
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.a
                key={item.name}
                href={`#${item.name.toLowerCase().replace(' ', '-')}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  relative group ${
                    activeSection === item.name.toLowerCase().replace(' ', '-')
                      ? 'text-blue-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Hover Background */}
                <span className="absolute inset-0 rounded-lg bg-white/[0.03] 
                               opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Active Indicator */}
                {activeSection === item.name.toLowerCase().replace(' ', '-') && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-lg bg-white/[0.05] 
                             border border-white/10 backdrop-blur-sm"
                  />
                )}
                
                <span className="relative">{item.name}</span>
              </motion.a>
            ))}

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 
                       text-white font-medium rounded-lg shadow-lg shadow-blue-500/25
                       hover:shadow-blue-500/40 transition-all duration-300"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 
                     transition-colors border border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#070B14]/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={`#${item.name.toLowerCase().replace(' ', '-')}`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg 
                           text-gray-300 hover:text-white hover:bg-white/[0.03] 
                           transition-all duration-300"
                  whileHover={{ x: 10 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 
                         text-white font-medium rounded-lg shadow-lg shadow-blue-500/25"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 
