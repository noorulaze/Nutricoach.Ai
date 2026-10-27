import { getExerciseMediaGuide } from '../src/utils/foodImageDatabase';
import { MUSCLE_GROUPS } from '../src/data/workoutAnatomyData';
import { EXERCISE_LIBRARY } from '../src/data/nutritionAndExerciseData';

console.log('Testing workoutAnatomyData:');
let totalChecked = 0;

for (const group of MUSCLE_GROUPS) {
  for (const ex of group.exercises) {
    totalChecked++;
    const byId = getExerciseMediaGuide(ex.id);
    const byName = getExerciseMediaGuide(ex.name);
    console.log(`[Anatomy] id: ${ex.id} -> ${byId.startFrame.split('/').slice(-2).join('/')} | name: ${ex.name} -> ${byName.startFrame.split('/').slice(-2).join('/')}`);
  }
}

console.log('\nTesting nutritionAndExerciseData:');
for (const ex of EXERCISE_LIBRARY) {
  totalChecked++;
  const byId = getExerciseMediaGuide(ex.id);
  const byName = getExerciseMediaGuide(ex.name);
  console.log(`[Library] id: ${ex.id} -> ${byId.startFrame.split('/').slice(-2).join('/')} | name: ${ex.name} -> ${byName.startFrame.split('/').slice(-2).join('/')}`);
}

console.log('\nTotal exercises checked:', totalChecked);
