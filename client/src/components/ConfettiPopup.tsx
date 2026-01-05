import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfettiPopup({ isOpen, onClose }: ConfettiPopupProps) {
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; y: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#06B6D4', '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 6)],
        rotation: Math.random() * 360
      }));
      setConfettiPieces(pieces);
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('partnership.innovacion@iem.edu.in');
    // You could add a toast notification here
  };

  const sendEmail = () => {
    const email = 'partnership.innovacion@iem.edu.in';
    const subject = 'Partnership Inquiry - INNOVACIÓN 2026';
    const body = 'Hi,\n\nI am interested in partnering with INNOVACIÓN 2026. Please provide more information about partnership opportunities.\n\nThank you!';
    
    // Create mailto link with subject and body
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    try {
      window.open(mailtoLink, '_blank');
    } catch (error) {
      // Fallback: copy email to clipboard if mailto fails
      navigator.clipboard.writeText(email);
      alert('Email address copied to clipboard: ' + email);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="fixed w-3 h-3 pointer-events-none z-40"
              style={{
                backgroundColor: piece.color,
                left: piece.x,
                top: piece.y,
              }}
              initial={{ 
                y: -10, 
                rotate: piece.rotation,
                opacity: 1 
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: piece.rotation + 720,
                opacity: 0
              }}
              transition={{ 
                duration: 3,
                ease: "easeOut",
                delay: Math.random() * 0.5
              }}
            />
          ))}

          {/* Popup */}
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="glassmorphism bg-[var(--space-black)]/90 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden z-60"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  className="w-full h-full"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, var(--neon-cyan) 0%, transparent 70%)'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-[var(--steel-gray)] hover:text-white transition-colors w-8 h-8 flex items-center justify-center"
              >
                <i className="fas fa-times"></i>
              </button>

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-handshake text-2xl text-white"></i>
                </div>

                <h3 className="font-orbitron font-bold text-2xl mb-4 text-[var(--neon-cyan)]">
                  Partner With Us!
                </h3>

                <p className="text-[var(--steel-gray)] mb-6">
                  Join INNOVACIÓN 2026 as a partner and be part of the multiverse experience.
                </p>

                <div className="glassmorphism bg-white/5 rounded-lg p-4 mb-6">
                  <p className="text-sm text-[var(--steel-gray)] mb-2">Partnership Email:</p>
                  <div className="flex items-center justify-between bg-[var(--dark-navy)] rounded-lg p-3">
                    <span className="font-mono text-[var(--neon-cyan)] text-sm">
                      partnership.innovacion@iem.edu.in
                    </span>
                    <motion.button
                      onClick={copyToClipboard}
                      className="text-[var(--neon-green)] hover:text-white transition-colors ml-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-copy"></i>
                    </motion.button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    onClick={sendEmail}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] text-white font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer pointer-events-auto relative z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Send Email
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                     
                      onClose();
                    }}
                    className="flex-1 py-3 rounded-lg border-2 border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black transition-all duration-300 cursor-pointer pointer-events-auto relative z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}