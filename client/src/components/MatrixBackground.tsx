import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matrixRef.current) return;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const container = matrixRef.current;

    const createMatrixChar = () => {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      char.style.left = Math.random() * 100 + '%';
      char.style.animationDuration = (Math.random() * 3 + 2) + 's';
      char.style.animationDelay = Math.random() * 2 + 's';
      char.style.fontSize = (Math.random() * 6 + 10) + 'px';
      char.style.opacity = (Math.random() * 0.5 + 0.3).toString();

      container.appendChild(char);

      setTimeout(() => {
        if (char.parentNode) {
          char.parentNode.removeChild(char);
        }
      }, 5000);
    };

    // Create matrix characters periodically
    const interval = setInterval(createMatrixChar, 200);

    // Cleanup
    return () => {
      clearInterval(interval);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={matrixRef} className="matrix-bg" />;
}
