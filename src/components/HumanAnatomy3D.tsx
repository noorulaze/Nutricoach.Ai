import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface HumanAnatomy3DProps {
  selectedMuscleId: string;
  onSelectMuscle: (muscleId: string) => void;
  className?: string;
  viewMode?: 'front' | 'back';
  onViewModeChange?: (mode: 'front' | 'back') => void;
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
  const [internalView, setInternalView] = useState<'front' | 'back'>(viewMode);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

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
  const targetCameraZRef = useRef(5.5);
  const animationFrameIdRef = useRef<number | null>(null);

  // Materials
  const baseMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const unselectedMuscleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const selectedMuscleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const hoveredMuscleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Sync prop changes for view mode
  useEffect(() => {
    if (viewMode !== internalView) {
      setInternalView(viewMode);
      targetRotationYRef.current = viewMode === 'front' ? 0 : Math.PI;
    }
  }, [viewMode, internalView]);

  // Rotate model automatically to ideal orientation when muscle changes
  useEffect(() => {
    const backMuscles = ['upper_back', 'lats', 'lower_back', 'glutes', 'hamstrings'];
    const isBackMuscle = backMuscles.includes(selectedMuscleId);
    
    // Normalize current rotation angle between 0 and 2*PI
    let currentNorm = targetRotationYRef.current % (Math.PI * 2);
    if (currentNorm < 0) currentNorm += Math.PI * 2;
    const isFacingBack = currentNorm > Math.PI * 0.5 && currentNorm < Math.PI * 1.5;

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

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGlSupported(false);
        return;
      }
    } catch {
      setIsWebGlSupported(false);
      return;
    }

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const aspect = container.clientWidth / (container.clientHeight || 560);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 0.1, 5.5);
    cameraRef.current = camera;
    targetCameraZRef.current = 5.5;

    // 3. Renderer with antialiasing and transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight || 560);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Configuration (matches realistic silver/gray studio render)
    const ambientLight = new THREE.AmbientLight(0xdde5e8, 0.95);
    scene.add(ambientLight);

    // Front-Right Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.85);
    keyLight.position.set(3.5, 6.0, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Front-Left Fill Light
    const fillLight = new THREE.DirectionalLight(0xd4e2e6, 1.2);
    fillLight.position.set(-4.0, 3.5, 4.0);
    scene.add(fillLight);

    // Rim / Backlight for sculpted muscle silhouette definition
    const rimLight = new THREE.DirectionalLight(0xd9ecd6, 1.6);
    rimLight.position.set(0, 5.5, -6.0);
    scene.add(rimLight);

    // Soft Bottom Bounce Light
    const groundBounce = new THREE.DirectionalLight(0xb0bfc2, 0.6);
    groundBounce.position.set(0, -4.0, 2.0);
    scene.add(groundBounce);

    // 5. Materials
    // Base bone/joint gray
    baseMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x828b90,
      roughness: 0.50,
      metalness: 0.20
    });

    // Default Gray/Silver Muscular Material
    unselectedMuscleMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x9da6ab,
      roughness: 0.44,
      metalness: 0.22
    });

    // Sage Green Highlight for Selected Muscle (matches reference image #7cb342)
    selectedMuscleMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x7cb342,
      roughness: 0.32,
      metalness: 0.12,
      emissive: 0x243e18,
      emissiveIntensity: 0.42
    });

    // Subtle hover material
    hoveredMuscleMaterialRef.current = new THREE.MeshStandardMaterial({
      color: 0x8faf78,
      roughness: 0.36,
      metalness: 0.16,
      emissive: 0x1c3314,
      emissiveIntensity: 0.25
    });

    // 6. Build the 3D Muscular Anatomy Model Group
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, -0.15, 0);
    scene.add(bodyGroup);
    bodyGroupRef.current = bodyGroup;

    // Contact Shadow Disk on the floor
    const shadowGeo = new THREE.RingGeometry(0.01, 1.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x1a241b,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.15;
    scene.add(shadowMesh);

    // Inner shadow circle
    const shadowInnerGeo = new THREE.CircleGeometry(0.75, 32);
    const shadowInnerMat = new THREE.MeshBasicMaterial({
      color: 0x141d14,
      transparent: true,
      opacity: 0.12
    });
    const shadowInner = new THREE.Mesh(shadowInnerGeo, shadowInnerMat);
    shadowInner.rotation.x = -Math.PI / 2;
    shadowInner.position.y = -2.14;
    scene.add(shadowInner);

    // Helper: Register a muscle mesh for raycasting and selection
    const registerMuscleMesh = (mesh: THREE.Mesh, muscleId: string) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { muscleId };
      allClickableMeshesRef.current.push(mesh);

      const existing = muscleMeshesMapRef.current.get(muscleId) || [];
      existing.push(mesh);
      muscleMeshesMapRef.current.set(muscleId, existing);
    };

    // Helper: Construct smooth curved muscle geometry
    const createMuscleMesh = (
      geo: THREE.BufferGeometry,
      muscleId: string,
      pos: [number, number, number],
      rot?: [number, number, number],
      scale?: [number, number, number]
    ): THREE.Mesh => {
      const mesh = new THREE.Mesh(geo, unselectedMuscleMaterialRef.current!);
      mesh.position.set(...pos);
      if (rot) mesh.rotation.set(...rot);
      if (scale) mesh.scale.set(...scale);
      bodyGroup.add(mesh);
      registerMuscleMesh(mesh, muscleId);
      return mesh;
    };

    // Helper: Construct non-clickable armature bone/joint
    const createArmature = (
      geo: THREE.BufferGeometry,
      pos: [number, number, number],
      rot?: [number, number, number],
      scale?: [number, number, number]
    ): THREE.Mesh => {
      const mesh = new THREE.Mesh(geo, baseMaterialRef.current!);
      mesh.position.set(...pos);
      if (rot) mesh.rotation.set(...rot);
      if (scale) mesh.scale.set(...scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      bodyGroup.add(mesh);
      return mesh;
    };

    // =========================================================================
    // ANATOMICAL CONSTRUCTION OF 3D HUMAN PHYSIQUE
    // =========================================================================

    // --- 1. HEAD & NECK ---
    // Cranium
    const headGeo = new THREE.SphereGeometry(0.24, 32, 24);
    headGeo.scale(0.85, 1.15, 0.95);
    createArmature(headGeo, [0, 1.76, 0]);

    // Jaw / Chin
    const jawGeo = new THREE.ConeGeometry(0.18, 0.22, 16);
    jawGeo.scale(0.9, 1.0, 0.85);
    createArmature(jawGeo, [0, 1.58, 0.05], [Math.PI, 0, 0]);

    // Neck (Sternocleidomastoid armature)
    const neckGeo = new THREE.CylinderGeometry(0.13, 0.16, 0.26, 20);
    createArmature(neckGeo, [0, 1.45, -0.01]);

    // --- 2. CHEST (Pectoralis Major) ---
    // Left Pectoral plate
    const chestLeftGeo = new THREE.SphereGeometry(0.23, 28, 20);
    chestLeftGeo.scale(1.25, 0.75, 0.58);
    createMuscleMesh(chestLeftGeo, 'chest', [-0.22, 1.14, 0.18], [0.08, -0.15, 0.12]);

    // Right Pectoral plate
    const chestRightGeo = new THREE.SphereGeometry(0.23, 28, 20);
    chestRightGeo.scale(1.25, 0.75, 0.58);
    createMuscleMesh(chestRightGeo, 'chest', [0.22, 1.14, 0.18], [0.08, 0.15, -0.12]);

    // Upper Clavicular Chest Left
    const chestUpperLeftGeo = new THREE.SphereGeometry(0.16, 20, 16);
    chestUpperLeftGeo.scale(1.3, 0.6, 0.5);
    createMuscleMesh(chestUpperLeftGeo, 'chest', [-0.20, 1.26, 0.15], [0.05, -0.1, 0.18]);

    // Upper Clavicular Chest Right
    const chestUpperRightGeo = new THREE.SphereGeometry(0.16, 20, 16);
    chestUpperRightGeo.scale(1.3, 0.6, 0.5);
    createMuscleMesh(chestUpperRightGeo, 'chest', [0.20, 1.26, 0.15], [0.05, 0.1, -0.18]);

    // Clavicles bone armature
    const clavicleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.84, 16);
    clavicleGeo.rotateZ(Math.PI / 2);
    createArmature(clavicleGeo, [0, 1.34, 0.08]);

    // Sternum center strip
    const sternumGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.42, 12);
    createArmature(sternumGeo, [0, 1.12, 0.17]);

    // --- 3. SHOULDERS (Deltoids) ---
    // Left Deltoid (Anterior + Lateral Cap)
    const deltLeftGeo = new THREE.SphereGeometry(0.19, 24, 20);
    deltLeftGeo.scale(0.85, 1.35, 1.05);
    createMuscleMesh(deltLeftGeo, 'shoulders', [-0.55, 1.25, 0.02], [0, 0, 0.28]);

    // Right Deltoid (Anterior + Lateral Cap)
    const deltRightGeo = new THREE.SphereGeometry(0.19, 24, 20);
    deltRightGeo.scale(0.85, 1.35, 1.05);
    createMuscleMesh(deltRightGeo, 'shoulders', [0.55, 1.25, 0.02], [0, 0, -0.28]);

    // Left Rear Deltoid
    const rearDeltLeftGeo = new THREE.SphereGeometry(0.14, 18, 16);
    rearDeltLeftGeo.scale(0.8, 1.1, 0.9);
    createMuscleMesh(rearDeltLeftGeo, 'shoulders', [-0.51, 1.24, -0.10], [-0.15, 0.1, 0.25]);

    // Right Rear Deltoid
    const rearDeltRightGeo = new THREE.SphereGeometry(0.14, 18, 16);
    rearDeltRightGeo.scale(0.8, 1.1, 0.9);
    createMuscleMesh(rearDeltRightGeo, 'shoulders', [0.51, 1.24, -0.10], [-0.15, -0.1, -0.25]);

    // --- 4. BICEPS (Biceps Brachii) ---
    // Left Bicep
    const bicepLeftGeo = new THREE.CapsuleGeometry(0.11, 0.22, 16, 20);
    createMuscleMesh(bicepLeftGeo, 'biceps', [-0.58, 0.92, 0.06], [0.1, 0, 0.2]);

    // Right Bicep
    const bicepRightGeo = new THREE.CapsuleGeometry(0.11, 0.22, 16, 20);
    createMuscleMesh(bicepRightGeo, 'biceps', [0.58, 0.92, 0.06], [0.1, 0, -0.2]);

    // --- 5. TRICEPS (Triceps Brachii) ---
    // Left Tricep
    const tricepLeftGeo = new THREE.CapsuleGeometry(0.12, 0.26, 16, 20);
    createMuscleMesh(tricepLeftGeo, 'triceps', [-0.58, 0.91, -0.07], [-0.1, 0, 0.2]);

    // Right Tricep
    const tricepRightGeo = new THREE.CapsuleGeometry(0.12, 0.26, 16, 20);
    createMuscleMesh(tricepRightGeo, 'triceps', [0.58, 0.91, -0.07], [-0.1, 0, -0.2]);

    // Elbow Joints armature
    const elbowGeo = new THREE.SphereGeometry(0.08, 14, 12);
    createArmature(elbowGeo, [-0.64, 0.72, 0]);
    createArmature(elbowGeo, [0.64, 0.72, 0]);

    // --- 6. FOREARMS (Brachioradialis & Flexors) ---
    // Left Forearm
    const forearmLeftGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.44, 18);
    createMuscleMesh(forearmLeftGeo, 'forearms', [-0.73, 0.48, 0.02], [0, 0, 0.24]);

    // Right Forearm
    const forearmRightGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.44, 18);
    createMuscleMesh(forearmRightGeo, 'forearms', [0.73, 0.48, 0.02], [0, 0, -0.24]);

    // Hands armature
    const handGeo = new THREE.BoxGeometry(0.07, 0.18, 0.11);
    createArmature(handGeo, [-0.80, 0.18, 0.02], [0, 0, 0.15]);
    createArmature(handGeo, [0.80, 0.18, 0.02], [0, 0, -0.15]);

    // --- 7. ABS (Rectus Abdominis 6-Pack) ---
    // Upper Abs
    const absUpperLeft = new THREE.BoxGeometry(0.14, 0.11, 0.09);
    createMuscleMesh(absUpperLeft, 'abs', [-0.085, 0.94, 0.16]);
    const absUpperRight = new THREE.BoxGeometry(0.14, 0.11, 0.09);
    createMuscleMesh(absUpperRight, 'abs', [0.085, 0.94, 0.16]);

    // Mid Abs
    const absMidLeft = new THREE.BoxGeometry(0.135, 0.11, 0.09);
    createMuscleMesh(absMidLeft, 'abs', [-0.080, 0.81, 0.15]);
    const absMidRight = new THREE.BoxGeometry(0.135, 0.11, 0.09);
    createMuscleMesh(absMidRight, 'abs', [0.080, 0.81, 0.15]);

    // Lower Abs
    const absLowerLeft = new THREE.BoxGeometry(0.13, 0.13, 0.09);
    createMuscleMesh(absLowerLeft, 'abs', [-0.075, 0.67, 0.14]);
    const absLowerRight = new THREE.BoxGeometry(0.13, 0.13, 0.09);
    createMuscleMesh(absLowerRight, 'abs', [0.075, 0.67, 0.14]);

    // --- 8. OBLIQUES (External & Internal) ---
    // Left Oblique column
    const obliqueLeftGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.38, 16);
    obliqueLeftGeo.scale(0.8, 1.0, 1.2);
    createMuscleMesh(obliqueLeftGeo, 'obliques', [-0.27, 0.80, 0.08], [0, 0, 0.18]);

    // Right Oblique column
    const obliqueRightGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.38, 16);
    obliqueRightGeo.scale(0.8, 1.0, 1.2);
    createMuscleMesh(obliqueRightGeo, 'obliques', [0.27, 0.80, 0.08], [0, 0, -0.18]);

    // Midsection core base core armature
    const coreBaseGeo = new THREE.CylinderGeometry(0.30, 0.28, 0.55, 20);
    createArmature(coreBaseGeo, [0, 0.82, 0]);

    // --- 9. UPPER BACK (Trapezius & Rhomboids) ---
    // Diamond-shaped Upper/Mid Trapezius
    const trapsCenterGeo = new THREE.ConeGeometry(0.36, 0.48, 18);
    trapsCenterGeo.scale(1.2, 1.0, 0.55);
    createMuscleMesh(trapsCenterGeo, 'upper_back', [0, 1.25, -0.11], [Math.PI, 0, 0]);

    // Upper Trap Left Neck band
    const trapNeckLeft = new THREE.BoxGeometry(0.16, 0.22, 0.14);
    createMuscleMesh(trapNeckLeft, 'upper_back', [-0.20, 1.36, -0.06], [0.1, 0.15, -0.3]);

    // Upper Trap Right Neck band
    const trapNeckRight = new THREE.BoxGeometry(0.16, 0.22, 0.14);
    createMuscleMesh(trapNeckRight, 'upper_back', [0.20, 1.36, -0.06], [0.1, -0.15, 0.3]);

    // --- 10. LATS (Latissimus Dorsi) ---
    // Left Lat V-Wing
    const latLeftGeo = new THREE.BoxGeometry(0.18, 0.44, 0.22);
    latLeftGeo.rotateY(0.35);
    createMuscleMesh(latLeftGeo, 'lats', [-0.34, 1.00, -0.10], [0, 0, -0.22]);

    // Right Lat V-Wing
    const latRightGeo = new THREE.BoxGeometry(0.18, 0.44, 0.22);
    latRightGeo.rotateY(-0.35);
    createMuscleMesh(latRightGeo, 'lats', [0.34, 1.00, -0.10], [0, 0, 0.22]);

    // --- 11. LOWER BACK (Erector Spinae) ---
    const lowerBackLeftGeo = new THREE.CapsuleGeometry(0.08, 0.34, 14, 16);
    createMuscleMesh(lowerBackLeftGeo, 'lower_back', [-0.10, 0.74, -0.12]);

    const lowerBackRightGeo = new THREE.CapsuleGeometry(0.08, 0.34, 14, 16);
    createMuscleMesh(lowerBackRightGeo, 'lower_back', [0.10, 0.74, -0.12]);

    // --- 12. GLUTES (Gluteus Maximus) ---
    // Left Glute
    const gluteLeftGeo = new THREE.SphereGeometry(0.23, 24, 20);
    gluteLeftGeo.scale(1.0, 1.15, 1.05);
    createMuscleMesh(gluteLeftGeo, 'glutes', [-0.19, 0.42, -0.12], [0.1, 0.1, -0.05]);

    // Right Glute
    const gluteRightGeo = new THREE.SphereGeometry(0.23, 24, 20);
    gluteRightGeo.scale(1.0, 1.15, 1.05);
    createMuscleMesh(gluteRightGeo, 'glutes', [0.19, 0.42, -0.12], [0.1, -0.1, 0.05]);

    // Pelvis base armature
    const pelvisGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.26, 20);
    createArmature(pelvisGeo, [0, 0.44, 0]);

    // --- 13. QUADRICEPS (Front Thighs) ---
    // Left Quadriceps (Rectus Femoris + Vastus Lateralis/Medialis sweep)
    const quadLeftGeo = new THREE.CylinderGeometry(0.18, 0.13, 0.74, 24);
    quadLeftGeo.scale(1.05, 1.0, 1.15);
    createMuscleMesh(quadLeftGeo, 'quadriceps', [-0.22, -0.12, 0.06], [0.06, 0, -0.06]);

    // Left Vastus Medialis (Teardrop)
    const teardropLeftGeo = new THREE.SphereGeometry(0.12, 16, 14);
    teardropLeftGeo.scale(0.85, 1.25, 0.9);
    createMuscleMesh(teardropLeftGeo, 'quadriceps', [-0.14, -0.38, 0.11], [0, 0, -0.15]);

    // Right Quadriceps
    const quadRightGeo = new THREE.CylinderGeometry(0.18, 0.13, 0.74, 24);
    quadRightGeo.scale(1.05, 1.0, 1.15);
    createMuscleMesh(quadRightGeo, 'quadriceps', [0.22, -0.12, 0.06], [0.06, 0, 0.06]);

    // Right Vastus Medialis (Teardrop)
    const teardropRightGeo = new THREE.SphereGeometry(0.12, 16, 14);
    teardropRightGeo.scale(0.85, 1.25, 0.9);
    createMuscleMesh(teardropRightGeo, 'quadriceps', [0.14, -0.38, 0.11], [0, 0, 0.15]);

    // Knee Joints (Patella) armature
    const patellaGeo = new THREE.SphereGeometry(0.09, 16, 14);
    createArmature(patellaGeo, [-0.23, -0.54, 0.04]);
    createArmature(patellaGeo, [0.23, -0.54, 0.04]);

    // --- 14. HAMSTRINGS (Back Thighs) ---
    // Left Hamstrings
    const hamLeftGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.68, 20);
    hamLeftGeo.scale(1.0, 1.0, 1.1);
    createMuscleMesh(hamLeftGeo, 'hamstrings', [-0.22, -0.12, -0.08], [-0.04, 0, -0.05]);

    // Right Hamstrings
    const hamRightGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.68, 20);
    hamRightGeo.scale(1.0, 1.1, 1.1);
    createMuscleMesh(hamRightGeo, 'hamstrings', [0.22, -0.12, -0.08], [-0.04, 0, 0.05]);

    // --- 15. CALVES (Gastrocnemius & Soleus) ---
    // Left Calf
    const calfLeftGeo = new THREE.SphereGeometry(0.14, 22, 18);
    calfLeftGeo.scale(0.95, 1.65, 1.15);
    createMuscleMesh(calfLeftGeo, 'calves', [-0.23, -1.02, -0.04], [0.08, 0, -0.02]);

    // Right Calf
    const calfRightGeo = new THREE.SphereGeometry(0.14, 22, 18);
    calfRightGeo.scale(0.95, 1.65, 1.15);
    createMuscleMesh(calfRightGeo, 'calves', [0.23, -1.02, -0.04], [0.08, 0, 0.02]);

    // Shinbone (Tibia/Fibula) armature
    const shinGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.72, 16);
    createArmature(shinGeo, [-0.23, -1.14, 0.03]);
    createArmature(shinGeo, [0.23, -1.14, 0.03]);

    // Feet armature
    const footGeo = new THREE.BoxGeometry(0.13, 0.08, 0.32);
    createArmature(footGeo, [-0.23, -1.54, 0.08], [0.05, 0.12, 0]);
    createArmature(footGeo, [0.23, -1.54, 0.08], [0.05, -0.12, 0]);

    // Trigger initial materials
    updateMuscleMaterials();

    // 7. Raycaster for Hover & Click Selection
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
      // Don't trigger click if it was a significant drag
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
      targetRotationXRef.current = Math.max(-0.25, Math.min(0.25, targetRotationXRef.current + rotationVelocityXRef.current));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = 'grab';
      }
    };

    // Touch Support
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
      targetRotationXRef.current = Math.max(-0.25, Math.min(0.25, targetRotationXRef.current + deltaY * 0.006));
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
      const height = container.clientHeight || 560;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    });
    resizeObserver.observe(container);

    // 8. Main Animation Render Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (bodyGroupRef.current) {
        // Smoothly interpolate rotation toward target
        bodyGroupRef.current.rotation.y += (targetRotationYRef.current - bodyGroupRef.current.rotation.y) * 0.12;
        bodyGroupRef.current.rotation.x += (targetRotationXRef.current - bodyGroupRef.current.rotation.x) * 0.12;

        // Inertial damping when user releases drag
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
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [onSelectMuscle, updateMuscleMaterials]);

  // Button Handlers
  const handleViewToggle = (mode: 'front' | 'back') => {
    setInternalView(mode);
    targetRotationYRef.current = mode === 'front' ? 0 : Math.PI;
    targetRotationXRef.current = 0;
    if (onViewModeChange) onViewModeChange(mode);
  };

  const handleZoomIn = () => {
    targetCameraZRef.current = Math.max(3.8, targetCameraZRef.current - 0.6);
  };

  const handleZoomOut = () => {
    targetCameraZRef.current = Math.min(7.5, targetCameraZRef.current + 0.6);
  };

  const handleReset = () => {
    targetRotationYRef.current = 0;
    targetRotationXRef.current = 0;
    targetCameraZRef.current = 5.5;
    setInternalView('front');
    if (onViewModeChange) onViewModeChange('front');
  };

  return (
    <div className={`relative w-full h-[540px] sm:h-[620px] lg:h-[680px] flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* Front / Back Toggle Pill (Top Right, matching reference image) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-[#272E29]/90 backdrop-blur-md p-1 rounded-2xl border border-[#e2e8df] dark:border-[#394139] shadow-xs">
        <button
          type="button"
          onClick={() => handleViewToggle('front')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            internalView === 'front'
              ? 'bg-[#2b3a2a] text-white shadow-xs'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => handleViewToggle('back')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            internalView === 'back'
              ? 'bg-[#2b3a2a] text-white shadow-xs'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
        >
          Back
        </button>
      </div>

      {/* Zoom In, Zoom Out, Reset Controls (Stacked Right below Front/Back, matching reference) */}
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

      {/* Real Three.js Canvas Container */}
      {isWebGlSupported ? (
        <div 
          ref={mountRef} 
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" 
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
          {/* Curved rotation arc */}
          <path 
            d="M 15,16 Q 120,30 225,16" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="4 3" 
            strokeLinecap="round" 
          />
          {/* Left arrow head */}
          <path d="M 24,12 L 15,16 L 24,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right arrow head */}
          <path d="M 216,12 L 225,16 L 216,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute left-1/2 -translate-x-1/2 -top-1 text-[11px] font-semibold text-[#6d7e6c] dark:text-[#A2AAA1] bg-white/70 dark:bg-[#1C211D]/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
          Drag to rotate
        </span>
      </div>

    </div>
  );
}
