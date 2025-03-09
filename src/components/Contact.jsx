import { motion } from 'framer-motion'
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
import { useState, useRef } from 'react'
import PropTypes from 'prop-types'

// Contact info card with minimal design
const ContactInfo = ({ Icon, title, content, link }) => {
  return (
    <motion.a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 group"
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 
                    flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <h4 className="text-white text-sm font-medium">
          {title}
        </h4>
        <p className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors">{content}</p>
      </div>
    </motion.a>
  )
}

ContactInfo.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
}

// Minimalist form field
const FormField = ({ label, type, value, onChange, required, placeholder }) => {
  return (
    <div className="relative">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
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
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                   text-white focus:outline-none focus:border-blue-500 focus:ring-1 
                   focus:ring-blue-500 transition-all placeholder:text-gray-500
                   hover:border-white/20"
        />
      )}
    </div>
  )
}

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
  const formRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormState({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus(null), 3000)
    } catch {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 3000)
    }
    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background with subtle grid and gradient similar to Hero */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#070B14]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("/grid.svg")',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 70%)',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to start your project? Contact us for a free consultation
            and let&apos;s create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Contact Form - Takes 2/3 of the space */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white/[0.02] backdrop-blur-sm rounded-xl p-6
                     border border-white/10 hover:border-white/20 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </div>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600
                         text-white font-medium rounded-lg hover:opacity-90 transition-all
                         disabled:opacity-50 flex items-center justify-center space-x-2"
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

          {/* Contact Info - Takes 1/3 of the space */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-6
                     border border-white/10 hover:border-white/20 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
            
            <div className="space-y-5">
              <ContactInfo 
                Icon={Mail} 
                title="Email" 
                content="hello@nexusforge.com" 
                link="mailto:hello@nexusforge.com"
              />
              <ContactInfo 
                Icon={Phone} 
                title="Phone" 
                content="+1 (555) 123-4567" 
                link="tel:+15551234567"
              />
              <ContactInfo 
                Icon={MapPin} 
                title="Office" 
                content="123 Innovation St, Tech City" 
                link="https://maps.google.com"
              />
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-white mb-4">Working Hours</h4>
              <p className="text-gray-400 text-sm mb-1">Monday - Friday: 9am - 6pm</p>
              <p className="text-gray-400 text-sm">Saturday - Sunday: Closed</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}