import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoPath from '@assets/logo_1750741176591.png';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Multiverse...');

  const loadingSteps = [
    'Initializing Multiverse...',
    'Connecting Dimensions...',
    'Loading Event Matrix...',
    'Syncing Portal Data...',
    'Ready to Explore!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update loading text based on progress
        if (newProgress < 20) setLoadingText(loadingSteps[0]);
        else if (newProgress < 40) setLoadingText(loadingSteps[1]);
        else if (newProgress < 60) setLoadingText(loadingSteps[2]);
        else if (newProgress < 80) setLoadingText(loadingSteps[3]);
        else if (newProgress < 100) setLoadingText(loadingSteps[4]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-[var(--space-black)] flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[var(--neon-blue)] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          {/* Logo with spinning effect */}
          <motion.div
            className="mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--neon-blue)] via-[var(--deep-purple)] to-[var(--neon-cyan)] rounded-full p-2 mx-auto">
              <div className="w-full h-full rounded-full bg-[var(--space-black)] flex items-center justify-center">
                <img
                  src={logoPath}
                  alt="INNOVACIÓN 2026"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-orbitron font-bold text-4xl md:text-6xl mb-2 holographic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            INNOVACIÓN
          </motion.h1>
          
          <motion.h2
            className="font-orbitron font-bold text-2xl md:text-3xl mb-8 text-[var(--neon-cyan)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            2026
          </motion.h2>

          {/* Progress bar */}
          <div className="w-80 mx-auto mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-[var(--steel-gray)] text-sm">Loading</span>
              <span className="text-[var(--neon-cyan)] text-sm">{progress}%</span>
            </div>
            
            <div className="w-full bg-[var(--dark-navy)] rounded-full h-2 mb-4">
              <motion.div
                className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-cyan)] h-2 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Loading text */}
          <motion.p
            className="text-[var(--steel-gray)] text-lg font-fira"
            key={loadingText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {loadingText}
          </motion.p>

          {/* Matrix-style loading indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[var(--neon-green)] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}