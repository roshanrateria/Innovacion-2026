import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation } from 'wouter';

export default function GallerySection() {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [, setLocation] = useLocation();
  
  const galleryImages = [
    {
      id: '1s-Ei0kijgeDQUWRImHB_DZB5aMbJJtLb',
    },
    {
      id: '146iP97hOASMaQcaeNIAZINl7deg2qBtP',
    },
    {
      id: '1w3vMbXKvZkohfbx__Z0oDUaDDhYwMeS3',
    },
    {
      id: '1SwO5s0OdWsKWC9zGljPoFreSbdA_Jplz',
    },
    {
      id: '12n_S_5pXK_YOmy56kK-e5AThCZaeuSwe',
    },
    {
      id: '1YvbXIfA1zHHFDuOB6rgc4PJMigVzkI5N',
    },
  ];

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
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };
  
  // Helper function to optimize iframe loading
  const getImageSrc = (id: string) => {
    return `https://drive.google.com/file/d/${id}/preview`;
  };

  return (
    <section id="gallery" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <span className="holographic">MULTIVERSE</span>
            <span className="text-[var(--neon-cyan)]"> GALLERY</span>
          </h2>
          <p className="text-xl text-[var(--steel-gray)]">Glimpses from past dimensions</p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl glassmorphism cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: '0 25px 50px rgba(6, 182, 212, 0.3)',
              }}
              style={{ transformStyle: 'preserve-3d', aspectRatio: '16/9' }}
            >
              <div className="w-full h-full relative">
                <iframe 
                  key={`iframe-${image.id}`}
                  src={getImageSrc(image.id)}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  className="w-full h-full"
                  loading={index < 6 ? "eager" : "lazy"}
                  onLoad={() => {
                    setLoadedImages(prev => ({
                      ...prev,
                      [image.id]: true
                    }));
                  }}
                ></iframe>
                {!loadedImages[image.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--space-black)]/80">
                    <div className="w-10 h-10 border-4 border-t-[var(--neon-cyan)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Neon revolving border effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                {/* Top border */}
                <motion.div 
                  className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)]"
                  animate={{
                    width: ['0%', '100%', '100%', '0%'],
                    left: ['0%', '0%', '0%', '100%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Right border */}
                <motion.div 
                  className="absolute top-0 right-0 w-[2px] bg-gradient-to-b from-[var(--neon-green)] to-[var(--neon-cyan)]"
                  animate={{
                    height: ['0%', '100%', '100%', '0%'],
                    top: ['0%', '0%', '0%', '100%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1
                  }}
                />
                
                {/* Bottom border */}
                <motion.div 
                  className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[var(--neon-green)] to-[var(--neon-cyan)]"
                  animate={{
                    width: ['0%', '100%', '100%', '0%'],
                    right: ['0%', '0%', '0%', '100%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                  }}
                />
                
                {/* Left border */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-[2px] bg-gradient-to-t from-[var(--neon-cyan)] to-[var(--neon-green)]"
                  animate={{
                    height: ['0%', '100%', '100%', '0%'],
                    bottom: ['0%', '0%', '0%', '100%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 3
                  }}
                />
              </div>
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-70 bg-[var(--neon-cyan)]/10 transition-opacity duration-300"
                whileHover={{ opacity: 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="flex justify-center mt-12">
          <motion.button
                className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-[var(--neon-cyan)]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLocation('/gallery')}
              ><i className="fas fa-images mr-2"></i>
                View More
              </motion.button>
        </div>
      </div>
    </section>
  );
}
