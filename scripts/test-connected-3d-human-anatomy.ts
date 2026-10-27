import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  NUTRICOACH AI — CONNECTED 3D HUMAN ANATOMY TEST SUITE         ');
console.log('================================================================\n');

let passCount = 0;
function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
}

async function runTests() {
  // -------------------------------------------------------------------------
  // TEST 1: GLB & DRACO 3D Asset Files
  // -------------------------------------------------------------------------
  console.log('[1] 3D Model Assets & DRACO Decoder Files:');
  const glbPath = path.resolve('public/models/body.glb');
  assert(fs.existsSync(glbPath), 'GLB anatomy asset exists at public/models/body.glb');
  const glbStats = fs.statSync(glbPath);
  assert(glbStats.size > 5_000_000, `GLB asset has valid complete size (${(glbStats.size / (1024 * 1024)).toFixed(2)} MB)`);

  const glbBuffer = fs.readFileSync(glbPath);
  const magic = glbBuffer.readUInt32LE(0);
  assert(magic === 0x46546c67, 'GLB file has valid glTF binary magic header (0x46546c67)');

  assert(fs.existsSync(path.resolve('public/draco/draco_decoder.wasm')), 'DRACO decoder wasm binary present');
  assert(fs.existsSync(path.resolve('public/draco/draco_decoder.js')), 'DRACO decoder js wrapper present');
  assert(fs.existsSync(path.resolve('public/draco/gltf/draco_decoder.wasm')), 'DRACO gltf fallback wasm binary present');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 2: HumanAnatomy3D Component Verification
  // -------------------------------------------------------------------------
  console.log('[2] HumanAnatomy3D Component Architecture:');
  const compSrc = fs.readFileSync(path.resolve('src/components/HumanAnatomy3D.tsx'), 'utf-8');

  assert(compSrc.includes('GLTFLoader'), 'Imports GLTFLoader from Three.js');
  assert(compSrc.includes('DRACOLoader'), 'Imports DRACOLoader from Three.js');
  assert(compSrc.includes("setDecoderPath('/draco/')"), 'Configures DRACO decoder path to /draco/');
  assert(compSrc.includes("'/models/body.glb'"), 'Loads /models/body.glb model asset');
  assert(compSrc.includes('isLoading'), 'Maintains asynchronous loading state');
  assert(compSrc.includes('loadingProgress'), 'Tracks loading progress percentage');
  assert(compSrc.includes('loadError'), 'Handles 3D model loading error gracefully');
  assert(compSrc.includes('Loading 3D Anatomy Model'), 'Displays informative loading overlay with progress');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 3: Connected Body & View Controls (Front, Back, Side, Zoom, Reset)
  // -------------------------------------------------------------------------
  console.log('[3] Connected Body Controls & View Orientations:');
  assert(compSrc.includes('Front'), 'Provides Front view button');
  assert(compSrc.includes('Back'), 'Provides Back view button');
  assert(compSrc.includes('Side'), 'Provides Side view button matching reference image');
  assert(compSrc.includes('Math.PI * 0.5'), 'Smoothly rotates 90° for Side view inspection');
  assert(compSrc.includes('handleZoomIn'), 'Interactive zoom in function');
  assert(compSrc.includes('handleZoomOut'), 'Interactive zoom out function');
  assert(compSrc.includes('handleReset'), 'Interactive reset view function');
  assert(compSrc.includes('Math.max(1.8,'), 'Constrains zoom min distance to prevent model clipping');
  assert(compSrc.includes('Math.min(4.5,'), 'Constrains zoom max distance to keep model visible');
  assert(compSrc.includes('Math.max(-0.35, Math.min(0.35,'), 'Clamps vertical camera tilt to prevent upside-down flipping');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 4: Touch & Mouse Rotation with Inertial Physics
  // -------------------------------------------------------------------------
  console.log('[4] Touch & Mouse 360° Drag Rotation:');
  assert(compSrc.includes('onMouseDown'), 'Handles desktop mouse down');
  assert(compSrc.includes('onMouseMove'), 'Handles desktop mouse drag with velocity calculation');
  assert(compSrc.includes('onTouchStart'), 'Handles mobile touch start');
  assert(compSrc.includes('onTouchMove'), 'Handles mobile touch drag for smooth 360° rotation');
  assert(compSrc.includes('touchAction: \'none\''), 'Sets touchAction none to prevent mobile screen scrolling during 3D drag');
  assert(compSrc.includes('rotationVelocityYRef.current *= 0.91'), 'Implements inertial physics damping when user releases drag');
  assert(compSrc.includes('Drag to rotate'), 'Renders curved drag rotation guide arc at bottom');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 5: Accurate Muscle Group Mapping & Sage Green Highlighting
  // -------------------------------------------------------------------------
  console.log('[5] Anatomical Muscle Group Mapping & Highlighting:');
  const requiredMuscles = [
    'chest',
    'shoulders',
    'biceps',
    'triceps',
    'forearms',
    'abs',
    'obliques',
    'upper_back',
    'lats',
    'lower_back',
    'glutes',
    'quadriceps',
    'hamstrings',
    'calves'
  ];

  for (const mId of requiredMuscles) {
    assert(compSrc.includes(`id: '${mId}'`), `Maps anatomical meshes to muscle group "${mId}"`);
  }

  assert(compSrc.includes('0x7cb342'), 'Highlights selected muscle in NutriCoach AI sage green (#7cb342)');
  assert(compSrc.includes('0x243e18'), 'Emissive glow (#243e18) applied to highlighted muscle region');
  assert(compSrc.includes('0x9ba6ab'), 'Restores unselected muscles to realistic silver/gray material (#9ba6ab)');
  assert(compSrc.includes('0x8faf78'), 'Applies subtle hover preview material (#8faf78)');
  assert(compSrc.includes('raycaster.intersectObjects'), 'Raycaster intersects 3D mesh for click selection');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 6: Real GLB Data Verification for Muscle Groups
  // -------------------------------------------------------------------------
  console.log('[6] Real GLB Asset Node Inspection for All 14 Groups:');
  const dataView = new DataView(glbBuffer.buffer, glbBuffer.byteOffset, glbBuffer.byteLength);
  const chunk0Length = dataView.getUint32(12, true);
  const jsonBytes = new Uint8Array(glbBuffer.buffer, glbBuffer.byteOffset + 20, chunk0Length);
  const gltfJson = JSON.parse(new TextDecoder('utf-8').decode(jsonBytes));

  const allNodeNames = gltfJson.nodes.map((n: any) => `${n.name || ''} ${n.extras?.name || ''} ${n.extras?.nameDetail || ''}`.toLowerCase());

  const checks: Record<string, RegExp> = {
    chest: /pectoralis[- ]major/i,
    shoulders: /deltoid/i,
    biceps: /biceps[- ]brachii/i,
    triceps: /triceps[- ]brachii/i,
    forearms: /brachioradialis|pronator[- ]teres/i,
    abs: /rectus[- ]abdominis/i,
    obliques: /oblique/i,
    upper_back: /trapezius/i,
    lats: /latissimus[- ]dorsi/i,
    lower_back: /iliocostalis|erector[- ]spinae/i,
    glutes: /gluteus[- ]maximus/i,
    quadriceps: /rectus[- ]femoris|vastus[- ]lateralis/i,
    hamstrings: /biceps[- ]femoris|semitendinosus/i,
    calves: /gastrocnemius|soleus/i
  };

  for (const [mId, pattern] of Object.entries(checks)) {
    const found = allNodeNames.some((txt: string) => pattern.test(txt));
    assert(found, `body.glb contains verified anatomical node for "${mId}" (${pattern.source})`);
  }

  console.log();
  console.log('================================================================');
  console.log(`🎉 ALL ${passCount} CONNECTED 3D HUMAN ANATOMY ASSERTIONS PASSED!`);
  console.log('================================================================');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
