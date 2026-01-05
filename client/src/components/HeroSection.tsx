import { motion } from "framer-motion";
import logoPath from "@assets/logo2_1750741228071.png";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
      maxHeight: "100vh",   }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--space-black)]/70 via-transparent to-[var(--space-black)]/70"></div>
      </div>

      <motion.div
        className="relative z-10 text-center max-w-6xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Event Logo - positioned before text */}
        <motion.div className="mb-0 mt-20" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center justify-center mb-0 relative"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Enhanced Glowing Ripple Effect */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-60 h-60 border-2 border-[var(--neon-cyan)] rounded-full"
                style={{
                  boxShadow: `0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.2)`,
                  filter: "blur(0.5px)",
                }}
                animate={{
                  scale: [0, 2],
                  opacity: [0.7, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeOut",
                }}
              />
            ))}

            <img
              src={logoPath}
              alt="INNOVACIÓN 2026 Logo"
              className="w-90 h-90 md:w-80 md:h-80 object-contain holographic relative z-10"
              style={{
                filter:
                  "drop-shadow(0 0 20px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.3))",
              }}
            />
          </motion.div>
        </motion.div>

        <motion.h1
          className="font-orbitron font-black text-4xl md:text-6xl lg:text-7xl mb-0"
          variants={itemVariants}
        >
          <span className="holographic">INNOVACIÓN</span>
        </motion.h1>

        <motion.h2
          className="font-orbitron font-bold text-3xl md:text-4xl mb-4"
          variants={itemVariants}
        >
          <span className="text-[var(--neon-cyan)]">2K26</span>
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl mb-8"
          variants={itemVariants}
        >
          <span 
            className="font-fira text-white font-semibold tracking-wider"
            style={{
              textShadow: `
                0 0 10px rgba(6, 182, 212, 0.8),
                0 0 20px rgba(6, 182, 212, 0.6),
                0 0 30px rgba(6, 182, 212, 0.4),
                2px 2px 4px rgba(0, 0, 0, 0.5)
              `,
              filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))"
            }}
          >
            13-15 MARCH, 2026
          </span>
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
          variants={itemVariants}
        >
          <motion.button
            className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--deep-purple)] px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-[var(--neon-blue)]/50 transition-all duration-300 animate-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/registration")}
          >
            <i className="fas fa-rocket mr-2"></i>
            Register Now
          </motion.button>

          <motion.button
            className="border-2 border-[var(--neon-cyan)] px-8 py-4 rounded-full text-lg font-bold hover:bg-[var(--neon-cyan)] hover:text-[var(--space-black)] transition-all duration-300"
            whileHover={{
              scale: 1.05,
              backgroundColor: "var(--neon-cyan)",
              color: "var(--space-black)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://drive.google.com/file/d/15xFcLzIhXxrTFscuxY6zpa0FTfSdjNZN/view?usp=sharing", "_blank")}
          >
            <i className="fas fa-play mr-2"></i>
            Watch Trailer
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {[
            { number: "25+", label: "EVENTS", color: "var(--neon-green)" },
            { number: "₹5L+", label: "PRIZE POOL", color: "var(--neon-cyan)" },
            {
              number: "5000+",
              label: "PARTICIPANTS",
              color: "var(--deep-purple)",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glassmorphism bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotateY: 10 }}
            >
              <div
                className="font-orbitron font-black text-3xl md:text-4xl mb-2"
                style={{ color: stat.color }}
              >
                {stat.number}
              </div>
              <div className="text-[var(--steel-gray)]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[var(--neon-cyan)] rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-[var(--neon-cyan)] rounded-full mt-2"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
