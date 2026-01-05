import { motion } from 'framer-motion';
import { registrationTypes } from '@/data/Registration';

export default function RegistrationSection() {
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
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <span className="text-[var(--neon-cyan)]">REGISTRATION</span>
            <span className="holographic"> PORTAL</span>
          </h2>
          <p className="text-xl text-[var(--steel-gray)]">Choose your dimensional access level</p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {registrationTypes.map((regType, index) => (
            <motion.div
              key={regType.id}
              className="glassmorphism bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 20px 50px ${regType.color}30`,
              }}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${regType.color}, transparent 70%)`
                }}
              />
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <motion.div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${regType.color}, ${regType.secondaryColor})`
                    }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <i className={`${regType.icon} text-2xl text-white`}></i>
                  </motion.div>
                  
                  <h3 
                    className="font-orbitron font-bold text-2xl mb-2"
                    style={{ color: regType.color }}
                  >
                    {regType.name}
                  </h3>
                  <p className="text-[var(--steel-gray)]">{regType.description}</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {regType.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center text-[var(--steel-gray)]"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.1 }}
                    >
                      <i className="fas fa-check text-[var(--neon-green)] mr-3"></i>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${regType.color}, ${regType.secondaryColor})`
                  }}
                  whileHover={{ 
                    boxShadow: `0 8px 25px ${regType.color}50`,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/registration'}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
