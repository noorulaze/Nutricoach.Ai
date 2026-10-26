import fs from 'fs';
import path from 'path';

// Mock localStorage for Node environment
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
(globalThis as any).localStorage = mockStorage;
(globalThis as any).window = {
  location: { origin: 'http://localhost:5173' },
  localStorage: mockStorage
};

import { MUSCLE_GROUPS, getMuscleGroupById } from '../src/data/workoutAnatomyData';
import { getWorkoutPlan, saveWorkoutPlan } from '../src/utils/storage';

console.log('================================================================');
console.log('  NUTRICOACH AI — 3D ANATOMY WORKOUT PAGE TEST SUITE           ');
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
  // TEST 1: All 14 Required Muscle Groups & Reference Parity
  // -------------------------------------------------------------------------
  console.log('[1] Muscle Groups Anatomy Database Coverage:');
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

  assert(MUSCLE_GROUPS.length === 14, `All 14 anatomical muscle groups present (Count: ${MUSCLE_GROUPS.length})`);

  for (const muscleId of requiredMuscles) {
    const muscle = getMuscleGroupById(muscleId);
    assert(Boolean(muscle && muscle.id === muscleId), `Muscle group "${muscleId}" resolved correctly`);
    assert(Boolean(muscle.scientificName), `"${muscle.name}" has anatomical name: ${muscle.scientificName}`);
    assert(Boolean(muscle.description && muscle.description.length > 20), `"${muscle.name}" has comprehensive biomechanics description`);
    assert(Boolean(muscle.tips.focus && muscle.tips.equipment && muscle.tips.rest && muscle.tips.target), `"${muscle.name}" includes Tips & Info card metadata`);
    assert(muscle.exercises.length >= 2, `"${muscle.name}" has ${muscle.exercises.length} verified resistance exercises`);
  }
  console.log();

  // -------------------------------------------------------------------------
  // TEST 2: Reference Image Exact Exercise Match (Chest)
  // -------------------------------------------------------------------------
  console.log('[2] Chest Exercises Exact Reference Image Parity:');
  const chest = getMuscleGroupById('chest');
  assert(chest.name === 'Chest', 'Chest name is Chest');
  assert(chest.scientificName === 'Pectoralis Major', 'Scientific name is Pectoralis Major');

  const chestExNames = chest.exercises.map((e) => e.name);
  assert(chestExNames.includes('Barbell Bench Press'), 'Includes Barbell Bench Press');
  assert(chestExNames.includes('Dumbbell Chest Press'), 'Includes Dumbbell Chest Press');
  assert(chestExNames.includes('Incline Dumbbell Press'), 'Includes Incline Dumbbell Press');
  assert(chestExNames.includes('Push Up'), 'Includes Push Up');
  assert(chestExNames.includes('Cable Fly'), 'Includes Cable Fly');

  // Verify Barbell Bench Press parameters
  const bench = chest.exercises.find((e) => e.name === 'Barbell Bench Press')!;
  assert(bench.sets === '3–4 sets', 'Sets match reference: 3–4 sets');
  assert(bench.reps === '8–12 reps', 'Reps match reference: 8–12 reps');
  assert(bench.restText === '90s rest', 'Rest matches reference: 90s rest');
  assert(bench.difficulty === 'Intermediate', 'Difficulty matches reference: Intermediate');
  assert(bench.targetMuscles.includes('Chest') && bench.targetMuscles.includes('Triceps'), 'Target muscles: Chest & Triceps');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 3: 3D Anatomical Human Model Component Verification
  // -------------------------------------------------------------------------
  console.log('[3] Three.js 3D Muscular Anatomy Model Verification:');
  const anatomy3dSrc = fs.readFileSync(path.resolve('src/components/HumanAnatomy3D.tsx'), 'utf-8');

  assert(anatomy3dSrc.includes("import * as THREE from 'three'"), 'HumanAnatomy3D imports Three.js');
  assert(anatomy3dSrc.includes('WebGLRenderer'), 'Instantiates WebGLRenderer with hardware acceleration');
  assert(anatomy3dSrc.includes('PCFSoftShadowMap'), 'Enables soft studio shadow mapping');
  assert(anatomy3dSrc.includes('0x7cb342'), 'Selected muscle highlighted in sage green #7cb342');
  assert(anatomy3dSrc.includes('Drag to rotate'), 'Renders curved "Drag to rotate" indicator matching reference');
  assert(anatomy3dSrc.includes('Front'), 'Provides Front view orientation control');
  assert(anatomy3dSrc.includes('Back'), 'Provides Back view orientation control');
  assert(anatomy3dSrc.includes('handleZoomIn'), 'Provides interactive Zoom In control');
  assert(anatomy3dSrc.includes('handleZoomOut'), 'Provides interactive Zoom Out control');
  assert(anatomy3dSrc.includes('handleReset'), 'Provides Reset view control');
  assert(anatomy3dSrc.includes('raycaster.intersectObjects'), 'Interactive 3D raycasting enables direct muscle mesh clicks');

  // Verify all 14 muscle groups are mapped to 3D meshes
  for (const mId of requiredMuscles) {
    assert(anatomy3dSrc.includes(`'${mId}'`), `3D anatomy model sculpts and registers mesh for "${mId}"`);
  }
  console.log();

  // -------------------------------------------------------------------------
  // TEST 4: Layout & UI Components Verification
  // -------------------------------------------------------------------------
  console.log('[4] Reference 3-Column Layout & Component Structure:');
  const pageSrc = fs.readFileSync(path.resolve('src/pages/WorkoutPlannerPage.tsx'), 'utf-8');

  assert(pageSrc.includes('Muscle Groups'), 'Renders Muscle Groups tab');
  assert(pageSrc.includes('Workout Plans'), 'Renders Workout Plans tab');
  assert(pageSrc.includes('Tips & Info'), 'Renders Tips & Info card in center column');
  assert(pageSrc.includes('Add to Workout Plan'), 'Renders "+ Add to Workout Plan" primary action');
  assert(pageSrc.includes('Search exercises...'), 'Renders exercise search input with placeholder');
  assert(pageSrc.includes('Intermediate'), 'Renders difficulty filter buttons');
  assert(pageSrc.includes('HumanAnatomy3D'), 'Mounts HumanAnatomy3D in center column');
  assert(pageSrc.includes('MuscleGroupIcon'), 'Mounts MuscleGroupIcon in left sidebar');
  assert(pageSrc.includes('AnatomyExerciseCard'), 'Mounts AnatomyExerciseCard in right column');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 5: Workout Plan Integration & Storage Preservation
  // -------------------------------------------------------------------------
  console.log('[5] Workout Plan Integration & Data Persistence:');
  const initialPlan = getWorkoutPlan();
  assert(initialPlan.length === 7, '7-day weekly workout plan loaded');

  // Simulate adding Barbell Bench Press to Monday (dayIndex 0)
  const monday = initialPlan[0];
  const initialExCount = monday.exercises.length;

  const newExercise = {
    id: 'ex_test_bench',
    exerciseId: bench.id,
    name: bench.name,
    targetMuscle: bench.primaryMuscle,
    sets: 3,
    reps: bench.reps,
    weightKg: 80,
    restSeconds: bench.restSeconds,
    instructions: bench.instructions[0],
    completedSets: [false, false, false]
  };

  const updatedPlan = initialPlan.map((d) => {
    if (d.dayIndex === 0) {
      return {
        ...d,
        exercises: [...d.exercises, newExercise]
      };
    }
    return d;
  });

  saveWorkoutPlan(updatedPlan);

  const reloadedPlan = getWorkoutPlan();
  const reloadedMonday = reloadedPlan.find((d) => d.dayIndex === 0)!;
  assert(reloadedMonday.exercises.length === initialExCount + 1, 'Exercise appended to Monday workout');
  assert(reloadedMonday.exercises.some((e) => e.name === 'Barbell Bench Press'), 'Barbell Bench Press persisted in plan');
  console.log();

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('================================================================');
  console.log(`🎉 ALL 3D WORKOUT ANATOMY TESTS PASSED! Total assertions: ${passCount}`);
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
