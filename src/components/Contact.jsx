import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Loader2,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import PropTypes from 'prop-types'

const ContactInfo = ({ Icon, title, content, link }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm
                 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
      onClick={() => link && window.open(link, '_blank')}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 
                    flex items-center justify-center shadow-lg shadow-blue-500/20">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <p className="text-gray-400 hover:text-blue-400 transition-colors">{content}</p>
      </div>
    </motion.div>
  )
}

ContactInfo.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  link: PropTypes.string
}

const FormField = ({ label, type, value, onChange, required, placeholder }) => (
  <div className="relative">
    <label className="block text-white mb-2 font-medium">{label}</label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                   text-white focus:outline-none focus:border-blue-500 focus:ring-1 
                   focus:ring-blue-500 transition-all placeholder:text-gray-500
                   hover:border-white/20"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                   text-white focus:outline-none focus:border-blue-500 focus:ring-1 
                   focus:ring-blue-500 transition-all placeholder:text-gray-500
                   hover:border-white/20"
      />
    )}
  </div>
)

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string
}

export default function Contact() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [isHovered, setIsHovered] = useState(false)

  // Parallax effect for background
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormState({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus(null), 3000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 3000)
    }
    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0F172A]">
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
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-white to-gray-300 mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to start your project? Contact us for a free consultation
            and let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group bg-white/[0.03] backdrop-blur-xl rounded-xl p-8
                     border border-white/10 hover:border-white/20 transition-all"
          >
            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
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

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <FormField
                label="Name"
                type="text"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Your name"
              />
              <FormField
                label="Email"
                type="email"
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="your@email.com"
              />
              <FormField
                label="Subject"
                type="text"
                value={formState.subject}
                onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                required
                placeholder="What's this about?"
              />
              <FormField
                label="Message"
                type="textarea"
                value={formState.message}
                onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                required
                placeholder="Your message here..."
              />

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600
                         text-white font-semibold rounded-xl hover:opacity-90 transition-all
                         disabled:opacity-50 flex items-center justify-center space-x-2
                         shadow-lg shadow-blue-500/25"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Message Sent!</span>
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>Error Sending</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <ContactInfo
              Icon={Mail}
              title="Email Us"
              content="Nihaldm65@gmail.com"
              link="mailto:Nihaldm65@gmail.com"
            />
            <ContactInfo
              Icon={Phone}
              title="Call Us"
              content="+91 8197922447"
              link="tel:+15551234567"
            />
            <ContactInfo
              Icon={MapPin}
              title="Visit Us"
              content="123 Innovation Street, Tech City, TC 12345"
              link="https://maps.google.com"
            />
            
            {/* Interactive Map */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10
                         hover:border-white/20 transition-all shadow-lg"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM3zCsDQ2JzI5LjciTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}