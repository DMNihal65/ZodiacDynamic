import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false)



  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 50)

    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)

  }, [])



  return (

    <motion.nav

      initial={{ y: -100 }}

      animate={{ y: 0 }}

      transition={{ duration: 0.5 }}

      className={`fixed w-full z-50 transition-all duration-300 ${

        scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'

      }`}

    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          <motion.div 

            className="flex-shrink-0"

            whileHover={{ scale: 1.05 }}

          >

            <span className="text-2xl font-bold text-primary">NexusForge</span>

          </motion.div>

          

          <div className="hidden md:block">

            <div className="ml-10 flex items-baseline space-x-4">

              {['Services', 'Portfolio', 'About Us', 'Technologies', 'Contact'].map((item) => (

                <motion.a

                  key={item}

                  href={`#${item.toLowerCase().replace(' ', '-')}`}

                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors

                    ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-gray-300'}`}

                  whileHover={{ scale: 1.1 }}

                  whileTap={{ scale: 0.95 }}

                >

                  {item}

                </motion.a>

              ))}

            </div>

          </div>

        </div>

      </div>

    </motion.nav>

  )

} 
