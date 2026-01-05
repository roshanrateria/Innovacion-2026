import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="font-orbitron font-bold text-4xl md:text-5xl mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[var(--neon-cyan)]">About</span>
            <span className="holographic"> INNOVACIÓN</span>
          </motion.h2>
          
          <motion.div
            className="glassmorphism bg-white/5 rounded-2xl p-8 md:p-12 hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.p
              className="text-lg md:text-xl leading-relaxed text-[var(--steel-gray)] mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Institute of Engineering and Management, Kolkata proudly presents the 13th edition of its Annual Techno-Management Fest, 
              <span className="text-[var(--neon-cyan)] font-semibold"> INNOVACIÓN 2026</span>. 
            </motion.p>
            
            <motion.p
              className="text-lg md:text-xl leading-relaxed text-[var(--steel-gray)] mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Journey through the <span className="holographic font-semibold">MULTIVERSE</span> of innovation, 
              where cutting-edge technology meets boundless creativity. Experience parallel dimensions of robotics, AI, gaming, and management 
              as brilliant minds converge to shape the future.
            </motion.p>
            
            <motion.p
              className="text-lg md:text-xl leading-relaxed text-[var(--steel-gray)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Each event unfolds like a portal to new possibilities, where students showcase their unparalleled brilliance, 
              their ideas shining like stars in the limitless expanse of technological innovation.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
