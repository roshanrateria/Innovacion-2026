import { useState } from 'react';
import { motion } from 'framer-motion';
import ConfettiPopup from './ConfettiPopup';

// Import all sponsor logos using @assets alias
import img1 from '@assets/IMG-20250628-WA0002.jpg';
import img2 from '@assets/IMG-20250628-WA0003.jpg';
import img3 from '@assets/IMG-20250628-WA0004.jpg';
import img4 from '@assets/IMG-20250628-WA0005.jpg';
import img5 from '@assets/IMG-20250628-WA0006.jpg';
import img6 from '@assets/IMG-20250628-WA0007.jpg';
import img7 from '@assets/IMG-20250628-WA0008.jpg';
import img8 from '@assets/IMG-20250628-WA0009.jpg';
import img9 from '@assets/IMG-20250628-WA0010.jpg';
import img10 from '@assets/IMG-20250628-WA0011.jpg';
import img11 from '@assets/IMG-20250628-WA0012.jpg';
import img12 from '@assets/IMG-20250628-WA0013.jpg';
import img13 from '@assets/IMG-20250628-WA0014.jpg';
import img14 from '@assets/IMG-20250628-WA0015.jpg';
import img15 from '@assets/IMG-20250628-WA0016.jpg';
import img16 from '@assets/IMG-20250628-WA0017.jpg';
import img17 from '@assets/IMG-20250628-WA0018.jpg';
import img18 from '@assets/IMG-20250628-WA0019.jpg';
import img19 from '@assets/IMG-20250628-WA0020.jpg';
import img20 from '@assets/IMG-20250628-WA0021.jpg';
import img21 from '@assets/IMG-20250628-WA0022.jpg';
import img22 from '@assets/IMG-20250628-WA0023.jpg';
import logo1 from '@assets/logo_1750741176591.png';
import logo2 from '@assets/logo2_1750741228071.png';

export default function PartnersSection() {
  const [showPartnerPopup, setShowPartnerPopup] = useState(false);
  
  // Sponsor logos array with imported assets
  const sponsors = [
    { id: 1, image: img1, alt: 'Partner Logo 1' },
    { id: 2, image: img2, alt: 'Partner Logo 2' },
    { id: 3, image: img3, alt: 'Partner Logo 3' },
    { id: 4, image: img4, alt: 'Partner Logo 4' },
    { id: 5, image: img5, alt: 'Partner Logo 5' },
    { id: 6, image: img6, alt: 'Partner Logo 6' },
    { id: 7, image: img7, alt: 'Partner Logo 7' },
    { id: 8, image: img8, alt: 'Partner Logo 8' },
    { id: 9, image: img9, alt: 'Partner Logo 9' },
    { id: 10, image: img10, alt: 'Partner Logo 10' },
    { id: 11, image: img11, alt: 'Partner Logo 11' },
    { id: 12, image: img12, alt: 'Partner Logo 12' },
    { id: 13, image: img13, alt: 'Partner Logo 13' },
    { id: 14, image: img14, alt: 'Partner Logo 14' },
    { id: 15, image: img15, alt: 'Partner Logo 15' },
    { id: 16, image: img16, alt: 'Partner Logo 16' },
    { id: 17, image: img17, alt: 'Partner Logo 17' },
    { id: 18, image: img18, alt: 'Partner Logo 18' },
    { id: 19, image: img19, alt: 'Partner Logo 19' },
    { id: 20, image: img20, alt: 'Partner Logo 20' },
    { id: 21, image: img21, alt: 'Partner Logo 21' },
    { id: 22, image: img22, alt: 'Partner Logo 22' },
      ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="partners" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <span className="holographic"> PAST </span>
            <span className="text-[var(--neon-cyan)]">DIMENSIONAL</span>
            <span className="holographic"> PARTNERS</span>
          </h2>
          <p className="text-xl text-[var(--steel-gray)]">Entities powering the multiverse</p>
        </motion.div>
        
        {/* Partner logos grid */}
        <motion.div
          className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {sponsors.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              className="glassmorphism bg-white/5 rounded-xl p-4 flex items-center justify-center hover:bg-white/10 transition-all duration-300 h-24 group cursor-pointer relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.1,
                rotateY: 5,
                boxShadow: '0 15px 30px rgba(6, 182, 212, 0.3)',
              }}
            >
              <img 
                src={sponsor.image} 
                alt={sponsor.alt}
                className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                style={{
                  filter: 'brightness(0.9) contrast(1.2) saturate(1.1)',
                  mixBlendMode: 'multiply',
                  background: 'transparent'
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Partnership CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="glassmorphism bg-white/5 rounded-2xl p-8 max-w-2xl mx-auto hover:bg-white/10 transition-all duration-300">
            <motion.h3
              className="font-orbitron font-bold text-2xl mb-4 text-[var(--neon-cyan)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Want to Partner with Us?
            </motion.h3>
            
            <motion.p
              className="text-[var(--steel-gray)] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Join us in shaping the future of innovation. Partner with INNOVACIÓN 2026 and be part of the multiverse revolution.
            </motion.p>
            
            <motion.button
              className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-[var(--neon-cyan)]/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPartnerPopup(true)}
            >
              <i className="fas fa-handshake mr-2"></i>
              Become a Partner
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Partner Popup with Confetti */}
      <ConfettiPopup 
        isOpen={showPartnerPopup} 
        onClose={() => setShowPartnerPopup(false)} 
      />
    </section>
  );
}
