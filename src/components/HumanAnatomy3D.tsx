import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Plus, Minus, RotateCcw, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { MUSCLE_GROUPS } from '../data/workoutAnatomyData';

interface HumanAnatomy3DProps {
  selectedMuscleId: string;
  onSelectMuscle: (muscleId: string) => void;
  className?: string;
  viewMode?: 'front' | 'back' | 'side';
  onViewModeChange?: (mode: 'front' | 'back' | 'side') => void;
}

// Model URL with version query to prevent browser HTTP caching of old assets
const MODEL_URL = '/models/human_body_athletic.glb?v=20261027';

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
    patterns: [/pectoral/i, /subclavius/i, /transversus-thoracis/i, /intercostal/i]
  },
  {
    id: 'shoulders',
    name: 'Shoulders (Deltoid & Rotator Cuff)',
    patterns: [/deltoid/i, /supraspinatus/i, /infraspinatus/i, /subscapularis/i, /teres-minor/i, /teres-major/i]
  },
  {
    id: 'biceps',
    name: 'Biceps (Biceps Brachii & Brachialis)',
    patterns: [/biceps-brachii/i, /brachialis/i, /coracobrachialis/i, /biceps\s+brachii/i]
  },
  {
    id: 'triceps',
    name: 'Triceps (Triceps Brachii)',
    patterns: [/triceps-brachii/i, /anconeus/i, /triceps\s+brachii/i]
  },
  {
    id: 'forearms',
    name: 'Forearms (Brachioradialis & Hand/Wrist)',
    patterns: [
      /brachioradialis/i,
      /pronator/i,
      /supinator/i,
      /carpi/i,
      /digitorum-superficialis/i,
      /digitorum-profundus/i,
      /^extensor-digitorum$/i,
      /^extensor-digiti-minimi$/i,
      /pollicis/i,
      /palmaris/i,
      /indicis/i,
      /hand/i,
      /palmar-interossei/i
    ]
  },
  {
    id: 'abs',
    name: 'Abs (Rectus Abdominis)',
    patterns: [/rectus-abdominis/i, /pyramidalis/i, /linea-alba/i, /rectus\s+abdominis/i]
  },
  {
    id: 'obliques',
    name: 'Obliques (External & Internal Obliques)',
    patterns: [/oblique/i, /transversus-abdominis/i, /obliquus/i]
  },
  {
    id: 'upper_back',
    name: 'Upper Back (Trapezius & Rhomboids)',
    patterns: [
      /trapezius/i,
      /rhomboid/i,
      /levator-scapulae/i,
      /splenius/i,
      /serratus-posterior/i,
      /semispinalis/i,
      /serratus-anterior/i
    ]
  },
  {
    id: 'lats',
    name: 'Lats (Latissimus Dorsi)',
    patterns: [/latissimus/i]
  },
  {
    id: 'lower_back',
    name: 'Lower Back (Erector Spinae & Multifidus)',
    patterns: [
      /iliocostalis/i,
      /longissimus/i,
      /spinalis/i,
      /multifidus/i,
      /rotatores/i,
      /interspinales/i,
      /intertransversarii/i,
      /quadratus-lumborum/i
    ]
  },
  {
    id: 'glutes',
    name: 'Glutes (Gluteus Maximus, Medius & Minimus)',
    patterns: [/gluteus/i]
  },
  {
    id: 'quadriceps',
    name: 'Quadriceps (Rectus Femoris & Vastus)',
    patterns: [
      /rectus-femoris/i,
      /vastus-lateralis/i,
      /vastus-medialis/i,
      /vastus-intermedius/i,
      /sartorius/i,
      /rectus\s+femoris/i
    ]
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings (Biceps Femoris & Semitendinosus)',
    patterns: [/biceps-femoris/i, /semitendinosus/i, /semimembranosus/i, /biceps\s+femoris/i]
  },
  {
    id: 'calves',
    name: 'Calves (Gastrocnemius & Soleus)',
    patterns: [
      /gastrocnemius/i,
      /soleus/i,
      /plantaris/i,
      /calcaneal-tendon/i,
      /popliteus/i,
      /tibialis/i,
      /fibularis/i,
      /foot/i,
      /hallucis/i,
      /plantar/i,
      /plantae/i,
      /digitorum-longus/i,
      /digitorum-brevis/i,
      /peroneus/i
    ]
  }
];

// Meshes categorized as dark athletic training shorts (pelvis, hip & groin region)
const SHORTS_PATTERNS = [
  /pubococcygeus/i,
  /puborectalis/i,
  /iliococcygeus/i,
  /coccygeus/i,
  /external-anal-sphincter/i,
  /obturator/i,
  /gemellus/i,
  /quadratus-femoris/i,
  /piriformis/i,
  /iliacus/i,
  /psoas-major/i,
  /pectineus/i,
  /adductor-brevis/i,
  /adductor-minimus/i,
  /tensor-fasciae-latae/i
];

// Meshes categorized as dark natural athletic hair on the head
const HAIR_PATTERNS = [
  /epicranial-aponeurosis/i,
  /occipitalis/i,
  /temporoparietalis/i,
  /temporalis/i
];

// Deep microscopic internal vertebral and cavity slips hidden to prevent hollow artifacts
const DEEP_INTERNAL_PATTERNS = [
  /rotatores/i,
  /interspinales/i,
  /intertransversarii/i,
  /levatores-costarum/i,
  /innermost-intercostals/i
];

// In-Memory Asset Cache to guarantee the GLB is fetched and parsed ONLY ONCE
interface CachedAnatomyAsset {
  scene: THREE.Group;
  clickableMeshes: THREE.Mesh[];
  muscleMeshesMap: Map<string, THREE.Mesh[]>;
  skinBaseMeshes: THREE.Mesh[];
  hairMeshes: THREE.Mesh[];
  shortsMeshes: THREE.Mesh[];
  floorY: number;
}

let cachedAsset: CachedAnatomyAsset | null = null;
let assetLoadingPromise: Promise<CachedAnatomyAsset> | null = null;

function loadAnatomyAsset(onProgress?: (percent: number) => void): Promise<CachedAnatomyAsset> {
  if (cachedAsset) {
    if (onProgress) onProgress(100);
    return Promise.resolve(cachedAsset);
  }
  if (assetLoadingPromise) {
    return assetLoadingPromise;
  }

  assetLoadingPromise = new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;

        // Auto-scale to standard athletic human height (1.76m)
        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const targetHeight = 1.76;
        const scaleFactor = targetHeight / (size.y || 1);
        model.scale.setScalar(scaleFactor);

        // Center model so its volumetric center is precisely at (0, 0, 0)
        const scaledBbox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBbox.getCenter(new THREE.Vector3());
        model.position.x = -scaledCenter.x;
        model.position.y = -scaledCenter.y;
        model.position.z = -scaledCenter.z;

        const floorY = scaledBbox.min.y - scaledCenter.y;

        const clickableMeshes: THREE.Mesh[] = [];
        const skinBaseMeshes: THREE.Mesh[] = [];
        const hairMeshes: THREE.Mesh[] = [];
        const shortsMeshes: THREE.Mesh[] = [];
        const muscleMeshesMap = new Map<string, THREE.Mesh[]>();

        // Pre-classify every anatomical mesh
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const nodeName = mesh.name || '';
            const extraName = (mesh.userData?.name as string) || '';
            const extraDetail = (mesh.userData?.nameDetail as string) || '';
            const fullText = `${nodeName} ${extraName} ${extraDetail}`;

            // Hide microscopic internal vertebral slips to eliminate hollow skeletal artifacts
            if (DEEP_INTERNAL_PATTERNS.some((p) => p.test(fullText))) {
              mesh.visible = false;
              return;
            }

            // Hair meshes
            if (HAIR_PATTERNS.some((p) => p.test(fullText))) {
              hairMeshes.push(mesh);
              return;
            }

            // Pelvic / Groin Shorts meshes
            if (SHORTS_PATTERNS.some((p) => p.test(fullText))) {
              shortsMeshes.push(mesh);
              return;
            }

            // Check if mesh belongs to one of the 14 target muscle groups
            let matchedGroupId: string | null = null;
            for (const rule of MUSCLE_RULES) {
              if (rule.patterns.some((p) => p.test(fullText))) {
                matchedGroupId = rule.id;
                break;
              }
            }

            if (matchedGroupId) {
              mesh.userData.muscleId = matchedGroupId;
              clickableMeshes.push(mesh);
              const existing = muscleMeshesMap.get(matchedGroupId) || [];
              existing.push(mesh);
              muscleMeshesMap.set(matchedGroupId, existing);
            } else {
              skinBaseMeshes.push(mesh);
            }
          }
        });

        cachedAsset = {
          scene: model,
          clickableMeshes,
          muscleMeshesMap,
          skinBaseMeshes,
          hairMeshes,
          shortsMeshes,
          floorY
        };
        resolve(cachedAsset);
      },
      (progress) => {
        if (progress.total > 0 && onProgress) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          onProgress(percent);
        }
      },
      (error) => {
        assetLoadingPromise = null;
        reject(error);
      }
    );
  });

  return assetLoadingPromise;
}

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
  const [isLoading, setIsLoading] = useState<boolean>(!cachedAsset);
  const [loadingProgress, setLoadingProgress] = useState<number>(cachedAsset ? 100 : 0);
  const [loadError, setLoadError] = useState<string | null>(null);

  // References for Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const muscleMeshesMapRef = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const allClickableMeshesRef = useRef<THREE.Mesh[]>([]);

  // Drag & rotation state (stored in refs for 60 FPS performance without React state re-renders)
  const isDraggingRef = useRef(false);
  const previousPointerXRef = useRef(0);
  const previousPointerYRef = useRef(0);
  const rotationVelocityYRef = useRef(0);
  const rotationVelocityXRef = useRef(0);
  const targetRotationYRef = useRef(0);
  const targetRotationXRef = useRef(0);
  const targetCameraZRef = useRef(2.75);
  const animationFrameIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef(false);

  // Active muscle and hover cache in refs to avoid useEffect recreation
  const selectedMuscleIdRef = useRef(selectedMuscleId);
  selectedMuscleIdRef.current = selectedMuscleId;
  const hoveredMuscleRef = useRef<string | null>(null);
  const onSelectMuscleRef = useRef(onSelectMuscle);
  onSelectMuscleRef.current = onSelectMuscle;

  // --------------------------------------------------------------------------
  // MATERIALS: Realistic athletic human skin, dark hair, shorts, and green highlight
  // --------------------------------------------------------------------------
  // 1. Warm healthy athletic human skin tone (matches reference media_1793006681681.jpg)
  const skinMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0xd89b74,
      roughness: 0.46,
      metalness: 0.03,
      side: THREE.FrontSide
    })
  );

  // 2. Head & Facial skin material
  const faceSkinMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0xd4956d,
      roughness: 0.48,
      metalness: 0.03,
      side: THREE.FrontSide
    })
  );

  // 3. Dark athletic hair material
  const hairMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0x2b221d,
      roughness: 0.86,
      metalness: 0.02,
      side: THREE.FrontSide
    })
  );

  // 4. Dark charcoal athletic training shorts (matches reference media_1793006681681.jpg)
  const shortsMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0x202422,
      roughness: 0.82,
      metalness: 0.04,
      side: THREE.FrontSide
    })
  );

  // 5. Signature NutriCoach AI glowing emerald green for selected muscle
  const selectedMuscleMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0x60b836,
      roughness: 0.28,
      metalness: 0.04,
      emissive: 0x224a14,
      emissiveIntensity: 0.65,
      side: THREE.FrontSide
    })
  );

  // 6. Interactive hover green
  const hoveredMuscleMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0x7ecc4f,
      roughness: 0.30,
      metalness: 0.04,
      emissive: 0x193b0f,
      emissiveIntensity: 0.35,
      side: THREE.FrontSide
    })
  );

  // Request Animation Frame on demand (pauses when idle, saving 100% CPU/GPU and eliminating lag)
  const animateLoop = useCallback(() => {
    let keepRunning = false;

    if (bodyGroupRef.current) {
      const diffY = targetRotationYRef.current - bodyGroupRef.current.rotation.y;
      const diffX = targetRotationXRef.current - bodyGroupRef.current.rotation.x;

      bodyGroupRef.current.rotation.y += diffY * 0.14;
      bodyGroupRef.current.rotation.x += diffX * 0.14;

      // Inertial damping after drag release
      if (!isDraggingRef.current && Math.abs(rotationVelocityYRef.current) > 0.0001) {
        targetRotationYRef.current += rotationVelocityYRef.current;
        rotationVelocityYRef.current *= 0.90;
        keepRunning = true;
      }

      if (Math.abs(diffY) > 0.0005 || Math.abs(diffX) > 0.0005) {
        keepRunning = true;
      }
    }

    // Camera zoom interpolation
    if (cameraRef.current) {
      const diffZ = targetCameraZRef.current - cameraRef.current.position.z;
      cameraRef.current.position.z += diffZ * 0.14;
      if (Math.abs(diffZ) > 0.001) {
        keepRunning = true;
      }
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    if (keepRunning || isDraggingRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(animateLoop);
    } else {
      isLoopRunningRef.current = false;
    }
  }, []);

  const wakeRenderLoop = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      animationFrameIdRef.current = requestAnimationFrame(animateLoop);
    }
  }, [animateLoop]);

  // Fast, instant material update without re-rendering or traversing the scene (<0.05ms)
  const applyMuscleMaterials = useCallback((selectedId: string, hoveredId: string | null) => {
    const skinMat = skinMaterialRef.current;
    const shortsMat = shortsMaterialRef.current;
    const selectedMat = selectedMuscleMaterialRef.current;
    const hoveredMat = hoveredMuscleMaterialRef.current;

    muscleMeshesMapRef.current.forEach((meshes, muscleId) => {
      const isSelected = muscleId === selectedId;
      const isHovered = muscleId === hoveredId && !isSelected;

      // Glutes meshes: display as sleek shorts when not selected, highlight in green when selected
      let targetMat = skinMat;
      if (muscleId === 'glutes') {
        targetMat = isSelected ? selectedMat : isHovered ? hoveredMat : shortsMat;
      } else {
        targetMat = isSelected ? selectedMat : isHovered ? hoveredMat : skinMat;
      }

      for (let i = 0; i < meshes.length; i++) {
        if (meshes[i].material !== targetMat) {
          meshes[i].material = targetMat;
        }
      }
    });

    wakeRenderLoop();
  }, [wakeRenderLoop]);

  // Update muscle selection without recreating the scene (runs in <0.05ms, ZERO reload)
  useEffect(() => {
    applyMuscleMaterials(selectedMuscleId, hoveredMuscleRef.current);

    // Auto-rotate model to back view if selecting a back muscle group
    const backMuscles = ['upper_back', 'lats', 'lower_back', 'glutes', 'hamstrings'];
    const isBackMuscle = backMuscles.includes(selectedMuscleId);
    let currentNorm = targetRotationYRef.current % (Math.PI * 2);
    if (currentNorm < 0) currentNorm += Math.PI * 2;
    const isFacingBack = currentNorm > Math.PI * 0.4 && currentNorm < Math.PI * 1.6;

    if (isBackMuscle && !isFacingBack) {
      targetRotationYRef.current = Math.PI;
      setInternalView('back');
      wakeRenderLoop();
    } else if (!isBackMuscle && isFacingBack) {
      targetRotationYRef.current = 0;
      setInternalView('front');
      wakeRenderLoop();
    }
  }, [selectedMuscleId, applyMuscleMaterials, wakeRenderLoop]);

  // Sync viewMode prop changes
  useEffect(() => {
    if (viewMode !== internalView) {
      setInternalView(viewMode);
      if (viewMode === 'front') targetRotationYRef.current = 0;
      else if (viewMode === 'back') targetRotationYRef.current = Math.PI;
      else if (viewMode === 'side') targetRotationYRef.current = Math.PI * 0.5;
      wakeRenderLoop();
    }
  }, [viewMode, internalView, wakeRenderLoop]);

  // --------------------------------------------------------------------------
  // MAIN THREE.JS SETUP: RUNS EXACTLY ONCE ON MOUNT - NEVER RE-RUN BY SELECTION
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
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

    // 2. Camera: FOV 38 with responsive distance for full 1.76m athletic human body
    const initialWidth = container.clientWidth || 400;
    const initialHeight = container.clientHeight || 640;
    const aspect = initialWidth / initialHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 50);
    const initialZ = aspect < 0.95 ? 2.75 * (0.95 / aspect) : 2.75;
    camera.position.set(0, 0, initialZ);
    cameraRef.current = camera;
    targetCameraZRef.current = initialZ;

    // 3. Renderer with antialiasing and transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio 4-Point Athletic Lighting (matches reference media_1793006681681.jpg)
    const ambientLight = new THREE.AmbientLight(0xfffbf5, 1.10);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 1.50);
    keyLight.position.set(2.8, 3.8, 3.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0f2, 1.05);
    fillLight.position.set(-2.8, 2.2, 2.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf2f7f0, 1.30);
    rimLight.position.set(0, 3.2, -3.5);
    scene.add(rimLight);

    const groundBounce = new THREE.DirectionalLight(0xdce5dc, 0.50);
    groundBounce.position.set(0, -2.5, 1.0);
    scene.add(groundBounce);

    // 5. Body Group & Ground Contact Shadow
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 0, 0);
    scene.add(bodyGroup);
    bodyGroupRef.current = bodyGroup;

    const shadowGeo = new THREE.CircleGeometry(0.55, 48);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x141f15,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.88;
    bodyGroup.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // 6. Asynchronously Load Model (Cached in memory after first load)
    loadAnatomyAsset((progress) => {
      setLoadingProgress(progress);
    })
      .then((asset) => {
        allClickableMeshesRef.current = asset.clickableMeshes;
        muscleMeshesMapRef.current = asset.muscleMeshesMap;

        // Position shadow exactly under feet
        shadowMesh.position.y = asset.floorY - 0.005;

        // Apply realistic materials
        const faceSkinMat = faceSkinMaterialRef.current;
        for (let i = 0; i < asset.skinBaseMeshes.length; i++) {
          asset.skinBaseMeshes[i].material = faceSkinMat;
        }

        const hairMat = hairMaterialRef.current;
        for (let i = 0; i < asset.hairMeshes.length; i++) {
          asset.hairMeshes[i].material = hairMat;
        }

        const shortsMat = shortsMaterialRef.current;
        for (let i = 0; i < asset.shortsMeshes.length; i++) {
          asset.shortsMeshes[i].material = shortsMat;
        }

        bodyGroup.add(asset.scene);
        setIsLoading(false);

        // Apply initial muscle selection
        applyMuscleMaterials(selectedMuscleIdRef.current, null);
        wakeRenderLoop();
      })
      .catch((err) => {
        console.error('Failed to load 3D anatomy asset:', err);
        setLoadError('Failed to load anatomical 3D model.');
        setIsLoading(false);
      });

    // 7. Raycasting for Muscle Selection & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedMuscle = (clientX: number, clientY: number): string | null => {
      if (!rendererRef.current || allClickableMeshesRef.current.length === 0) return null;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

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
      const hitMuscle = getIntersectedMuscle(e.clientX, e.clientY);
      if (hitMuscle !== hoveredMuscleRef.current) {
        hoveredMuscleRef.current = hitMuscle;
        applyMuscleMaterials(selectedMuscleIdRef.current, hitMuscle);
        setHoveredMuscle(hitMuscle);
        if (rendererRef.current) {
          rendererRef.current.domElement.style.cursor = hitMuscle ? 'pointer' : 'grab';
        }
      }
    };

    const onPointerClick = (e: MouseEvent) => {
      if (Math.abs(rotationVelocityYRef.current) > 0.005) return;
      const hitMuscle = getIntersectedMuscle(e.clientX, e.clientY);
      if (hitMuscle && onSelectMuscleRef.current) {
        onSelectMuscleRef.current(hitMuscle);
      }
    };

    // Drag / Orbit Events
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousPointerXRef.current = e.clientX;
      previousPointerYRef.current = e.clientY;
      rotationVelocityYRef.current = 0;
      rotationVelocityXRef.current = 0;
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = 'grabbing';
      }
      wakeRenderLoop();
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
      wakeRenderLoop();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = 'grab';
      }
      wakeRenderLoop();
    };

    // Mobile Touch Drag Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousPointerXRef.current = e.touches[0].clientX;
        previousPointerYRef.current = e.touches[0].clientY;
        rotationVelocityYRef.current = 0;
        wakeRenderLoop();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousPointerXRef.current;
      const deltaY = e.touches[0].clientY - previousPointerYRef.current;
      previousPointerXRef.current = e.touches[0].clientX;
      previousPointerYRef.current = e.touches[0].clientY;

      rotationVelocityYRef.current = deltaX * 0.008;
      targetRotationYRef.current += rotationVelocityYRef.current;
      targetRotationXRef.current = Math.max(-0.35, Math.min(0.35, targetRotationXRef.current + deltaY * 0.005));
      wakeRenderLoop();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isDraggingRef.current && Math.abs(rotationVelocityYRef.current) < 0.002) {
        if (e.changedTouches.length === 1) {
          const hitMuscle = getIntersectedMuscle(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          if (hitMuscle && onSelectMuscleRef.current) {
            onSelectMuscleRef.current(hitMuscle);
          }
        }
      }
      isDraggingRef.current = false;
      wakeRenderLoop();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('click', onPointerClick);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    domElement.addEventListener('touchend', onTouchEnd, { passive: true });

    // Handle Context Restoration
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost, pausing render loop.');
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      isLoopRunningRef.current = false;
    };

    const handleContextRestored = () => {
      console.info('WebGL context restored, restarting engine.');
      wakeRenderLoop();
    };

    domElement.addEventListener('webglcontextlost', handleContextLost, false);
    domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Resize Observer with responsive camera framing
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 640;
      const newAspect = width / height;
      cameraRef.current.aspect = newAspect;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);

      // On narrow mobile devices, comfortably frame full height
      const idealDistance = newAspect < 0.95 ? 2.75 * (0.95 / newAspect) : 2.75;
      targetCameraZRef.current = Math.min(idealDistance, 4.2);
      wakeRenderLoop();
    });
    resizeObserver.observe(container);

    wakeRenderLoop();

    // Cleanup ONLY when component unmounts
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
      domElement.removeEventListener('webglcontextlost', handleContextLost);
      domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
    // EMPTY ARRAY: Run setup strictly once on mount. Never re-run on selection or view change!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // View Switcher Buttons
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
    wakeRenderLoop();
  };

  const handleZoomIn = () => {
    targetCameraZRef.current = Math.max(1.8, targetCameraZRef.current - 0.4);
    wakeRenderLoop();
  };

  const handleZoomOut = () => {
    targetCameraZRef.current = Math.min(4.5, targetCameraZRef.current + 0.4);
    wakeRenderLoop();
  };

  const handleReset = () => {
    targetRotationYRef.current = 0;
    targetRotationXRef.current = 0;
    if (cameraRef.current && mountRef.current) {
      const aspect = mountRef.current.clientWidth / (mountRef.current.clientHeight || 640);
      targetCameraZRef.current = aspect < 0.95 ? 2.75 * (0.95 / aspect) : 2.75;
    } else {
      targetCameraZRef.current = 2.75;
    }
    setInternalView('front');
    if (onViewModeChange) onViewModeChange('front');
    wakeRenderLoop();
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

      {/* Asynchronous Loading Overlay (Shown ONLY on initial download, never during rotation or selection) */}
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
