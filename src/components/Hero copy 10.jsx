import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

// Enhanced constellation data
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
  },
  libra: {
    name: 'Libra',
    points: [[-1.2, 0.3, 0], [-0.6, 0.5, 0], [0, 0.4, 0], [0.6, 0.5, 0], [1.2, 0.3, 0], [0, 0.4, 0], [0, -0.4, 0]]
  },
  scorpio: {
    name: 'Scorpio',
    points: [[-1.5, 0, 0], [-0.8, 0.2, 0], [0, 0.1, 0], [0.7, -0.2, 0], [1.2, -0.5, 0], [1.5, -0.3, 0], [1.3, -0.1, 0]]
  }
};

const Hero = () => {
  const threeContainerRef = useRef(null);
  const contentRef = useRef(null);
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
  const timeline = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Setup renderer with optimized settings
    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    threeContainerRef.current.appendChild(renderer.current.domElement);

    // Setup camera position
    camera.current.position.z = 5;

    // Create enhanced starfield
    const createStarfield = () => {
      const positions = [];
      const colors = [];
      const sizes = [];
      
      // Create more stars for richer background
      for (let i = 0; i < 5000; i++) {
        const radius = 50;
        // Distribute stars in a spherical pattern for more depth
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const distance = Math.pow(Math.random(), 0.5) * radius; // Cluster more toward center
        
        positions.push(
          distance * Math.sin(phi) * Math.cos(theta),
          distance * Math.sin(phi) * Math.sin(theta),
          distance * Math.cos(phi)
        );
        
        // Refined color palette for stars - more blues and cyans
        const starType = Math.random();
        if (starType > 0.97) {
          // Bright blue-white stars (rare)
          colors.push(0.8, 0.9, 1.0);
        } else if (starType > 0.9) {
          // Cyan-tinted stars
          colors.push(0.6, 0.85, 0.95);
        } else if (starType > 0.7) {
          // Deep blue stars
          colors.push(0.5, 0.7, 1.0);
        } else if (starType > 0.4) {
          // Common light blue stars
          colors.push(0.7, 0.8, 0.95);
        } else {
          // Subtle background stars
          const intensity = 0.3 + Math.random() * 0.3;
          colors.push(intensity, intensity + 0.1, intensity + 0.3);
        }

        // Improved size distribution
        const sizeFactor = Math.random();
        if (sizeFactor > 0.995) {
          // Ultra rare large stars (almost like small nebulae)
          sizes.push(Math.random() * 0.12 + 0.08);
        } else if (sizeFactor > 0.97) {
          // Very rare large stars
          sizes.push(Math.random() * 0.08 + 0.05);
        } else if (sizeFactor > 0.9) {
          // Uncommon medium stars
          sizes.push(Math.random() * 0.04 + 0.02);
        } else {
          // Common small stars - more variation
          sizes.push(Math.random() * 0.02 + 0.005);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

      // Custom shader material for better looking stars
      const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vDistance;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vDistance = -mvPosition.z;
            gl_PointSize = size * (150.0 / length(mvPosition.xyz));
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vDistance;
          
          void main() {
            // Circular star shape with soft edge
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            float intensity = 1.0 - smoothstep(0.4, 0.5, r);
            
            // Add distance-based opacity for depth effect
            float opacity = mix(0.4, 1.0, vDistance / 30.0);
            
            gl_FragColor = vec4(vColor, intensity * opacity);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      });

      starPoints.current = new THREE.Points(geometry, starMaterial);
      scene.current.add(starPoints.current);
    };

    createStarfield();

    // Create more detailed constellations
    Object.entries(CONSTELLATIONS).forEach(([key, constellation]) => {
      // Create constellation lines
      const constellationPoints = [];
      
      for (let i = 0; i < constellation.points.length - 1; i++) {
        constellationPoints.push(
          new THREE.Vector3(...constellation.points[i]),
          new THREE.Vector3(...constellation.points[i + 1])
        );
      }
      
      // For closed shapes (connect last point to first)
      if (['libra', 'scorpio'].includes(key)) {
        constellationPoints.push(
          new THREE.Vector3(...constellation.points[constellation.points.length - 1]),
          new THREE.Vector3(...constellation.points[0])
        );
      }
      
      const constellationGeometry = new THREE.BufferGeometry().setFromPoints(constellationPoints);
      
      // Use different colors for each constellation
      let lineColor;
      switch (key) {
        case 'aries': lineColor = 0x4f70e5; break;
        case 'taurus': lineColor = 0x5e9bf2; break;
        case 'gemini': lineColor = 0x4aa8ff; break;
        case 'libra': lineColor = 0x70c5f8; break;
        case 'scorpio': lineColor = 0x3d9dff; break;
        default: lineColor = 0x4f70e5;
      }
      
      const constellationMaterial = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0,
        linewidth: 1
      });

      const constellationObject = new THREE.LineSegments(constellationGeometry, constellationMaterial);
      constellationObject.visible = key === currentConstellation.current;
      constellations.current[key] = constellationObject;
      scene.current.add(constellationObject);
      
      // Add stars at vertices with varied sizes
      const starGroup = new THREE.Group();
      constellation.points.forEach((point, index) => {
        // Vary star size based on position in the constellation
        const isImportant = index === 0 || index === constellation.points.length - 1;
        const geometrySize = isImportant ? 0.045 : 0.025 + Math.random() * 0.02;
        
        const vertexGeometry = new THREE.SphereGeometry(geometrySize, 16, 16);
        const vertexMaterial = new THREE.MeshBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: 0
        });
        
        const star = new THREE.Mesh(vertexGeometry, vertexMaterial.clone());
        star.position.set(...point);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(geometrySize * 2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        star.add(glowMesh);
        star.userData = { isGlow: false, glowMesh };
        
        starGroup.add(star);
      });
      
      constellationObject.add(starGroup);
    });

    // Fade in the initial constellation
    if (constellations.current[currentConstellation.current]) {
      constellations.current[currentConstellation.current].visible = true;
      gsap.to(constellations.current[currentConstellation.current].material, {
        opacity: 0.7,
        duration: 2,
        delay: 0.5
      });
      
      // Fade in the stars
      constellations.current[currentConstellation.current].children[0].children.forEach((star, i) => {
        gsap.to(star.material, {
          opacity: 0.9,
          delay: 1 + i * 0.1,
          duration: 1
        });
        
        // Fade in the glow
        if (star.userData && star.userData.glowMesh) {
          gsap.to(star.userData.glowMesh.material, {
            opacity: 0.3,
            delay: 1.2 + i * 0.1,
            duration: 1.2
          });
        }
      });
    }

    // Handle window resize with debounce for performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();
        renderer.current.setSize(window.innerWidth, window.innerHeight);
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop with optimized rendering
    let previousTime = 0;
    const animate = (time) => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      // Limit to 60fps for performance
      const timeElapsed = time - previousTime;
      if (timeElapsed > 16) { // ~60fps
        previousTime = time;
        
        if (starPoints.current) {
          // Update shader time uniform for potential animations
          starPoints.current.material.uniforms.time.value = time * 0.001;
          
          // Gentle rotation for starfield
          starPoints.current.rotation.x += 0.0001;
          starPoints.current.rotation.y += 0.00015;
          
          // Subtle parallax effect with mouse
          starPoints.current.rotation.x += (mouse.current.y * 0.0015 - starPoints.current.rotation.x) * 0.02;
          starPoints.current.rotation.y += (mouse.current.x * 0.0015 - starPoints.current.rotation.y) * 0.02;
        }
        
        // Animate active constellation
        Object.entries(constellations.current).forEach(([key, constellation]) => {
          if (constellation.visible) {
            // Gentle floating motion
            constellation.rotation.y = Math.sin(time * 0.0003) * 0.05;
            constellation.rotation.x = Math.sin(time * 0.0002) * 0.03;
            
            // Animate stars in constellation with variance
            if (constellation.children[0]) {
              constellation.children[0].children.forEach((star, i) => {
                // Pulse the opacity subtly
                const pulseFactor = Math.sin(time * 0.001 + i * 0.3) * 0.15 + 0.85;
                if (star.material.opacity > 0) {
                  star.material.opacity = 0.8 * pulseFactor;
                  
                  // Pulse the glow more dramatically
                  if (star.userData && star.userData.glowMesh) {
                    star.userData.glowMesh.material.opacity = 0.3 * (Math.sin(time * 0.0015 + i * 0.2) * 0.5 + 0.5);
                    star.userData.glowMesh.scale.setScalar(1 + Math.sin(time * 0.002 + i * 0.5) * 0.2);
                  }
                }
              });
            }
          }
        });
        
        // Subtle parallax effect with scroll
        const targetY = -scrollY.current * 0.001;
        camera.current.position.y += (targetY - camera.current.position.y) * 0.05;
        
        renderer.current.render(scene.current, camera.current);
      }
    };
    
    animate(0);

    // Enhanced mouse interaction
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Use raycaster for interactive stars
      raycaster.current.setFromCamera(mouse.current, camera.current);
      
      Object.values(constellations.current).forEach(constellation => {
        if (constellation.visible && constellation.children[0]) {
          const intersects = raycaster.current.intersectObjects(constellation.children[0].children);
          
          // Reset all stars to normal
          constellation.children[0].children.forEach(star => {
            if (star.userData && star.userData.isHovered) {
              gsap.to(star.scale, { 
                x: 1, y: 1, z: 1, 
                duration: 0.3,
                ease: 'power2.out'
              });
              
              if (star.userData.glowMesh) {
                gsap.to(star.userData.glowMesh.material, {
                  opacity: 0.3,
                  duration: 0.3
                });
              }
              
              star.userData.isHovered = false;
            }
          });
          
          // Highlight hovered star
          if (intersects.length > 0) {
            const hoveredStar = intersects[0].object;
            
            // Apply hover effect
            gsap.to(hoveredStar.scale, {
              x: 1.8, y: 1.8, z: 1.8,
              duration: 0.4,
              ease: 'elastic.out(1, 0.5)'
            });
            
            // Enhance glow on hover
            if (hoveredStar.userData && hoveredStar.userData.glowMesh) {
              gsap.to(hoveredStar.userData.glowMesh.material, {
                opacity: 0.7,
                duration: 0.3
              });
              
              hoveredStar.userData.isHovered = true;
            }
          }
        }
      });
    };

    // Optimized scroll handler with throttling
    let scrollThrottled = false;
    const handleScroll = () => {
      if (!scrollThrottled) {
        scrollY.current = window.scrollY;
        scrollThrottled = true;
        setTimeout(() => { scrollThrottled = false; }, 16);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Set visibility after loading completes
    const visibilityTimeout = setTimeout(() => setIsVisible(true), 300);

    return () => {
      clearTimeout(visibilityTimeout);
      clearTimeout(resizeTimeout);
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

  // Refined text animation with GSAP
  useEffect(() => {
    if (contentRef.current && isVisible) {
      // Create main timeline
      timeline.current = gsap.timeline({
        defaults: { ease: "power3.out" }
      });
      
      // Fade in background first
      timeline.current.to(".cosmos-gradient", {
        opacity: 1,
        duration: 2
      });
      
      // Staggered reveal of title words
      timeline.current.fromTo(".hero-title .word",
        {
          opacity: 0,
          y: 40,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.2,
          duration: 1.2
        },
        "-=1.5"
      );
      
      // Reveal title background decoration
      timeline.current.fromTo(".title-decoration",
        { width: 0 },
        { width: "100%", duration: 1 },
        "-=1"
      );
      
      // Subtitle reveal
      timeline.current.fromTo(".hero-subtitle",
        {
          opacity: 0,
          y: 20,
          filter: "blur(3px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8
        },
        "-=0.8"
      );
      
      // Description reveal with character stagger for elegant effect
      timeline.current.fromTo(".hero-description",
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 1
        },
        "-=0.6"
      );
      
      // Button animation
      timeline.current.fromTo(".hero-button",
        {
          opacity: 0,
          y: 20,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.5)"
        },
        "-=0.7"
      );
      
      // Scroll indicator fade in last
      timeline.current.fromTo(".scroll-indicator",
        {
          opacity: 0,
          y: 10
        },
        {
          opacity: 0.7,
          y: 0,
          duration: 0.6
        },
        "-=0.4"
      );
      
      // Set up scroll animations
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: -80,
        opacity: 0.1,
        filter: "blur(5px)",
        ease: "power2.inOut"
      });
      
      // Parallax effect for floating elements
      gsap.to(".parallax-slow", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: -120,
        ease: "none"
      });
      
      gsap.to(".parallax-fast", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: -200,
        ease: "none"
      });
      
      // Floating decorative elements
      gsap.to(".floating-element-1", {
        y: -30,
        x: 15,
        rotation: 5,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      gsap.to(".floating-element-2", {
        y: -40,
        x: -20,
        rotation: -3,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1
      });
      
      // Button hover effects
      const heroButton = document.querySelector(".hero-button");
      if (heroButton) {
        const buttonGlow = document.querySelector(".button-glow");
        
        heroButton.addEventListener("mouseenter", () => {
          gsap.to(buttonGlow, {
            opacity: 0.8,
            scale: 1.2,
            duration: 0.4
          });
        });
        
        heroButton.addEventListener("mouseleave", () => {
          gsap.to(buttonGlow, {
            opacity: 0.3,
            scale: 1,
            duration: 0.4
          });
        });
      }
    }
  }, [isVisible]);

  // Cycle through constellations with smooth transitions
  useEffect(() => {
    if (!isVisible) return;
    
    const constellationKeys = Object.keys(CONSTELLATIONS);
    let index = constellationKeys.indexOf(currentConstellation.current);
    
    const cycleInterval = setInterval(() => {
      // Get current and next constellation
      const oldConstellation = currentConstellation.current;
      index = (index + 1) % constellationKeys.length;
      const newConstellation = constellationKeys[index];
      
      // Create transition timeline
      const transitionTl = gsap.timeline();
      
      // Fade out current constellation
      if (constellations.current[oldConstellation]) {
        // Fade out lines
        transitionTl.to(constellations.current[oldConstellation].material, {
          opacity: 0,
          duration: 1.8,
          ease: "power2.inOut"
        });
        
        // Fade out stars
        if (constellations.current[oldConstellation].children[0]) {
          constellations.current[oldConstellation].children[0].children.forEach((star, i) => {
            transitionTl.to(star.material, {
              opacity: 0,
              duration: 0.7,
              ease: "power2.in"
            }, `-=0.${7-i}`);
            
            if (star.userData && star.userData.glowMesh) {
              transitionTl.to(star.userData.glowMesh.material, {
                opacity: 0,
                duration: 0.5
              }, `-=0.7`);
            }
          });
        }
        
        transitionTl.call(() => {
          // Hide old constellation and show new one
          constellations.current[oldConstellation].visible = false;
          constellations.current[newConstellation].visible = true;
          
          // Fade in new constellation
          gsap.to(constellations.current[newConstellation].material, {
            opacity: 0.7,
            duration: 1.8,
            ease: "power2.out"
          });
          
          // Fade in stars for new constellation
          if (constellations.current[newConstellation].children[0]) {
            constellations.current[newConstellation].children[0].children.forEach((star, i) => {
              gsap.to(star.material, {
                opacity: 0.9,
                delay: 0.3 + i * 0.1,
                duration: 1,
                ease: "power2.out"
              });
              
              if (star.userData && star.userData.glowMesh) {
                gsap.to(star.userData.glowMesh.material, {
                  opacity: 0.3,
                  delay: 0.4 + i * 0.1,
                  duration: 1.2
                });
              }
            });
          }
          
          currentConstellation.current = newConstellation;
        });
      }
    }, 12000); // Cycle every 12 seconds for a more relaxed pace
    
    return () => clearInterval(cycleInterval);
  }, [isVisible]);

  // Split text for refined animations
  const splitWords = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word inline-block">
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030617] hero-section">
      {/* Three.js Background Canvas */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />
      
      {/* Cosmic Background Gradients */}
      <div className="cosmos-gradient absolute inset-0 opacity-0 z-0">
        {/* Deep space gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030617] via-[#070D2A] to-[#051124]"></div>
        
        {/* Nebula effect gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#0F1A45]/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#142356]/5 to-transparent"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#020510]/70"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cosmic dust particle 1 */}
        <div className="floating-element-1 absolute w-64 h-64 rounded-full blur-3xl bg-[#1A4B9C]/5 top-1/4 left-1/5 parallax-slow"></div>
        
        {/* Cosmic dust particle 2 */}
        <div className="floating-element-2 absolute w-96 h-96 rounded-full blur-3xl bg-[#2568D7]/5 bottom-1/3 right-1/4 parallax-fast"></div>
        
        {/* Light streaks */}
        <div className="absolute h-px w-40 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent top-1/3 left-1/4 rotate-[30deg] parallax-fast"></div>
        <div className="absolute h-px w-64 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent bottom-1/3 right-1/3 -rotate-[20deg] parallax-slow"></div>
      </div>
      
      {/* Content Container */}
      <div 
        ref={contentRef}
        className={`relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto text-center hero-content">
          {/* Main Title with Split Words Animation */}
          <h1 className="hero-title relative inline-block mb-6">
            <span className="word-1 text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              {splitWords("Zodiac")}
            </span>
            <span className="word-2 text-5xl sm:text-6xl md:text-7xl font-light text-blue-100/80">
              {splitWords("Dynamics")}
            </span>
            
            {/* Decorative underline animation */}
            <div className="title-decoration absolute left-1/2 transform -translate-x-1/2 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-0"></div>
          </h1>
          
          {/* Subtitle */}
          <h2 className="hero-subtitle text-xl md:text-2xl text-blue-300/90 font-light tracking-wide mb-8">
            Cosmic Solutions for Digital Evolution
          </h2>
          
          {/* Description - More concise and minimal */}
          <p className="hero-description text-blue-100/70 max-w-2xl mx-auto mb-12 leading-relaxed text-base md:text-lg">
            We transform visions into digital realities with celestial precision, crafting innovative solutions 
            that propel businesses beyond conventional boundaries.
          </p>
          
          {/* CTA Button with Enhanced Glow Effect */}
          <div className="relative inline-block mb-16 group">
            <div className="button-glow absolute inset-0 bg-blue-500/30 rounded-full blur-xl opacity-30 transition-all duration-300"></div>
            <motion.button
              className="hero-button relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 px-8 rounded-full font-medium tracking-wide shadow-lg transition-all duration-300"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Our Universe
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </motion.button>
          </div>
          
          {/* Minimal Scroll Indicator */}
          <motion.div 
            className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0"
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
            <div className="text-blue-300/50 text-sm font-light tracking-widest uppercase text-xs mb-2">
              Scroll
            </div>
            <motion.div
              className="w-5 h-9 border border-blue-400/20 rounded-full flex justify-center"
              animate={{ boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 8px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1 h-2 bg-blue-400/40 rounded-full mt-1.5"
                animate={{ y: [0, 15, 0] }}
                transition={{ 
                  duration: 1.8, 
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px rounded-full bg-blue-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() * 2 + 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Constellation Name Display (minimal overlay) */}
      <div className="absolute bottom-4 right-4 text-blue-300/30 text-xs tracking-widest font-light uppercase z-20">
        {CONSTELLATIONS[currentConstellation.current]?.name || ""}
      </div>
    </div>
  );
};

export default Hero;