import { useEffect, useRef } from 'react';

export default function DocsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      const gridSize = 50;
      const offsetX = (time * 10) % gridSize;
      const offsetY = (time * 5) % gridSize;

      ctx.beginPath();
      for (let x = -gridSize; x < width + gridSize; x += gridSize) {
        ctx.moveTo(x + offsetX, 0);
        ctx.lineTo(x + offsetX, height);
      }
      for (let y = -gridSize; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, y + offsetY);
        ctx.lineTo(width, y + offsetY);
      }
      ctx.stroke();

      // Draw subtle terminal blocks
      ctx.fillStyle = `rgba(214, 58, 0, ${Math.abs(Math.sin(time * 2)) * 0.15})`;
      ctx.fillRect(width * 0.1, height * 0.8, 12, 20);
      
      ctx.fillStyle = `rgba(214, 58, 0, ${Math.abs(Math.cos(time * 3)) * 0.1})`;
      ctx.fillRect(width * 0.8, height * 0.2, 12, 20);

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }} 
    />
  );
}
