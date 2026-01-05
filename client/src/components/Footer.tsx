import { motion } from 'framer-motion';
import logoPath from '@assets/logo2_1750741228071.png';

export default function Footer() {
  return (
    <motion.footer
      className="py-12 border-t border-[var(--steel-gray)]/20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="flex items-center space-x-4 mb-4 md:mb-0"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 bg-[var(--neon-blue)] rounded-full flex items-center justify-center">
              <img
                src={logoPath}
                alt="INNOVACIÓN Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="font-orbitron font-bold text-xl holographic">
              INNOVACIÓN 2026
            </div>
          </motion.div>
          
          <motion.div
            className="text-center md:text-right"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[var(--steel-gray)] text-sm">
              © 2026 INNOVACIÓN. All Rights Reserved.
            </p>
            <p className="text-[var(--steel-gray)] text-xs mt-1">
              Powered by <span className="text-[var(--neon-cyan)]"> Innovation</span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
