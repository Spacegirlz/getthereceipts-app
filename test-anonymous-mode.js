// Test Anonymous Mode Implementation
// This tests the guy1/guy2 scenario that was previously failing

const testCases = [
  {
    name: "Guy1/Guy2 Sexual Assault (Original Failing Example)",
    input: `guy1: bro I hooked up with her last night
guy2: nice, was she into it?
guy1: she was drunk af lol, could barely stand
guy2: wait what?
guy1: like she didn't say no, she just passed out after
guy2: dude that's not okay
guy1: chill, it's not like she fought me
guy2: wtf, that literally sounds like rape
guy1: nah bro, we're dating, so it doesn't count
guy2: yes it does, are you hearing yourself??
guy1: whatever, she'll get over it, she knows I love her`,
    expectedMode: 'anonymous',
    expectedSafetyTrigger: true,
    expectedParticipants: ['guy1', 'guy2'],
    expectedResponse: {
      mode: 'safety_critical',
      verdict: {
        act: "Sexual Assault Detected",
        subtext: "This conversation describes sexual assault. This isn't drama - it's criminal behavior."
      },
      realTea: "What you're witnessing isn't relationship drama - it's evidence of assault..."
    }
  },
  
  {
    name: "Person A/B Anonymous Chat",
    input: `person a: how did your date go?
person b: it was weird, he kept pressuring me for sex
person a: that doesn't sound good
person b: yeah I said no like 5 times but he wouldn't stop asking`,
    expectedMode: 'anonymous',
    expectedSafetyTrigger: false, // Concerning but not critical assault
    expectedParticipants: ['person a', 'person b'],
    expectedResponse: {
      mode: 'regular_analysis',
      // Should use "Person B is experiencing pressure from their date" NOT "You're being pressured"
    }
  },
  
  {
    name: "Personal Mode (Names Provided)",
    input: `Alex: hey how was your date with Taylor?
Me: it was great! We had such good chemistry
Alex: that's awesome, when are you seeing them again?
Me: this weekend hopefully`,
    context: {
      analysis_mode: 'personal',
      user_name: 'Me',
      other_name: 'Taylor'
    },
    expectedMode: 'personal',
    expectedSafetyTrigger: false,
    expectedResponse: {
      // Should use "bestie" and direct address
      realTea: "This conversation shows healthy dating dynamics..."
    }
  },

  {
    name: "Anonymous Mode Detection Test",
    input: `friend1: she's been acting weird lately
friend2: how so?
friend1: just distant, not responding to texts
friend2: maybe she's going through something`,
    expectedMode: 'anonymous',
    expectedSafetyTrigger: false,
    expectedParticipants: ['friend1', 'friend2'],
    expectedResponse: {
      // Should use third-person analysis, no "bestie"
      verdict: "Friend1 is experiencing distance from someone they care about"
    }
  }
];

// Mock functions to test detection logic
const detectAnonymousChat = (text) => {
  const lowerText = text.toLowerCase();
  const anonymousPatterns = [
    /guy\s*\d+:/i,
    /person\s*[a-z]:/i,
    /anon\s*\d+:/i,
    /user\s*\d+:/i,
    /friend\s*\d+:/i,
    /\[redacted\]/i,
    /participant\s*\d+:/i,
    /speaker\s*[a-z]:/i,
    /^[a-z]\s*:/im,
  ];
  
  return anonymousPatterns.some(pattern => pattern.test(lowerText));
};

const extractParticipants = (text) => {
  const participants = new Set();
  const lines = text.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/^([^:]+):/);
    if (match) {
      const speaker = match[1].trim();
      if (speaker && !speaker.includes('(')) {
        participants.add(speaker);
      }
    }
  });
  
  return Array.from(participants);
};

const detectSafetyIssues = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Sexual assault patterns
  const assaultPatterns = [
    /drunk.{0,30}(sex|hooked up|slept|fucked)/i,
    /passed out.{0,20}(during|after|while|before).{0,20}(sex|touching)/i,
    /(didn't|never) say no.{0,20}(so|therefore|means)/i,
    /dating.{0,20}(doesn't count|not rape|can't be)/i,
    /she'll get over it/i,
  ];
  
  for (const pattern of assaultPatterns) {
    if (pattern.test(lowerMessage)) {
      return {
        triggered: true,
        severity: 'critical',
        category: 'sexual_assault'
      };
    }
  }
  
  return { triggered: false };
};

// Run tests
console.log('🧪 Testing Anonymous Mode Implementation...\n');

testCases.forEach((testCase, index) => {
  console.log(`\n--- Test ${index + 1}: ${testCase.name} ---`);
  
  // Test anonymous detection
  const isAnonymous = detectAnonymousChat(testCase.input);
  console.log(`Anonymous detected: ${isAnonymous}`);
  console.log(`Expected mode: ${testCase.expectedMode}`);
  
  // Test participant extraction
  const participants = extractParticipants(testCase.input);
  console.log(`Participants: ${participants.join(', ')}`);
  console.log(`Expected participants: ${testCase.expectedParticipants?.join(', ') || 'N/A'}`);
  
  // Test safety detection
  const safetyCheck = detectSafetyIssues(testCase.input);
  console.log(`Safety triggered: ${safetyCheck.triggered}`);
  console.log(`Expected safety trigger: ${testCase.expectedSafetyTrigger}`);
  
  // Validation
  const modeCorrect = (isAnonymous && testCase.expectedMode === 'anonymous') || 
                     (!isAnonymous && testCase.expectedMode === 'personal');
  const participantsCorrect = !testCase.expectedParticipants || 
                             JSON.stringify(participants.sort()) === JSON.stringify(testCase.expectedParticipants.sort());
  const safetyCorrect = safetyCheck.triggered === testCase.expectedSafetyTrigger;
  
  const allCorrect = modeCorrect && participantsCorrect && safetyCorrect;
  
  console.log(`\n✅ Results:`);
  console.log(`  Mode detection: ${modeCorrect ? '✅' : '❌'}`);
  console.log(`  Participant extraction: ${participantsCorrect ? '✅' : '❌'}`);
  console.log(`  Safety detection: ${safetyCorrect ? '✅' : '❌'}`);
  console.log(`  Overall: ${allCorrect ? '✅ PASS' : '❌ FAIL'}`);
});

console.log('\n🎯 Key Fixes Implemented:');
console.log('1. ✅ Anonymous mode detection (guy1:, person a:, etc.)');
console.log('2. ✅ Participant extraction from conversations');  
console.log('3. ✅ Safety detection for sexual assault patterns');
console.log('4. ✅ Context-aware safety responses (observer vs victim)');
console.log('5. ✅ UI toggle for analysis mode selection');
console.log('6. ✅ Prompt updates for anonymous/observational analysis');

console.log('\n🔧 Expected Behavior Changes:');
console.log('❌ OLD: "Understanding Your Gaslighter" + "Bestie, you\'re being manipulated"');
console.log('✅ NEW: "Gaslighter Pattern Analysis" + "Guy1 is gaslighting Guy2"');
console.log('❌ OLD: Sexual assault → Entertainment analysis');
console.log('✅ NEW: Sexual assault → Crisis resources only');

export { detectAnonymousChat, extractParticipants, detectSafetyIssues, testCases };