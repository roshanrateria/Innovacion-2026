import { motion } from 'framer-motion';
import { registrationTypes } from '@/data/Registration';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MatrixBackground from '@/components/MatrixBackground';
import DynamicBackground from '@/components/DynamicBackground';
import EnhancedParticleSystem from '@/components/EnhancedParticleSystem';
import CustomCursor from '@/components/CustomCursor';
import BackButton from '@/components/BackButton';
import EventRecommendationAI from '@/components/EventRecommendationAI';
import FloatingNavButton from '@/components/FloatingNavButton';

export default function Registration() {
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
    <div className="min-h-screen bg-[var(--space-black)] text-white overflow-x-hidden custom-cursor">
      <CustomCursor />
      <MatrixBackground />
      <DynamicBackground />
      <EnhancedParticleSystem />
      <FloatingNavButton />



      <div className="pt-8">
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <BackButton />

            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-orbitron font-bold text-5xl md:text-7xl mb-4">
                <span className="text-[var(--neon-cyan)]">REGISTRATION</span>
                <span className="holographic"> PORTAL</span>
              </h1>
              <p className="text-xl text-[var(--steel-gray)] mb-8">Choose your dimensional access level to INNOVACIÓN 2026</p>

              {/* Registration Stats */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {[
                  { number: '25+', label: 'EVENTS AVAILABLE', color: 'var(--neon-green)' },
                  { number: '₹5L+', label: 'TOTAL PRIZES', color: 'var(--neon-cyan)' },
                  { number: '3 DAYS', label: 'OF INNOVATION', color: 'var(--deep-purple)' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="glassmorphism bg-white/5 rounded-xl p-4 text-center"
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                  >
                    <div 
                      className="font-orbitron font-black text-2xl md:text-3xl mb-1"
                      style={{ color: stat.color }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-[var(--steel-gray)] text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {registrationTypes.map((regType, index) => (
                <motion.div
                  key={regType.id}
                  className="glassmorphism bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 25px 60px ${regType.color}30`,
                  }}
                >
                  {/* Enhanced glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${regType.color}, transparent 70%)`
                    }}
                  />

                  {/* Popular badge for Central registration */}
                  {regType.id === 'central' && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <motion.div
                        className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${regType.color}, ${regType.secondaryColor})`
                        }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <i className={`${regType.icon} text-3xl text-white`}></i>
                      </motion.div>

                      <h3 
                        className="font-orbitron font-bold text-2xl mb-2"
                        style={{ color: regType.color }}
                      >
                        {regType.name}
                      </h3>
                      <p className="text-[var(--steel-gray)] mb-4">{regType.description}</p>

                      {regType.price && (
                        <div className="text-3xl font-orbitron font-bold mb-4" style={{ color: regType.color }}>
                          {regType.price}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mb-8">
                      <h4 className="font-semibold text-[var(--neon-cyan)] mb-3">Features Included:</h4>
                      {regType.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-center text-[var(--steel-gray)]"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                        >
                          <i className="fas fa-check text-[var(--neon-green)] mr-3"></i>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {regType.benefits && (
                      <div className="space-y-2 mb-8">
                        <h4 className="font-semibold text-[var(--neon-cyan)] mb-3">Benefits:</h4>
                        {regType.benefits.map((benefit, benefitIndex) => (
                          <motion.div
                            key={benefitIndex}
                            className="flex items-center text-[var(--steel-gray)] text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: benefitIndex * 0.1 + 0.5 }}
                          >
                            <i className="fas fa-star text-[var(--neon-green)] mr-2 text-xs"></i>
                            <span>{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <motion.button
                      className="w-full py-4 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: `linear-gradient(135deg, ${regType.color}, ${regType.secondaryColor})`
                      }}
                      whileHover={{ 
                        boxShadow: `0 8px 25px ${regType.color}50`,
                        y: -2,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (regType.registrationLink) {
                          window.open(regType.registrationLink, '_blank');
                        } else {
                          alert('Registration portal for this category will be available soon!');
                        }
                      }}
                    >
                      <span className="relative z-10">{regType.registrationLink ? 'Register Now' : 'Coming Soon'}</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Registration Process Steps */}
            <motion.div
              className="mt-20 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="font-orbitron font-bold text-3xl text-center mb-12 text-[var(--neon-cyan)]">
                Registration Process
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: '01', title: 'Choose Plan', desc: 'Select your registration type', icon: 'fas fa-mouse-pointer' },
                  { step: '02', title: 'Fill Details', desc: 'Complete your information', icon: 'fas fa-user-edit' },
                  { step: '03', title: 'Payment', desc: 'Secure online payment', icon: 'fas fa-credit-card' },
                  { step: '04', title: 'Confirm', desc: 'Receive confirmation', icon: 'fas fa-check-circle' },
                ].map((process, index) => (
                  <motion.div
                    key={process.step}
                    className="text-center glassmorphism bg-white/5 rounded-xl p-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 1 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--deep-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className={`${process.icon} text-white`}></i>
                    </div>
                    <div className="font-orbitron font-bold text-lg text-[var(--neon-cyan)] mb-2">
                      STEP {process.step}
                    </div>
                    <div className="font-semibold mb-2">{process.title}</div>
                    <div className="text-[var(--steel-gray)] text-sm">{process.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />

      {/* AI Assistant */}
      <EventRecommendationAI />
    </div>
  );
}