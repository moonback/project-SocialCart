import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

interface ConstellationProps {
  className?: string;
}

export function Constellation({ className = "" }: ConstellationProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Couleurs des étoiles avec des tons bleus cohérents
  const starColors = [
    '#3b82f6', // blue-500
    '#06b6d4', // cyan-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#1d4ed8', // blue-700
    '#0891b2', // cyan-600
    '#7c3aed', // violet-600
  ];

  // Générer les étoiles initiales
  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = 25; // Nombre d'étoiles dans la constellation

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Régénérer les étoiles si la fenêtre est redimensionnée
    const handleResize = () => {
      generateStars();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Suivre la position de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dessiner les connexions entre les étoiles et la souris
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawConnections = () => {
      // Redimensionner le canvas pour correspondre à la fenêtre
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Effacer le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner les connexions
      stars.forEach((star) => {
        const distance = Math.sqrt(
          Math.pow(star.x - mousePosition.x, 2) + Math.pow(star.y - mousePosition.y, 2)
        );

        // Seulement dessiner des connexions pour les étoiles proches
        if (distance < 200) {
          const opacity = Math.max(0, 1 - distance / 200) * 0.6;
          
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mousePosition.x, mousePosition.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`; // blue-500 avec transparence
          ctx.lineWidth = 1;
          ctx.stroke();

          // Ajouter un effet de gradient pour les connexions proches
          if (distance < 100) {
            const gradient = ctx.createLinearGradient(star.x, star.y, mousePosition.x, mousePosition.y);
            gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(6, 182, 212, ${opacity * 0.8})`); // cyan-500
            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);
            
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mousePosition.x, mousePosition.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(drawConnections);
    };

    drawConnections();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, mousePosition]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Canvas pour les connexions */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Étoiles animées */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Cursor glow effect */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          width: 40,
          height: 40,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 100%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />

      {/* Particules flottantes autour du curseur */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400"
          style={{
            left: mousePosition.x + (Math.cos(i * Math.PI / 4) * 30),
            top: mousePosition.y + (Math.sin(i * Math.PI / 4) * 30),
            width: 2,
            height: 2,
          }}
          animate={{
            scale: [0.5, 1, 0.5],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
