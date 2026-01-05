import { motion } from 'framer-motion';

// Import contact photos using @assets alias
import aniketPhoto from '@assets/aniket.jpg';

export default function ContactSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const contactPersons = [
    {
      id: 'aniket',
      name: 'Aniket Chakraborty',
      phone: '+918240815528',
      photo: aniketPhoto,
      whatsapp: 'https://wa.me/918240815528',
      color: 'var(--neon-green)',
      secondaryColor: 'var(--neon-cyan)',
    },
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook', href: '#', color: 'var(--neon-blue)' },
    { icon: 'fab fa-twitter', href: '#', color: 'var(--neon-cyan)' },
    { icon: 'fab fa-instagram', href: '#', color: 'var(--deep-purple)' },
    { icon: 'fab fa-linkedin', href: '#', color: 'var(--neon-green)' },
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <span className="holographic">CONTACT</span>
            <span className="text-[var(--neon-cyan)]"> NEXUS</span>
          </h2>
          <p className="text-xl text-[var(--steel-gray)]">Connect across dimensions</p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {contactPersons.map((person, index) => (
            <motion.div
              key={person.id}
              className="glassmorphism bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-center group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 20px 50px ${person.color}30`,
              }}
            >
              {/* Background gradient overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${person.color}, ${person.secondaryColor})`
                }}
              />
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 relative z-10"
                style={{
                  background: `linear-gradient(135deg, ${person.color}, ${person.secondaryColor})`,
                  borderColor: person.color
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <h3 
                className="font-orbitron font-bold text-xl mb-4 relative z-10"
                style={{ color: person.color }}
              >
                {person.name}
              </h3>
              
              <div className="space-y-3 text-sm relative z-10">
                <motion.div
                  className="flex items-center justify-center text-[var(--steel-gray)] group-hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <i className="fas fa-phone text-[var(--neon-cyan)] mr-2"></i>
                  <span>{person.phone}</span>
                </motion.div>
                
                <motion.a
                  href={person.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-[var(--steel-gray)] group-hover:text-[var(--neon-green)] transition-colors duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                >
                  <i className="fab fa-whatsapp text-[var(--neon-green)] mr-2"></i>
                  <span>WhatsApp</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Social Media */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="font-orbitron font-bold text-2xl mb-8 text-[var(--neon-cyan)]">
            Follow the Multiverse
          </h3>
          
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${social.color}, ${social.color}99)`
                }}
                whileHover={{ 
                  scale: 1.2,
                  rotate: 360,
                  boxShadow: `0 8px 25px ${social.color}50`,
                }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <i className={`${social.icon} text-white text-xl`}></i>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
