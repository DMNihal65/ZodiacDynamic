import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

// Reusing constellation data from LoadingScreen
const CONSTELLATIONS = {
  aries: {
    name: 'Aries',
    points: [[-1, 0, 0], [-0.5, 0.5, 0], [0, 0.8, 0], [0.5, 0.9, 0], [1, 0.7, 0], [1.5, 0.3, 0]]
  },
  taurus: {
    name: 'Taurus',
    points: [[-1.5, -0.5, 0], [-0.8, -0.3, 0], [0, 0, 0], [0.8, 0.5, 0], [0.6, 1, 0], [1.5, 1, 0]]
  },
  gemini: {
    name: 'Gemini',
    points: [[-1, 1, 0], [-0.5, 0.5, 0], [0, 0, 0], [0.5, 0.5, 0], [1, 1, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]]
  }
};

const Hero = () => {
  const threeContainerRef = useRef(null);
  const textRef = useRef(null);
  const scene = useRef(new THREE.Scene());
  const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const renderer = useRef(null);
  const starPoints = useRef(null);
  const animationFrameId = useRef(null);
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const currentConstellation = useRef('taurus');
  const constellations = useRef({});
  const scrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Initialize Three.js scene
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

    // Setup camera position
    camera.current.position.z = 5;

    // Create starfield with varied sizes and colors
    const createStarfield = () => {
      const positions = [];
      const colors = [];
      const sizes = [];
      
      for (let i = 0; i < 4000; i++) {
        positions.push(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        );
        
        // Blue color variations for stars
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

        // Varied sizes
        const sizeFactor = Math.random();
        if (sizeFactor > 0.98) {
          // Very rare large stars
          sizes.push(Math.random() * 0.08 + 0.05);
        } else if (sizeFactor > 0.9) {
          // Uncommon medium stars
          sizes.push(Math.random() * 0.05 + 0.03);
        } else {
          // Common small stars
          sizes.push(Math.random() * 0.03 + 0.01);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

      const starMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      });

      starPoints.current = new THREE.Points(geometry, starMaterial);
      scene.current.add(starPoints.current);
    };

    createStarfield();

    // Create constellations
    Object.entries(CONSTELLATIONS).forEach(([key, constellation]) => {
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
        linewidth: 2
      });

      const constellationObject = new THREE.Line(constellationGeometry, constellationMaterial);
      constellationObject.visible = key === currentConstellation.current;
      constellations.current[key] = constellationObject;
      scene.current.add(constellationObject);
      
      // Add stars at vertices
      const vertexGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const vertexMaterial = new THREE.MeshBasicMaterial({
        color: 0x70a9f7,
        transparent: true,
        opacity: 0.9
      });
      
      constellation.points.forEach(point => {
        const star = new THREE.Mesh(vertexGeometry, vertexMaterial.clone());
        star.position.set(...point);
        constellationObject.add(star);
      });
    });

    // Handle window resize
    const handleResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      if (starPoints.current) {
        // Rotate starfield slowly
        starPoints.current.rotation.x += 0.0002;
        starPoints.current.rotation.y += 0.0003;
        
        // Parallax effect with mouse
        starPoints.current.rotation.x += (mouse.current.y * 0.002 - starPoints.current.rotation.x) * 0.05;
        starPoints.current.rotation.y += (mouse.current.x * 0.002 - starPoints.current.rotation.y) * 0.05;
      }
      
      // Animate active constellation
      Object.entries(constellations.current).forEach(([key, constellation]) => {
        if (constellation.visible) {
          constellation.rotation.y = Math.sin(Date.now() * 0.0005) * 0.07;
          constellation.rotation.x = Math.sin(Date.now() * 0.0004) * 0.05;
          
          // Animate stars in constellation
          constellation.children.forEach((star, i) => {
            star.material.opacity = Math.sin(Date.now() * 0.001 + i * 0.2) * 0.3 + 0.7;
            star.scale.setScalar(Math.sin(Date.now() * 0.002 + i * 0.1) * 0.3 + 1.2);
          });
        }
      });
      
      // Parallax effect with scroll
      if (camera.current) {
        camera.current.position.y = -scrollY.current * 0.0015;
        starPoints.current.position.y = scrollY.current * 0.0005;
      }
      
      renderer.current.render(scene.current, camera.current);
    };
    
    animate();

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Raycaster for interactive constellation points
      raycaster.current.setFromCamera(mouse.current, camera.current);
      
      Object.values(constellations.current).forEach(constellation => {
        if (constellation.visible) {
          const intersects = raycaster.current.intersectObjects(constellation.children);
          if (intersects.length > 0) {
            gsap.to(intersects[0].object.scale, {
              x: 2,
              y: 2,
              z: 2,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        }
      });
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Set visibility after a short delay to ensure smooth transition from loading screen
    const visibilityTimeout = setTimeout(() => setIsVisible(true), 300);

    return () => {
      clearTimeout(visibilityTimeout);
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (renderer.current && threeContainerRef.current) {
        threeContainerRef.current.removeChild(renderer.current.domElement);
        renderer.current.dispose();
      }
    };
  }, []);

  // Enhanced text animation with GSAP
  useEffect(() => {
    if (textRef.current && isVisible) {
      const tl = gsap.timeline();
      
      // Split title animation
      tl.fromTo(".hero-title .word-1 span", 
        { opacity: 0, y: 40, filter: "blur(15px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          stagger: 0.06,
          duration: 1,
          ease: "power4.out"
        }
      );
      
      tl.fromTo(".hero-title .word-2 span", 
        { opacity: 0, y: 40, filter: "blur(15px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          stagger: 0.06,
          duration: 1,
          ease: "power4.out"
        },
        "-=0.7"
      );
      
      // Subtitle animation
      tl.fromTo(".hero-subtitle",
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { 
          opacity: 1, 
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out" 
        },
        "-=0.8"
      );
      
      // Description text animation
      tl.fromTo(".hero-description",
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out" 
        },
        "-=0.8"
      );
      
      // Button animation with glow effect
      tl.fromTo(".hero-button",
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)" 
        },
        "-=0.7"
      );
      
      // Button glow animation
      tl.fromTo(".button-glow",
        { opacity: 0 },
        {
          opacity: 0.7,
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        }
      );

      // Scroll indicator animation
      tl.fromTo(".scroll-indicator",
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.5
        },
        "-=0.4"
      );

      // Set up scroll animations
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-container",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: -100,
        opacity: 0.5
      });
      
      // Scroll indicator fade out
      gsap.to(".scroll-indicator", {
        scrollTrigger: {
          trigger: ".hero-container",
          start: "top top",
          end: "20% top",
          scrub: true
        },
        opacity: 0,
        y: 30
      });
      
      // Floating code animations
      gsap.fromTo(".floating-code-1", 
        { y: 0, opacity: 0.05 },
        {
          y: -80,
          opacity: 0.1,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
      
      gsap.fromTo(".floating-code-2", 
        { y: 0, opacity: 0.07 },
        {
          y: -120,
          opacity: 0.12,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2
        }
      );
    }
  }, [isVisible]);

  // Text splitting for animation
  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  // Cycle through constellations
  useEffect(() => {
    if (!isVisible) return;
    
    const constellationKeys = Object.keys(CONSTELLATIONS);
    let index = 0;
    
    const cycleInterval = setInterval(() => {
      const oldConstellation = currentConstellation.current;
      index = (index + 1) % constellationKeys.length;
      const newConstellation = constellationKeys[index];
      
      // Fade out current constellation
      if (constellations.current[oldConstellation]) {
        gsap.to(constellations.current[oldConstellation].material, {
          opacity: 0,
          duration: 1.5,
          onComplete: () => {
            constellations.current[oldConstellation].visible = false;
            
            // Fade in new constellation
            constellations.current[newConstellation].visible = true;
            gsap.to(constellations.current[newConstellation].material, {
              opacity: 0.7,
              duration: 1.5
            });
            
            // Fade in stars for new constellation
            constellations.current[newConstellation].children.forEach((star, i) => {
              gsap.to(star.material, {
                opacity: 0.9,
                delay: i * 0.1,
                duration: 0.8
              });
            });
            
            currentConstellation.current = newConstellation;
          }
        });
      }
    }, 10000); // Cycle every 10 seconds
    
    return () => clearInterval(cycleInterval);
  }, [isVisible]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050A1F] hero-container">
      {/* Three.js Background */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050A1F]/40 to-[#050A1F] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050A1F]/70 via-transparent to-[#050A1F]/70 pointer-events-none z-10" />
      
      {/* Content Container */}
      <div 
        ref={textRef}
        className={`relative z-20 flex flex-col items-center justify-center min-h-screen px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-5xl mx-auto text-center hero-content">
          {/* Animated Binary Code Background */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-xs md:text-sm font-mono text-blue-500/10 floating-code-1 pointer-events-none">
            {`function initZodiac() {\n  const cosmos = new Universe();\n  return cosmos.initialize();\n}`}
          </div>
          
          <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 text-xs md:text-sm font-mono text-blue-500/10 floating-code-2 pointer-events-none">
            {`const dynamics = {\n  stellar: true,\n  quantum: {\n    state: "superposition",\n    entangled: true\n  }\n};`}
          </div>
          
          {/* Main Title */}
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white mb-6">
            <span className="word-1 font-bold bg-gradient-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent inline-block mr-4">
              {splitText("Zodiac")}
            </span>
            <span className="word-2 font-extralight text-blue-100/90 inline-block">
              {splitText("Dynamics")}
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-blue-300 font-light tracking-wide mb-8">
            Cosmic Solutions for Digital Evolution
          </h2>
          
          {/* Description */}
          <p className="hero-description text-blue-100/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Transforming visions into digital realities with celestial precision. We craft innovative software solutions that propel businesses beyond conventional boundaries.
          </p>
          
          {/* CTA Button with Glow Effect */}
          <div className="relative inline-block mb-16">
            <div className="button-glow absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
            <motion.button
              className="hero-button relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-10 rounded-full font-medium tracking-wide shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.6)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Our Universe
            </motion.button>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            <div className="text-blue-300/70 text-sm mb-2 font-light tracking-wider">
              Scroll to Discover
            </div>
            <motion.div
              className="w-6 h-10 border-2 border-blue-400/30 rounded-full flex justify-center"
              animate={{ boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1.5 h-3 bg-blue-400/50 rounded-full mt-2"
                animate={{ y: [0, 15, 0] }}
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
      
      {/* Ambient Light Flares */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <motion.div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)',
            top: '30%',
            left: '15%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
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
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.05) 0%, rgba(147, 197, 253, 0) 70%)',
            bottom: '20%',
            left: '30%'
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() * 3 + 1, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;