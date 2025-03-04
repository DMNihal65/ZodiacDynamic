import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

// Define constellation patterns for major zodiac signs
const CONSTELLATIONS = {
  aries: {
    name: 'Aries',
    points: [[-1, 0, 0], [-0.5, 0.5, 0], [0, 0.8, 0], [0.5, 0.9, 0], [1, 0.7, 0], [1.5, 0.3, 0]]
  },
  taurus: {
    name: 'Taurus',
    points: [[-1.5, -0.5, 0], [-0.8, -0.3, 0], [0, 0, 0], [0.8, 0.5, 0], [0.6, 1, 0], [1.5, 1, 0]]
  },
  cancer: {
    name: 'Cancer',
    points: [[-1, 0, 0], [-0.5, 0.5, 0], [0, 0.8, 0], [0.5, 0.5, 0], [0.8, 0, 0], [0.5, -0.5, 0], [0, -0.8, 0]]
  },
  leo: {
    name: 'Leo',
    points: [[-1.5, -0.5, 0], [-0.8, -0.2, 0], [0, 0, 0], [0.5, 0.5, 0], [1, 0.2, 0], [1.5, -0.3, 0], [1.8, -0.8, 0]]
  },
  virgo: {
    name: 'Virgo',
    points: [[-1, -0.3, 0], [-0.5, 0, 0], [0, 0.5, 0], [0.5, 0.8, 0], [1, 0.5, 0], [1.3, 0, 0], [1, -0.5, 0], [0.5, -0.8, 0]]
  },
  libra: {
    name: 'Libra',
    points: [[-1, 0.5, 0], [0, 0.5, 0], [1, 0.5, 0], [0, 0, 0], [-1, -0.5, 0], [0, -0.5, 0], [1, -0.5, 0]]
  },
  scorpio: {
    name: 'Scorpio',
    points: [[-1.5, 0, 0], [-0.8, 0.2, 0], [0, 0.3, 0], [0.8, 0.2, 0], [1.5, 0, 0], [1.8, -0.3, 0], [2, -0.6, 0]]
  },
  sagittarius: {
    name: 'Sagittarius',
    points: [[-1, -0.5, 0], [-0.5, 0, 0], [0, 0.5, 0], [0.5, 0.8, 0], [1, 0.5, 0], [1.5, 0, 0], [1.8, -0.5, 0]]
  },
  capricorn: {
    name: 'Capricorn',
    points: [[-1.5, -0.3, 0], [-0.8, 0, 0], [0, 0.3, 0], [0.8, 0.1, 0], [1.3, -0.2, 0], [1.8, -0.5, 0]]
  },
  aquarius: {
    name: 'Aquarius',
    points: [[-1.5, 0, 0], [-0.8, 0.2, 0], [0, 0, 0], [0.8, 0.2, 0], [1.5, 0, 0], [-0.8, -0.5, 0], [0, -0.7, 0], [0.8, -0.5, 0]]
  },
  pisces: {
    name: 'Pisces',
    points: [[-1.5, 0.5, 0], [-0.8, 0.3, 0], [0, 0, 0], [0.8, -0.3, 0], [1.5, -0.5, 0], [-1, -0.5, 0], [-0.5, -0.3, 0], [0.5, 0.3, 0], [1, 0.5, 0]]
  }
};

// Loading messages for a more engaging experience
const LOADING_MESSAGES = [
  "Mapping celestial coordinates...",
  "Aligning with cosmic energies...",
  "Calculating stellar influences...",
  "Decoding celestial patterns...",
  "Connecting to astral matrix...",
  "Synchronizing zodiac resonance...",
  "Loading star chart algorithms...",
  "Calibrating cosmic compiler..."
];

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [activeConstellation, setActiveConstellation] = useState('leo');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const threeContainerRef = useRef(null);
  const scene = useRef(new THREE.Scene());
  const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const renderer = useRef(null);
  const starPoints = useRef(null);
  const constellations = useRef({});
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const animationFrameId = useRef(null);
  const cameraStartZ = useRef(15); // Initial zoom level
  const cameraTargetZ = useRef(5); // Final zoom level

  // Three.js initialization
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Setup renderer with improved settings
    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    threeContainerRef.current.appendChild(renderer.current.domElement);

    // Create enhanced particle field with different star sizes and colors
    const positions = [];
    const colors = [];
    const sizes = [];
    
    // More stars for a richer background
    for (let i = 0; i < 3500; i++) {
      positions.push(
        (Math.random() - 0.5) * 30, // Wider distribution for zoom effect
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      
      // Blue color variations for stars (focusing on shades of blue)
      const starType = Math.random();
      if (starType > 0.95) {
        // Bright blue-white stars (rare)
        colors.push(0.7, 0.8, 1.0);
      } else if (starType > 0.8) {
        // Blue-white stars
        colors.push(0.8, 0.9, 1.0);
      } else if (starType > 0.6) {
        // Pale blue stars
        colors.push(0.6, 0.7, 0.9);
      } else {
        // Common blue stars with slight variations
        const colorVariation = Math.random() * 0.2;
        colors.push(
          0.4 + colorVariation,
          0.5 + colorVariation,
          0.8 + colorVariation
        );
      }

      // More varied sizes
      const sizeFactor = Math.random();
      if (sizeFactor > 0.98) {
        // Very rare large stars
        sizes.push(Math.random() * 0.06 + 0.04);
      } else if (sizeFactor > 0.9) {
        // Uncommon medium stars
        sizes.push(Math.random() * 0.04 + 0.02);
      } else {
        // Common small stars
        sizes.push(Math.random() * 0.025 + 0.005);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Improved star material with custom shader for better glow effect
    const starMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    starPoints.current = new THREE.Points(geometry, starMaterial);
    scene.current.add(starPoints.current);

    // Create all zodiac constellations
    Object.entries(CONSTELLATIONS).forEach(([key, constellation]) => {
      const constellationGeometry = new THREE.BufferGeometry();
      const points = [];
      
      constellation.points.forEach(point => {
        points.push(...point);
      });

      constellationGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      
      // Create material with a nice blue glow effect
      const constellationMaterial = new THREE.LineBasicMaterial({
        color: 0x4f70e5, // More blue-focused color
        transparent: true,
        opacity: 0
      });

      const constellationObject = new THREE.Line(constellationGeometry, constellationMaterial);
      constellationObject.visible = key === activeConstellation;
      constellations.current[key] = constellationObject;
      scene.current.add(constellationObject);
      
      // Add bright stars at constellation vertices
      const vertexGeometry = new THREE.SphereGeometry(0.03, 16, 16);
      const vertexMaterial = new THREE.MeshBasicMaterial({
        color: 0x70a9f7, // Lighter blue for stars
        transparent: true,
        opacity: 0
      });
      
      constellation.points.forEach((point, i) => {
        const star = new THREE.Mesh(vertexGeometry, vertexMaterial.clone());
        star.position.set(...point);
        star.userData = { index: i, constellationKey: key };
        constellationObject.add(star);
      });
    });

    // Initial camera position for zoom-in effect
    camera.current.position.z = cameraStartZ.current;

    // Start zoom animation
    gsap.to(camera.current.position, {
      z: cameraTargetZ.current,
      duration: 8,
      ease: "power2.out"
    });

    // Handle window resize
    const handleResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop with improved performance
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      // More dynamic star field rotation
      starPoints.current.rotation.x += 0.0002;
      starPoints.current.rotation.y += 0.0003;
      
      // Animate active constellation
      const activeConst = constellations.current[activeConstellation];
      if (activeConst) {
        // Gentle pulsing effect
        activeConst.material.opacity = Math.sin(Date.now() * 0.002) * 0.3 + 0.7;
        
        // Animate stars in constellation
        activeConst.children.forEach((star, i) => {
          star.material.opacity = Math.sin(Date.now() * 0.001 + i * 0.2) * 0.3 + 0.7;
          star.scale.setScalar(Math.sin(Date.now() * 0.002 + i * 0.1) * 0.3 + 1.2);
        });
      }
      
      renderer.current.render(scene.current, camera.current);
    };
    animate();

    // Enhanced mouse move interaction
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Subtle parallax effect on star field
      starPoints.current.rotation.x += mouse.current.y * 0.0001;
      starPoints.current.rotation.y += mouse.current.x * 0.0001;
      
      raycaster.current.setFromCamera(mouse.current, camera.current);
      
      Object.values(constellations.current).forEach(constellation => {
        const intersects = raycaster.current.intersectObjects(constellation.children);
        if (intersects.length > 0) {
          gsap.to(intersects[0].object.scale, {
            x: 1.8,
            y: 1.8,
            z: 1.8,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer.current && threeContainerRef.current) {
        threeContainerRef.current.removeChild(renderer.current.domElement);
        renderer.current.dispose();
      }
    };
  }, [activeConstellation]);

  // Cycle through constellations during loading
  useEffect(() => {
    const constellationKeys = Object.keys(CONSTELLATIONS);
    
    // Change constellation every 5% of progress
    const constellationInterval = setInterval(() => {
      if (progress < 100) {
        const index = Math.floor((progress / 100) * constellationKeys.length) % constellationKeys.length;
        const newConstellation = constellationKeys[index];
        
        // Fade out current constellation
        if (constellations.current[activeConstellation]) {
          gsap.to(constellations.current[activeConstellation].material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              constellations.current[activeConstellation].visible = false;
              
              // Fade in new constellation
              constellations.current[newConstellation].visible = true;
              gsap.to(constellations.current[newConstellation].material, {
                opacity: 0.7,
                duration: 0.5
              });
              
              // Fade in stars for new constellation
              constellations.current[newConstellation].children.forEach((star, i) => {
                gsap.to(star.material, {
                  opacity: 0.8,
                  delay: i * 0.05,
                  duration: 0.3
                });
              });
              
              setActiveConstellation(newConstellation);
            }
          });
        }
      }
    }, 3500); // Slightly longer interval for better experience

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      const messageIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 2500);
    
    return () => {
      clearInterval(constellationInterval);
      clearInterval(messageInterval);
    };
  }, [progress, activeConstellation]);

  // Loading simulation with GSAP
  useEffect(() => {
    // Tween for smoother progress animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Final zoom in animation
        gsap.to(camera.current.position, {
          z: cameraTargetZ.current - 1,
          duration: 1,
          ease: "power3.in"
        });
        
        // Fade out loading screen
        gsap.to('.loading-screen', {
          opacity: 0,
          duration: 1.5,
          delay: 0.5,
          ease: 'power4.inOut',
          onComplete: onLoaded
        });
      }
    });

    // Progress animation with smoother easing
    tl.to({}, {
      duration: 7, // Longer duration for more engaging animation
      onUpdate: () => {
        // Calculate progress with slight fluctuations for more natural feel
        const randomFactor = Math.sin(Date.now() * 0.001) * 0.3;
        const currentProgress = Math.floor(tl.progress() * 100 + randomFactor);
        setProgress(Math.min(Math.max(currentProgress, 0), 100));
        
        // Update constellation connections based on progress
        Object.values(constellations.current).forEach(constellation => {
          if (constellation.visible) {
            const visiblePoints = Math.floor((progress / 100) * (constellation.geometry.attributes.position.count));
            constellation.geometry.setDrawRange(0, visiblePoints);
          }
        });
      },
      ease: 'power3.inOut'
    }, 0);

    return () => tl.kill();
  }, []);

  // Text reveal animations
  const titleVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 2.5,
        staggerChildren: 0.08,
        delayChildren: 0.5
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring",
        damping: 12
      }
    }
  };

  return (
    <div className="loading-screen fixed inset-0 bg-[#050A1F] overflow-hidden flex items-center justify-center">
      {/* Three.js Background */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />

      {/* Fixed Central Content Container */}
      <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Logo Area - Always centered */}
        <div className="relative z-20 flex flex-col items-center justify-center">
          {/* Animated Logo with Improved Text Reveal Animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="relative mb-6"
          >
            <h1 className="text-5xl xl:text-7xl font-light tracking-tighter text-white flex">
              <span className="font-bold overflow-hidden">
                {/* Animated text reveal for "Zodiac" */}
                <span className="inline-block">
                  {Array.from("Zodiac").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      className="inline-block bg-gradient-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </span>
              <span className="font-extralight opacity-80 ml-2 overflow-hidden">
                {/* Animated text reveal for "Dynamics" */}
                <span className="inline-block">
                  {Array.from("Dynamics").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      className="inline-block text-blue-100/90"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </span>
            </h1>
            
            {/* Blue-toned Binary Code Overlay */}
            <div className="absolute inset-0 flex justify-center opacity-10 pointer-events-none overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="text-[0.6rem] font-mono text-blue-300 mx-1"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.3 }}
                  transition={{
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 2 + Math.random() * 2
                  }}
                >
                  {Math.random().toString(2).slice(2, 10)}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Current Constellation Name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-blue-300 font-light text-xl tracking-wider"
          >
            {CONSTELLATIONS[activeConstellation].name}
          </motion.div>
        </div>
      </div>

      {/* Lower Loading Info - Scrolls Down */}
      <div className="relative z-20 flex flex-col items-center justify-end pb-16 mt-auto w-full">
        {/* Improved Progress Container */}
        <div className="relative w-full sm:w-96 mx-auto px-6">
          {/* Progress Percentage Display */}
          <motion.div
            className="absolute -top-6 right-6 text-sm font-mono text-blue-300/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {progress}%
          </motion.div>
          
          {/* Progress Bar Track */}
          <div className="bg-blue-900/20 h-3 rounded-full overflow-hidden backdrop-blur-sm border border-blue-800/30 shadow-inner">
            {/* Glowing Progress Bar - Fixed by ensuring proper styles and controlled animation */}
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-full relative overflow-hidden"
              style={{ width: `${progress}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                type: "spring", 
                stiffness: 50, 
                damping: 10 
              }}
            >
              {/* Progress Pulse Effect */}
              <div className="absolute inset-0 bg-blue-200/20 animate-pulse" />
              
              {/* Progress Particles */}
              {progress > 5 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-200 rounded-full absolute"
                      style={{
                        top: (i - 2) * 3
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0], 
                        opacity: [0, 1, 0],
                        x: [0, 10, 20],
                        y: [0, i % 2 === 0 ? -5 : 5, 0]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Loading Message */}
        <motion.div
          className="text-sm font-mono text-blue-300/80 tracking-widest h-6 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={loadingMessage} // Key changes trigger re-animation
          transition={{ 
            type: "tween", 
            duration: 0.4 
          }}
        >
          {loadingMessage}
          <span className="ml-2 animate-pulse">▋</span>
        </motion.div>

        {/* System Messages with Enhanced Animation */}
        <div className="text-xs font-mono text-blue-400/70 space-y-2 max-w-lg mx-auto bg-blue-900/10 backdrop-blur-sm p-3 mt-6 rounded-md border border-blue-800/30">
          {/* Progress-related system messages */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex"
          >
            <span className="text-blue-400 mr-2">✓</span>
            {`> Booting cosmic compiler v${(progress / 33.3).toFixed(1)}...`}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="flex"
          >
            <span className="text-blue-300 mr-2">{progress < 50 ? "⚠" : "✓"}</span>
            {`> Initializing ${Math.round(progress * 3.5)} stellar modules...`}
          </motion.div>
          
          {/* Additional messages that appear during loading */}
          {progress > 30 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex"
            >
              <span className="text-blue-300 mr-2">i</span>
              {`> Loading constellation data: ${CONSTELLATIONS[activeConstellation].name}`}
            </motion.div>
          )}
          
          {progress > 60 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex"
            >
              <span className="text-blue-400 mr-2">⚡</span>
              {`> Establishing cosmic connection...`}
            </motion.div>
          )}
          
          {progress > 80 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex"
            >
              <span className="text-blue-300 mr-2">↺</span>
              {`> Synchronizing astrological data (${(progress - 80) * 5}%)`}
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Floating Code Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 font-mono text-xs"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              opacity: [0, Math.random() * 0.2, 0],
              y: `-=${50 + Math.random() * 100}vh`,
              x: `${Math.random() * 20 - 10}%`,
              transition: {
                duration: 8 + Math.random() * 12,
                repeat: Infinity,
                delay: Math.random() * 5
              }
            }}
          >
            {i % 5 === 0 ? `0x${Math.random().toString(16).slice(2, 10)}` : 
             i % 4 === 0 ? '<cosmic::${CONSTELLATIONS[activeConstellation].name}>' : 
             i % 3 === 0 ? 'function astral() => void' :
             i % 2 === 0 ? '{ type: "celestial", id: 0x' + Math.floor(Math.random() * 1000) + ' }' :
             '/* zodiac dynamics */'}
          </motion.div>
        ))}
      </div>
      
      {/* Ambient Light Flares - Blue-toned */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)' 
                : 'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0) 70%)',
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

// export default LoadingScreen;
