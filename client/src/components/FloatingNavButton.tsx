import { motion } from 'framer-motion';

export default function FloatingNavButton() {
  return (
    <motion.button
      className="fixed top-6 left-6 w-12 h-12 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      onClick={() => window.location.href = '/'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <i className="fas fa-home text-white text-lg"></i>
    </motion.button>
  );
}