import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

interface BackButtonProps {
  customText?: string;
  customAction?: () => void;
}

export default function BackButton({ customText, customAction }: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (customAction) {
      customAction();
    } else {
      setLocation('/');
    }
  };

  return (
    <motion.button
      className="flex items-center text-[var(--neon-cyan)] hover:text-white transition-colors duration-300 mb-8 group"
      onClick={handleBack}
      whileHover={{ x: -5 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.i 
        className="fas fa-arrow-left mr-3 text-lg"
        whileHover={{ x: -3 }}
        transition={{ duration: 0.2 }}
      />
      <span className="font-orbitron font-semibold">
        {customText || 'Back to Home'}
      </span>
      
      {/* Animated underline */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--neon-cyan)] group-hover:w-full transition-all duration-300" />
    </motion.button>
  );
}