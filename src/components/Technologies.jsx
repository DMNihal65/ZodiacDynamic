import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Technology data with orbit parameters
const technologies = {
  frontend: [
    { name: 'React', icon: '/tech/react.svg', description: 'A JavaScript library for building user interfaces', orbitalPeriod: 70, distance: 10, size: 1.2 },
    { name: 'Vue', icon: '/tech/vue.svg', description: 'Progressive JavaScript framework for building UIs', orbitalPeriod: 85, distance: 10, size: 1.0 },
    { name: 'Angular', icon: '/tech/angular.svg', description: 'Platform for building mobile & desktop web apps', orbitalPeriod: 100, distance: 10, size: 1.1 },
    { name: 'Next.js', icon: '/tech/nextjs.svg', description: 'React framework for production-grade apps', orbitalPeriod: 115, distance: 10, size: 1.0 },
    { name: 'Tailwind', icon: '/tech/tailwind.svg', description: 'Utility-first CSS framework', orbitalPeriod: 130, distance: 10, size: 0.9 }
  ],
  backend: [
    { name: 'Node.js', icon: '/tech/nodejs.svg', description: 'JavaScript runtime built on Chromes V8 engine', orbitalPeriod: 90, distance: 20, size: 1.2 },
    { name: 'Python', icon: '/tech/python.svg', description: 'Interpreted high-level programming language', orbitalPeriod: 110, distance: 20, size: 1.3 },
    { name: 'Java', icon: '/tech/java.svg', description: 'Object-oriented programming language', orbitalPeriod: 130, distance: 20, size: 1.1 },
    { name: 'Go', icon: '/tech/go.svg', description: 'Statically typed language by Google', orbitalPeriod: 150, distance: 20, size: 1.0 },
    { name: 'GraphQL', icon: '/tech/graphql.svg', description: 'Query language for APIs', orbitalPeriod: 170, distance: 20, size: 0.9 }
  ],
  mobile: [
    { name: 'React Native', icon: '/tech/react-native.svg', description: 'Framework for building native apps with React', orbitalPeriod: 80, distance: 30, size: 1.2 },
    { name: 'Flutter', icon: '/tech/flutter.svg', description: 'Googles UI toolkit for multi-platform apps', orbitalPeriod: 110, distance: 30, size: 1.1 },
    { name: 'Swift', icon: '/tech/swift.svg', description: 'Powerful language for iOS development', orbitalPeriod: 140, distance: 30, size: 1.0 },
    { name: 'Kotlin', icon: '/tech/kotlin.svg', description: 'Modern language for Android development', orbitalPeriod: 170, distance: 30, size: 1.0 }
  ],
  cloud: [
    { name: 'AWS', icon: '/tech/aws.svg', description: 'Comprehensive cloud platform by Amazon', orbitalPeriod: 120, distance: 40, size: 1.4 },
    { name: 'Azure', icon: '/tech/azure.svg', description: 'Microsofts cloud computing service', orbitalPeriod: 150, distance: 40, size: 1.3 },
    { name: 'Google Cloud', icon: '/tech/gcp.svg', description: 'Googles suite of cloud computing services', orbitalPeriod: 180, distance: 40, size: 1.3 },
    { name: 'Docker', icon: '/tech/docker.svg', description: 'Platform for developing, shipping, and running apps', orbitalPeriod: 210, distance: 40, size: 1.0 },
    { name: 'Kubernetes', icon: '/tech/kubernetes.svg', description: 'Container orchestration system', orbitalPeriod: 240, distance: 40, size: 1.1 }
  ]
};

// Category theme mapping
const categoryThemes = {
  frontend: {
    color: '#4F70E5',
    orbitColor: 0x4F70E5,
    gradient: 'from-blue-500/20 to-indigo-500/20',
    distance: 15
  },
  backend: {
    color: '#5E9BF2',
    orbitColor: 0x5E9BF2,
    gradient: 'from-blue-400/20 to-blue-600/20',
    distance: 25
  },
  mobile: {
    color: '#4AA8FF',
    orbitColor: 0x4AA8FF,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    distance: 35
  },
  cloud: {
    color: '#70C5F8',
    orbitColor: 0x70C5F8,
    gradient: 'from-blue-300/20 to-indigo-400/20',
    distance: 45
  }
};

// Helper function to create tech sphere texture with icon
const createTechTexture = (name, size = 1) => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const textureSize = 256;
  canvas.width = textureSize;
  canvas.height = textureSize;

  // Draw background
  context.fillStyle = '#1a1a1a';
  context.beginPath();
  context.arc(textureSize/2, textureSize/2, textureSize/2, 0, 2 * Math.PI);
  context.fill();

  // Draw gradient
  const gradient = context.createRadialGradient(
    textureSize/2, textureSize/2, 0,
    textureSize/2, textureSize/2, textureSize/2
  );
  gradient.addColorStop(0, 'rgba(80, 120, 255, 0.8)');
  gradient.addColorStop(0.7, 'rgba(60, 100, 220, 0.5)');
  gradient.addColorStop(1, 'rgba(30, 60, 180, 0.1)');
  
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(textureSize/2, textureSize/2, textureSize/2, 0, 2 * Math.PI);
  context.fill();

  // Add text
  context.font = '24px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(name, textureSize/2, textureSize/2);

  // Create a texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// Tech Solar System Component
const TechSolarSystem = () => {
  const mountRef = useRef(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const techObjectsRef = useRef({});
  const orbitLinesRef = useRef({});
  const animationFrameRef = useRef(null);
  const infoPopupRef = useRef(null);
  
  // Intersection observer to detect when component is in view
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current || isInitialized) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 65;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Add point light at center (representing the core)
    const coreLight = new THREE.PointLight(0x3B82F6, 2, 100);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);
    
    // Create core at center
    const coreGeometry = new THREE.SphereGeometry(4, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x4F70E5,
      transparent: true,
      opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    
    // Add pulsating glow to core
    const glowGeometry = new THREE.SphereGeometry(4.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4F70E5,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);
    
    // Add stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = [];
    
    for (let i = 0; i < starCount; i++) {
      // Random positions in a sphere
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 100 + Math.random() * 50;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starPositions.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xFFFFFF, 
      size: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Add orbit paths for each category
    const techObjects = {};
    const orbitLines = {};
    
    Object.entries(categoryThemes).forEach(([category, theme]) => {
      // Create orbit path
      const orbitGeometry = new THREE.RingGeometry(theme.distance - 0.2, theme.distance + 0.2, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: theme.orbitColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      orbitLines[category] = orbit;
      
      // Create tech objects for this category
      techObjects[category] = [];
      
      technologies[category].forEach((tech, index) => {
        // Adjust orbital spacing for each tech in the category
        const angle = (index / technologies[category].length) * Math.PI * 2;
        const adjustedDistance = theme.distance;
        
        // Create tech sphere with texture
        const texture = createTechTexture(tech.name, tech.size);
        
        const sphereGeometry = new THREE.SphereGeometry(tech.size, 24, 24);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        // Position the tech on its orbit
        sphere.position.x = Math.cos(angle) * adjustedDistance;
        sphere.position.z = Math.sin(angle) * adjustedDistance;
        
        // Store original angle for animation
        sphere.userData = {
          ...tech,
          category,
          angle,
          originalPosition: {
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z
          }
        };
        
        scene.add(sphere);
        techObjects[category].push(sphere);
      });
    });
    
    techObjectsRef.current = techObjects;
    orbitLinesRef.current = orbitLines;
    
    // Create raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Add click event listener
    const handleMouseClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      // Get all tech objects
      const techObjectsArray = Object.values(techObjectsRef.current)
        .flat()
        .filter(Boolean);
      
      // Check for intersections
      const intersects = raycaster.intersectObjects(techObjectsArray);
      
      if (intersects.length > 0) {
        const selected = intersects[0].object;
        setSelectedTech(selected.userData);
        
        // Update info popup position
        if (infoPopupRef.current) {
          const vector = new THREE.Vector3();
          vector.setFromMatrixPosition(selected.matrixWorld);
          vector.project(cameraRef.current);
          
          const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
          const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
          
          infoPopupRef.current.style.left = `${x}px`;
          infoPopupRef.current.style.top = `${y}px`;
        }
      } else {
        setSelectedTech(null);
      }
    };
    
    // Add event listener
    window.addEventListener('click', handleMouseClick);
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const clock = new THREE.Clock();
    let time = 0;
    
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      time += delta;
      
      // Pulse the core glow
      glow.scale.set(
        1 + Math.sin(time * 2) * 0.1, 
        1 + Math.sin(time * 2) * 0.1, 
        1 + Math.sin(time * 2) * 0.1
      );
      
      // Rotate the core
      core.rotation.y += delta * 0.2;
      
      // Animate tech objects in orbit
      Object.entries(techObjectsRef.current).forEach(([category, techs]) => {
        techs.forEach(tech => {
          if (tech && tech.userData) {
            // Calculate new position based on orbital period
            const period = tech.userData.orbitalPeriod;
            const angle = tech.userData.angle + (time / period) * Math.PI * 2;
            const distance = categoryThemes[category].distance;
            
            tech.position.x = Math.cos(angle) * distance;
            tech.position.z = Math.sin(angle) * distance;
            
            // Rotate the tech
            tech.rotation.y += delta * 0.5;
          }
        });
      });
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    
    animate();
    setIsInitialized(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of resources
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [isInitialized]);
  
  // Handle visibility changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (inView) {
      // Resume animation
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        if (sceneRef.current && cameraRef.current && rendererRef.current && controlsRef.current) {
          controlsRef.current.update();
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();
    } else {
      // Pause animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [inView, isInitialized]);
  
  return (
    <div 
      className="relative w-full h-[700px] md:h-[800px]"
      ref={(node) => {
        mountRef.current = node;
        ref(node);
      }}
    >
      {/* Technology info popup */}
      {selectedTech && (
        <motion.div
          ref={infoPopupRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-10 bg-[#070D20]/90 backdrop-blur-md p-4 rounded-lg border border-blue-500/30 shadow-lg min-w-[200px] max-w-[300px] transform -translate-x-1/2 -translate-y-[120%]"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <img 
                src={selectedTech.icon} 
                alt={selectedTech.name} 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-white">{selectedTech.name}</h3>
          </div>
          <p className="text-blue-100/80 text-sm">{selectedTech.description}</p>
        </motion.div>
      )}

      {/* Instructions overlay */}
      <div className="absolute bottom-6 left-6 bg-[#070D20]/80 backdrop-blur-md p-3 rounded-lg border border-blue-500/20 text-xs text-blue-200/80 max-w-[200px]">
        <p className="mb-1 font-medium text-blue-300">Solar System Controls:</p>
        <ul className="space-y-1">
          <li>• Click on a technology to see details</li>
          <li>• Drag to rotate the view</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Double-click to reset view</li>
        </ul>
      </div>
    </div>
  );
};

// Tech category card with stats
const TechCategoryCard = ({ category, title, icon, description, techs, color, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[#070D20]/80 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6
               hover:border-blue-500/40 transition-all duration-300 group"
      style={{ 
        boxShadow: `0 8px 32px -10px ${color}30`
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10"
        >
          {icon.svg}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-blue-100/70 mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex gap-2 flex-wrap">
        {techs.map(tech => (
          <span key={tech.name} 
                className="text-xs px-3 py-1 rounded-full transition-colors duration-300 bg-blue-500/10 text-blue-300">
            {tech.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// Main Technologies component
export default function Technologies() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Category card data with icons
  const categoryCards = [
    { 
      category: 'frontend',
      title: 'Frontend Excellence',
      icon: { 
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
      },
      description: 'Creating stunning user interfaces with modern frameworks that deliver exceptional experiences across all devices.',
      techs: technologies.frontend,
      color: '#4F70E5'
    },
    {
      category: 'backend',
      title: 'Robust Backend',
      icon: {
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
      },
      description: 'Powering applications with scalable, secure backend solutions that ensure performance and reliability.',
      techs: technologies.backend,
      color: '#5E9BF2'
    },
    {
      category: 'mobile',
      title: 'Celestial Mobile',
      icon: {
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
      },
      description: 'Building native and cross-platform mobile applications that extend your digital reach to every user device.',
      techs: technologies.mobile,
      color: '#4AA8FF'
    },
    {
      category: 'cloud',
      title: 'Nebula Cloud',
      icon: {
        svg: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
      },
      description: 'Deploying and scaling with modern cloud infrastructure that ensures your solutions reach cosmic scale.',
      techs: technologies.cloud,
      color: '#70C5F8'
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[#030617] to-[#050A1F]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#030617] opacity-90" />
      
      {/* Animated nebula effects */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(ellipse at 10% 90%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 90% 10%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 10% 90%, rgba(79, 112, 229, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundSize: '50px 50px',
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
                     bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm
                     text-sm font-medium text-blue-300 mb-4"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Our Technology Cosmos
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-blue-300 bg-clip-text text-transparent mb-4">
            Universal Tech Arsenal
          </h2>
          
          <p className="text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            Explore our solar system of technologies that powers digital transformation across the universe
          </p>
          
          {/* Decorative accent line */}
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-300 mx-auto rounded-full mt-6"
            initial={{ width: 0 }}
            animate={inView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        {/* Solar System Display */}
        <TechSolarSystem />
        
        {/* Technology Category Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {categoryCards.map((card, index) => (
            <TechCategoryCard
              key={card.category}
              {...card}
              index={index}
            />
          ))}
        </div>
        
        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { value: "20+", label: "Core Technologies", color: "#4F70E5" },
            { value: "100+", label: "Projects Delivered", color: "#5E9BF2" },
            { value: "99%", label: "Client Satisfaction", color: "#4AA8FF" },
            { value: "24/7", label: "Stellar Support", color: "#70C5F8" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5, boxShadow: `0 10px 30px -5px ${stat.color}40` }}
              className="text-center p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-lg
                       border border-white/10 flex flex-col items-center justify-center"
            >
              <h4 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                {stat.value}
              </h4>
              <p className="text-blue-100/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030617] to-transparent pointer-events-none" />
    </section>
  );
}
