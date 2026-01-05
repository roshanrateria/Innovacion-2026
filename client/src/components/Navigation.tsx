import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoPath from "@assets/logo2_1750741228071.png";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#events", label: "Events" },
    { href: "#gallery", label: "Gallery" },
    { href: "#partners", label: "Partners" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "glassmorphism bg-[var(--space-black)]/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Innovación Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-blue)] to-[var(--deep-purple)] rounded-full flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-[var(--space-black)] flex items-center justify-center">
                <img
                  src={logoPath}
                  alt="INNOVACIÓN Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Text Logo */}
            <div
              className="font-orbitron font-bold text-2xl holographic cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              INNOVACIÓN
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="text-white hover:text-[var(--neon-cyan)] transition-colors duration-300 relative group"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--neon-cyan)] transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Register Button */}
          <motion.button
            className="hidden md:block bg-gradient-to-r from-[var(--neon-blue)] to-[var(--deep-purple)] px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-[var(--neon-blue)]/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => (window.location.href = "/registration")}
          >
            Register
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white text-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <i
              className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}
            ></i>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 glassmorphism rounded-lg p-4"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-[var(--neon-cyan)] transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.button
                  className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--deep-purple)] px-6 py-2 rounded-full font-semibold text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  onClick={() => (window.location.href = "/registration")}
                >
                  Register
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
