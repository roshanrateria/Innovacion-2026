import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition);

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Hide cursor on mobile devices
  if (window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          left: mousePosition.x + 'px',
          top: mousePosition.y + 'px',
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
        }}
      />
      <div
        className="cursor-ring"
        style={{
          left: (mousePosition.x - 16) + 'px',
          top: (mousePosition.y - 16) + 'px',
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
        }}
      />
    </>
  );
}
