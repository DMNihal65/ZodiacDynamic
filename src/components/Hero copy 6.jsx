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
      
      for (let i = 0; i < 3500; i++) {
        positions.push(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
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

      const starMaterial = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        sizeAttenuation: true,
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
          opacity: 0.7
        });

        const constellationObject = new THREE.Line(constellationGeometry, constellationMaterial);
        constellationObject.visible = key === currentConstellation.current;
        constellations.current[key] = constellationObject;
        scene.current.add(constellationObject);
        
        // Add stars at vertices
        const vertexGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const vertexMaterial = new THREE.MeshBasicMaterial({
          color: 0x70a9f7,
          transparent: true,
          opacity: 0.8
        });
        
        constellation.points.forEach(point => {
          const star = new THREE.Mesh(vertexGeometry, vertexMaterial.clone());
          star.position.set(...point);
          constellationObject.add(star);
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

    // Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      if (starPoints.current) {
        // Rotate starfield slowly
        starPoints.current.rotation.x += 0.0002;
        starPoints.current.rotation.y += 0.0003;
        
        // Parallax effect
        starPoints.current.rotation.x += (mouse.current.y * 0.001 - starPoints.current.rotation.x) * 0.1;
        starPoints.current.rotation.y += (mouse.current.x * 0.001 - starPoints.current.rotation.y) * 0.1;
      }
      
      // Animate active constellation
      Object.entries(constellations.current).forEach(([key, constellation]) => {
        if (constellation.visible) {
          constellation.rotation.y = Math.sin(Date.now() * 0.0005) * 0.05;
          constellation.rotation.x = Math.sin(Date.now() * 0.0004) * 0.03;
          
          // Animate stars in constellation
          constellation.children.forEach((star, i) => {
            star.material.opacity = Math.sin(Date.now() * 0.001 + i * 0.2) * 0.3 + 0.7;
            star.scale.setScalar(Math.sin(Date.now() * 0.002 + i * 0.1) * 0.3 + 1.2);
          });
        }
      });
      
      // Parallax effect with scroll
      if (camera.current) {
        camera.current.position.y = -scrollY.current * 0.003;
      }
      
      renderer.current.render(scene.current, camera.current);
    };
    
    animate();

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

  // Text animation with GSAP
  useEffect(() => {
    if (textRef.current && isVisible) {
      const tl = gsap.timeline();
      
      // Staggered animation for main heading
      tl.fromTo(".hero-title span", 
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 1,
          ease: "power3.out"
        }
      );
      
      // Subtitle animation
      tl.fromTo(".hero-subtitle",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1,
          ease: "power2.out" 
        },
        "-=0.6"
      );
      
      // Description text animation
      tl.fromTo(".hero-description",
        { opacity: 0 },
        { 
          opacity: 1,
          duration: 1,
          ease: "power2.out" 
        },
        "-=0.7"
      );
      
      // Button animation
      tl.fromTo(".hero-button",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)" 
        },
        "-=0.7"
      );

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
      
      gsap.to(".hero-title, .hero-subtitle", {
        scrollTrigger: {
          trigger: ".hero-container",
          start: "top top",
          end: "center top",
          scrub: true
        },
        y: -50,
        opacity: 0.5
      });
    }
  }, [isVisible]);

  // Text splitting for animation
  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="inline-block">
        {char}
      </span>
    ));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050A1F] hero-container">
      {/* Three.js Background */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050A1F]/30 to-[#050A1F] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050A1F]/60 via-transparent to-[#050A1F]/60 pointer-events-none z-10" />
      
      {/* Content Container */}
      <div 
        ref={textRef}
        className={`relative z-20 flex flex-col items-center justify-center min-h-screen px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter text-white mb-6">
            <span className="font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent mr-3">
              {splitText("Zodiac")}
            </span>
            <span className="font-extralight text-blue-100/90">
              {splitText("Dynamics")}
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="hero-subtitle text-xl md:text-2xl text-blue-300 font-light tracking-wide mb-8">
            Cosmic Solutions for Digital Evolution
          </h2>
          
          {/* Description */}
          <p className="hero-description text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transforming visions into digital realities with celestial precision. We craft innovative software solutions that propel businesses beyond conventional boundaries.
          </p>
          
          {/* CTA Button */}
          <motion.button
            className="hero-button bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-8 rounded-full font-medium tracking-wide shadow-lg shadow-blue-500/20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Our Universe
          </motion.button>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center"
              animate={{ boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.5)", "0 0 0px rgba(59, 130, 246, 0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1.5 h-3 bg-blue-400/80 rounded-full mt-2"
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
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Abstract code snippets */}
        <motion.div
          className="absolute text-xs font-mono text-blue-500/10 top-1/4 left-10 md:left-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7, x: [0, 10, 0] }}
          transition={{ delay: 1, duration: 10, repeat: Infinity }}
        >
          {`function initZodiac() {\n  return dynamics.create();\n}`}
        </motion.div>
        
        <motion.div
          className="absolute text-xs font-mono text-blue-500/10 bottom-1/4 right-10 md:right-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7, x: [0, -10, 0] }}
          transition={{ delay: 1.5, duration: 12, repeat: Infinity }}
        >
          {`const universe = {\n  solutions: infinity,\n  creativity: true\n};`}
        </motion.div>
        
        {/* Ambient light flares */}
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
      </div>
    </div>
  );
};

export default Hero;