
import { useEffect, useRef } from 'react';

export default function EnhancedParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#06B6D4', '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B'];

    class SlowGlowParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;
      glowRadius: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.1; // Slightly faster
        this.speedY = (Math.random() - 0.5) * 0.1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.6;
        this.life = 0;
        this.maxLife = Math.random() * 1000 ; // Long life
        this.glowRadius = this.size * 8;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Wrap around edges instead of dying
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;

        // Gentle floating motion
        this.x += Math.sin(this.life * this.pulseSpeed) * 0.1;
        this.y += Math.cos(this.life * this.pulseSpeed * 0.8) * 0.1;

        // Breathing opacity
        this.opacity = (Math.sin(this.life * this.pulseSpeed * 2) * 0.2 + 0.6) * 
                      (1 - Math.min(this.life / this.maxLife, 0.3));
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Multiple glow layers for rich effect
        for (let i = 3; i >= 1; i--) {
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.glowRadius * i * 0.7
          );
          
          const alpha = Math.round(80 / i).toString(16).padStart(2, '0');
          gradient.addColorStop(0, this.color + alpha);
          gradient.addColorStop(0.5, this.color + Math.round(40 / i).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.glowRadius * i * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core particle
        ctx.fillStyle = this.color + 'FF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      isDead() {
        return this.life >= this.maxLife;
      }
    }

    const createParticle = () => {
      particles.push(new SlowGlowParticle());
    };

    // Create initial particles
    for (let i = 0; i < 30; i++) {
      createParticle();
    }

    const animate = () => {
      // Clear canvas for better visibility
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].isDead()) {
          particles.splice(i, 1);
        }
      }

      // Maintain particle count
      while (particles.length < 30) {
        createParticle();
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 2,
        mixBlendMode: 'screen'
      }}
    />
  );
}
