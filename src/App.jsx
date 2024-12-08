import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Technologies from './components/Technologies'
import Portfolio from './components/Portfolio'
import AboutUs from './components/AboutUs'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  

  return (
    <div className="font-inter">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : (
          <>
            <Navbar />
            <main>
              <Hero />
              <Services />
              <Technologies />
              <Portfolio />
              <AboutUs />
              <Testimonials />
              <Contact />
            </main>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

