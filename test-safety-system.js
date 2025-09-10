// Quick test of the safety system with the original failing input
import { detectSafetyIssues, generateSafetyResponse } from './src/lib/analysis/advancedAnalysis.js';

const testInput = `guy1: bro I hooked up with her last night
guy2: nice, was she into it?
guy1: she was drunk af lol, could barely stand
guy2: wait what?
guy1: like she didn't say no, she just passed out after
guy2: dude that's not okay
guy1: chill, it's not like she fought me
guy2: wtf, that literally sounds like rape
guy1: nah bro, we're dating, so it doesn't count
guy2: yes it does, are you hearing yourself??
guy1: whatever, she'll get over it, she knows I love her
guy2: that's seriously messed up
guy1: you're overreacting, it's not that deep`;

console.log('🧪 Testing Safety System...');
console.log('Input:', testInput.slice(0, 100) + '...');

const safetyResult = detectSafetyIssues(testInput);
console.log('Safety Detection Result:', safetyResult);

if (safetyResult.triggered) {
  const response = generateSafetyResponse(safetyResult, safetyResult.isLikelyTest);
  console.log('Safety Response:', response);
} else {
  console.log('❌ CRITICAL FAILURE: Safety system did not trigger on clear assault description');
}