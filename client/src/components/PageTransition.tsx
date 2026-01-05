import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  trigger?: boolean;
}

export default function PageTransition({ children, trigger = false }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(trigger);

  useEffect(() => {
    if (trigger) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 bg-[var(--space-black)] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Scanning lines effect */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-60"
                  initial={{ x: '-100%', y: i * 100 }}
                  animate={{ x: '100vw' }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Portal loading animation */}
            <div className="relative">
              <motion.div
                className="w-32 h-32 border-4 border-[var(--neon-cyan)] rounded-full relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 border-4 border-transparent border-t-[var(--neon-green)] rounded-full"></div>
                <div className="absolute inset-2 border-4 border-transparent border-b-[var(--deep-purple)] rounded-full"></div>
              </motion.div>
              
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] rounded-full"></div>
              </motion.div>
            </div>

            {/* Loading text */}
            <motion.div
              className="absolute bottom-32 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[var(--neon-cyan)] font-orbitron text-lg">
                Transitioning Dimensions...
              </p>
              <div className="flex justify-center space-x-1 mt-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[var(--neon-green)] rounded-full"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isTransitioning && children}
    </>
  );
}