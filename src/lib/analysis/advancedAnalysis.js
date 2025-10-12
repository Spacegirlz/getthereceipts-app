// Advanced Psychology Analysis Engine - Get The Receipts
// Integrating OpenAI GPT-4o-mini with sophisticated psychological profiling

// Perf logging gate (enable with ?perf=1 or in DEV)
const PERF_LOG = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('perf') === '1') ||
                 (typeof importMeta !== 'undefined' ? false : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV));
const safeLog = (...args) => { if (PERF_LOG) console.log(...args); };

// Detect Sage mode based on user context and message content
const detectSageMode = (message, context) => {
  const lowerMessage = message.toLowerCase();
  const userName = context?.user_name?.toLowerCase() || '';
  const userSide = context?.user_side?.toLowerCase() || '';
  const contextType = context?.context_type?.toLowerCase() || '';
  
  // Check if user is the toxic one (self_receipt mode)
  const toxicUserSignals = [
    'share live location', 'send a pic', 'prove it', 'if you loved me',
    'calm my anxiety', 'without me asking', 'flip it on'
  ];
  const hasToxicBehavior = toxicUserSignals.some(signal => lowerMessage.includes(signal));
  
  // Check context clues
  if (contextType.includes('ex') || contextType.includes('situation')) {
    if (hasToxicBehavior && userName) {
      return 'self_receipt'; // User is exhibiting toxic behavior
    }
    return 'mirror'; // Both sides messy
  }
  
  if (contextType.includes('family')) {
    return 'family';
  }
  
  // If healthy relationship context
  if (contextType.includes('healthy') || lowerMessage.includes('good relationship')) {
    return 'healthy';
  }
  
  // Default to mirror for dating scenarios
  return 'mirror';
};


// 5 Viral Color Palettes - Randomized for maximum shareability
export const colorPalettes = [
  {
    name: "Electric Pink",
    primary: '#FF6B9D',
    secondary: '#FFB3D1',
    bg: 'from-[#FF6B9D]/10 to-[#FFB3D1]/5',
    border: '#FF6B9D'
  },
  {
    name: "Crimson Fire", 
    primary: '#FF5B5B',
    secondary: '#FF8B8B',
    bg: 'from-[#FF5B5B]/10 to-[#FF8B8B]/5',
    border: '#FF5B5B'
  },
  {
    name: "Royal Purple",
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    bg: 'from-[#8B5CF6]/10 to-[#A78BFA]/5',
    border: '#8B5CF6'
  },
  {
    name: "Golden Amber",
    primary: '#FFB800',
    secondary: '#FFCC33',
    bg: 'from-[#FFB800]/10 to-[#FFCC33]/5',
    border: '#FFB800'
  },
  {
    name: "Cyber Teal",
    primary: '#00D4AA',
    secondary: '#00F5CC',
    bg: 'from-[#00D4AA]/10 to-[#00F5CC]/5',
    border: '#00D4AA'
  }
];

export const profiles = {
  // Dating archetypes
  ghoster: {
    title: "The Certified Ghoster 👻",
    color: "linear-gradient(135deg, #434343 0%, #000000 100%)"
  },
  breadcrumber: {
    title: "The Breadcrumber 🍞", 
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  lovebomber: {
    title: "The Love Bomber 💣",
    color: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)"
  },
  avoider: {
    title: "The Avoidant King 🏃",
    color: "linear-gradient(135deg, #2af598 0%, #009efd 100%)"
  },
  player: {
    title: "The Player 🎮",
    color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  hot_cold: {
    title: "The Hot & Cold 🥶",
    color: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
  },
  future_faker: {
    title: "The Future Faker 🎭", 
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  genuine_gem: {
    title: "The Genuine Gem 💎",
    color: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"
  },
  // Male-specific archetypes
  fuckboy: {
    title: "The Fuckboy 🎮",
    color: "linear-gradient(135deg, #ff5b5b 0%, #ff8b8b 100%)"
  },
  avoidant_king: {
    title: "The Avoidant King 🏃",
    color: "linear-gradient(135deg, #2af598 0%, #009efd 100%)"
  },
  genuine_guy: {
    title: "The Genuine Guy 💎",
    color: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"
  },
  // Female-specific archetypes
  drama_queen: {
    title: "The Drama Queen 🎭",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  game_player: {
    title: "The Game Player 🎯",
    color: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
  },
  pick_me: {
    title: "The Pick-Me Girl 😔",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  secure_queen: {
    title: "The Secure Queen 👑",
    color: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"
  },
  // Work archetypes
  boundary_crosser: {
    title: "The Boundary Crosser 🚫",
    color: "linear-gradient(135deg, #ff5b5b 0%, #ff8b8b 100%)"
  },
  toxic_boss: {
    title: "The Toxic Boss ☠️",
    color: "linear-gradient(135deg, #434343 0%, #000000 100%)"
  },
  micromanager: {
    title: "The Micromanager 🔍",
    color: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
  }
};

// Provider/model auto-selection with graceful fallback and safe logging
const selectAiProvider = () => {
  const providerEnv = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase();
  const hasOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY;
  const hasGoogle = !!import.meta.env.VITE_GOOGLE_API_KEY;
  let provider = providerEnv;

  // Auto-pick if unset or invalid, prefer OpenAI if both available
  if (!provider || (provider === 'openai' && !hasOpenAI) || (provider === 'google' && !hasGoogle)) {
    if (hasOpenAI) provider = 'openai';
    else if (hasGoogle) provider = 'google';
    else provider = 'none';
  }

  const openAIModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const geminiModel = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-2.5-lite';
  const model = provider === 'openai' ? openAIModel : provider === 'google' ? geminiModel : null;

  console.log('AI provider selection:', {
    provider,
    model,
    hasOpenAI,
    hasGoogle
  });

  return { provider, model, openAIModel, geminiModel };
};

// Heuristic Mode Detection System (before API call)
const detectToxicityMode = (userText, otherText) => {
  const CUES = {
    surveillance: [/share (your|live) location/i, /\b(location|find my|life360)\b/i, /send (a )?pic/i, /\bproof\b/i],
    guilt: [/\bif you loved me/i, /\bcalm my anxiety\b/i, /after all I've done/i, /\byou're making me/i],
    control: [/do it now/i, /\bright now\b/i, /\bprove it\b/i, /\bsend proof\b/i, /\bnext time just/i],
    gaslight: [/\bthat's not what happened\b/i, /\byour memory\b/i, /\bpeople talk\b/i, /\byou're remembering wrong/i],
  };

  const scoreSpeaker = (text) => {
    const s = { control: 0, guilt: 0, surveillance: 0, gaslight: 0, total: 0 };
    const add = (regexArray) => regexArray.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
    
    s.surveillance = add(CUES.surveillance);
    s.guilt = add(CUES.guilt);
    s.control = add(CUES.control);
    s.gaslight = add(CUES.gaslight);
    s.total = s.surveillance * 3 + s.guilt * 2 + s.control * 2 + s.gaslight;
    
    return s;
  };

  const userScore = scoreSpeaker(userText);
  const otherScore = scoreSpeaker(otherText);
  const margin = userScore.total - otherScore.total;

  safeLog('🔍 Toxicity Detection:', {
    userScore: userScore.total,
    otherScore: otherScore.total,
    margin,
    userBreakdown: userScore,
    otherBreakdown: otherScore
  });

  const selfConcern = userScore.total >= 2 && margin >= 1;        // user shows more concerning cues
  const bothMessy = userScore.total >= 2 && otherScore.total >= 2 && Math.abs(margin) <= 1;

  if (selfConcern) return "SELF_RECEIPT";
  if (bothMessy) return "DUAL_RECEIPT";
  return "STANDARD";
};

// Mathematical Context Detection System
const detectContextMathematically = (message) => {
  const lowercased = message.toLowerCase();
  const words = lowercased.split(' ');
  
  // Context scoring system
  const contextScores = {
    workplace: 0,
    dating: 0,
    family: 0,
    friendship: 0,
    social: 0
  };
  
  // WORKPLACE INDICATORS (High weight)
  const workplaceKeywords = {
    'boss': 50,
    'manager': 45,
    'meeting': 40,
    'work': 35,
    'office': 30,
    'denied': 45,
    'never said': 40,
    'didn\'t happen': 40,
    'misremembering': 35,
    'that\'s not what happened': 40,
    'professional': 25,
    'deadline': 25,
    'project': 20,
    'coworker': 30,
    'colleague': 25,
    'supervisor': 35,
    'hr': 30,
    'performance': 25,
    'review': 25,
    'promotion': 20,
    'salary': 20,
    'company': 15,
    'business': 15
  };
  
  // DATING INDICATORS (High weight)
  const datingKeywords = {
    'miss you': 50,
    'love': 45,
    'relationship': 40,
    'dating': 40,
    'boyfriend': 35,
    'girlfriend': 35,
    'partner': 30,
    'romantic': 30,
    'intimate': 25,
    'kiss': 25,
    'hug': 20,
    'cuddle': 20,
    'soulmate': 45,
    'forever': 35,
    'marriage': 40,
    'wedding': 40,
    'proposal': 35,
    'engagement': 35,
    'move in': 30,
    'together': 25,
    'us': 15,
    'we': 15,
    'our': 15,
    'ghost': 30,
    'disappeared': 25,
    'left on read': 25,
    'breadcrumb': 30,
    'maybe': 20,
    'soon': 20,
    'later': 15
  };
  
  // FAMILY INDICATORS
  const familyKeywords = {
    'parent': 50,
    'mom': 45,
    'dad': 45,
    'mother': 45,
    'father': 45,
    'family': 40,
    'sibling': 35,
    'brother': 35,
    'sister': 35,
    'child': 30,
    'kid': 30,
    'son': 30,
    'daughter': 30,
    'grandparent': 35,
    'grandma': 30,
    'grandpa': 30,
    'aunt': 25,
    'uncle': 25,
    'cousin': 20,
    'relative': 20,
    'holiday': 15,
    'christmas': 15,
    'thanksgiving': 15,
    'birthday': 10
  };
  
  // FRIENDSHIP INDICATORS
  const friendshipKeywords = {
    'friend': 50,
    'best friend': 45,
    'bff': 40,
    'buddy': 30,
    'pal': 25,
    'group chat': 35,
    'hang out': 25,
    'party': 20,
    'drinks': 15,
    'dinner': 10,
    'movie': 10,
    'concert': 10
  };
  
  // SOCIAL INDICATORS
  const socialKeywords = {
    'neighbor': 40,
    'acquaintance': 35,
    'stranger': 30,
    'community': 25,
    'social': 20,
    'network': 15,
    'event': 15,
    'gathering': 15
  };
  
  // Calculate scores for each context with early-exit threshold
  const THRESHOLD = 60;
  const addAndCheck = (ctxKey, weight) => {
    contextScores[ctxKey] += weight;
    if (contextScores[ctxKey] >= THRESHOLD) {
      safeLog('⏩ Context early decision:', ctxKey, contextScores[ctxKey]);
      return ctxKey; // early winner
    }
    return null;
  };

  let earlyWinner = null;
  for (const [keyword, weight] of Object.entries(workplaceKeywords)) {
    if (lowercased.includes(keyword)) { earlyWinner = addAndCheck('workplace', weight) || earlyWinner; if (earlyWinner) break; }
  }
  if (!earlyWinner) {
    for (const [keyword, weight] of Object.entries(datingKeywords)) {
      if (lowercased.includes(keyword)) { earlyWinner = addAndCheck('dating', weight) || earlyWinner; if (earlyWinner) break; }
    }
  }
  if (!earlyWinner) {
    for (const [keyword, weight] of Object.entries(familyKeywords)) {
      if (lowercased.includes(keyword)) { earlyWinner = addAndCheck('family', weight) || earlyWinner; if (earlyWinner) break; }
    }
  }
  if (!earlyWinner) {
    for (const [keyword, weight] of Object.entries(friendshipKeywords)) {
      if (lowercased.includes(keyword)) { earlyWinner = addAndCheck('friendship', weight) || earlyWinner; if (earlyWinner) break; }
    }
  }
  if (!earlyWinner) {
    for (const [keyword, weight] of Object.entries(socialKeywords)) {
      if (lowercased.includes(keyword)) { earlyWinner = addAndCheck('social', weight) || earlyWinner; if (earlyWinner) break; }
    }
  }

  if (earlyWinner) {
    safeLog('🏁 Context decided early:', earlyWinner);
    return earlyWinner;
  }
  
  // Find the highest scoring context
  const maxScore = Math.max(...Object.values(contextScores));
  const detectedContext = Object.keys(contextScores).find(key => contextScores[key] === maxScore);
  
  safeLog('🧮 MATHEMATICAL CONTEXT DETECTION:');
  safeLog('📊 Context Scores:', contextScores);
  safeLog('🎯 Highest Score:', maxScore);
  safeLog('🏆 Detected Context:', detectedContext);
  
  // Confidence threshold - if no clear winner, default to dating
  if (maxScore < 20) {
    safeLog('⚠️ Low confidence, defaulting to dating context');
    return 'dating';
  }
  
  return detectedContext;
};

// Enhanced grammar fixing with comprehensive patterns
const fixGrammar = (text) => {
  if (!text) return text;
  let fixed = text
    // Fix their/they're patterns (with word boundaries)
    .replace(/\btheir throwing/g, "they're throwing")
    .replace(/\btheir saying/g, "they're saying")
    .replace(/\btheir playing/g, "they're playing")
    .replace(/\btheir being/g, "they're being")
    .replace(/\btheir acting/g, "they're acting")
    .replace(/\btheir making/g, "they're making")
    .replace(/\btheir doing/g, "they're doing")
    .replace(/\btheir giving/g, "they're giving")
    .replace(/\btheir texting/g, "they're texting")
    .replace(/\btheir treating/g, "they're treating")
    .replace(/\btheir keeping/g, "they're keeping")
    .replace(/\btheir showing/g, "they're showing")
    .replace(/\btheir time to/g, "it's time to")
    .replace(/\btheir convenient/g, "it's convenient")
    .replace(/\btheir real/g, "that's real")
    .replace(/\btheir a crash/g, "it's a crash")
    .replace(/\btheir the real/g, "that's the real")
    .replace(/\bthey aren't adding up/g, "the numbers aren't adding up")
    .replace(/\bthey aren't showing up for you/g, "who isn't showing up for you")
    // Fix basic verb agreement
    .replace(/\bthey is\b/g, 'they are')
    .replace(/\bthey was\b/g, 'they were')
    // Fix availability grammar
    .replace(/\btheir active on/g, "they're active on")
    .replace(/\btheir always/g, "they're always")
    .replace(/\btheir not/g, "They're not")
    // Fix word concatenation issues
    .replace(/\bitemonly\b/g, "item only")
    .replace(/\bmenuitem\b/g, "menu item")
    .replace(/\bsecretmenu\b/g, "secret menu")
    // Replace overused metaphors with fresh ones
    .replace(/\bsecret menu item\b/g, "classified document")
    .replace(/\bmenu item\b/g, "backup option")
    // Fix weird sentences and fragments
    .replace(/they werete more time/g, "you waste more time")
    .replace(/they are growth/g, "that's growth")
    .replace(/they werete/g, "you won't waste")
    .replace(/you waste more time\./g, "than waste more time.")
    .replace(/they aresue/g, "an issue")
    // Replace em dashes with spaces to prevent word concatenation
    .replace(/—/g, " ")
    .replace(/–/g, " ");
  
  return fixed;
};

// UI Sanitization - prevent placeholder leaks
const hasPlaceholderLeak = (s) => {
  if (!s) return false;
  return /\[[^\]]+\]/.test(s) || /pending - analysis/i.test(s) || /analysis in progress/i.test(s);
};

const sanitizeResult = (result) => {
  const fields = ["verdict", "realTea", "prophecy"];
  for (const k of fields) {
    const v = (result[k] ?? "").toString();
    if (!v.trim() || hasPlaceholderLeak(v)) {
      result[k] = k === "prophecy" ? "Next: more of the same" : "You're not crazy. Trust your gut.";
    }
  }
  
  // Cap red flag chips and sanitize
  if (result.redFlagTags) {
    result.redFlagTags = result.redFlagTags.slice(0, 5).filter(tag => !hasPlaceholderLeak(tag));
  }
  
  return result;
};

// Validate metrics before returning
const validateMetrics = (result) => {
  // Fix "CONFUSED" confidence to proper values
  if (result.confidenceRemark === 'CONFUSED') {
    result.confidenceRemark = result.redFlags > 6 ? 'High' : result.redFlags > 3 ? 'Medium' : 'Low';
  }
  
  return result;
};

// Parse user/other text from message for mode detection
const parseConversationSides = (message, context) => {
  // Try to extract user vs other party messages
  let userText = '';
  let otherText = '';
  
  // Look for patterns like "Alex (time): text" vs "Mateo (time): text"
  const lines = message.split('\n');
  const userName = context?.userName || context?.user_name || 'user';
  
  safeLog('🔍 Parsing conversation for mode detection:', { userName, totalLines: lines.length });
  
  let processed = 0;
  for (const line of lines) {
    if (processed >= 200) {
      safeLog('⏩ parseConversationSides: early stop at 200 lines');
      break;
    }
    // Enhanced parsing to handle multiple formats
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Format 1: "Alex (10:41 PM): text" - with timestamp
    if (line.includes(`${userName} (`)) {
      const text = line.substring(line.indexOf('):') + 2);
      userText += ' ' + text;
      safeLog(`  ✅ ${userName} line (with timestamp):`, text.slice(0, 50));
      processed++;
    }
    // Format 2: "Alex: text" - simple format (NEW)
    else if (line.startsWith(`${userName}:`)) {
      const text = line.substring(line.indexOf(':') + 1).trim();
      userText += ' ' + text;
      safeLog(`  ✅ ${userName} line (simple format):`, text.slice(0, 50));
      processed++;
    }
    // Format 3: Other party with timestamp "Mateo (10:42 PM): text"
    else if (line.includes('(') && line.includes('):') && !line.includes('—')) {
      const text = line.substring(line.indexOf('):') + 2);
      otherText += ' ' + text;
      const speaker = line.substring(0, line.indexOf(' ('));
      safeLog(`  ✅ ${speaker} line (with timestamp):`, text.slice(0, 50));
      processed++;
    }
    // Format 4: Other party simple format "Name: text" (NEW)
    else if (line.includes(':') && !line.includes('(') && !line.includes('—')) {
      const colonIndex = line.indexOf(':');
      const speaker = line.substring(0, colonIndex).trim();
      const text = line.substring(colonIndex + 1).trim();
      
      // Only process if speaker is not the known user and looks like a valid name
      if (speaker !== userName && speaker.length > 0 && speaker.length < 20 && text.length > 0) {
        otherText += ' ' + text;
        safeLog(`  ✅ ${speaker} line (simple format):`, text.slice(0, 50));
        processed++;
      }
    }
  }
  
  const result = { userText: userText.trim(), otherText: otherText.trim() };
  safeLog('📝 Parsed result:', {
    userTextLength: result.userText.length,
    otherTextLength: result.otherText.length,
    userPreview: result.userText.slice(0, 100),
    otherPreview: result.otherText.slice(0, 100)
  });
  
  return result;
};

// Helper function to make API calls with backup support
const makeApiCallWithBackup = async (endpoint, body, attemptNumber = 0) => {
  const apiKeys = [
    import.meta.env.VITE_OPENAI_API_KEY,
    import.meta.env.VITE_OPENAI_API_KEY_BACKUP1,
    import.meta.env.VITE_GOOGLE_API_KEY_BACKUP2,  // Gemini API as third backup
    import.meta.env.VITE_GOOGLE_API_KEY  // Use the existing Google key as backup
  ].filter(key => key && key.trim());

  if (attemptNumber >= apiKeys.length) {
    throw new Error('All API keys exhausted');
  }

  const currentKey = apiKeys[attemptNumber].replace(/\s/g, ''); // CRITICAL FIX: Remove ALL spaces!
  
  // Validate API key
  if (!currentKey || typeof currentKey !== 'string' || currentKey.length === 0) {
    throw new Error(`Invalid API key at attempt ${attemptNumber + 1}`);
  }

  const authHeader = `Bearer ${currentKey}`;
  console.log(`🔑 API call attempt ${attemptNumber + 1} with key:`, currentKey.substring(0, 10) + '...');
  console.log(`🔍 DEBUG - Full key length:`, currentKey.length);
  console.log(`🔍 DEBUG - Key starts with:`, currentKey.substring(0, 20));
  console.log(`🔍 DEBUG - Key ends with:`, currentKey.substring(currentKey.length - 10));
  console.log(`🔍 DEBUG - Authorization header:`, authHeader.substring(0, 30) + '...');
  console.log(`🔍 DEBUG - Key type:`, typeof currentKey);
  console.log(`🔍 DEBUG - Key has spaces:`, currentKey.includes(' '));
  console.log(`🔍 DEBUG - Key has quotes:`, currentKey.includes('"') || currentKey.includes("'"));
  console.log(`🔍 DEBUG - Key spaces removed successfully:`, currentKey.length > 0);
  console.log(`🔍 DEBUG - Key has spaces after removal:`, currentKey.includes(' '));

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Attempt ${attemptNumber + 1} timed out after 30 seconds`);
      error.message = 'Request timed out after 30 seconds';
    } else {
      console.error(`Attempt ${attemptNumber + 1} failed:`, error.message);
    }
    
    // Try next API key
    if (attemptNumber < apiKeys.length - 1) {
      console.log(`Trying backup key ${attemptNumber + 2}...`);
      return makeApiCallWithBackup(endpoint, body, attemptNumber + 1);
    }
    
    throw error;
  }
};

// ============================================================================
// SIMPLIFIED SAFETY SYSTEM - Permissive by Default
// Only blocks: Adult+Minor, Immediate Danger, Non-Consensual Acts
// ============================================================================

// STEP 1: Pre-GPT Hard Blocks (Immediate Danger Only)
const IMMEDIATE_DANGER_CHECK = (message) => {
  const text = String(message || '').toLowerCase();

  // ONLY suicide/self-harm with clear intent
  const suicidePatterns = [
    /\b(took|swallowed|overdosed on) (pills|medication|meds)\b/i,
    /\bgonna (kill myself|end it)\b/i,
    /\bsuicide note\b/i,
    /\bcut (my|myself).*wrist/i
  ];

  // ONLY active violence happening right now
  const activeViolence = [
    /\b(he's|she's|they're) (hitting|beating|choking) me\b/i,
    /\b(just|currently) (beat|raped|assaulted) (me|her|him)\b/i
  ];

  if (suicidePatterns.some(p => p.test(text))) {
    return {
      triggered: true,
      category: 'suicide_immediate',
      message: 'Your safety is the priority. Please reach out for help.',
      resources: [
        '🆘 988 Suicide & Crisis Lifeline: Call or text 988',
        '🆘 Crisis Text Line: Text HOME to 741741'
      ]
    };
  }

  if (activeViolence.some(p => p.test(text))) {
    return {
      triggered: true,
      category: 'violence_immediate',
      message: 'This isn\'t drama, it\'s danger. Please reach out for help.',
      resources: [
        '🆘 National DV Hotline: 1-800-799-7233',
        '🆘 RAINN: 1-800-656-4673'
      ]
    };
  }

  return { triggered: false };
};

// STEP 2: Add Safety Check to GPT Prompt (Permissive Instructions)
// SAFETY_CHECK_PROMPT moved to prompts/brutalPrompt.js and imported dynamically

// STEP 3: Post-GPT Validation (Sanity Check)
const validateSafetyTrigger = (gptResponse, originalMessage) => {
  const text = String(originalMessage || '').toLowerCase();

  // If GPT didn't trigger, we're done
  if (!gptResponse?.safetyCheck?.triggered) {
    return { shouldTrigger: false };
  }

  // GPT triggered - verify with simple regex
  const category = gptResponse.safetyCheck.category;

  if (category === 'age_gap') {
    // Check for actual age gap (minor + adult)
    const ages = text.match(/\b(13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30)\b/g);
    if (!ages || ages.length < 2) return { shouldTrigger: false };

    const numericAges = ages.map(Number);
    const hasMinor = numericAges.some(age => age >= 13 && age <= 17);
    const hasAdult = numericAges.some(age => age >= 20);

    if (hasMinor && hasAdult) {
      // Confirm romantic/sexual context
      const romanticContext = /\b(dating|boyfriend|girlfriend|relationship|sex|love|kiss|hook.*up)\b/i.test(text);
      if (romanticContext) {
        return {
          shouldTrigger: true,
          category: 'age_gap_grooming',
          message: 'This conversation involves an age gap that raises safety concerns.',
          resources: [
            '🆘 RAINN: 1-800-656-4673',
            '🆘 Crisis Text Line: Text HOME to 741741'
          ]
        };
      }
    }
  }

  if (category === 'non_consensual') {
    // Check for actual non-consent language
    const nonConsentPatterns = [
      /\b(forced|made) me (to )?(have sex|do|perform)\b/i,
      /\bI said no but (he|she|they)\b/i,
      /\b(didn't|did not) consent\b/i,
      /\btold (him|her|them) to stop but\b/i
    ];

    if (nonConsentPatterns.some(p => p.test(text))) {
      return {
        shouldTrigger: true,
        category: 'non_consensual',
        message: 'This describes a non-consensual situation. Support is available.',
        resources: [
          '🆘 RAINN (Sexual Assault): 1-800-656-4673',
          '🆘 National DV Hotline: 1-800-799-7233'
        ]
      };
    }
  }

  // GPT triggered but we can't confirm - don't block
  console.log('⚠️ GPT flagged concern but validation failed - allowing through');
  return { shouldTrigger: false };
};

// Advanced OpenAI Integration - CLEANED VERSION
export const analyzeWithGPT = async (message, context, attemptNumber = 0) => {
  
  // Prevent infinite recursion - max 3 attempts (main + 2 backups)
  if (attemptNumber > 2) {
    console.error('Max retry attempts reached, using fallback analysis');
    return generateAdvancedResults(message, { ...context, context: 'Dating/Romantic' });
  }

  // Parse conversation sides for mode detection
  const { userText, otherText } = parseConversationSides(message, context);
  const detectedMode = detectToxicityMode(userText, otherText);
  
  console.log('🎭 Mode Detection Result:', {
    detectedMode,
    userText: userText.slice(0, 100),
    otherText: otherText.slice(0, 100)
  });
  
  // Smart context detection that considers both quiz input and message content
  let actualContext = 'Dating/Romantic'; // Default
  
  // Primary: Use quiz context if provided
  if (context?.context || context?.contextType || context?.relationshipType) {
    const quizContext = (context?.context || context?.contextType || context?.relationshipType).toLowerCase();
    if (quizContext === 'work') {
      actualContext = 'Work/Professional';
    } else if (quizContext === 'family') {
      actualContext = 'Family/Personal';
    } else if (quizContext === 'friends') {
      actualContext = 'Friendship';
    } else if (quizContext === 'dating' || quizContext === 'situationship' || quizContext === 'marriage' || quizContext === "don't know yet") {
      actualContext = 'Dating/Romantic';
    }
  } else {
    // Fallback: Analyze message content for context clues
    const detectedContext = detectContextMathematically(message);
    actualContext = detectedContext === 'workplace' ? 'Work/Professional' : 
                         detectedContext === 'family' ? 'Family/Personal' : 
                         detectedContext === 'friendship' ? 'Friendship' : 'Dating/Romantic';
  }
  
  // Special case: If quiz says dating but message clearly involves workplace
  const hasWorkplaceElements = message.toLowerCase().includes('boss') || 
                               message.toLowerCase().includes('manager') ||
                               message.toLowerCase().includes('coworker') ||
                               message.toLowerCase().includes('office');
  
  console.log('Context analysis:', {
    quizContext: context?.context,
    contextType: context?.contextType,
    relationshipType: context?.relationshipType,
    detectedContext: actualContext,
    hasWorkplaceElements,
    messagePreview: message.slice(0, 100)
  });

  // Get all available API keys from environment
  const apiKeys = [
    import.meta.env.VITE_OPENAI_API_KEY,
    import.meta.env.VITE_OPENAI_API_KEY_BACKUP1,
    import.meta.env.VITE_GOOGLE_API_KEY_BACKUP2,  // Gemini API as third backup
    import.meta.env.VITE_GOOGLE_API_KEY  // Use the existing Google key as backup
  ].filter(key => key && key.trim());
  
  console.log(`🔍 DEBUG - Environment variables check:`);
  console.log(`🔍 DEBUG - VITE_OPENAI_API_KEY exists:`, !!import.meta.env.VITE_OPENAI_API_KEY);
  console.log(`🔍 DEBUG - VITE_OPENAI_API_KEY_BACKUP1 exists:`, !!import.meta.env.VITE_OPENAI_API_KEY_BACKUP1);
  console.log(`🔍 DEBUG - VITE_GOOGLE_API_KEY_BACKUP2 exists:`, !!import.meta.env.VITE_GOOGLE_API_KEY_BACKUP2);
  console.log(`🔍 DEBUG - VITE_GOOGLE_API_KEY exists:`, !!import.meta.env.VITE_GOOGLE_API_KEY);
  console.log(`🔍 DEBUG - Total valid keys found:`, apiKeys.length);
  console.log(`🔍 DEBUG - Available keys:`, apiKeys.map((key, i) => `Key ${i+1}: ${key?.substring(0, 10)}...`));

  // If we've exhausted all keys, return fallback
  if (attemptNumber >= apiKeys.length) {
    console.log('All API keys exhausted, using fallback analysis');
    return generateAdvancedResults(message, { ...context, context: actualContext });
  }

  const currentKey = apiKeys[attemptNumber].replace(/\s/g, ''); // CRITICAL FIX: Remove ALL spaces!
  console.log(`Using API key attempt ${attemptNumber + 1} of ${apiKeys.length}`);
  
  // Validate API key format
  if (!currentKey || typeof currentKey !== 'string' || currentKey.length === 0) {
    console.error(`❌ Invalid API key at attempt ${attemptNumber + 1}:`, currentKey);
    throw new Error(`Invalid API key format at attempt ${attemptNumber + 1}`);
  }
  
  // Check if key starts with expected prefix
  if (!currentKey.startsWith('sk-') && !currentKey.startsWith('AIza')) {
    console.warn(`⚠️ API key doesn't start with expected prefix:`, currentKey.substring(0, 10) + '...');
  }

  // Determine provider based on current key
  const isGeminiKey = currentKey.startsWith('AIza');
  const provider = isGeminiKey ? 'google' : 'openai';
  
  // Get models
  const openAIModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const geminiModel = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-2.5-lite';
  const model = provider === 'openai' ? openAIModel : geminiModel;
  
  console.log('Provider determined from key:', { 
    provider, 
    model, 
    keyPrefix: currentKey.substring(0, 10) + '...',
    isGeminiKey 
  });

  try {
          console.log('Calling AI with context:', actualContext);
    // Import the working prompts - now fully dynamic
    const { brutalPrompt, SAFETY_CHECK_PROMPT } = await import('../prompts/brutalPrompt');

      // EXTRACT ACTUAL NAMES - ROBUST FOR SCREENSHOTS/HEADERS
      const extractNamesFromConversation = (text, context) => {
        // BLACKLIST: Only used for auto-detection validation
        const FORBIDDEN_NAMES = new Set([
          'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
          'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
          'delivered', 'edited', 'read', 'sent'
        ]);
        
        // Priority 1: If names explicitly provided, ALWAYS use them (even if "Wednesday")
        const userName = context?.userName || context?.user_name || context?.user_side;
        const otherName = context?.otherName || context?.other_name || context?.their_name;
        
        if (userName && otherName && userName.trim().length > 0 && otherName.trim().length > 0) {
          console.log('✅ Using EXPLICIT names (trusted):', { userName, otherName });
          return {
            user: userName.trim(),
            other: otherName.trim()
          };
        }
        
        // Only auto-detect if NO explicit names
        console.log('ℹ️ No explicit names, running auto-detection');
        
        const lines = text.split('\n').filter(line => line.trim());
        const speakers = new Map();
        
        for (const line of lines) {
          const patterns = [
            /^([^:]+):/,                    
            /^([^(]+)\s*\([^)]+\):/,       
            /^([^:]+):\s*/                  
          ];
          
          for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
              const speaker = match[1].trim();
              const speakerLower = speaker.toLowerCase();
              
              // SMART CHECK: Is this a timestamp disguised as a name?
              const hasTimestamp = /\d|am|pm/i.test(speaker);
              const isBlacklisted = FORBIDDEN_NAMES.has(speakerLower);
              
              // Skip if it's blacklisted AND has timestamp indicators
              if ((isBlacklisted && hasTimestamp) || 
                  speaker.length < 2 || 
                  speaker.length > 20) {
                continue;
              }
              
              speakers.set(speakerLower, speaker);
              break;
            }
          }
        }
        
        const speakerArray = Array.from(speakers.values());
        const actualNames = speakerArray.filter(s => 
          !['me', 'i', 'myself', 'her', 'him', 'them', 'they'].includes(s.toLowerCase())
        );
        // Use detected names to fill any missing explicit values
        let detectedUser = actualNames.length >= 2 ? actualNames[1] : null;
        let detectedOther = actualNames.length >= 2 ? actualNames[0] : (actualNames.length === 1 ? actualNames[0] : null);
        const finalUser = (userName && userName.trim()) || detectedUser || 'You';
        // If otherName not given, pick the first detected name that isn't finalUser
        let autoOther = detectedOther;
        if (!autoOther && actualNames.length > 0) {
          autoOther = actualNames.find(n => n.toLowerCase() !== String(finalUser).toLowerCase()) || null;
        }
        const finalOther = (otherName && otherName.trim()) || autoOther || 'Them';
        console.log('✅ FINAL NAME ASSIGNMENT:', { user: finalUser, other: finalOther, detected: actualNames });
        return { user: finalUser, other: finalOther };
      };
      
      // BUILD CLEAN CONTEXT - SINGLE SOURCE OF TRUTH
      const buildCleanContext = (message, context) => {
        // Simple and clear - no complex logic
        const names = extractNamesFromConversation(message, context);
        // VALIDATE against explicit user selection
        if (context?.user_name || context?.user_side) {
          const expectedUser = context?.user_name || context?.user_side;
          if (names.user !== expectedUser) {
            console.error('❌ NAME EXTRACTION MISMATCH! Forcing expected user');
            names.user = expectedUser;
          }
        }

        return {
          // Single source of truth for names
          userName: names.user,
          otherName: names.other,
          
          // Pronouns
          userPronouns: context?.userPronouns || context?.known_pronouns?.user || 'they/them',
          otherPronouns: context?.otherPartyPronouns || context?.known_pronouns?.other_party || 'they/them',
          
          // Core context
          relationshipType: context?.context_type || context?.contextType || context?.relationshipType || context?.context?.toLowerCase() || 'dating',
          background: context?.background || context?.background_context || '',
          userQuestion: context?.userQuestion || '',
          gutFeeling: context?.gutFeel || context?.gut_feeling || '',
          
          // The actual conversation
          conversation: message
        };
      };
      
      const cleanContext = buildCleanContext(message, context);
      const actualUserName = cleanContext.userName;
      const actualOtherName = cleanContext.otherName;

      // Validate names before sending to AI (guard against field-name leakage)
      if (['chat_excerpt', 'message', 'transcript', 'conversation'].includes(String(cleanContext.otherName).toLowerCase())) {
        console.error('❌ CRITICAL ERROR: Field name used as person name!');
        const conversationNames = message.match(/^([A-Za-z]+)\s*[\(:]/gm)
          ?.map(m => m.match(/^([A-Za-z]+)/)[1])
          ?.filter(n => n !== cleanContext.userName);
        if (conversationNames && conversationNames.length > 0) {
          cleanContext.otherName = conversationNames[0];
          console.log('🔧 Emergency fix applied, using:', cleanContext.otherName);
        }
      }

      // CRITICAL: Pre-GPT immediate danger check ONLY (permissive system)
      const immediateDanger = IMMEDIATE_DANGER_CHECK(message) || checkImmediateDanger?.(message) || { triggered: false };
      if (immediateDanger.triggered) {
        console.log('🚨 IMMEDIATE DANGER DETECTED:', immediateDanger.category);
        return {
          mode: 'safety_override',
          safetyOverride: immediateDanger,
          archetype: 'Emergency Support 🆘',
          verdict: immediateDanger.message,
          realTea: 'Your safety matters most right now.',
          wastingTime: 0,
          actuallyIntoYou: 0,
          redFlags: 10,
          confidenceScore: 100,
          confidenceRemark: 'SAFETY PRIORITY',
          yourMove: ['Reach out for professional help', 'Your safety matters most'],
          prophecy: 'Next: prioritize your wellbeing',
          redFlagTags: ['crisis situation'],
          deepDive: { valence: 'red' },
          immunityTraining: { riskLevel: 'high', safetyNote: immediateDanger.message },
          resources: immediateDanger.resources,
          userName: actualUserName,
          otherName: actualOtherName
        };
      }

      // SAGE VOICE ENFORCEMENT - purely dynamic
      let voiceOverride = '';
      if (!context?.purePropmt) {
        voiceOverride = `🔮 SAGE VOICE ENFORCEMENT - SMART SAFETY DETECTION:
• PRIORITY 1: Distinguish genuine crisis from testing/jokes using context clues
• GENUINE CRISIS indicators: recent events, specific details, emotional distress, help-seeking  
• TEST/JOKE indicators: vague scenarios, "asking for a friend", obvious testing language, hypotheticals
• If GENUINE CRISIS: Full safety override, caring voice, NO analysis, provide resources
• If TEST DETECTED: Sassy call-out + brief safety mention: "Nice try, but real talk - resources exist if needed"
• CRITICAL: Detect who is toxic before assigning blame. Use mode detection.
• SELF-RECEIPT mode: "Babe, let me be real with you..." (validate user but address their behavior)
• MIXED mode: "You both got some work to do..." (balanced call-out)
• MIRROR mode: "This whole situation is a mess..." (systemic issues)
• HEALTHY mode: "Disgusting but effective. Keep it up." (exhausted support)
• NEVER say user is "embarrassing/desperate/crazy" - always target the BEHAVIOR
• Use therapy-speak alternatives: house rules not boundaries, speak up not communicate
• Extract names from conversation dynamically - use USER/OTHER or actual names consistently
• Every response should feel personalized, never template-based`;
      }
      
      // Create a clean conversation string and narrative payload to avoid field-name extraction
      const cleanConversation = message
        .replace(/chat[_\s]excerpt/gi, 'CONVERSATION')
        .replace(/^\s*{\s*\"/, '')
        .replace(/\"\s*}\s*$/, '');

      const userPayload = {
        ACTUAL_MESSAGES: cleanConversation,
        PEOPLE_IN_CONVERSATION: {
          YOUR_BESTIE_WHO_NEEDS_ADVICE: cleanContext.userName,
          PERSON_BEING_ANALYZED: cleanContext.otherName,
          NEVER_USE_THESE_WORDS: ["chat_excerpt", "message", "transcript"]
        },
        CONTEXT: {
          names: `${cleanContext.userName} is asking about ${cleanContext.otherName}`,
          relationship: cleanContext.relationshipType,
          background: cleanContext.background || context?.background || ''
        }
      };
      console.log('🎯 FINAL NAME ASSIGNMENT CHECK:', {
        userSelectedAs: cleanContext.userName,
        otherIdentifiedAs: cleanContext.otherName,
        promptWillReceive: {
          bestieAskingForAdvice: cleanContext.userName,
          personBeingAnalyzed: cleanContext.otherName
        },
        criticalContext: `USER: ${cleanContext.userName} | OTHER: ${cleanContext.otherName}`
      });
      const userContent = `
CONVERSATION BETWEEN ${cleanContext.userName} AND ${cleanContext.otherName}:
${cleanConversation}

IMPORTANT: 
- ${cleanContext.userName} is your bestie asking for advice
- ${cleanContext.otherName} is the person to analyze
- NEVER use the words "chat excerpt" or any field names
- The actual names are ${cleanContext.userName} and ${cleanContext.otherName}
`;

      console.log('API Request selection:', { provider, openAIModel, geminiModel });


    let rawContent = '';
    if (provider === 'openai') {
      // Use Chat Completions API for all models
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const messages = [
        { role: 'system', content: brutalPrompt },
        { role: 'system', content: SAFETY_CHECK_PROMPT },
        { role: 'user', content: userContent }
      ];
      
      if (voiceOverride) {
        messages.splice(1, 0, { role: 'system', content: voiceOverride });
      }
      
      const body = {
        model: openAIModel,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
        presence_penalty: 0.3,
        frequency_penalty: 0.4,
        response_format: { type: 'json_object' }
      };
      
      const data = await makeApiCallWithBackup(endpoint, body);
      console.log('OpenAI response meta:', { endpoint, hasChoices: !!data?.choices, usage: data?.usage });
      rawContent = data.choices?.[0]?.message?.content || '';
    } else {
      // Google Gemini with structured output
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${currentKey}`;
      
      const promptText = voiceOverride 
        ? `${brutalPrompt}\n\n${SAFETY_CHECK_PROMPT}\n\n${voiceOverride}\n\n${userContent}` 
        : `${brutalPrompt}\n\n${SAFETY_CHECK_PROMPT}\n\n${userContent}`;
      
      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 1500
        }
      };
      
      // Add timeout to Gemini API calls
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error ${response.status}:`, errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Gemini response meta:', { hasCandidates: !!data?.candidates, promptFeedback: !!data?.promptFeedback });
      rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    console.log('AI rawContent length:', rawContent?.length || 0);
    let result;
    // Minimal cleaning - just remove markdown code blocks
    let cleanContent = rawContent?.trim();
    cleanContent = cleanContent?.replace(/^```json\s*/i, '');
    cleanContent = cleanContent?.replace(/\s*```\s*$/i, '');
    
    try {
      result = JSON.parse(cleanContent);
      console.log('✅ AI Analysis parsed successfully');
    } catch (parseError) {
      // Try to find and parse the JSON object
      const jsonMatch = cleanContent?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
          console.log('✅ AI Analysis parsed from extracted JSON');
        } catch (e2) {
          console.error('❌ JSON parsing completely failed, using fallback');
          return generateAdvancedResults(message, { ...context, context: actualContext });
        }
      } else {
        console.error('❌ No JSON found in response, using fallback');
        return generateAdvancedResults(message, { ...context, context: actualContext });
      }
    }
    
    // NEW PARSING STRUCTURE for master prompt response
    console.log('Raw API result structure:', Object.keys(result || {}));
    
    // Key repair function to handle common variations
    const repairKeys = (obj) => {
      if (obj?.truthReceipt?.prediction && !obj.truthReceipt.prophecy) {
        obj.truthReceipt.prophecy = obj.truthReceipt.prediction;
      }
      if (obj?.truthReceipt?.yourMoves && !obj.truthReceipt.yourMove) {
        obj.truthReceipt.yourMove = obj.truthReceipt.yourMoves;
      }
      return obj;
    };

    // Apply key repairs
    const repairedResult = repairKeys(result);
    
    // Extract the new structure
    const safetyOverride = repairedResult.safetyOverride || {};
    const truthReceipt = repairedResult.truthReceipt || {};
    const deepDive = repairedResult.deepDive || {};
    const immunityTraining = repairedResult.immunityTraining || {};
    const sagesSeal = repairedResult.sagesSeal || {};

    // Check for safety override - handle based on severity
    if (safetyOverride.triggered) {
      if (safetyOverride.severity === 'genuine_crisis') {
        // Full safety override for genuine crisis
        return {
          mode: 'safety_override',
          safetyOverride: safetyOverride,
          archetype: 'Emergency Support 🛡️',
          verdict: safetyOverride.message || 'Your safety is the priority right now.',
          realTea: safetyOverride.message || 'This goes beyond relationship analysis.',
          wastingTime: 0,
          actuallyIntoYou: 0, 
          redFlags: 10,
          confidenceScore: 100,
          confidenceRemark: 'SAFETY PRIORITY',
          yourMove: ['Reach out for professional help', 'Your safety matters most'],
          prophecy: 'Next: prioritize your wellbeing',
          redFlagTags: ['safety concern'],
          deepDive: { valence: 'red' },
          immunityTraining: { riskLevel: 'high', safetyNote: safetyOverride.message }
        };
      } else if (safetyOverride.severity === 'test_detected') {
        // Continue with regular analysis but include safety acknowledgment
        console.log('Safety test detected, continuing with regular analysis but noting safety resources');
      }
    }

    // Check if this is a crisis situation for metrics override
    const isCrisisArchetype = (truthReceipt.archetype || result.archetype || '').includes('Emergency Support') || 
                             (truthReceipt.archetype || result.archetype || '').includes('Crisis');

    // POST-GPT VALIDATION of safety (permissive): verify any GPT safetyCheck
    const postValidation = validateSafetyTrigger(result, message) || validateGPTSafety?.(result, message) || { shouldTrigger: false };
    if (postValidation.shouldTrigger) {
      console.log('🚨 SAFETY CONFIRMED (post-GPT):', postValidation.category);
      return {
        mode: 'safety_override',
        safetyOverride: postValidation,
        archetype: 'Safety Concern Detected 🛡️',
        verdict: postValidation.message,
        realTea: 'This situation requires careful attention.',
        wastingTime: 0,
        actuallyIntoYou: 0,
        redFlags: 10,
        confidenceScore: 100,
        confidenceRemark: 'SAFETY PRIORITY',
        yourMove: ['Talk to a trusted adult', 'Reach out for support'],
        prophecy: 'Next: prioritize your safety',
        redFlagTags: [postValidation.category],
        resources: postValidation.resources
      };
    }

    // Transform to match existing component expectations (wrapped in analysis object)
    let finalResult = {
      // Core truth receipt fields (directly at root level for compatibility)
      mode: truthReceipt.mode || detectedMode.toLowerCase() || 'mirror', // Use detected mode
      safetyOverride: safetyOverride, // Include safety info
      archetype: truthReceipt.archetype || result.archetype || 'The Analyzer 🔮',
      verdict: truthReceipt.verdict || result.verdict || 'Analysis in progress...',
      realTea: truthReceipt.realTea || (result.teaAndMovePlay ? result.teaAndMovePlay.slice(0, 2).join(' ') : 'Tea is brewing...'),
      // Crisis metrics override
      // Defaults set to 0 to avoid false positives on healthy conversations
      wastingTime: isCrisisArchetype ? 0 : Math.max(0, Math.min(100, truthReceipt.wastingTime || result.wastingTime || 0)),
      actuallyIntoYou: isCrisisArchetype ? 0 : Math.max(0, Math.min(100, truthReceipt.actuallyIntoYou || result.actuallyIntoYou || 0)),
      redFlags: isCrisisArchetype ? 10 : Math.max(0, Math.min(10, truthReceipt.redFlags || result.redFlags || 0)),
      confidenceScore: Math.max(0, Math.min(100, truthReceipt.confidenceScore || result.confidenceScore || 85)),
      confidenceRemark: truthReceipt.confidenceRemark || result.confidenceRemark || 'CONFUSED',
      yourMove: Array.isArray(truthReceipt.yourMove) ? truthReceipt.yourMove.slice(0, 2) : (result.teaAndMovePlay ? result.teaAndMovePlay.slice(2, 4) : ['Check back later', 'Try again']),
      prophecy: truthReceipt.prophecy || result.prophecy || 'Analysis pending...',
      
      // Map brutalPrompt fields
      teaAndMovePlay: result.teaAndMovePlay || truthReceipt.teaAndMovePlay,
      redFlagChips: result.redFlagChips || truthReceipt.redFlagChips || [],
      
      // New fields from master prompt  
      patternNumber: truthReceipt.patternNumber || result.patternNumber || Math.floor(Math.random() * 99) + 1,
      redFlagTags: truthReceipt.redFlagTags || result.redFlagChips || [],
      accuracyEstimate: Math.max(0, Math.min(100, truthReceipt.accuracyEstimate || 85)),
      gotThisCountToday: truthReceipt.gotThisCountToday || Math.floor(Math.random() * 5000) + 1000,
      gotThisPercentToday: Math.max(0, Math.min(100, truthReceipt.gotThisPercentToday || 25)),
      trendWeekDelta: Math.max(-100, Math.min(100, truthReceipt.trendWeekDelta || 0)),
      jokeDetection: truthReceipt.jokeDetection || { isWeaponizedHumor: false, type: '', example: '', risk: 0 },
      
      // Deep Dive v2.2 structure - pass through new schema
      deepDive: deepDive.valence ? deepDive : {
        // Fallback for old structure compatibility
        patternExpose: deepDive.patternExpose || '',
        theirGame: deepDive.theirGame || '',
        whyYoureStuck: deepDive.whyYoureStuck || '',
        yourPattern: deepDive.yourPattern || '',
        finalRead: deepDive.finalRead || ''
      },
      
      immunityTraining: immunityTraining.riskLevel ? immunityTraining : {
        // Fallback for old structure compatibility
        redFlagDrills: immunityTraining.redFlagDrills || '',
        patternBreakers: immunityTraining.patternBreakers || '',
        immunityShield: immunityTraining.immunityShield || '',
        earlyWarnings: immunityTraining.earlyWarnings || '',
        exitStrategy: immunityTraining.exitStrategy || '',
        // Add new universal schema fields for compatibility
        riskLevel: truthReceipt.redFlags <= 3 ? 'low' : truthReceipt.redFlags <= 6 ? 'medium' : 'high',
        whatGoodLooksLike: [],
        menuOfMoves: [],
        twoWeekExperiment: {},
        selfCheck: [],
        safetyNote: "Only you decide next steps. If you feel unsafe, limit contact and reach out to trusted support."
      },
      
      sagesSeal: {
        content: sagesSeal.content || 'Your peace is premium.',
        mood: sagesSeal.mood || 'protective',
        shareCaption: sagesSeal.shareCaption || 'Stamped with Sage\'s Seal 🔮'
      }
    };
    
    // Apply metrics validation and UI sanitization
    finalResult = validateMetrics(finalResult);
    finalResult = sanitizeResult(finalResult);
    
    console.log('Final AI result keys to return:', Object.keys(finalResult));
    console.log('Mode used:', finalResult.mode, 'Detected mode:', detectedMode);
    return finalResult;
    
  } catch (error) {
    console.error(`Attempt ${attemptNumber + 1} failed:`, error.message);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      context: actualContext,
      attemptNumber: attemptNumber + 1,
      totalKeys: apiKeys.length
    });
    
    // Try next API key
    if (attemptNumber < apiKeys.length - 1) {
      console.log(`Trying backup key ${attemptNumber + 2}...`);
      return analyzeWithGPT(message, context, attemptNumber + 1);
    }
    
    // All keys failed, use fallback
    console.log('All API keys failed, using fallback');
    return generateAdvancedResults(message, { ...context, context: actualContext });
  }
};

// Fallback analysis function - KEEP STRUCTURE
export const generateAdvancedResults = (message, context) => {
  // Basic scoring logic (simplified)
  const lowerCaseMessage = message.toLowerCase();
  let interest = 50;
  let manipulation = 10;
  let availability = 50;
  
  // Simple keyword analysis
  const positiveKeywords = ['?', 'tonight', 'tomorrow', 'excited', 'can\'t wait', 'when', 'where', 'what time'];
  const negativeKeywords = ['busy', 'maybe', 'idk', 'we\'ll see', 'k', 'lol', 'haha'];
  const manipulationKeywords = ['miss you', 'thinking of you', 'u up?', 'wyd', 'bored'];

  positiveKeywords.forEach(word => {
    if (lowerCaseMessage.includes(word)) interest += 8;
  });
  
  negativeKeywords.forEach(word => {
    if (lowerCaseMessage.includes(word)) interest -= 12;
  });
  
  manipulationKeywords.forEach(word => {
    if (lowerCaseMessage.includes(word)) manipulation += 15;
  });

  // Basic profile detection
  let profileKey = 'breadcrumber';
  if (interest > 80) profileKey = 'genuine_gem';
  if (manipulation > 70) profileKey = 'player';
  if (interest < 30) profileKey = 'ghoster';
  
  const profile = profiles[profileKey];

  // Return Sage-style error state - no fake analysis
  const fallbackResult = {
    archetype: 'Technical Difficulties 🔮',
    verdict: 'Bestie, my crystal ball needs a recharge',
    realTea: 'The WiFi gods are not cooperating right now',
    wastingTime: 0,
    actuallyIntoYou: 0,
    redFlags: 0,
    yourMove: ['Hit refresh and try again', 'Give it another shot in a sec'],
    prophecy: 'I\'ll be back with the tea in just a moment'
  };
  
  console.log('Fallback result to return:', fallbackResult);
  return sanitizeResult(fallbackResult);
};

// Function to generate ALIGNED results for premium users (same analysis for Share Shot + Deep Dive)
export const generateAlignedResults = async (message, context) => {
  const startTime = performance.now();
  console.log('🔄 Starting 3-API analysis system...');
  
  // Smart content truncation for long inputs (5000+ characters)
  const MAX_INPUT_LENGTH = 8000; // allow longer screenshot transcripts while keeping headroom
  let processedMessage = message;
  if (message.length > MAX_INPUT_LENGTH) {
    console.log(`📝 Input too long (${message.length} chars), truncating to ${MAX_INPUT_LENGTH} chars`);
    // Keep the beginning and end for context
    const start = message.substring(0, MAX_INPUT_LENGTH * 0.6);
    const end = message.substring(message.length - MAX_INPUT_LENGTH * 0.4);
    processedMessage = start + '\n\n[... content truncated for performance ...]\n\n' + end;
  }
  
  // Build clean context for all API calls
  const buildCleanContext = (message, context) => {
    const extractNamesFromConversation = (text, context) => {
      // Priority 0: Respect explicit main user selection
      const explicitMain = context?.selectedMainUser || context?.mainUser || context?.main_user;
      if (explicitMain) {
        const lines = text.split('\n').filter(line => line.trim());
        const speakers = new Set();
        for (const line of lines) {
          const matchA = line.match(/^([^:]+):/);
          const matchB = line.match(/^([^(]+)\s*\([^)]+\):/);
          const speaker = (matchA?.[1] || matchB?.[1] || '').trim();
          if (speaker) speakers.add(speaker);
        }
        const speakerList = Array.from(speakers);
        const other = speakerList.find(n => n.toLowerCase() !== String(explicitMain).toLowerCase())
                      || context?.otherName || context?.other_name || 'they';
        return { user: String(explicitMain), other };
      }

      // Priority 1: Check ALL possible field name formats (CRITICAL FIX)
      const userName = context?.userName || context?.user_name || context?.user_side;
      const otherName = context?.otherName || context?.other_name || context?.their_name;
      
      console.log('🔍 Name Detection:', { userName, otherName, context });
      
      if (userName && otherName) {
        return {
          user: userName.trim(),
          other: otherName.trim()
        };
      }
      
      // Priority 2: Check for color-based identification (for screenshots)
      if (context?.colorMapping) {
        console.log('🎨 Color mapping detected:', context.colorMapping);
        // Example: "blue = Piet, grey = Nanna"
        const mappings = context.colorMapping.split(',').map(m => {
          const [color, name] = m.split('=').map(s => s.trim());
          return { color, name };
        });
        
        console.log('🎨 Parsed color mappings:', mappings);
        
        // Use first mapping for user, second for other
        if (mappings.length >= 2) {
          const result = {
            user: mappings[0].name,
            other: mappings[1].name
          };
          console.log('🎨 Color mapping result:', result);
          return result;
        }
      }
      
      // Priority 2.5: Narrative mode detection
      if (context?.inputFormat === 'narrative' || context?.isNarrative) {
        // In narrative mode, "I/me/my" = user, first mentioned name or they/them = other
        const narrativeText = text.toLowerCase();
        const otherNameMatch = text.match(/(?:with |about |from |to )([A-Z][a-z]+)/);
        
        return {
          user: context?.userName || 'You',
          other: context?.otherName || otherNameMatch?.[1] || 'Them'
        };
      }
      
      // Priority 3: Auto-detect from conversation patterns
      const lines = text.split('\n').filter(line => line.trim());
      const speakers = new Map();
      
      // Look for patterns like "Name:", "Name (time):", etc.
      for (const line of lines) {
        const patterns = [
          /^([^:]+):/,                    // "Name:"
          /^([^(]+)\s*\([^)]+\):/,       // "Name (time):"
          /^([^:]+):\s*/                  // "Name: "
        ];
        
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            const speaker = match[1].trim();
            if (speaker && speaker.length > 0 && speaker.length < 20) {
              speakers.set(speaker.toLowerCase(), speaker);
            }
            break;
          }
        }
      }
      
      // Identify speakers
      const speakerArray = Array.from(speakers.values());
      
      // Smart detection: First non-pronoun name is likely "other", second is "user"
      const pronouns = ['me', 'i', 'myself', 'her', 'him', 'them', 'they'];
      const actualNames = speakerArray.filter(s => 
        !pronouns.includes(s.toLowerCase()) && s.length > 1
      );
      
      if (actualNames.length >= 2) {
        return {
          user: actualNames[1],  // Second speaker is often the user
          other: actualNames[0]  // First speaker is often who initiated
        };
      } else if (actualNames.length === 1) {
        return {
          user: userName || 'You',
          other: actualNames[0]
        };
      }
      
      // Fallback with partial context
      return {
        user: userName || 'You',
        other: otherName || 'they'
      };
    };
    
    const names = extractNamesFromConversation(message, context);
    
    // Handle narrative mode name detection
    if (context?.inputFormat === 'narrative') {
      // Override with narrative logic: I/me = user, they/them = other
      if (!names.user || names.user === 'You') {
        names.user = context?.userName || 'You';
      }
      if (!names.other || names.other === 'they') {
        // Try to extract mentioned name from narrative
        const nameMatch = message.match(/(?:about|with|from) ([A-Z][a-z]+)/);
        names.other = context?.otherName || nameMatch?.[1] || 'Them';
      }
    }
    
    return {
      // Single source of truth for names - prioritize context over extraction
      userName: context?.userName || names.user,
      otherName: context?.otherName || names.other,
      
      // Pronouns
      userPronouns: context?.userPronouns || context?.known_pronouns?.user || 'they/them',
      otherPronouns: context?.otherPartyPronouns || context?.known_pronouns?.other_party || 'they/them',
      
      // Core context
      relationshipType: context?.contextType || context?.relationshipType || context?.context?.toLowerCase() || 'dating',
      background: context?.background || context?.background_context || '',
      userQuestion: context?.userQuestion || '',
      gutFeeling: context?.gutFeel || context?.gut_feeling || '',
      
      // The actual conversation
      conversation: message,
      
      // Input format tracking for narrative mode
      inputFormat: context?.inputFormat,
      isNarrative: context?.isNarrative,
      narrativeDisclaimer: context?.narrativeDisclaimer
    };
  };
  
  const cleanContext = buildCleanContext(message, context);
  
  // API Call 1: Truth Receipt (Main Analysis)
  const api1Start = performance.now();
  console.log('📊 API Call 1: Truth Receipt analysis...');
  const shareShotAnalysis = await analyzeWithGPT(processedMessage, cleanContext, 0);
  const api1Time = performance.now() - api1Start;
  console.log(`✅ Truth Receipt complete in ${(api1Time / 1000).toFixed(2)}s`);

  // API Call 2 and 3 in parallel: Deep Dive and Immunity Training
  const runDeepDive = async () => {
    const api2Start = performance.now();
    console.log('🔍 API Call 2: Deep Dive analysis...');
    let alignedDeepDive = null;
    const deepDiveTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Deep Dive timeout after 25 seconds')), 25000));
    try {
      const { deepDivePrompt } = await import('../prompts/deepDivePrompt');
      const deepDiveSystemPrompt = deepDivePrompt(shareShotAnalysis.archetype, message, shareShotAnalysis.redFlags, shareShotAnalysis.confidenceRemark)
        .replace(/\{userName\}/g, cleanContext.userName || 'You')
        .replace(/\{otherName\}/g, cleanContext.otherName || 'they');
      const apiKeys = [import.meta.env.VITE_OPENAI_API_KEY, import.meta.env.VITE_OPENAI_API_KEY_BACKUP1, import.meta.env.VITE_GOOGLE_API_KEY_BACKUP2].filter(key => key && key.trim());
      const currentKey = apiKeys[0]?.replace(/\s/g, '');
      const provider = currentKey?.startsWith('AIza') ? 'google' : 'openai';
      const cacheKey = `deepDiveV4:${shareShotAnalysis.archetype}:${encodeURIComponent(message.slice(0,100))}`;
      console.info('🔍 DEEP DIVE TELEMETRY:', { promptVersion: 'deepDiveV4', usedPromptId: 'deepDivePrompt.js', cacheKey, provider, archetype: shareShotAnalysis.archetype, redFlags: shareShotAnalysis.redFlags, messageLength: message.length, systemPromptLength: deepDiveSystemPrompt.length });
      console.log('🔧 Deep Dive using provider:', provider);
      const openAIModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
      const geminiModel = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-2.5-lite';
      let rawContent = '';
      if (provider === 'openai') {
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const body = { model: openAIModel, messages: [ { role: 'system', content: deepDiveSystemPrompt }, { role: 'user', content: `Return JSON only. Do not include explanations.\n\nTEXTS:\n${processedMessage}` } ], temperature: 0.8, max_completion_tokens: 1200, response_format: { type: 'json_object' } };
        console.log('🔧 OpenAI Deep Dive request:', { endpoint, model: openAIModel });
        const data = await Promise.race([ makeApiCallWithBackup(endpoint, body), deepDiveTimeout ]);
        rawContent = data.choices?.[0]?.message?.content || '';
        console.log('🔧 OpenAI Deep Dive response length:', rawContent.length);
      } else {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${currentKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(geminiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: deepDiveSystemPrompt + `\n\nTEXTS:\n${message}` }] }], generationConfig: { temperature: 1.2, maxOutputTokens: 2000 } }), signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();
        rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
      try { alignedDeepDive = JSON.parse(rawContent); } catch { const m = rawContent.match(/\{[\s\S]*\}/); if (m) alignedDeepDive = JSON.parse(m[0]); }
      // aggressive banned n-gram rejection removed; handled by sanitizeDeepDive
      const sanitizeDeepDive = (dd) => {
        if (!dd) return null;
        const BANNED_PATTERNS = /\[placeholder\]|\[template\]|\[pending\]|analysis in progress|pattern continuation predicted/i;
        const sanitizeField = (value, defaultValue) => {
          if (!value || typeof value !== 'string' || BANNED_PATTERNS.test(value)) return defaultValue;
          return value;
        };
        if (dd.verdict) {
          dd.verdict.act = sanitizeField(dd.verdict.act, shareShotAnalysis?.archetype || "Mixed Signal Territory");
          dd.verdict.subtext = sanitizeField(dd.verdict.subtext, "Let's break down what's really happening here");
        }
        if (dd.receipts && Array.isArray(dd.receipts)) {
          dd.receipts = dd.receipts.map((r) => ({
            quote: sanitizeField(r.quote, "Pattern observed in conversation"),
            bestie_look: sanitizeField(r.bestie_look, "Notice how they're controlling the narrative here"),
            calling_it: sanitizeField(r.calling_it, "They'll keep this pattern going"),
            vibe_check: sanitizeField(r.vibe_check, "Try being direct and watch what happens")
          }));
        }
        if (dd.physics) {
          dd.physics.you_bring = sanitizeField(dd.physics.you_bring, "Your genuine interest and emotional availability");
          dd.physics.they_exploit = sanitizeField(dd.physics.they_exploit, "Your patience and willingness to accept uncertainty");
          dd.physics.result = sanitizeField(dd.physics.result, "You're doing all the emotional work while they maintain control");
        }
        if (dd.playbook) {
          dd.playbook.next_48h = sanitizeField(dd.playbook.next_48h, "Watch for their next move - it'll follow the same pattern");
          dd.playbook.your_move = sanitizeField(dd.playbook.your_move, "Ask one direct question. Make one clear boundary. Notice their response.");
        }
        dd.sages_seal = sanitizeField(dd.sages_seal, shareShotAnalysis?.confidenceRemark === 'TOXIC AF' ? "Trust your gut. Red flags aren't confetti." : "Actions over words. Every single time.");
        return dd;
      };
      alignedDeepDive = sanitizeDeepDive(alignedDeepDive);
      if (!alignedDeepDive) {
        console.log('🔄 Deep Dive failed - creating fallback structure based on main analysis');
        alignedDeepDive = { mode: "mirror", verdict: { act: shareShotAnalysis.archetype || "Communication Territory", subtext: `${shareShotAnalysis.redFlags || 0} red flags detected` }, receipts: [ { quote: "Pattern analysis in progress", pattern: "Communication Style", cost: "Clarity needed" } ], physics: { you_bring: "Genuine interest and questions", they_exploit: "Your patience and understanding", result: "Mixed signals and confusion" }, playbook: { next_48h: "Ask one direct question about intentions", next_week: "Notice if actions match their words", trump_card: "Calendar test - suggest specific plans" }, sages_seal: shareShotAnalysis.confidenceRemark === 'TOXIC AF' ? "Trust your gut. Red flags aren't confetti." : "Actions over words. Every single time.", red_flag_tags: shareShotAnalysis.redFlagTags || [], metrics: { wastingTime: shareShotAnalysis.wastingTime || 0, actuallyIntoYou: shareShotAnalysis.actuallyIntoYou || 0, redFlags: shareShotAnalysis.redFlags || 0 }, next_move_script: shareShotAnalysis.redFlags > 5 ? "Say: 'I need consistency, not confusion.'" : null };
      }
    } catch (e) {
      if (e.message?.includes('timeout')) {
        console.warn('⏰ Deep Dive timed out after 15 seconds - using fallback');
      } else {
        console.error('🚨 DEEP DIVE GENERATION FAILED:', e);
        console.error('Error details:', e.message);
      }
      alignedDeepDive = { mode: "mirror", verdict: { act: shareShotAnalysis.archetype || "Communication Territory", subtext: "Analysis incomplete - try again" }, receipts: [ { quote: "API connection issue", pattern: "Technical Difficulty", cost: "Retry needed" } ], physics: { you_bring: "Patience during technical issues", they_exploit: "System limitations", result: "Temporary analysis unavailable" }, playbook: { next_48h: "Refresh and try analysis again", next_week: "Check connection and retry", trump_card: "Manual pattern recognition" }, sages_seal: "Technical hiccup. Your situation is still valid.", red_flag_tags: [], metrics: { wastingTime: 0, actuallyIntoYou: 0, redFlags: 0 }, next_move_script: null };
    }
    const api2Time = performance.now() - api2Start;
    console.log(`✅ Deep Dive complete in ${(api2Time / 1000).toFixed(2)}s`);
    return alignedDeepDive;
  };

  const runImmunity = async () => {
    const api3Start = performance.now();
    console.log('🛡️ API Call 3: Immunity Training...');
    let immunityTraining = null;
    try {
      const { immunityPrompt } = await import('../prompts/immunityPrompt');
      const immunitySystemPrompt = immunityPrompt
        .replace(/\{archetype\}/g, shareShotAnalysis.archetype)
        .replace(/\{message\}/g, message)
        .replace(/\{redFlags\}/g, String(shareShotAnalysis.redFlags))
        .replace(/\{confidenceRemark\}/g, shareShotAnalysis.confidenceRemark)
        .replace(/\{userName\}/g, cleanContext.userName || 'You')
        .replace(/\{otherName\}/g, cleanContext.otherName || 'they');
      const apiKeys = [import.meta.env.VITE_OPENAI_API_KEY, import.meta.env.VITE_OPENAI_API_KEY_BACKUP1, import.meta.env.VITE_GOOGLE_API_KEY_BACKUP2].filter(key => key && key.trim());
      const currentKey = apiKeys[0]?.replace(/\s/g, '');
      const provider = currentKey?.startsWith('AIza') ? 'google' : 'openai';
      const openAIModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
      const geminiModel = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-2.5-lite';
      let rawContent = '';
      if (provider === 'openai') {
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const body = { model: openAIModel, messages: [ { role: 'system', content: immunitySystemPrompt }, { role: 'user', content: `TEXTS:\n${processedMessage}` } ], temperature: 0.7, max_completion_tokens: 1000, response_format: { type: 'json_object' } };
        const data = await makeApiCallWithBackup(endpoint, body);
        rawContent = data.choices?.[0]?.message?.content || '';
        console.log('🛡️ Immunity Training response length:', rawContent.length);
      } else {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${currentKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(geminiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: immunitySystemPrompt + `\n\nTEXTS:\n${message}` }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 1500 } }), signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();
        rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
      try { immunityTraining = JSON.parse(rawContent); } catch { const m = rawContent.match(/\{[\s\S]*\}/); if (m) immunityTraining = JSON.parse(m[0]); }
      const sanitizeImmunity = (it) => {
        if (!it) return null;
        const BANNED_PATTERNS = /\[[^\]]+\]|analysis in progress|pattern continuation predicted|sage wisdom pending|generic advice/i;
        ['redFlagDrills', 'patternBreakers', 'immunityShield', 'earlyWarnings', 'exitStrategy'].forEach(k => { if (!it[k] || BANNED_PATTERNS.test(it[k])) it[k] = null; });
        if (!it.redFlagDrills) it.redFlagDrills = "Bestie, watch for these moves - they're classic manipulation tactics designed to keep you guessing.";
        if (!it.patternBreakers) it.patternBreakers = "When you catch them pulling this, call it out directly. No more tiptoeing around their feelings.";
        if (!it.immunityShield) it.immunityShield = "Remember: confusion isn't chemistry. Clarity is your superpower.";
        if (!it.earlyWarnings) it.earlyWarnings = "Trust your gut when something feels off. That instinct is your best protection.";
        if (!it.exitStrategy) it.exitStrategy = "Your peace is premium. Protect it first, explain yourself never.";
        return it;
      };
      immunityTraining = sanitizeImmunity(immunityTraining);
      const api3Time = performance.now() - api3Start;
      console.log(`✅ Immunity Training complete in ${(api3Time / 1000).toFixed(2)}s`);
      return immunityTraining;
    } catch (e) {
      console.error('🚨 IMMUNITY TRAINING GENERATION FAILED:', e);
      console.log('⚠️ Immunity Training failed, using fallback');
      return { redFlagDrills: "Watch for the patterns you saw today", patternBreakers: "When they do this again, you'll know", immunityShield: "Your standards are your protection", earlyWarnings: "Trust your gut from the start", exitStrategy: "You deserve consistency", riskLevel: shareShotAnalysis.redFlags <= 3 ? 'low' : shareShotAnalysis.redFlags <= 6 ? 'medium' : 'high', safetyNote: "Only you decide next steps. If you feel unsafe, limit contact and reach out to trusted support." };
    }
  };

  const [deepResult, immResult] = await Promise.allSettled([runDeepDive(), runImmunity()]);
  const alignedDeepDive = deepResult.status === 'fulfilled' ? deepResult.value : null;
  const immunityTraining = immResult.status === 'fulfilled' ? immResult.value : null;
  
  // Combine all results into final response
  const processingStart = performance.now();
  console.log('🔄 Combining all 3 API results...');
  let finalResult = {
    ...shareShotAnalysis,
    conversation: cleanContext.conversation,
    userQuestion: context?.userQuestion || context?.user_question || null,
    deepDive: alignedDeepDive,
    immunityTraining: immunityTraining,
    // Include user names for components to use
    userName: cleanContext.userName,
    otherName: cleanContext.otherName,
    userPronouns: cleanContext.userPronouns,
    otherPronouns: cleanContext.otherPronouns,
    isAligned: true,
    analysisComplete: true
  };
  
  // If Deep Dive has red flag tags, merge them into the main result
  if (alignedDeepDive?.red_flag_tags && alignedDeepDive.red_flag_tags.length > 0) {
    finalResult.redFlagTags = alignedDeepDive.red_flag_tags;
  }
  
  console.log('✅ All 3 API calls complete! Analysis ready with proper names:', {
    userName: cleanContext.userName,
    otherName: cleanContext.otherName,
    hasDeepDive: !!alignedDeepDive,
    hasImmunity: !!immunityTraining
  });
  
  // After parsing the AI response, add comprehensive field name sanitization
  const sanitizeFieldNames = (result, cleanContext) => {
    const fieldNames = ['chat_excerpt', 'message', 'transcript', 'conversation', 'chat excerpt'];
    const { otherName } = cleanContext;

    const sanitizeString = (str) => {
      if (!str || typeof str !== 'string') return str;
      fieldNames.forEach(fieldName => {
        const patterns = [
          new RegExp(`['"\`]${fieldName}['"\`]`, 'gi'),
          new RegExp(`\\b${fieldName}\\b`, 'gi'),
          new RegExp(`${fieldName.replace('_', ' ')}`, 'gi')
        ];
        patterns.forEach(pattern => {
          str = str.replace(pattern, otherName);
        });
      });
      return str;
    };

    if (result.verdict) result.verdict = sanitizeString(result.verdict);
    if (result.realTea) result.realTea = sanitizeString(result.realTea);
    if (result.prophecy) result.prophecy = sanitizeString(result.prophecy);
    if (result.teaAndMovePlay && Array.isArray(result.teaAndMovePlay)) {
      result.teaAndMovePlay = result.teaAndMovePlay.map(sanitizeString);
    }
    const processingTime = performance.now() - processingStart;
  console.log(`✅ Post-processing complete in ${(processingTime / 1000).toFixed(2)}s`);
  
  const totalTime = performance.now() - startTime;
  console.log(`🎉 TOTAL ANALYSIS TIME: ${(totalTime / 1000).toFixed(2)}s`);
    return result;
  };

  finalResult = sanitizeFieldNames(finalResult, cleanContext);

  return finalResult;
};

// Build aligned Deep Dive for premium users (expands Share Shot analysis)
const buildAlignedDeepDive = (shareShotAnalysis, message, context) => {
  const { archetype, tagline, verdict, actions, savageAdvice } = shareShotAnalysis;
  
  return {
    whoTheyReallyAre: {
      emoji: "🎭",
      title: "Who They Really Are",
      subtitle: "Behind closed doors energy",
      attachmentStyle: "Pattern Recognition Loading...",
      corePersonality: tagline,
      deepPsychology: "Their brain is wired for this pattern. Neuroscience says the behavior you're seeing is the behavior you'll keep seeing."
    },
    
    powerPlay: {
      emoji: "⚖️",
      title: "Power Play",
      subtitle: "How they control the game",
      content: `They're controlling the narrative by keeping you uncertain. The emotional labor imbalance is real - you're doing all the work while they maintain power through intermittent reinforcement. ${verdict}`
    },
    
    communicationCode: {
      emoji: "💬",
      title: "Communication Code",
      subtitle: "Decoding their language",
      content: `What they say: "maybe". What they mean: "I don't actually care". They're speaking in avoidance - a language designed to keep you guessing. ${tagline}`
    },
    
    signatureMoves: {
      emoji: "🎯",
      title: "Their Signature Moves",
      moves: [
        `⚠️ ${actions[0]} (and it's their way of maintaining control)`,
        `⚠️ ${actions[1]} (classic emotional unavailability)`,
        `⚠️ ${actions[2]} (clarity is the bare minimum)`,
        `⚠️ They'll keep doing this (because patterns don't lie)`
      ]
    },
    
    crystalBall: {
      emoji: "🔮",
      title: "The Crystal Ball Says...",
      subtitle: "Plot spoilers ahead",
      predictions: [
        `• They'll reach out when they need something`,
        `• They'll suddenly become perfect when you're done`,
        `• They'll try harder when they realize you're leaving`
      ]
    },
    
    receiptsAreIn: {
      emoji: "🚩",
      title: "The Receipts Are In",
      subtitle: "Warning signs to watch",
      redFlags: [
        `• ${savageAdvice[0]}`,
        `• ${tagline}`,
        `• The group chat is tired of this pattern`
      ]
    },
    
    plotTwist: {
      emoji: "⚠️",
      title: "The Plot Twist Nobody Wants",
      subtitle: "Your future self will thank you for reading this",
      content: `Staying with this person is like eating poison and expecting them to get sick. Your brain starts thinking this chaos is normal, and suddenly you're attracting more of the same energy. Break the cycle before it breaks you. You're not confused, you're in cognitive dissonance.`
    },
    
    realTalkMoment: {
      emoji: "💎",
      title: "The Real Talk Moment",
      bottomLine: `Bestie, and I say this with love, but ${verdict}. ${tagline}. Stop giving ${context} privileges to someone who won't even give you clarity.`
    }
  };
};

