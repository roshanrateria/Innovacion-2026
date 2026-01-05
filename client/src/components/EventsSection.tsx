import { motion } from 'framer-motion';
import { eventCategories } from '@/data/Events';

export default function EventsSection() {
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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="events" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <span className="holographic">DIMENSIONAL</span>
            <span className="text-[var(--neon-cyan)]"> EVENTS</span>
          </h2>
          <p className="text-xl text-[var(--steel-gray)]">Explore different dimensions of innovation</p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {eventCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group relative glassmorphism bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: `0 20px 50px ${category.color}20`,
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                style={{ backgroundImage: `url('${category.backgroundImage}')` }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}, ${category.secondaryColor})`
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <i className={`${category.icon} text-2xl text-white`}></i>
                </motion.div>
                
                <h3 
                  className="font-orbitron font-bold text-2xl mb-4"
                  style={{ color: category.color }}
                >
                  {category.name}
                </h3>
                
                <p className="text-[var(--steel-gray)] mb-6">{category.description}</p>
                
                <div className="space-y-2 mb-6 text-sm">
                  {category.events.slice(0, 3).map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      className="flex items-center text-[var(--steel-gray)]"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: eventIndex * 0.1 }}
                    >
                      <i className="fas fa-caret-right text-[var(--neon-cyan)] mr-2"></i>
                      <span>{event.name} - {event.shortDescription}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}, ${category.secondaryColor})`,
                    boxShadow: `0 4px 15px ${category.color}30`,
                  }}
                  whileHover={{ 
                    boxShadow: `0 8px 25px ${category.color}50`,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = `/events/${category.id}`}
                >
                  Explore Dimension
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
