import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const Hero = ({ constellationData }) => {
  const threeContainerRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const scene = useRef(new THREE.Scene());
  const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const renderer = useRef(null);
  const starPoints = useRef(null);
  const animationFrameId = useRef(null);
  const mouse = useRef(new THREE.Vector2());
  const currentConstellation = useRef('taurus');
  const constellations = useRef({});
  const scrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Setup renderer
    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    threeContainerRef.current.appendChild(renderer.current.domElement);

    // Setup camera position
    camera.current.position.z = 5;

    // Create starfield
    const createStarfield = () => {
      const positions = [];
      const colors = [];
      const sizes = [];
      
      for (let i = 0; i < 4000; i++) {
        positions.push(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        );
        
        // Enhanced color variations for stars
        const starType = Math.random();
        if (starType > 0.97) {
          // Very bright blue-white stars (rare)
          colors.push(0.85, 0.9, 1.0);
        } else if (starType > 0.92) {
          // Bright blue-white stars (uncommon)
          colors.push(0.75, 0.85, 1.0);
        } else if (starType > 0.85) {
          // Blue-white stars
          colors.push(0.7, 0.8, 0.95);
        } else if (starType > 0.7) {
          // Pale blue stars
          colors.push(0.55, 0.65, 0.85);
        } else {
          // Common blue stars with slight variations
          const colorVariation = Math.random() * 0.25;
          colors.push(
            0.35 + colorVariation,
            0.45 + colorVariation,
            0.7 + colorVariation
          );
        }

        // Varied sizes with more dramatic variation
        const sizeFactor = Math.random();
        if (sizeFactor > 0.99) {
          // Extremely rare large stars
          sizes.push(Math.random() * 0.08 + 0.05);
        } else if (sizeFactor > 0.96) {
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

      const vertexShader = `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        varying vec3 vColor;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (d > 0.5) discard;
          float intensity = 1.0 - d * 2.0;
          intensity = pow(intensity, 1.5);
          gl_FragColor = vec4(vColor, intensity);
        }
      `;

      const starMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      starPoints.current = new THREE.Points(geometry, starMaterial);
      scene.current.add(starPoints.current);
    };

    createStarfield();

    // Create constellation from data
    if (constellationData) {
      Object.entries(constellationData).forEach(([key, constellation]) => {
        const constellationGeometry = new THREE.BufferGeometry();
        const points = [];
        
        constellation.points.forEach(point => {
          points.push(...point);
        });

        constellationGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const constellationMaterial = new THREE.LineBasicMaterial({
          color: 0x4f70e5,
          transparent: true,
          opacity: 0.7,
          linewidth: 1.5
        });

        const constellationObject = new THREE.Line(constellationGeometry, constellationMaterial);
        constellationObject.visible = key === currentConstellation.current;
        constellations.current[key] = constellationObject;
        scene.current.add(constellationObject);
        
        // Add stars at vertices with improved appearance
        const vertexGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const vertexMaterial = new THREE.MeshBasicMaterial({
          color: 0x70a9f7,
          transparent: true,
          opacity: 0.9
        });
        
        constellation.points.forEach(point => {
          const star = new THREE.Mesh(vertexGeometry, vertexMaterial.clone());
          star.position.set(...point);
          constellationObject.add(star);
          
          // Add glow effect
          const glowGeometry = new THREE.SphereGeometry(0.05, 16, 16);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x70a9f7,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          star.add(glow);
        });
      });
    }

    // Handle window resize
    const handleResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Create mouse trail effect
    const initMouseTrail = () => {
      const trailMaterial = new THREE.PointsMaterial({
        color: 0x4f8fff,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      
      const trailGeometry = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(60 * 3); // 20 points with x,y,z
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      
      const trail = new THREE.Points(trailGeometry, trailMaterial);
      scene.current.add(trail);
      
      return trail;
    };
    
    const mouseTrail = initMouseTrail();
    const trailPositions = mouseTrail.geometry.attributes.position.array;
    let trailIndex = 0;

    // Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      if (starPoints.current) {
        // Rotate starfield slowly
        starPoints.current.rotation.x += 0.0001;
        starPoints.current.rotation.y += 0.0002;
        
        // Enhanced parallax effect
        const targetRotationX = mouse.current.y * 0.002;
        const targetRotationY = mouse.current.x * 0.002;
        
        starPoints.current.rotation.x += (targetRotationX - starPoints.current.rotation.x) * 0.05;
        starPoints.current.rotation.y += (targetRotationY - starPoints.current.rotation.y) * 0.05;
      }
      
      // Update mouse trail
      // Shift all positions back
      for (let i = trailPositions.length - 3; i >= 3; i -= 3) {
        trailPositions[i] = trailPositions[i - 3];
        trailPositions[i + 1] = trailPositions[i - 2];
        trailPositions[i + 2] = trailPositions[i - 1];
      }
      
      // Add new position
      if (mouse.current.x !== 0 && mouse.current.y !== 0) {
        // Convert screen coordinates to 3D space
        const vector = new THREE.Vector3(
          mouse.current.x * 3,
          mouse.current.y * 3,
          0
        );
        vector.unproject(camera.current);
        
        trailPositions[0] = vector.x;
        trailPositions[1] = vector.y;
        trailPositions[2] = vector.z;
        
        mouseTrail.geometry.attributes.position.needsUpdate = true;
      }
      
      // Animate active constellation
      Object.entries(constellations.current).forEach(([key, constellation]) => {
        if (constellation.visible) {
          constellation.rotation.y = Math.sin(Date.now() * 0.0003) * 0.05;
          constellation.rotation.x = Math.sin(Date.now() * 0.0002) * 0.03;
          
          // Animate stars in constellation
          constellation.children.forEach((star, i) => {
            // Pulsating opacity
            star.material.opacity = Math.sin(Date.now() * 0.001 + i * 0.2) * 0.3 + 0.7;
            
            // Pulsating size
            const pulseFactor = Math.sin(Date.now() * 0.002 + i * 0.1) * 0.3 + 1.2;
            star.scale.setScalar(pulseFactor);
            
            // Also pulse the glow
            if (star.children[0]) {
              star.children[0].scale.setScalar(1.2 + Math.sin(Date.now() * 0.001 + i * 0.2) * 0.5);
              star.children[0].material.opacity = Math.sin(Date.now() * 0.0015 + i * 0.1) * 0.2 + 0.3;
            }
          });
        }
      });
      
      // Parallax effect with scroll
      if (camera.current) {
        const targetY = -scrollY.current * 0.003;
        camera.current.position.y += (targetY - camera.current.position.y) * 0.05;
      }
      
      renderer.current.render(scene.current, camera.current);
    };
    
    animate();

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update cursor position for custom cursor
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Set visibility after timeout to ensure smooth transition from loading screen
    setTimeout(() => setIsVisible(true), 300);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (renderer.current && threeContainerRef.current) {
        threeContainerRef.current.removeChild(renderer.current.domElement);
        renderer.current.dispose();
      }
    };
  }, [constellationData]);

  // Custom cursor interactions
  useEffect(() => {
    const handleMouseEnter = () => setCursorVariant("hover");
    const handleMouseLeave = () => setCursorVariant("default");
    
    // Add listeners to interactive elements
    const buttons = document.querySelectorAll(".interactive");
    buttons.forEach(button => {
      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [isVisible]);

  // Text animation with GSAP - Fixed for Zodiac text
  useEffect(() => {
    if (textRef.current && isVisible) {
      const tl = gsap.timeline();
      
      // First, make sure all elements start hidden
      gsap.set([".hero-zodiac span", ".hero-dynamics span", ".hero-subtitle", ".hero-description", ".hero-button"], { 
        opacity: 0,
        y: 30
      });
      
      // Staggered animation for Zodiac title (first part)
      tl.to(".hero-zodiac span", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.08,
        duration: 1,
        ease: "power3.out"
      });
      
      // Staggered animation for Dynamics title (second part)
      tl.to(".hero-dynamics span", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.08,
        duration: 1,
        ease: "power3.out"
      }, "-=0.7"); // Start before first animation completes
      
      // Subtitle animation
      tl.to(".hero-subtitle", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8");
      
      // Description text animation
      tl.to(".hero-description", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.7");
      
      // Button animation
      tl.to(".hero-button", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.7");

      // Set up scroll animations
      gsap.to(".hero-button", {
        scrollTrigger: {
          trigger: ".hero-container",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        scale: 0.9,
        y: 20,
        opacity: 0
      });
      
      gsap.to(".hero-title-container", {
        scrollTrigger: {
          trigger: ".hero-container",
          start: "top top",
          end: "center top",
          scrub: true
        },
        y: -50,
        opacity: 0.5
      });
      
      // Additional subtle animations for the description
      gsap.to(".hero-description", {
        scrollTrigger: {
          trigger: ".hero-container",
          start: "10% top",
          end: "40% top",
          scrub: true
        },
        y: -30,
        opacity: 0.2
      });
    }
  }, [isVisible]);

  // Cursor variants for custom cursor
  const cursorVariants = {
    default: {
      height: 32,
      width: 32,
      backgroundColor: "rgba(79, 112, 229, 0.2)",
      borderColor: "rgba(79, 112, 229, 0.5)",
      x: cursorPosition.x - 16,
      y: cursorPosition.y - 16,
      mixBlendMode: "screen"
    },
    hover: {
      height: 64,
      width: 64,
      backgroundColor: "rgba(79, 112, 229, 0.3)",
      borderColor: "rgba(112, 169, 247, 0.8)",
      x: cursorPosition.x - 32,
      y: cursorPosition.y - 32,
      mixBlendMode: "screen"
    }
  };

  // Text splitting for animation - Fixed implementation
  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050A1F] hero-container">
      {/* Three.js Background */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />
      
      {/* Custom Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-50 border-2 rounded-full pointer-events-none"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      />
      
      {/* Gradient overlays - Enhanced for better depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050A1F]/40 to-[#050A1F] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050A1F]/70 via-transparent to-[#050A1F]/70 pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#050A1F] to-transparent pointer-events-none z-10" />
      
      {/* Content Container */}
      <div 
        ref={textRef}
        className={`relative z-20 flex flex-col items-center justify-center min-h-screen px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Title - Fixed structure for separate animations */}
          <h1 className="hero-title-container text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter text-white mb-6 flex flex-wrap justify-center">
            <span className="hero-zodiac font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent mr-3 filter drop-shadow-lg">
              {splitText("Zodiac")}
            </span>
            <span className="hero-dynamics font-extralight text-blue-100/90 filter drop-shadow-sm">
              {splitText("Dynamics")}
            </span>
          </h1>
          
          {/* Subtitle - Enhanced with gradient */}
          <h2 className="hero-subtitle text-xl md:text-2xl bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent font-light tracking-wide mb-8 filter drop-shadow-md">
            Cosmic Solutions for Digital Evolution
          </h2>
          
          {/* Description - Improved typography */}
          <p className="hero-description text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed text-base md:text-lg">
            Transforming visions into digital realities with celestial precision. Our innovative software solutions propel businesses beyond conventional boundaries into new dimensions of possibility.
          </p>
          
          {/* CTA Button - Enhanced with better animation and class for cursor interaction */}
          <motion.button
            className="hero-button interactive bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-8 rounded-full font-medium tracking-wide shadow-lg shadow-blue-500/20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Our Universe
          </motion.button>
          
          {/* Scroll Indicator - Enhanced animation */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center"
              animate={{ 
                boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.5)", "0 0 0px rgba(59, 130, 246, 0)"],
                borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.6)", "rgba(59, 130, 246, 0.3)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1.5 h-3 bg-blue-400/80 rounded-full mt-2"
                animate={{ 
                  y: [0, 15, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Constellation Names that fade in and out */}
        <motion.div
          className="absolute font-mono text-xs md:text-sm text-blue-400/20 top-1/5 left-10 md:left-24"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            x: [0, 5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            delay: 1.2
          }}
        >
          Andromeda
        </motion.div>
        
        <motion.div
          className="absolute font-mono text-xs md:text-sm text-blue-400/20 bottom-1/3 right-10 md:right-32"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            x: [0, -5, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            delay: 2.5
          }}
        >
          Cassiopeia
        </motion.div>
        
        <motion.div
          className="absolute font-mono text-xs md:text-sm text-blue-400/20 top-1/3 right-20 md:right-40"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity,
            delay: 3.8
          }}
        >
          Orion
        </motion.div>
        
        {/* Abstract code snippets - Enhanced for better readability */}
        <motion.div
          className="absolute text-xs font-mono text-blue-500/15 top-1/4 left-10 md:left-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8, x: [0, 10, 0] }}
          transition={{ delay: 1, duration: 10, repeat: Infinity }}
        >
          {`function createZodiacSolution() {
  return {
    innovation: true,
    precision: "celestial",
    boundaries: "none"
  };
}`}
        </motion.div>
        
        <motion.div
          className="absolute text-xs font-mono text-blue-500/15 bottom-1/4 right-10 md:right-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8, x: [0, -10, 0] }}
          transition={{ delay: 1.5, duration: 12, repeat: Infinity }}
        >
          {`const cosmicDevelopment = {
  solutions: "unlimited",
  creativity: "boundless",
  framework: "adaptive"
};`}
        </motion.div>
        
        {/* Enhanced ambient light flares */}
        <motion.div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)',
            top: '30%',
            left: '15%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, rgba(96, 165, 250, 0) 70%)',
            top: '40%',
            right: '10%'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* New smaller orbital light element */}
        <motion.div 
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.1) 0%, rgba(147, 197, 253, 0) 70%)',
            bottom: '25%',
            left: '25%'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default Hero;