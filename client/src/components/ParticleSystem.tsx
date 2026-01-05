import { useEffect, useRef } from 'react';

export default function ParticleSystem() {
  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particleRef.current) return;

    const container = particleRef.current;
    const colors = ['var(--neon-blue)', 'var(--neon-cyan)', 'var(--neon-green)', 'var(--deep-purple)'];

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;

      container.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 15000);
    };

    // Create particles periodically
    const interval = setInterval(createParticle, 300);

    // Cleanup
    return () => {
      clearInterval(interval);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={particleRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ zIndex: -1 }}
    />
  );
}
