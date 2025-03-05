import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

// Constellation data reused from LoadingScreen
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
  const constellations = useRef({});
  const scrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    renderer.current = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    threeContainerRef.current.appendChild(renderer.current.domElement);

    camera.current.position.z = 5;

    // Create starfield
    const createStarfield = () => {
      const positions = [];
      const colors = [];
      const sizes = [];
      for (let i = 0; i < 4000; i++) {
        positions.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
        const starType = Math.random();
        colors.push(
          starType > 0.95 ? 0.7 : starType > 0.8 ? 0.8 : starType > 0.6 ? 0.6 : 0.4 + Math.random() * 0.2,
          starType > 0.95 ? 0.8 : starType > 0.8 ? 0.9 : starType > 0.6 ? 0.7 : 0.5 + Math.random() * 0.2,
          starType > 0.95 ? 1.0 : starType > 0.8 ? 1.0 : starType > 0.6 ? 0.9 : 0.8 + Math.random() * 0.2
        );
        const sizeFactor = Math.random();
        sizes.push(sizeFactor > 0.98 ? Math.random() * 0.08 + 0.05 : sizeFactor > 0.9 ? Math.random() * 0.05 + 0.03 : Math.random() * 0.03 + 0.01);
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

    // Create constellations with offsets
    const offset = { aries: [-2, 0, 0], taurus: [2, 0, 0], gemini: [0, -2, 0] };
    Object.entries(CONSTELLATIONS).forEach(([key, constellation]) => {
      const points = [];
      constellation.points.forEach(point => {
        points.push(point[0] + offset[key][0], point[1] + offset[key][1], point[2] + offset[key][2]);
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

      const material = new THREE.LineBasicMaterial({ color: 0x4f70e5, transparent: true, opacity: 0.2, linewidth: 2 });
      const constellationObject = new THREE.Line(geometry, material);
      constellationObject.visible = true;
      constellations.current[key] = constellationObject;
      scene.current.add(constellationObject);

      const vertexGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const vertexMaterial = new THREE.MeshBasicMaterial({ color: 0x70a9f7, transparent: true, opacity: 0.2 });
      constellation.points.forEach(point => {
        const star = new THREE.Mesh(vertexGeometry, vertexMaterial.clone());
        star.position.set(point[0] + offset[key][0], point[1] + offset[key][1], point[2] + offset[key][2]);
        constellationObject.add(star);
      });
    });

    const handleResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (starPoints.current) {
        starPoints.current.rotation.x += 0.0002;
        starPoints.current.rotation.y += 0.0003;
        starPoints.current.rotation.x += (mouse.current.y * 0.0005 - starPoints.current.rotation.x) * 0.05;
        starPoints.current.rotation.y += (mouse.current.x * 0.0005 - starPoints.current.rotation.y) * 0.05;
      }

      Object.values(constellations.current).forEach(constellation => {
        if (constellation.visible) {
          constellation.rotation.y = Math.sin(Date.now() * 0.0005) * 0.07;
          constellation.rotation.x = Math.sin(Date.now() * 0.0004) * 0.05;
        }
      });

      camera.current.position.y = -scrollY.current * 0.0015;
      starPoints.current.position.y = scrollY.current * 0.0005;
      renderer.current.render(scene.current, camera.current);
    };
    animate();

    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera.current);
      Object.values(constellations.current).forEach(constellation => {
        if (constellation.visible) {
          const intersects = raycaster.current.intersectObjects(constellation.children);
          if (intersects.length > 0) {
            gsap.to(intersects[0].object.scale, { x: 2, y: 2, z: 2, duration: 0.3, ease: 'power2.out' });
          }
        }
      });
    };

    const handleScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

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

  // Text animations with GSAP
  useEffect(() => {
    if (textRef.current && isVisible) {
      const tl = gsap.timeline();

      // Title animations with shine effect
      tl.fromTo(".hero-title .word-1 span",
        { opacity: 0, y: 40, filter: "blur(15px)", scale: 0.9 },
        { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, stagger: 0.06, duration: 1, ease: "power4.out" }
      );
      tl.to(".hero-title .word-1 span", { scale: 1.1, duration: 0.2, ease: "power2.in", stagger: 0.06 }, "-=0.8");
      tl.to(".hero-title .word-1 span", { scale: 1, duration: 0.3, ease: "power2.out", stagger: 0.06 }, "-=0.6");

      tl.fromTo(".hero-title .word-2 span",
        { opacity: 0, y: 40, filter: "blur(15px)", scale: 0.9 },
        { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, stagger: 0.06, duration: 1, ease: "power4.out" },
        "-=0.7"
      );
      tl.to(".hero-title .word-2 span", { scale: 1.1, duration: 0.2, ease: "power2.in", stagger: 0.06 }, "-=0.8");
      tl.to(".hero-title .word-2 span", { scale: 1, duration: 0.3, ease: "power2.out", stagger: 0.06 }, "-=0.6");

      // Subtitle and description
      tl.fromTo(".hero-subtitle",
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
        "-=0.8"
      );
      tl.fromTo(".hero-description",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.8"
      );

      // Button and glow
      tl.fromTo(".hero-button",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.7"
      );
      tl.fromTo(".button-glow",
        { opacity: 0 },
        { opacity: 0.5, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" }
      );

      // Scroll indicator
      tl.fromTo(".scroll-indicator",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 },
        "-=0.4"
      );

      // Constellation synchronization
      tl.to(constellations.current.aries.material, { opacity: 0.7, duration: 1, ease: "power2.out" }, 0);
      tl.to(constellations.current.aries.children.map(child => child.material), { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
      tl.to(constellations.current.aries.children.map(child => child.scale), { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "power2.out" }, 0);
      tl.to(constellations.current.aries.children.map(child => child.material), { opacity: 0.9, duration: 0.5, ease: "power2.in" }, 0.5);
      tl.to(constellations.current.aries.children.map(child => child.scale), { x: 1.2, y: 1.2, z: 1.2, duration: 0.5, ease: "power2.in" }, 0.5);

      tl.to(constellations.current.taurus.material, { opacity: 0.7, duration: 1, ease: "power2.out" }, 0.5);
      tl.to(constellations.current.taurus.children.map(child => child.material), { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.5);
      tl.to(constellations.current.taurus.children.map(child => child.scale), { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "power2.out" }, 0.5);
      tl.to(constellations.current.taurus.children.map(child => child.material), { opacity: 0.9, duration: 0.5, ease: "power2.in" }, 1.0);
      tl.to(constellations.current.taurus.children.map(child => child.scale), { x: 1.2, y: 1.2, z: 1.2, duration: 0.5, ease: "power2.in" }, 1.0);

      tl.to(constellations.current.gemini.material, { opacity: 0.7, duration: 1, ease: "power2.out" }, 1.0);
      tl.to(constellations.current.gemini.children.map(child => child.material), { opacity: 1, duration: 0.5, ease: "power2.out" }, 1.0);
      tl.to(constellations.current.gemini.children.map(child => child.scale), { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "power2.out" }, 1.0);
      tl.to(constellations.current.gemini.children.map(child => child.material), { opacity: 0.9, duration: 0.5, ease: "power2.in" }, 1.5);
      tl.to(constellations.current.gemini.children.map(child => child.scale), { x: 1.2, y: 1.2, z: 1.2, duration: 0.5, ease: "power2.in" }, 1.5);

      // Scroll animations
      gsap.to(".hero-content", {
        scrollTrigger: { trigger: ".hero-container", start: "top top", end: "bottom top", scrub: true },
        y: -100,
        opacity: 0.5
      });
      gsap.to(".scroll-indicator", {
        scrollTrigger: { trigger: ".hero-container", start: "top top", end: "20% top", scrub: true },
        opacity: 0,
        y: 30
      });

      // Floating code animations
      gsap.fromTo(".floating-code-1",
        { y: 0, opacity: 0.03 },
        { y: -50, opacity: 0.05, duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" }
      );
      gsap.fromTo(".floating-code-2",
        { y: 0, opacity: 0.04 },
        { y: -70, opacity: 0.06, duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 }
      );
    }
  }, [isVisible]);

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
    ));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050A1F] hero-container">
      <div ref={threeContainerRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050A1F]/40 to-[#050A1F] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050A1F]/70 via-transparent to-[#050A1F]/70 pointer-events-none z-10" />

      <div
        ref={textRef}
        className={`relative z-20 flex flex-col items-center justify-center min-h-screen px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-5xl mx-auto text-center hero-content">
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-xs md:text-sm font-mono text-blue-500/10 floating-code-1 pointer-events-none">
            {`function initZodiac() {\n  const cosmos = new Universe();\n  return cosmos.initialize();\n}`}
          </div>
          <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 text-xs md:text-sm font-mono text-blue-500/10 floating-code-2 pointer-events-none">
            {`const dynamics = {\n  stellar: true,\n  quantum: {\n    state: "superposition",\n    entangled: true\n  }\n};`}
          </div>

          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white mb-6" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
            <span className="word-1 font-bold bg-gradient-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent inline-block mr-4">
              {splitText("Zodiac")}
            </span>
            <span className="word-2 font-extralight text-blue-100/90 inline-block">
              {splitText("Dynamics")}
            </span>
          </h1>

          <h2 className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-blue-300 font-light tracking-wide mb-8" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.2)' }}>
            Cosmic Solutions for Digital Evolution
          </h2>

          <p className="hero-description text-blue-100/80 max-w-2xl mx-auto mb-12 leading-relaxed" style={{ textShadow: '0 0 5px rgba(59, 130, 246, 0.1)' }}>
            Transforming visions into digital realities with celestial precision. We craft innovative software solutions that propel businesses beyond conventional boundaries.
          </p>

          <div className="relative inline-block mb-16">
            <div className="button-glow absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
            <motion.button
              className="hero-button relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-10 rounded-full font-medium tracking-wide shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.6)", textShadow: "0 0 10px rgba(255, 255, 255, 0.8)" }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Our Universe
            </motion.button>
          </div>

          <motion.div
            className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          >
            <div className="text-blue-300/70 text-sm mb-2 font-light tracking-wider">Scroll to Discover</div>
            <motion.div
              className="w-6 h-10 border-2 border-blue-400/30 rounded-full flex justify-center"
              animate={{ boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-3 bg-blue-400/50 rounded-full mt-2"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)', top: '30%', left: '15%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, rgba(96, 165, 250, 0) 70%)', top: '40%', right: '10%' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(147, 197, 253, 0.05) 0%, rgba(147, 197, 253, 0) 70%)', bottom: '20%', left: '30%' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -100, 0], x: [0, Math.random() * 50 - 25, 0], opacity: [0, 0.8, 0], scale: [0, Math.random() * 3 + 1, 0] }}
            transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, delay: Math.random() * 10 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;