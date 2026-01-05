import { useEffect, useRef, useCallback } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  connections: number[];
}

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const clickRipplesRef = useRef<
    Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }>
  >([]);
  const scrollFactorRef = useRef(1);

  const colors = [
    "#06B6D4",
    "#8B5CF6",
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
  ];

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    clickRipplesRef.current.push({
      x: clickX,
      y: clickY,
      radius: 0,
      maxRadius: 200,
      opacity: 1,
    });
  }, []);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / maxScroll;
    scrollFactorRef.current = 1 + scrollProgress * 2; // Increase density/speed based on scroll
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots: Dot[] = [];
    
    // Calculate screen-dependent dot count
    const screenArea = window.innerWidth * window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    let baseDotCount: number;
    let maxDotCount: number;
    
    if (isMobile) {
      // Mobile: fewer dots for better performance
      baseDotCount = Math.min(30, Math.floor(screenArea / 15000));
      maxDotCount = 50;
    } else if (isTablet) {
      // Tablet: moderate dot count
      baseDotCount = Math.min(50, Math.floor(screenArea / 12000));
      maxDotCount = 80;
    } else {
      // Desktop: full dot count
      baseDotCount = Math.min(80, Math.floor(screenArea / 10000));
      maxDotCount = 120;
    }
    
    // Ensure minimum dot count for visual effect
    baseDotCount = Math.max(baseDotCount, isMobile ? 15 : 30);

    // Create dots
    for (let i = 0; i < baseDotCount; i++) {
      const baseSize = Math.random() * 3 + 1;
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: baseSize,
        baseSize,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.3,
        baseOpacity: Math.random() * 0.6 + 0.3,
        connections: [],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentDotCount = Math.min(
        Math.floor(baseDotCount * scrollFactorRef.current),
        maxDotCount
      );

      // Add more dots if needed based on scroll (with max limit)
      while (dots.length < currentDotCount && dots.length < maxDotCount) {
        const baseSize = Math.random() * 3 + 1;
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: baseSize,
          baseSize,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.6 + 0.3,
          baseOpacity: Math.random() * 0.6 + 0.3,
          connections: [],
        });
      }

      // Update dots
      dots.forEach((dot, i) => {
        // Mouse attraction/repulsion
        const mouseDistance = Math.sqrt(
          (dot.x - mouseRef.current.x) ** 2 + (dot.y - mouseRef.current.y) ** 2,
        );

        if (mouseDistance < 150) {
          const force = (150 - mouseDistance) / 150;
          const angle = Math.atan2(
            dot.y - mouseRef.current.y,
            dot.x - mouseRef.current.x,
          );

          // Attraction/repulsion based on distance
          if (mouseDistance < 75) {
            // Repulsion when very close
            dot.vx += Math.cos(angle) * force * 0.02;
            dot.vy += Math.sin(angle) * force * 0.02;
          } else {
            // Attraction when farther
            dot.vx -= Math.cos(angle) * force * 0.01;
            dot.vy -= Math.sin(angle) * force * 0.01;
          }

          // Enhanced size and opacity near mouse
          dot.size = dot.baseSize * (1 + force * 2);
          dot.opacity = Math.min(1, dot.baseOpacity * (1 + force));
        } else {
          // Return to base size and opacity
          dot.size = dot.baseSize;
          dot.opacity = dot.baseOpacity;
        }

        // Apply scroll-based speed
        dot.x += dot.vx * scrollFactorRef.current;
        dot.y += dot.vy * scrollFactorRef.current;

        // Wrap around edges
        if (dot.x < 0) dot.x = canvas.width;
        if (dot.x > canvas.width) dot.x = 0;
        if (dot.y < 0) dot.y = canvas.height;
        if (dot.y > canvas.height) dot.y = 0;

        // Movement without mouse influence
        dot.vx += (Math.random() - 0.5) * 0.05;
        dot.vy += (Math.random() - 0.5) * 0.05;
        dot.vx*= 0.99; // Dampen velocity
        dot.vy*= 0.99; // Dampen velocity
        // Draw dot
        ctx.save();
        ctx.globalAlpha = dot.opacity;
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = dot.size * 3;
        ctx.fill();
        ctx.restore();
      });

      // Draw connections between nearby dots
      dots.forEach((dot, i) => {
        dots.slice(i + 1).forEach((otherDot) => {
          const distance = Math.sqrt(
            (dot.x - otherDot.x) ** 2 + (dot.y - otherDot.y) ** 2,
          );

          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.3;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = dot.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      // Draw and update click ripples
      clickRipplesRef.current = clickRipplesRef.current.filter((ripple) => {
        ripple.radius += 4;
        ripple.opacity = 1 - ripple.radius / ripple.maxRadius;

        if (ripple.radius < ripple.maxRadius) {
          ctx.save();
          ctx.globalAlpha = ripple.opacity * 0.5;
          ctx.strokeStyle = "#06B6D4";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Expand nearby dots
          dots.forEach((dot) => {
            const dotDistance = Math.sqrt(
              (dot.x - ripple.x) ** 2 + (dot.y - ripple.y) ** 2,
            );

            if (
              dotDistance < ripple.radius + 30 &&
              dotDistance > ripple.radius - 30
            ) {
              const expansionForce =
                (1 - Math.abs(dotDistance - ripple.radius) / 30) * 0.5;
              const angle = Math.atan2(dot.y - ripple.y, dot.x - ripple.x);
              dot.vx += Math.cos(angle) * expansionForce;
              dot.vy += Math.sin(angle) * expansionForce;
            }
          });

          return true;
        }
        return false;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleMouseMove, handleClick, handleScroll]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        mixBlendMode: "screen",
      }}
    />
  );
}
