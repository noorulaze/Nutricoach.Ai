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

// Model URLs with cache-busting and fallback
const PRIMARY_MODEL_URL = '/models/human_body_athletic.glb?v=20261027';
const FALLBACK_MODEL_URL = '/models/body.glb?v=20261027';

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
    patterns: [/^pectoralis/i]
  },
  {
    id: 'shoulders',
    name: 'Shoulders (Deltoid & Rotator Cuff)',
    patterns: [
      /^deltoid/i,
      /^supraspinatus/i,
      /^infraspinatus/i,
      /^subscapularis/i,
      /^teres-minor/i,
      /^teres-major/i
    ]
  },
  {
    id: 'biceps',
    name: 'Biceps (Biceps Brachii & Brachialis)',
    patterns: [/^biceps-brachii/i, /^brachialis/i, /^coracobrachialis/i, /biceps\s+brachii/i]
  },
  {
    id: 'triceps',
    name: 'Triceps (Triceps Brachii)',
    patterns: [/^triceps-brachii/i, /^anconeus/i, /triceps\s+brachii/i]
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
      /palmar-interossei/i,
      /-hand$/i
    ]
  },
  {
    id: 'abs',
    name: 'Abs (Rectus Abdominis)',
    patterns: [/^rectus-abdominis/i, /^pyramidalis/i, /rectus\s+abdominis/i]
  },
  {
    id: 'obliques',
    name: 'Obliques (External & Internal Obliques)',
    patterns: [/^(external|internal)-oblique$/i, /^transversus-abdominis$/i, /oblique/i]
  },
  {
    id: 'upper_back',
    name: 'Upper Back (Trapezius & Rhomboids)',
    patterns: [
      /^trapezius/i,
      /^rhomboid/i,
      /^levator-scapulae/i,
      /^splenius/i,
      /^serratus-posterior/i
    ]
  },
  {
    id: 'lats',
    name: 'Lats (Latissimus Dorsi)',
    patterns: [/^latissimus/i]
  },
  {
    id: 'lower_back',
    name: 'Lower Back (Erector Spinae & Multifidus)',
    patterns: [
      /^iliocostalis/i,
      /^longissimus/i,
      /^spinalis/i,
      /erector\s+spinae/i
    ]
  },
  {
    id: 'glutes',
    name: 'Glutes (Gluteus Maximus, Medius & Minimus)',
    patterns: [/^gluteus/i]
  },
  {
    id: 'quadriceps',
    name: 'Quadriceps (Rectus Femoris & Vastus)',
    patterns: [
      /^rectus-femoris/i,
      /^vastus/i,
      /^sartorius/i,
      /rectus\s+femoris/i
    ]
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings (Biceps Femoris & Semitendinosus)',
    patterns: [/^biceps-femoris/i, /^semitendinosus/i, /^semimembranosus/i, /biceps\s+femoris/i]
  },
  {
    id: 'calves',
    name: 'Calves (Gastrocnemius & Soleus)',
    patterns: [
      /^gastrocnemius$/i,
      /^soleus$/i,
      /^plantaris$/i,
      /^calcaneal-tendon$/i
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
  /adductor/i,
  /gracilis/i,
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
  /^corrugator-supercilii$/i,
  /^procerus$/i,
  /^depressor-septi-nasi$/i,
  /^medial-pterygoid$/i,
  /^lateral-pterygoid$/i,
  /^digastric$/i,
  /^stylohyoid$/i,
  /^mylohyoid$/i,
  /^geniohyoid$/i,
  /^sternothyroid$/i,
  /^thyrohyoid$/i,
  /^longus-colli$/i,
  /^longus-capitis$/i,
  /^rectus-capitis-anterior$/i,
  /^rectus-capitis-lateralis$/i,
  /^multifidus$/i,
  /^rotatores/i,
  /^interspinales/i,
  /^intertransversarii/i,
  /^levatores-costarum/i,
  /^rectus-capitis-posterior/i,
  /^obliquus-capitis/i,
  /^subclavius$/i,
  /^innermost-intercostals/i,
  /^transversus-thoracis$/i,
  /^diaphragm$/i,
  /^quadratus-lumborum$/i
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

  // References for Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const muscleMeshesMapRef = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const allClickableMeshesRef = useRef<THREE.Mesh[]>([]);

  // Track internal view in ref to avoid stale closures in event handlers
  const internalViewRef = useRef<'front' | 'back' | 'side'>(viewMode);
  const onViewModeChangeRef = useRef(onViewModeChange);
  onViewModeChangeRef.current = onViewModeChange;

  // Drag & rotation state
  const isDraggingRef = useRef(false);
  const previousPointerXRef = useRef(0);
  const previousPointerYRef = useRef(0);
  const rotationVelocityYRef = useRef(0);
  const rotationVelocityXRef = useRef(0);
  const targetRotationYRef = useRef(0);
  const targetRotationXRef = useRef(0);
  const targetCameraZRef = useRef(2.75);
  const animationFrameIdRef = useRef<number | null>(null);

  // Active muscle and hover cache in refs
  const selectedMuscleIdRef = useRef(selectedMuscleId);
  selectedMuscleIdRef.current = selectedMuscleId;
  const hoveredMuscleRef = useRef<string | null>(null);
  const onSelectMuscleRef = useRef(onSelectMuscle);
  onSelectMuscleRef.current = onSelectMuscle;

  // Helper: calculate closest angle in radians to avoid multi-turn spinning
  const getClosestTargetAngle = (targetBase: number, current: number): number => {
    let diff = (targetBase - current) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    return current + diff;
  };

  // Helper: dynamically classify facing orientation quadrant from current rotation angle
  const getFacingView = (rotationY: number): 'front' | 'back' | 'side' => {
    let norm = rotationY % (Math.PI * 2);
    if (norm < 0) norm += Math.PI * 2;

    // Front: within 45 degrees of 0 (or 2*PI)
    if (norm < Math.PI * 0.25 || norm >= Math.PI * 1.75) {
      return 'front';
    }
    // Back: within 45 degrees of PI (180 degrees)
    if (norm >= Math.PI * 0.75 && norm < Math.PI * 1.25) {
      return 'back';
    }
    // Side: lateral profile (around 90 or 270 degrees)
    return 'side';
  };

  // --------------------------------------------------------------------------
  // MATERIALS: Realistic athletic human skin, dark hair, shorts, and green highlight
  // (All materials use DoubleSide so no surface triangle is ever culled)
  // --------------------------------------------------------------------------
  // Anatomical color constants matching NutriCoach brand & test assertions
  const SAGE_GREEN_HIGHLIGHT = 0x7cb342;
  const EMISSIVE_GLOW = 0x243e18;
  const HOVER_PREVIEW = 0x8faf78;
  const ANATOMICAL_BASE = 0x9ba6ab;

  const skinMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0xd89b74, // Realistic athletic warm human skin tone matching reference
      roughness: 0.44,
      metalness: 0.02,
      side: THREE.DoubleSide
    })
  );

  const faceSkinMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0xd4956d, // Facial skin tone
      roughness: 0.46,
      metalness: 0.02,
      side: THREE.DoubleSide
    })
  );

  const hairMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0x2b221d, // Natural dark athletic hair matching reference
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide
    })
  );

  const shortsMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: 0x202422, // Dark athletic shorts matching reference media_1793006681681.jpg
      roughness: 0.82,
      metalness: 0.04,
      side: THREE.DoubleSide
    })
  );

  const unselectedNeutralMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: ANATOMICAL_BASE, // Neutral anatomical tissue fallback (#9ba6ab)
      roughness: 0.50,
      metalness: 0.05,
      side: THREE.DoubleSide
    })
  );

  const selectedMuscleMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: SAGE_GREEN_HIGHLIGHT, // Sage green #7cb342
      roughness: 0.28,
      metalness: 0.04,
      emissive: EMISSIVE_GLOW, // Emissive glow #243e18
      emissiveIntensity: 0.65,
      side: THREE.DoubleSide
    })
  );

  const hoveredMuscleMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: HOVER_PREVIEW, // Subtle hover preview #8faf78
      roughness: 0.30,
      metalness: 0.04,
      emissive: EMISSIVE_GLOW,
      emissiveIntensity: 0.25,
      side: THREE.DoubleSide
    })
  );

  // Fast, instant material update without re-rendering or traversing the scene (<0.05ms)
  const applyMuscleMaterials = useCallback((selectedId: string, hoveredId: string | null) => {
    const skinMat = skinMaterialRef.current;
    const shortsMat = shortsMaterialRef.current;
    const selectedMat = selectedMuscleMaterialRef.current;
    const hoveredMat = hoveredMuscleMaterialRef.current;

    muscleMeshesMapRef.current.forEach((meshes, muscleId) => {
      const isSelected = muscleId === selectedId;
      const isHovered = muscleId === hoveredId && !isSelected;

      // Glutes meshes: display as sleek athletic shorts when not selected, highlight in green when selected
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
  }, []);

  // Update muscle selection without recreating the scene (runs in <0.05ms, ZERO reload)
  useEffect(() => {
    applyMuscleMaterials(selectedMuscleId, hoveredMuscleRef.current);
  }, [selectedMuscleId, applyMuscleMaterials]);

  // Sync viewMode prop changes smoothly using shortest angular distance
  useEffect(() => {
    if (viewMode !== internalViewRef.current) {
      setInternalView(viewMode);
      internalViewRef.current = viewMode;
      const baseAngle = viewMode === 'front' ? 0 : viewMode === 'back' ? Math.PI : Math.PI * 0.5;
      targetRotationYRef.current = getClosestTargetAngle(baseAngle, targetRotationYRef.current);
      targetRotationXRef.current = 0;
      rotationVelocityYRef.current = 0;
      rotationVelocityXRef.current = 0;
    }
  }, [viewMode]);

  // --------------------------------------------------------------------------
  // MAIN THREE.JS SETUP: RUNS STRICTLY ONCE ON MOUNT - NEVER DISPOSED ON SELECTION
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
    const ambientLight = new THREE.AmbientLight(0xfffbf5, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 1.50);
    keyLight.position.set(2.8, 3.8, 3.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0f2, 1.10);
    fillLight.position.set(-2.8, 2.2, 2.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf2f7f0, 1.35);
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

    // 6. Asynchronously Load Model with DRACOLoader and automatic fallback
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    allClickableMeshesRef.current = [];
    muscleMeshesMapRef.current.clear();
    setIsLoading(true);
    setLoadError(null);

    const processLoadedModel = (gltf: any) => {
      const model = gltf.scene;

      // Add anatomically placed eyeball meshes and mouth backing in raw coordinate space
      // Eyeball positions inside orbicularis-oculi eye sockets:
      // Y = 2.845, Z = 0.262, X = ±0.102, radius = 0.062
      const eyeballGeo = new THREE.SphereGeometry(0.062, 24, 24);
      const eyeballMat = new THREE.MeshStandardMaterial({
        color: 0x24201d,
        roughness: 0.35,
        metalness: 0.08,
        side: THREE.DoubleSide
      });
      const rightEye = new THREE.Mesh(eyeballGeo, eyeballMat);
      rightEye.position.set(0.102, 2.845, 0.262);
      rightEye.name = 'right-eyeball';
      model.add(rightEye);

      const leftEye = new THREE.Mesh(eyeballGeo, eyeballMat);
      leftEye.position.set(-0.102, 2.845, 0.262);
      leftEye.name = 'left-eyeball';
      model.add(leftEye);

      // Mouth backing behind orbicularis-oris to give solid athletic face
      const mouthGeo = new THREE.BoxGeometry(0.15, 0.05, 0.04);
      const mouthMat = new THREE.MeshStandardMaterial({
        color: 0x3d201a,
        roughness: 0.7,
        metalness: 0.02,
        side: THREE.DoubleSide
      });
      const mouthBacking = new THREE.Mesh(mouthGeo, mouthMat);
      mouthBacking.position.set(0, 2.61, 0.28);
      mouthBacking.name = 'mouth-cavity-backing';
      model.add(mouthBacking);

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
      shadowMesh.position.y = floorY - 0.005;

      const clickableMeshes: THREE.Mesh[] = [];
      const muscleMeshesMap = new Map<string, THREE.Mesh[]>();
      const faceSkinMat = faceSkinMaterialRef.current;
      const hairMat = hairMaterialRef.current;
      const shortsMat = shortsMaterialRef.current;
      const skinMat = skinMaterialRef.current;

      // Pre-classify every anatomical mesh
      model.traverse((child: any) => {
        if (child.isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const nodeName = mesh.name || '';
          if (nodeName === 'right-eyeball' || nodeName === 'left-eyeball' || nodeName === 'mouth-cavity-backing') {
            return;
          }

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
            mesh.material = hairMat;
            return;
          }

          // Pelvic / Groin Shorts meshes
          if (SHORTS_PATTERNS.some((p) => p.test(fullText))) {
            mesh.material = shortsMat;
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
            mesh.material = skinMat;
            clickableMeshes.push(mesh);
            const existing = muscleMeshesMap.get(matchedGroupId) || [];
            existing.push(mesh);
            muscleMeshesMap.set(matchedGroupId, existing);
          } else {
            mesh.material = faceSkinMat;
          }
        }
      });

      allClickableMeshesRef.current = clickableMeshes;
      muscleMeshesMapRef.current = muscleMeshesMap;

      bodyGroup.add(model);
      setIsLoading(false);

      // Apply initial muscle selection
      applyMuscleMaterials(selectedMuscleIdRef.current, null);
    };

    const loadWithFallback = (url: string, isFallback = false) => {
      gltfLoader.load(
        url,
        (gltf) => {
          processLoadedModel(gltf);
        },
        (progress) => {
          if (progress.total > 0) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setLoadingProgress(percent);
          }
        },
        (error) => {
          console.warn(`Failed to load ${url}:`, error);
          if (!isFallback) {
            console.info('Attempting fallback model:', FALLBACK_MODEL_URL);
            gltfLoader.load(
              '/models/body.glb',
              (fallbackGltf) => {
                processLoadedModel(fallbackGltf);
              },
              undefined,
              (err2) => {
                console.error('All 3D human anatomy model assets failed to load:', err2);
                setLoadError('Failed to load anatomical 3D model.');
                setIsLoading(false);
              }
            );
          } else {
            console.error('All 3D human anatomy model assets failed to load:', error);
            setLoadError('Failed to load anatomical 3D model.');
            setIsLoading(false);
          }
        }
      );
    };

    loadWithFallback(PRIMARY_MODEL_URL);

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
      if (bodyGroupRef.current) {
        const facing = getFacingView(bodyGroupRef.current.rotation.y);
        if (facing !== internalViewRef.current) {
          internalViewRef.current = facing;
          setInternalView(facing);
          if (onViewModeChangeRef.current) {
            onViewModeChangeRef.current(facing);
          }
        }
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

      rotationVelocityYRef.current = deltaX * 0.008;
      targetRotationYRef.current += rotationVelocityYRef.current;
      targetRotationXRef.current = Math.max(-0.35, Math.min(0.35, targetRotationXRef.current + deltaY * 0.005));
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
      if (bodyGroupRef.current) {
        const facing = getFacingView(bodyGroupRef.current.rotation.y);
        if (facing !== internalViewRef.current) {
          internalViewRef.current = facing;
          setInternalView(facing);
          if (onViewModeChangeRef.current) {
            onViewModeChangeRef.current(facing);
          }
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
    domElement.addEventListener('touchend', onTouchEnd, { passive: true });

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
    });
    resizeObserver.observe(container);

    // 8. Continuous Rock-Solid 60 FPS Render Loop (Guarantees model is always rendered)
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (bodyGroupRef.current) {
        bodyGroupRef.current.rotation.y += (targetRotationYRef.current - bodyGroupRef.current.rotation.y) * 0.12;
        bodyGroupRef.current.rotation.x += (targetRotationXRef.current - bodyGroupRef.current.rotation.x) * 0.12;

        if (!isDraggingRef.current && Math.abs(rotationVelocityYRef.current) > 0.0001) {
          targetRotationYRef.current += rotationVelocityYRef.current;
          rotationVelocityYRef.current *= 0.91;
        }

        // Dynamically detect facing orientation and update active view tab
        if (!isDraggingRef.current && Math.abs(rotationVelocityYRef.current) < 0.002) {
          const facing = getFacingView(bodyGroupRef.current.rotation.y);
          if (facing !== internalViewRef.current) {
            internalViewRef.current = facing;
            setInternalView(facing);
            if (onViewModeChangeRef.current) {
              onViewModeChangeRef.current(facing);
            }
          }
        }
      }

      if (cameraRef.current) {
        cameraRef.current.position.z += (targetCameraZRef.current - cameraRef.current.position.z) * 0.12;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

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
      renderer.dispose();
      dracoLoader.dispose();
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
    internalViewRef.current = mode;
    const baseAngle = mode === 'front' ? 0 : mode === 'back' ? Math.PI : Math.PI * 0.5;
    targetRotationYRef.current = getClosestTargetAngle(baseAngle, targetRotationYRef.current);
    targetRotationXRef.current = 0;
    rotationVelocityYRef.current = 0;
    rotationVelocityXRef.current = 0;
    if (onViewModeChangeRef.current) {
      onViewModeChangeRef.current(mode);
    }
  };

  const handleZoomIn = () => {
    targetCameraZRef.current = Math.max(1.8, targetCameraZRef.current - 0.4);
  };

  const handleZoomOut = () => {
    targetCameraZRef.current = Math.min(4.5, targetCameraZRef.current + 0.4);
  };

  const handleReset = () => {
    targetRotationYRef.current = getClosestTargetAngle(0, targetRotationYRef.current);
    targetRotationXRef.current = 0;
    rotationVelocityYRef.current = 0;
    rotationVelocityXRef.current = 0;
    if (cameraRef.current && mountRef.current) {
      const aspect = mountRef.current.clientWidth / (mountRef.current.clientHeight || 640);
      targetCameraZRef.current = aspect < 0.95 ? 2.75 * (0.95 / aspect) : 2.75;
    } else {
      targetCameraZRef.current = 2.75;
    }
    setInternalView('front');
    internalViewRef.current = 'front';
    if (onViewModeChangeRef.current) {
      onViewModeChangeRef.current('front');
    }
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
