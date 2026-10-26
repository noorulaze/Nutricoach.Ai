import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Plus, Minus, RotateCcw, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { MUSCLE_GROUPS } from '../data/workoutAnatomyData';

interface HumanAnatomy3DProps {
  selectedMuscleId: string;
  onSelectMuscle: (muscleId: string) => void;
  className?: string;
  viewMode?: 'front' | 'back' | 'side';
  onViewModeChange?: (mode: 'front' | 'back' | 'side') => void;
}

// Comprehensive anatomical classification rules mapping 3D mesh nodes to NutriCoach AI muscle groups
interface MuscleRule {
  id: string;
  name: string;
  patterns: RegExp[];
}

const MUSCLE_RULES: MuscleRule[] = [
  {
    id: 'chest',
    name: 'Chest (Pectoralis Major & Minor)',
    patterns: [/pectoralis/i, /pectoral/i]
  },
  {
    id: 'shoulders',
    name: 'Shoulders (Deltoid & Rotator Cuff)',
    patterns: [/deltoid/i, /supraspinatus/i, /infraspinatus/i, /subscapularis/i]
  },
  {
    id: 'biceps',
    name: 'Biceps (Biceps Brachii & Brachialis)',
    patterns: [/biceps\s+brachii/i, /brachialis/i, /coracobrachialis/i]
  },
  {
    id: 'triceps',
    name: 'Triceps (Triceps Brachii)',
    patterns: [/triceps\s+brachii/i, /anconeus/i]
  },
  {
    id: 'forearms',
    name: 'Forearms (Brachioradialis & Flexors/Extensors)',
    patterns: [/brachioradialis/i, /pronator/i, /supinator/i, /flexor\s+carpi/i, /extensor\s+carpi/i, /flexor\s+digitorum/i, /extensor\s+digitorum/i, /palmaris\s+longus/i, /abductor\s+pollicis/i]
  },
  {
    id: 'abs',
    name: 'Abs (Rectus Abdominis)',
    patterns: [/rectus\s+abdominis/i, /pyramidalis/i]
  },
  {
    id: 'obliques',
    name: 'Obliques (External & Internal Obliques)',
    patterns: [/obliquus\s+externus/i, /obliquus\s+internus/i, /transversus\s+abdominis/i, /external\s+oblique/i, /internal\s+oblique/i]
  },
  {
    id: 'upper_back',
    name: 'Upper Back (Trapezius & Rhomboids)',
    patterns: [/trapezius/i, /rhomboid/i, /levator\s+scapulae/i, /splenius\s+capitis/i, /splenius\s+colli/i, /splenius\s+cervicis/i]
  },
  {
    id: 'lats',
    name: 'Lats (Latissimus Dorsi & Teres Major)',
    patterns: [/latissimus/i, /teres\s+major/i, /teres\s+minor/i]
  },
  {
    id: 'lower_back',
    name: 'Lower Back (Erector Spinae)',
    patterns: [/iliocostalis/i, /longissimus/i, /spinalis/i, /multifidus/i, /quadratus\s+lumborum/i, /erector\s+spinae/i]
  },
  {
    id: 'glutes',
    name: 'Glutes (Gluteus Maximus & Medius)',
    patterns: [/gluteus/i, /piriformis/i, /tensor\s+fasciae\s+latae/i, /obturator/i, /gemellus/i, /quadratus\s+femoris/i]
  },
  {
    id: 'quadriceps',
    name: 'Quadriceps (Rectus Femoris & Vasti)',
    patterns: [/rectus\s+femoris/i, /vastus\s+lateralis/i, /vastus\s+medialis/i, /vastus\s+intermedius/i, /sartorius/i, /quadriceps/i, /pectineus/i, /gracilis/i, /adductor\s+longus/i, /adductor\s+brevis/i, /adductor\s+magnus/i]
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings (Biceps Femoris & Semitendinosus)',
    patterns: [/biceps\s+femoris/i, /semitendinosus/i, /semimembranosus/i]
  },
  {
    id: 'calves',
    name: 'Calves (Gastrocnemius & Soleus)',
    patterns: [/gastrocnemius/i, /soleus/i, /plantaris/i, /popliteus/i, /tibialis/i, /fibularis/i, /peroneus/i, /flexor\s+hallucis/i, /extensor\s+hallucis/i]
  }
];

export default function HumanAnatomy3D({
  selectedMuscleId,
  onSelectMuscle,
  className = '',
  viewMode = 'front',
  onViewModeChange
}: HumanAnatomy3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isWebGlSupported, setIsWebGlSupported] = useState(true);
  const [internalView, setInternalView] = useState<'front' | 'back' | 'side'>(viewMode);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  // References for Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const muscleMeshesMapRef = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const allClickableMeshesRef = useRef<THREE.Mesh[]>([]);

  // Drag & rotation state
  const isDraggingRef = useRef(false);
  const previousPointerXRef = useRef(0);
  const previousPointerYRef = useRef(0);
  const rotationVelocityYRef = useRef(0);
  const rotationVelocityXRef = useRef(0);
  const targetRotationYRef = useRef(0);
  const targetRotationXRef = useRef(0);
  const targetCameraZRef = useRef(2.7);
  const animationFrameIdRef = useRef<number | null>(null);

  // Materials
  const boneMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const unselectedMuscleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const selectedMuscleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const hoveredMuscleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Sync prop changes for view mode
  useEffect(() => {
    if (viewMode !== internalView) {
      setInternalView(viewMode);
      if (viewMode === 'front') targetRotationYRef.current = 0;
      else if (viewMode === 'back') targetRotationYRef.current = Math.PI;
      else if (viewMode === 'side') targetRotationYRef.current = Math.PI * 0.5;
    }
  }, [viewMode, internalView]);

  // Rotate model automatically to ideal orientation when muscle changes
  useEffect(() => {
    const backMuscles = ['upper_back', 'lats', 'lower_back', 'glutes', 'hamstrings'];
    const isBackMuscle = backMuscles.includes(selectedMuscleId);
    
    // Normalize current rotation angle between 0 and 2*PI
    let currentNorm = targetRotationYRef.current % (Math.PI * 2);
    if (currentNorm < 0) currentNorm += Math.PI * 2;
    const isFacingBack = currentNorm > Math.PI * 0.4 && currentNorm < Math.PI * 1.6;

    if (isBackMuscle && !isFacingBack) {
      targetRotationYRef.current = Math.PI;
      setInternalView('back');
      if (onViewModeChange) onViewModeChange('back');
    } else if (!isBackMuscle && isFacingBack) {
      targetRotationYRef.current = 0;
      setInternalView('front');
      if (onViewModeChange) onViewModeChange('front');
    }
  }, [selectedMuscleId, onViewModeChange]);

  // Update muscle materials when selectedMuscleId or hoveredMuscle changes
  const updateMuscleMaterials = useCallback(() => {
    if (!unselectedMuscleMaterialRef.current || !selectedMuscleMaterialRef.current || !hoveredMuscleMaterialRef.current) return;

    muscleMeshesMapRef.current.forEach((meshes, muscleId) => {
      const isSelected = muscleId === selectedMuscleId;
      const isHovered = muscleId === hoveredMuscle && !isSelected;

      let activeMat = unselectedMuscleMaterialRef.current!;
      if (isSelected) {
        activeMat = selectedMuscleMaterialRef.current!;
      } else if (isHovered) {
        activeMat = hoveredMuscleMaterialRef.current!;
      }

      meshes.forEach((mesh) => {
        mesh.material = activeMat;
      });
    });
  }, [selectedMuscleId, hoveredMuscle]);

  useEffect(() => {
    updateMuscleMaterials();
  }, [selectedMuscleId, hoveredMuscle, updateMuscleMaterials]);

  // Load and setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGlSupported(false);
        setIsLoading(false);
        return;
      }
    } catch {
      setIsWebGlSupported(false);
      setIsLoading(false);
      return;
    }

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: FOV 40 with comfortable distance for full 1.70m human body
    const aspect = container.clientWidth / (container.clientHeight || 640);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    camera.position.set(0, 0, 2.7);
    cameraRef.current = camera;
    targetCameraZRef.current = 2.7;

    // 3. Renderer with antialiasing and transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight || 640);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Configuration (matches clean athletic reference)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Front-Right Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(3.0, 4.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Front-Left Fill Light
    const fillLight = new THREE.DirectionalLight(0xd9e5ea, 1.0);
    fillLight.position.set(-3.5, 3.0, 3.5);
    scene.add(fillLight);

    // Rim / Back Light (Crucial for trapezius, lats, glutes, hamstrings)
    const rimLight = new THREE.DirectionalLight(0xe4f3e0, 1.4);
    rimLight.position.set(0, 4.0, -4.5);
    scene.add(rimLight);

    // Soft Bottom Bounce Light
    const groundBounce = new THREE.DirectionalLight(0xbac6c9, 0.5);
    groundBounce.position.set(0, -3.0, 1.5);
    scene.add(groundBounce);

    // 5. Materials
    // Skeletal bones material
    boneMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x828d92,
      roughness: 0.55,
      metalness: 0.12,
      side: THREE.DoubleSide
    });

    // Default Gray/Silver Muscular Material
    unselectedMuscleMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x9ba6ab,
      roughness: 0.45,
      metalness: 0.18,
      side: THREE.DoubleSide
    });

    // Sage Green Highlight for Selected Muscle (matches NutriCoach AI theme #7cb342)
    selectedMuscleMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x7cb342,
      roughness: 0.30,
      metalness: 0.10,
      emissive: 0x243e18,
      emissiveIntensity: 0.65,
      side: THREE.DoubleSide
    });

    // Hover Material
    hoveredMuscleMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x8faf78,
      roughness: 0.35,
      metalness: 0.12,
      emissive: 0x1c3314,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    // 6. Build the 3D Muscular Anatomy Model Group
    const bodyGroup = new THREE.Group();
    // Center model at origin: model vertical midpoint is around 0.858m
    bodyGroup.position.set(0, -0.858, 0);
    scene.add(bodyGroup);
    bodyGroupRef.current = bodyGroup;

    // Contact Floor Shadow
    const shadowGeo = new THREE.RingGeometry(0.01, 0.75, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x141f15,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    bodyGroup.add(shadowMesh);

    // 7. Load Connected Realistic 3D Anatomy Model Asset (GLB + DRACO)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    allClickableMeshesRef.current = [];
    muscleMeshesMapRef.current.clear();
    setIsLoading(true);
    setLoadError(null);

    gltfLoader.load(
      '/models/body.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Traverse model to map every anatomical muscle node to the corresponding muscle group
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const nodeName = mesh.name || '';
            const extraName = (mesh.userData?.name as string) || '';
            const extraDetail = (mesh.userData?.nameDetail as string) || '';
            const nodeType = (mesh.userData?.type as string) || '';
            const fullText = `${nodeName} ${extraName} ${extraDetail}`;

            // Check if mesh belongs to one of the 14 muscle groups
            let matchedGroupId: string | null = null;
            for (const rule of MUSCLE_RULES) {
              if (rule.patterns.some((p) => p.test(fullText))) {
                matchedGroupId = rule.id;
                break;
              }
            }

            if (matchedGroupId) {
              mesh.userData.muscleId = matchedGroupId;
              mesh.material = unselectedMuscleMaterialRef.current!;
              allClickableMeshesRef.current.push(mesh);

              const existing = muscleMeshesMapRef.current.get(matchedGroupId) || [];
              existing.push(mesh);
              muscleMeshesMapRef.current.set(matchedGroupId, existing);
            } else if (nodeType === 'bone') {
              mesh.userData.isBone = true;
              mesh.material = boneMaterialRef.current!;
            } else {
              // Connective fascia / other anatomical structure
              mesh.material = boneMaterialRef.current!;
            }
          }
        });

        bodyGroup.add(model);
        setIsLoading(false);
        updateMuscleMaterials();
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setLoadingProgress(percent);
        }
      },
      (error) => {
        console.error('Error loading 3D human anatomy model:', error);
        setLoadError('Failed to load anatomical 3D model.');
        setIsLoading(false);
      }
    );

    // 8. Raycaster for Hover & Click Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedMuscle = (event: MouseEvent | Touch): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allClickableMeshesRef.current);
      if (intersects.length > 0) {
        const topHit = intersects[0].object as THREE.Mesh;
        return (topHit.userData.muscleId as string) || null;
      }
      return null;
    };

    // Pointer Move / Hover
    const onPointerMove = (e: MouseEvent) => {
      if (isDraggingRef.current) return;
      const hitMuscle = getIntersectedMuscle(e);
      setHoveredMuscle(hitMuscle);
      renderer.domElement.style.cursor = hitMuscle ? 'pointer' : 'grab';
    };

    // Pointer Click
    const onPointerClick = (e: MouseEvent) => {
      if (Math.abs(rotationVelocityYRef.current) > 0.005) return;
      const hitMuscle = getIntersectedMuscle(e);
      if (hitMuscle) {
        onSelectMuscle(hitMuscle);
      }
    };

    // Drag / Orbit Events
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousPointerXRef.current = e.clientX;
      previousPointerYRef.current = e.clientY;
      rotationVelocityYRef.current = 0;
      rotationVelocityXRef.current = 0;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) {
        onPointerMove(e);
        return;
      }
      const deltaX = e.clientX - previousPointerXRef.current;
      const deltaY = e.clientY - previousPointerYRef.current;
      previousPointerXRef.current = e.clientX;
      previousPointerYRef.current = e.clientY;

      rotationVelocityYRef.current = deltaX * 0.008;
      rotationVelocityXRef.current = deltaY * 0.005;

      targetRotationYRef.current += rotationVelocityYRef.current;
      targetRotationXRef.current = Math.max(-0.35, Math.min(0.35, targetRotationXRef.current + rotationVelocityXRef.current));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = 'grab';
      }
    };

    // Mobile Touch Drag Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousPointerXRef.current = e.touches[0].clientX;
        previousPointerYRef.current = e.touches[0].clientY;
        rotationVelocityYRef.current = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousPointerXRef.current;
      const deltaY = e.touches[0].clientY - previousPointerYRef.current;
      previousPointerXRef.current = e.touches[0].clientX;
      previousPointerYRef.current = e.touches[0].clientY;

      rotationVelocityYRef.current = deltaX * 0.010;
      targetRotationYRef.current += rotationVelocityYRef.current;
      targetRotationXRef.current = Math.max(-0.35, Math.min(0.35, targetRotationXRef.current + deltaY * 0.006));
    };

    const onTouchEnd = (e: TouchEvent) => {
      isDraggingRef.current = false;
      if (e.changedTouches.length === 1) {
        const hitMuscle = getIntersectedMuscle(e.changedTouches[0]);
        if (hitMuscle) {
          onSelectMuscle(hitMuscle);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('click', onPointerClick);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    domElement.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 640;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    });
    resizeObserver.observe(container);

    // 9. Main Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (bodyGroupRef.current) {
        // Smoothly interpolate rotation toward target
        bodyGroupRef.current.rotation.y += (targetRotationYRef.current - bodyGroupRef.current.rotation.y) * 0.12;
        bodyGroupRef.current.rotation.x += (targetRotationXRef.current - bodyGroupRef.current.rotation.x) * 0.12;

        // Inertial damping when drag released
        if (!isDraggingRef.current && Math.abs(rotationVelocityYRef.current) > 0.0001) {
          targetRotationYRef.current += rotationVelocityYRef.current;
          rotationVelocityYRef.current *= 0.91;
        }
      }

      // Smooth camera zoom interpolation
      if (cameraRef.current) {
        cameraRef.current.position.z += (targetCameraZRef.current - cameraRef.current.position.z) * 0.12;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
      domElement.removeEventListener('mousemove', onMouseMove);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('click', onPointerClick);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      dracoLoader.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [onSelectMuscle, updateMuscleMaterials]);

  // Button Handlers
  const handleViewToggle = (mode: 'front' | 'back' | 'side') => {
    setInternalView(mode);
    if (mode === 'front') {
      targetRotationYRef.current = 0;
    } else if (mode === 'back') {
      targetRotationYRef.current = Math.PI;
    } else if (mode === 'side') {
      targetRotationYRef.current = Math.PI * 0.5;
    }
    targetRotationXRef.current = 0;
    if (onViewModeChange) onViewModeChange(mode);
  };

  const handleZoomIn = () => {
    targetCameraZRef.current = Math.max(1.8, targetCameraZRef.current - 0.4);
  };

  const handleZoomOut = () => {
    targetCameraZRef.current = Math.min(4.5, targetCameraZRef.current + 0.4);
  };

  const handleReset = () => {
    targetRotationYRef.current = 0;
    targetRotationXRef.current = 0;
    targetCameraZRef.current = 2.7;
    setInternalView('front');
    if (onViewModeChange) onViewModeChange('front');
  };

  const activeMuscleInfo = MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId);
  const hoveredMuscleInfo = hoveredMuscle ? MUSCLE_GROUPS.find((m) => m.id === hoveredMuscle) : null;

  return (
    <div className={`relative w-full h-[540px] sm:h-[620px] lg:h-[680px] flex items-center justify-center select-none overflow-hidden ${className}`}>
      
      {/* Top Left Anatomy Status Pill */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/90 dark:bg-[#272E29]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#e2e8df] dark:border-[#394139] shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#5ba83c] animate-pulse" />
        <span className="text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7]">
          3D Human Anatomy
        </span>
      </div>

      {/* Front / Back / Side View Switcher (Top Right, matching reference image) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-[#272E29]/90 backdrop-blur-md p-1 rounded-2xl border border-[#e2e8df] dark:border-[#394139] shadow-xs">
        <button
          type="button"
          onClick={() => handleViewToggle('front')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            internalView === 'front'
              ? 'bg-[#2b3a2a] dark:bg-[#8BAF78] text-white dark:text-[#192418] shadow-xs'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => handleViewToggle('back')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            internalView === 'back'
              ? 'bg-[#2b3a2a] dark:bg-[#8BAF78] text-white dark:text-[#192418] shadow-xs'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handleViewToggle('side')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            internalView === 'side'
              ? 'bg-[#2b3a2a] dark:bg-[#8BAF78] text-white dark:text-[#192418] shadow-xs'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
        >
          Side
        </button>
      </div>

      {/* Zoom In, Zoom Out, Reset Controls (Stacked below View Switcher) */}
      <div className="absolute top-18 right-4 z-20 flex flex-col gap-1.5 bg-white/90 dark:bg-[#272E29]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#e2e8df] dark:border-[#394139] shadow-xs">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C211D] border border-[#e2e8df] dark:border-[#394139] flex items-center justify-center text-[#192418] dark:text-[#E8EDE7] hover:bg-[#f2f7ef] dark:hover:bg-[#2a352c] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C211D] border border-[#e2e8df] dark:border-[#394139] flex items-center justify-center text-[#192418] dark:text-[#E8EDE7] hover:bg-[#f2f7ef] dark:hover:bg-[#2a352c] transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          title="Reset View"
          aria-label="Reset View"
          className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C211D] border border-[#e2e8df] dark:border-[#394139] flex items-center justify-center text-[#192418] dark:text-[#E8EDE7] hover:bg-[#f2f7ef] dark:hover:bg-[#2a352c] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hovered / Active Muscle Floating Badge */}
      {(hoveredMuscleInfo || activeMuscleInfo) && (
        <div className="absolute top-18 left-4 z-20 pointer-events-none transition-all duration-200">
          <div className="bg-white/95 dark:bg-[#272E29]/95 backdrop-blur-md border border-[#e2e8df] dark:border-[#394139] px-3 py-1.5 rounded-2xl shadow-xs">
            <span className="text-[10px] font-bold text-[#5ba83c] dark:text-[#8BAF78] uppercase tracking-wider block">
              {hoveredMuscleInfo ? 'Hovering' : 'Selected'}
            </span>
            <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7]">
              {(hoveredMuscleInfo || activeMuscleInfo)?.name}
            </span>
            <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] block italic">
              {(hoveredMuscleInfo || activeMuscleInfo)?.scientificName}
            </span>
          </div>
        </div>
      )}

      {/* Asynchronous Loading Overlay */}
      {isLoading && isWebGlSupported && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 dark:bg-[#1C211D]/85 backdrop-blur-sm space-y-4 p-6 transition-all duration-300">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-3 border-[#e2e8df] dark:border-[#394139] border-t-[#5ba83c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-[#5ba83c]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-xs font-black text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider">
              Loading 3D Anatomy Model
            </h4>
            <p className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1]">
              Connecting muscular system... {loadingProgress}%
            </p>
          </div>
          <div className="w-48 h-1.5 bg-[#e8ede6] dark:bg-[#323d33] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5ba83c] transition-all duration-200 rounded-full"
              style={{ width: `${Math.max(loadingProgress, 12)}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-white/95 dark:bg-[#272E29]/95 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-[#d9534f]" />
          <h4 className="text-sm font-bold text-[#192418] dark:text-[#E8EDE7]">
            Unable to load 3D Model
          </h4>
          <p className="text-xs text-[#7a8c79] dark:text-[#A2AAA1] max-w-xs">
            {loadError} You can still select any muscle group from the sidebar to inspect exercises.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5ba83c] text-white text-xs font-bold shadow-xs hover:bg-[#4d9630]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* WebGL Canvas Mount Container */}
      {isWebGlSupported ? (
        <div 
          ref={mountRef} 
          style={{ touchAction: 'none' }}
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none" 
        />
      ) : (
        /* Graceful Accessible Fallback */
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#272E29] rounded-3xl border border-[#e8ede6] dark:border-[#394139] max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#eef7eb] dark:bg-[#344233] text-[#5ba83c] flex items-center justify-center text-xl font-bold">
            🏋️‍♂️
          </div>
          <h3 className="font-bold text-[#192418] dark:text-[#E8EDE7]">3D Anatomy Rendering</h3>
          <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
            Hardware acceleration is unavailable in this browser environment. You can still select all 14 muscle groups from the sidebar to inspect exercises and add them to your routine.
          </p>
        </div>
      )}

      {/* "Drag to rotate" Interactive Curved Indicator (Bottom Center, matching reference image) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-none">
        <svg className="w-48 sm:w-60 h-8 text-[#98a497] dark:text-[#7a8878]" viewBox="0 0 240 32" fill="none">
          <path 
            d="M 15,16 Q 120,30 225,16" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="4 3" 
            strokeLinecap="round" 
          />
          <path d="M 24,12 L 15,16 L 24,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 216,12 L 225,16 L 216,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute left-1/2 -translate-x-1/2 -top-1 text-[11px] font-semibold text-[#6d7e6c] dark:text-[#A2AAA1] bg-white/70 dark:bg-[#1C211D]/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
          Drag to rotate
        </span>
      </div>

    </div>
  );
}
