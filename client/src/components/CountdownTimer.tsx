import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';

export default function CountdownTimer() {
  const { days, hours, minutes, seconds, isEventLive } = useCountdown('2026-03-13T00:00:00');

  const timeUnits = [
    { value: days, label: 'DAYS', color: 'var(--neon-blue)' },
    { value: hours, label: 'HOURS', color: 'var(--neon-green)' },
    { value: minutes, label: 'MINUTES', color: 'var(--neon-cyan)' },
    { value: seconds, label: 'SECONDS', color: 'var(--deep-purple)' },
  ];

  if (isEventLive) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <h2 className="font-orbitron font-bold text-6xl text-[var(--neon-green)] animate-pulse-glow">
              EVENT LIVE NOW!
            </h2>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <span className="holographic">MULTIVERSE</span>
            <span className="text-[var(--neon-cyan)]"> OPENS IN</span>
          </h2>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                className="glassmorphism bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 0 20px ${unit.color}`,
                }}
              >
                <motion.div
                  className="font-orbitron font-black text-4xl md:text-6xl mb-2"
                  style={{ color: unit.color }}
                  key={unit.value} // This will trigger re-animation when value changes
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.div>
                <div className="text-[var(--steel-gray)] font-fira">{unit.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
