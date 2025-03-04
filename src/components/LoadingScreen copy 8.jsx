import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const threeContainerRef = useRef(null);
  const scene = useRef(new THREE.Scene());
  const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const renderer = useRef(null);
  const starPoints = useRef([]);
  const zodiacSymbol = useRef(null);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Three.js initialization
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Setup renderer
    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    threeContainerRef.current.appendChild(renderer.current.domElement);

    // Create particle field with different star sizes
    const positions = [];
    const colors = [];
    const sizes = [];
    
    for (let i = 0; i < 2000; i++) {
      positions.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      // Color variations for stars
      const colorVariation = Math.random() * 0.3;
      colors.push(
        0.6 + colorVariation,
        0.6 + colorVariation,
        0.8 + colorVariation
      );

      // Size variations
      sizes.push(Math.random() * 0.03 + 0.01);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      sizeAttenuation: true
    });

    starPoints.current = new THREE.Points(geometry, material);
    scene.current.add(starPoints.current);

    // Create zodiac constellation geometry
    const zodiacGeometry = new THREE.BufferGeometry();
    const points = [];
    
    // Gemini constellation points (simplified)
    const constellationPoints = [
      [0, 0, 0], [1, 0.5, 0], [1.5, 0, 0], [2, -0.5, 0],
      [0, 1, 0], [1, 1.5, 0], [2, 1, 0], [3, 0.5, 0]
    ];
    
    constellationPoints.forEach(point => {
      points.push(...point);
    });

    zodiacGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    const zodiacMaterial = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0
    });

    zodiacSymbol.current = new THREE.Line(zodiacGeometry, zodiacMaterial);
    scene.current.add(zodiacSymbol.current);

    // Camera position
    camera.current.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle rotation
      starPoints.current.rotation.x += 0.0001;
      starPoints.current.rotation.y += 0.0002;
      
      // Pulsing zodiac symbol
      zodiacSymbol.current.material.opacity = Math.sin(Date.now() * 0.002) * 0.3 + 0.4;
      
      renderer.current.render(scene.current, camera.current);
    };
    animate();

    // Mouse move interaction
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera.current);
      const intersects = raycaster.intersectObject(starPoints.current);
      
      if (intersects.length > 0) {
        gsap.to(intersects[0].object.scale, {
          x: 1.2,
          y: 1.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer.current) {
        renderer.current.dispose();
        threeContainerRef.current.removeChild(renderer.current.domElement);
      }
    };
  }, []);

  // Loading simulation with GSAP
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('.loading-screen', {
          opacity: 0,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: onLoaded
        });
      }
    });

    // Animate zodiac constellation reveal
    tl.to(zodiacSymbol.current.material, {
      opacity: 0.6,
      duration: 2,
      ease: 'sine.inOut'
    });

    // Progress animation
    tl.to({}, {
      duration: 4,
      onUpdate: () => {
        const progress = Math.floor(tl.progress() * 100);
        setProgress(progress);
        
        // Update constellation connections based on progress
        const visiblePoints = Math.floor((progress / 100) * 8);
        zodiacSymbol.current.geometry.setDrawRange(0, visiblePoints);
      },
      ease: 'power4.out'
    }, 0);

    return () => tl.kill();
  }, []);

  return (
    <div className="loading-screen fixed inset-0 bg-[#0a0e17] overflow-hidden flex items-center justify-center">
      {/* Three.js Background */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />

      {/* Loading Content */}
      <div className="relative z-20 text-center space-y-6">
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'circOut' }}
          className="relative"
        >
          <h1 className="text-5xl xl:text-6xl font-light tracking-tighter text-white">
            <span className="font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Zodiac
            </span>
            <span className="font-extralight opacity-80 ml-2">Dynamics</span>
          </h1>
          
          {/* Binary Code Overlay */}
          <div className="absolute inset-0 flex justify-center opacity-10 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="text-[0.6rem] font-mono text-white mx-1"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 0.3 }}
                transition={{
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 2 + Math.random() * 2
                }}
              >
                {Math.random().toString(2).slice(2, 8)}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Container */}
        <div className="relative w-96 bg-gray-900/50 rounded-full h-2.5">
          {/* Glowing Progress Bar */}
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full relative overflow-hidden"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 4, ease: 'power4.out' }}
          >
            {/* Progress Pulse Effect */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            
            {/* Progress Particles */}
            {progress > 0 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-cyan-300 rounded-full absolute"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{
                      delay: i * 0.1,
                      type: 'spring',
                      stiffness: 200
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Loading Status */}
        <motion.div
          className="text-sm font-mono text-cyan-300/80 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {`INITIALIZING [${progress.toString().padStart(3, '0')}%]`}
          <span className="ml-2 animate-pulse">▋</span>
        </motion.div>

        {/* System Messages */}
        <div className="text-xs font-mono text-gray-400 space-y-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {`> Booting cosmic compiler v${(progress / 33.3).toFixed(1)}...`}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {`> Initializing ${Math.round(progress * 2.5)} stellar modules...`}
          </motion.div>
        </div>
      </div>

      {/* Floating Code Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 font-mono text-xs"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0
            }}
            animate={{
              opacity: [0, 0.1, 0],
              y: '-=100vh',
              x: Math.random() * 20 - 10 + '%',
              transition: {
                duration: 8 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 3
              }
            }}
          >
            {i % 4 === 0 ? `0x${Math.random().toString(16).slice(2, 8)}` : 
             i % 3 === 0 ? '<cosmic::code>' : 
             'function() => universe'}
          </motion.div>
        ))}
      </div>
    </div>
  );
}