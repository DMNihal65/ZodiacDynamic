import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [constellation, setConstellation] = useState(null);
  const canvasRef = useRef(null);
  
  // Simulated loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Initialize constellation canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    
    // Create stars for constellation
    const createConstellation = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Define constellation points (will be connected based on progress)
      const stars = [];
      
      // Add code-inspired constellations (representing software development)
      // We'll create a simplified code bracket pattern
      
      // Left bracket - software side
      stars.push({ x: width * 0.3, y: height * 0.35, radius: 2, opacity: 0.8 });
      stars.push({ x: width * 0.28, y: height * 0.39, radius: 1.7, opacity: 0.7 });
      stars.push({ x: width * 0.28, y: height * 0.5, radius: 1.7, opacity: 0.7 });
      stars.push({ x: width * 0.28, y: height * 0.61, radius: 1.7, opacity: 0.7 });
      stars.push({ x: width * 0.3, y: height * 0.65, radius: 2, opacity: 0.8 });
      
      // Right bracket - software side
      stars.push({ x: width * 0.7, y: height * 0.35, radius: 2, opacity: 0.8 });
      stars.push({ x: width * 0.72, y: height * 0.39, radius: 1.7, opacity: 0.7 });
      stars.push({ x: width * 0.72, y: height * 0.5, radius: 1.7, opacity: 0.7 });
      stars.push({ x: width * 0.72, y: height * 0.61, radius: 1.7, opacity: 0.7 });
      stars.push({ x: width * 0.7, y: height * 0.65, radius: 2, opacity: 0.8 });
      
      // Central connecting points - forming celestial patterns
      // Gemini-inspired constellation in the center
      stars.push({ x: width * 0.4, y: height * 0.42, radius: 2.2, opacity: 0.9 });
      stars.push({ x: width * 0.45, y: height * 0.38, radius: 1.8, opacity: 0.85 });
      stars.push({ x: width * 0.5, y: height * 0.4, radius: 2.5, opacity: 1 });
      stars.push({ x: width * 0.55, y: height * 0.38, radius: 1.8, opacity: 0.85 });
      stars.push({ x: width * 0.6, y: height * 0.42, radius: 2.2, opacity: 0.9 });
      
      stars.push({ x: width * 0.42, y: height * 0.48, radius: 1.5, opacity: 0.8 });
      stars.push({ x: width * 0.5, y: height * 0.52, radius: 1.8, opacity: 0.85 });
      stars.push({ x: width * 0.58, y: height * 0.48, radius: 1.5, opacity: 0.8 });
      
      stars.push({ x: width * 0.4, y: height * 0.58, radius: 2, opacity: 0.85 });
      stars.push({ x: width * 0.5, y: height * 0.62, radius: 2.3, opacity: 0.9 });
      stars.push({ x: width * 0.6, y: height * 0.58, radius: 2, opacity: 0.85 });
      
      // Define connections based on progress (reveals gradually)
      const connections = [
        // Code bracket connections (left)
        [0, 1], [1, 2], [2, 3], [3, 4],
        // Code bracket connections (right)
        [5, 6], [6, 7], [7, 8], [8, 9],
        // Constellation connections (central zodiac-inspired pattern)
        [10, 11], [11, 12], [12, 13], [13, 14],
        [10, 15], [15, 16], [16, 17], [17, 14],
        [15, 18], [16, 19], [17, 20]
      ];
      
      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
      
      // Calculate how many connections to show based on progress
      const connectionsToShow = Math.floor((progress / 100) * connections.length);
      
      // Draw connections
      for (let i = 0; i < connectionsToShow; i++) {
        const [startIdx, endIdx] = connections[i];
        const startPoint = stars[startIdx];
        const endPoint = stars[endIdx];
        
        // Gradient line with subtle glow
        const gradient = ctx.createLinearGradient(
          startPoint.x, startPoint.y, endPoint.x, endPoint.y
        );
        
        // Colors inspired by cosmic blue/purple hues
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.6)');
        
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add subtle glow effect
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = 'rgba(111, 111, 255, 0.1)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Add subtle background stars
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 0.6;
        const opacity = Math.random() * 0.3 + 0.1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      
      // Draw subtle code lines in background
      const codeLines = 15;
      const lineOpacity = 0.04;
      const lineWidth = width * 0.2;
      const lineSpacing = height * 0.75 / codeLines;
      const lineY = height * 0.2;
      
      ctx.textAlign = 'left';
      ctx.font = '10px monospace';
      
      for (let i = 0; i < codeLines; i++) {
        const y = lineY + i * lineSpacing;
        const lineLength = Math.random() * 0.5 + 0.5; // Varied line lengths
        
        ctx.fillStyle = `rgba(111, 168, 220, ${lineOpacity})`;
        ctx.fillRect(width * 0.15, y, lineWidth * lineLength, 1);
        
        if (i % 3 === 1) {
          ctx.fillStyle = `rgba(92, 187, 242, ${lineOpacity * 2})`;
          ctx.fillText('{ constellation: zodiac }', width * 0.16, y - 4);
        }
        
        if (i % 4 === 2) {
          ctx.fillStyle = `rgba(167, 139, 250, ${lineOpacity * 2})`;
          ctx.fillText('function initDynamics()', width * 0.18, y - 4);
        }
      }
      
      // Request next animation frame
      requestAnimationFrame(createConstellation);
    };
    
    setConstellation(createConstellation());
    
    // Cleanup
    return () => {
      if (constellation) {
        cancelAnimationFrame(constellation);
      }
    };
  }, [progress]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Canvas for constellation animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-wider text-white">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Zodiac
            </span>
            <span className="font-light">Dynamics</span>
          </h1>
        </motion.div>
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/70 text-sm md:text-base mb-10 font-light tracking-wide"
        >
          Transforming code into cosmic solutions
        </motion.p>
        
        {/* Minimalist loading bar */}
        <motion.div 
          className="w-72 md:w-80 h-px bg-gray-800 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </motion.div>
        
        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-4 text-white/70 text-xs tracking-widest font-mono"
        >
          {progress < 100 ? 'INITIALIZING SYSTEM' : 'READY'}
        </motion.div>
      </div>
    </div>
  );
}