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
  // gemini: {
  //   name: 'Gemini',
  //   points: [[0, 0, 0], [1, 0.5, 0], [1.5, 0, 0], [2, -0.5, 0], [0, 1, 0], [1, 1.5, 0], [2, 1, 0], [3, 0.5, 0]]
  // },
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
  "Calculating planetary influences...",
  "Decoding stellar patterns...",
  "Connecting to universal matrix...",
  "Synchronizing zodiac resonance...",
  "Loading astrological algorithms...",
  "Calibrating cosmic compiler..."
];

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [activeConstellation, setActiveConstellation] = useState('taurus');
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

    // Create stars with zoom effect
    const positions = [];
    const colors = [];
    const sizes = [];
    
    for (let i = 0; i < 3000; i++) {
      const distance = Math.random() * 100 - 50;
      positions.push(
        (Math.random() - 0.5) * distance,
        (Math.random() - 0.5) * distance,
        (Math.random() - 0.5) * distance * 2
      );
      
      // Blue color variations for stars
      colors.push(
        0.5 + Math.random() * 0.2, // Less red
        0.7 + Math.random() * 0.3, // More blue
        1.0 // Full blue
      );

      sizes.push(Math.random() * 0.05 + 0.01);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    starPoints.current = new THREE.Points(geometry, material);
    scene.current.add(starPoints.current);

    // Camera position for zoom effect
    camera.current.position.z = 50;

    // Animation loop with zoom effect
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      // Zoom effect
      camera.current.position.z = 50 - (progress / 2);
      
      // Rotation effect
      starPoints.current.rotation.x += 0.0001;
      starPoints.current.rotation.y += 0.0002;
      
      renderer.current.render(scene.current, camera.current);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.current && threeContainerRef.current) {
        threeContainerRef.current.removeChild(renderer.current.domElement);
        renderer.current.dispose();
      }
    };
  }, [progress]);

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
    }, 3000);

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

    // Progress animation
    tl.to({}, {
      duration: 4,
      onUpdate: () => {
        const progress = Math.floor(tl.progress() * 100);
        setProgress(progress);
      },
      ease: 'power4.out'
    }, 0);

    return () => tl.kill();
  }, []);

  return (
    <div className="loading-screen fixed inset-0 bg-[#040B1A] overflow-hidden flex items-center justify-center">
      {/* Three.js Background */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        {/* Main Content - Always Centered */}
        <div className="flex flex-col items-center space-y-6">
          {/* Title with improved reveal animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2,
              ease: [0.25, 0.1, 0, 1],
              type: "spring",
              stiffness: 100
            }}
            className="text-center"
          >
            <h1 className="text-5xl xl:text-7xl font-light tracking-tighter">
              <span className="font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Zodiac
              </span>
              <span className="font-extralight text-blue-100 ml-2">
                Dynamics
              </span>
            </h1>
          </motion.div>

          {/* Binary Code Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center opacity-10 pointer-events-none">
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
        </div>

        {/* Loading Info - Fixed at Bottom */}
        <div className="absolute bottom-16 left-0 right-0">
          <div className="flex flex-col items-center space-y-4">
            {/* Loading Message */}
            <motion.div
              key={loadingMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-blue-200 text-sm tracking-wider"
            >
              {loadingMessage}
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-blue-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Progress Percentage */}
            <motion.span 
              className="text-blue-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
            >
              {progress}%
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}