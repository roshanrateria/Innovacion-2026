import { motion } from 'framer-motion';

export default function IndiaMap() {
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
            <span className="text-[var(--neon-cyan)]">DIMENSIONAL</span>
            <span className="holographic"> LOCATION</span>
          </h2>
          <p className="text-xl text-[var(--steel-gray)]">IEM Kolkata, West Bengal, India</p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto glassmorphism bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* India Map SVG */}
            <div className="relative">
              <motion.svg
                viewBox="0 0 400 400"
                className="w-full h-auto max-w-md mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                {/* India outline path - accurate shape */}
                <motion.path
                  d="M200 50 L230 55 L260 65 L285 80 L305 100 L320 125 L330 150 L335 175 L330 200 L320 225 L305 245 L285 260 L260 270 L230 275 L200 270 L170 260 L145 245 L125 225 L115 200 L120 175 L130 150 L145 125 L170 100 L200 80 Z M180 90 L190 100 L185 110 L175 105 Z M290 120 L300 130 L295 140 L285 135 Z"
                  fill="rgba(6, 182, 212, 0.1)"
                  stroke="var(--neon-cyan)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
                
                {/* West Bengal highlight */}
                <motion.circle
                  cx="305"
                  cy="190"
                  r="15"
                  fill="var(--neon-green)"
                  opacity="0.3"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 2 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                />
                
                {/* Kolkata marker */}
                <motion.circle
                  cx="305"
                  cy="190"
                  r="4"
                  fill="var(--neon-green)"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                />
                
                {/* Pulsing rings around Kolkata */}
                {[1, 2, 3].map((ring, index) => (
                  <motion.circle
                    key={ring}
                    cx="305"
                    cy="190"
                    r={8 + index * 6}
                    fill="none"
                    stroke="var(--neon-green)"
                    strokeWidth="1"
                    opacity="0.5"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.5],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.4 + 3,
                      ease: "easeOut"
                    }}
                  />
                ))}

                {/* Location label */}
                <motion.text
                  x="320"
                  y="185"
                  fill="var(--neon-cyan)"
                  fontSize="10"
                  fontFamily="Orbitron"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 3 }}
                >
                  IEM HOUSE
                </motion.text>
                
                {/* Matrix-style grid overlay */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--neon-blue)" strokeWidth="0.5" opacity="0.2"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </motion.svg>
            </div>

            {/* Location Details */}
            <div>
              <motion.h3
                className="font-orbitron font-bold text-2xl mb-6 text-[var(--neon-cyan)]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                IEM Management House
              </motion.h3>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="flex items-center text-[var(--steel-gray)]">
                  <i className="fas fa-map-marker-alt text-[var(--neon-green)] mr-3"></i>
                  <span>Salt Lake, Sector V, Kolkata, West Bengal 700091</span>
                </div>
                
                <div className="flex items-center text-[var(--steel-gray)]">
                  <i className="fas fa-calendar text-[var(--neon-blue)] mr-3"></i>
                  <span>13-15 March, 2026</span>
                </div>
                
                <div className="flex items-center text-[var(--steel-gray)]">
                  <i className="fas fa-clock text-[var(--deep-purple)] mr-3"></i>
                  <span>9:00 AM onwards (All 3 days)</span>
                </div>
                
                
              </motion.div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.button
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] text-white font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://maps.app.goo.gl/YwAtpmh8QHG3Bdm37', '_blank')}
                >
                  <i className="fas fa-directions mr-2"></i>
                  Get Directions
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[var(--steel-gray)]/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { icon: 'fas fa-users', value: '5000+', label: 'Expected Participants' },
              { icon: 'fas fa-globe-asia', value: '15+', label: 'States Represented' },
              { icon: 'fas fa-university', value: '100+', label: 'Colleges' },
              { icon: 'fas fa-trophy', value: '₹5L+', label: 'Prize Money' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-4 glassmorphism bg-white/5 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 1.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <i className={`${stat.icon} text-2xl text-[var(--neon-cyan)] mb-2`}></i>
                <div className="font-orbitron font-bold text-lg text-[var(--neon-green)]">{stat.value}</div>
                <div className="text-[var(--steel-gray)] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}