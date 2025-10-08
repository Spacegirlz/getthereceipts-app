// Advanced Psychology Analysis Engine - Get The Receipts
// Integrating OpenAI GPT-4o-mini with sophisticated psychological profiling

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

  console.log('🔍 Toxicity Detection:', {
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
  
  // Calculate scores for each context
  Object.entries(workplaceKeywords).forEach(([keyword, weight]) => {
    if (lowercased.includes(keyword)) {
      contextScores.workplace += weight;
    }
  });
  
  Object.entries(datingKeywords).forEach(([keyword, weight]) => {
    if (lowercased.includes(keyword)) {
      contextScores.dating += weight;
    }
  });
  
  Object.entries(familyKeywords).forEach(([keyword, weight]) => {
    if (lowercased.includes(keyword)) {
      contextScores.family += weight;
    }
  });
  
  Object.entries(friendshipKeywords).forEach(([keyword, weight]) => {
    if (lowercased.includes(keyword)) {
      contextScores.friendship += weight;
    }
  });
  
  Object.entries(socialKeywords).forEach(([keyword, weight]) => {
    if (lowercased.includes(keyword)) {
      contextScores.social += weight;
    }
  });
  
  // Find the highest scoring context
  const maxScore = Math.max(...Object.values(contextScores));
  const detectedContext = Object.keys(contextScores).find(key => contextScores[key] === maxScore);
  
  console.log('🧮 MATHEMATICAL CONTEXT DETECTION:');
  console.log('📊 Context Scores:', contextScores);
  console.log('🎯 Highest Score:', maxScore);
  console.log('🏆 Detected Context:', detectedContext);
  
  // Confidence threshold - if no clear winner, default to dating
  if (maxScore < 20) {
    console.log('⚠️ Low confidence, defaulting to dating context');
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
  const userName = context?.user_name || 'user';
  
  console.log('🔍 Parsing conversation for mode detection:', { userName, totalLines: lines.length });
  
  lines.forEach(line => {
    if (line.includes(`${userName} (`)) {
      // Handle format "Alex (10:41 PM): text"
      const text = line.substring(line.indexOf('):') + 2);
      userText += ' ' + text;
      console.log(`  ✅ ${userName} line:`, text.slice(0, 50));
    } else if (line.includes('(') && line.includes('):') && !line.includes('—')) {
      // Handle other party format "Mateo (10:42 PM): text"  
      const text = line.substring(line.indexOf('):') + 2);
      otherText += ' ' + text;
      const speaker = line.substring(0, line.indexOf(' ('));
      console.log(`  ✅ ${speaker} line:`, text.slice(0, 50));
    }
  });
  
  const result = { userText: userText.trim(), otherText: otherText.trim() };
  console.log('📝 Parsed result:', {
    userTextLength: result.userText.length,
    otherTextLength: result.otherText.length,
    userPreview: result.userText.slice(0, 100),
    otherPreview: result.otherText.slice(0, 100)
  });
  
  return result;
};

// Advanced OpenAI Integration - CLEANED VERSION
export const analyzeWithGPT = async (message, context) => {
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
  if (context?.context) {
    const quizContext = context.context.toLowerCase();
    if (quizContext === 'work') {
      actualContext = 'Work/Professional';
    } else if (quizContext === 'family') {
      actualContext = 'Family/Personal';
    } else if (quizContext === 'friends') {
      actualContext = 'Friendship';
    } else if (quizContext === 'dating' || quizContext === 'situationship' || quizContext === "don't know yet") {
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
    detectedContext: actualContext,
    hasWorkplaceElements,
    messagePreview: message.slice(0, 100)
  });

  // Provider/model selection with auto-pick
  const { provider, model, openAIModel, geminiModel } = selectAiProvider();
  if (provider === 'none') {
    console.log('No AI keys detected; returning minimal fallback analysis');
    return generateAdvancedResults(message, { ...context, context: actualContext });
  }

  try {
          console.log('Calling AI with context:', actualContext);
    // Import the working prompt that's already perfectly structured
    const { brutalPrompt } = await import('./brutalPrompt');
    const customPrompt = brutalPrompt;



      // SAGE VOICE ENFORCEMENT - Nuanced Safety + Multi-Modal Protection  
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
• MANDATORY: Every response should feel personalized, never template-based`;
      }

      // NEW USER MESSAGE FORMAT with mode detection
      const userPayload = {
        transcript: message,
        detectedMode: detectedMode, // Pass heuristic mode detection
        context: context?.quickContext || context?.additionalContext || '',
        relationshipType: context?.context?.toLowerCase() || 'dating',
        userName: context?.user_name || 'user',
        subjectGender: 'unknown', // Can be enhanced later
        locale: 'en-US',
        preferences: {
          spice: 'medium',
          maxWordsVerdict: 95,  // Updated limits
          maxWordsRealTea: 240
        }
      };
      const userContent = JSON.stringify(userPayload);

      console.log('API Request selection:', { provider, openAIModel, geminiModel });


    let rawContent = '';
    if (provider === 'openai') {
      // Check if using GPT-5 reasoning models
      const isReasoningModel = openAIModel.includes('gpt-5') || openAIModel.includes('o1');
      
      if (isReasoningModel) {
        // Use Responses API for reasoning models
        const endpoint = 'https://api.openai.com/v1/responses';
        const input = [
          { role: 'system', content: customPrompt }
        ];
        
        if (voiceOverride) {
          input.push({ role: 'system', content: voiceOverride });
        }
        
        input.push({ role: 'user', content: userContent });
        
        const body = {
          model: openAIModel,
          input,
          reasoning: { effort: 'medium' },
          max_output_tokens: 1500,
          text: { format: { type: 'json_object' } }
        };
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI Responses API error ${response.status}:`, errorText);
          throw new Error(`OpenAI Responses API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🔧 FULL GPT-5 Response Structure:', JSON.stringify(data, null, 2));
        console.log('OpenAI Responses API meta:', { hasOutput: !!data?.output, usage: data?.usage });
        console.log('🔍 Output array:', data?.output);
        
        // GPT-5 mini returns output in data.output[1].content[0].text
        const messageOutput = data?.output?.find(o => o.type === 'message');
        console.log('🎯 Found message output:', messageOutput);
        rawContent = messageOutput?.content?.[0]?.text || data?.output_text || '';
        console.log('📝 Extracted rawContent:', rawContent);
        
      } else {
        // Use Chat Completions API for regular models
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const messages = [
          { role: 'system', content: customPrompt },
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
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error ${response.status}:`, errorText);
          throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('OpenAI response meta:', { endpoint, hasChoices: !!data?.choices, usage: data?.usage });
        rawContent = data.choices?.[0]?.message?.content || '';
      }
    } else {
      // Google Gemini with structured output
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
      
      const promptText = voiceOverride ? `${customPrompt}\n\n${voiceOverride}\n\n${userContent}` : `${customPrompt}\n\n${userContent}`;
      
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
      
      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
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
          archetype: 'Safety First 🛡️',
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

    // Transform to match existing component expectations (wrapped in analysis object)
    let finalResult = {
      // Core truth receipt fields (directly at root level for compatibility)
      mode: truthReceipt.mode || detectedMode.toLowerCase() || 'mirror', // Use detected mode
      safetyOverride: safetyOverride, // Include safety info
      archetype: truthReceipt.archetype || result.archetype || 'The Analyzer 🔮',
      verdict: truthReceipt.verdict || result.verdict || 'Analysis in progress...',
      realTea: truthReceipt.realTea || (result.teaAndMovePlay ? result.teaAndMovePlay.slice(0, 2).join(' ') : 'Tea is brewing...'),
      // Defaults set to 0 to avoid false positives on healthy conversations
      wastingTime: Math.max(0, Math.min(100, truthReceipt.wastingTime || result.wastingTime || 0)),
      actuallyIntoYou: Math.max(0, Math.min(100, truthReceipt.actuallyIntoYou || result.actuallyIntoYou || 0)),
      redFlags: Math.max(0, Math.min(10, truthReceipt.redFlags || result.redFlags || 0)),
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
    console.error('OpenAI API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      context: actualContext,
      hasOpenAIKey: !!import.meta.env.VITE_OPENAI_API_KEY,
      hasGoogleKey: !!import.meta.env.VITE_GOOGLE_API_KEY
    });
    // Fallback to local analysis if API fails
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

  // Return basic structure with calculated metrics only
  const fallbackResult = {
    archetype: 'Analysis Unavailable',
    verdict: 'Unable to generate analysis at this time',
    realTea: 'Check your connection and try again',
    wastingTime: Math.max(0, 100 - interest),
    actuallyIntoYou: interest,
    redFlags: Math.round(manipulation / 10),
    yourMove: ['Try again later', 'Check your internet connection'],
    prophecy: 'Analysis will be available when connection is restored'
  };
  
  console.log('Fallback result to return:', fallbackResult);
  return sanitizeResult(fallbackResult);
};

// Function to generate ALIGNED results for premium users (same analysis for Share Shot + Deep Dive)
export const generateAlignedResults = async (message, context) => {
  console.log('Generating ALIGNED results for premium user');
  
  // Generate the primary analysis (for Share Shot)
  const shareShotAnalysis = await analyzeWithGPT(message, context);
  
  // Generate live Deep Dive using Sage's Deep Dive prompt (same context)
  let alignedDeepDive = null;
  try {
    const ddPrompt = (await import('@/lib/deepDivePrompt')).deepDivePrompt;
    const ddSystem = ddPrompt(shareShotAnalysis.archetype, message, shareShotAnalysis.redFlags, shareShotAnalysis.confidenceRemark);
    const provider = (import.meta.env.VITE_AI_PROVIDER || 'openai').toLowerCase();
    
    // 🔍 TELEMETRY - Track what's actually happening
    const cacheKey = `deepDiveV4:${shareShotAnalysis.archetype}:${encodeURIComponent(message.slice(0,100))}`;
    console.info('🔍 DEEP DIVE TELEMETRY:', {
      promptVersion: 'deepDiveV4',
      usedPromptId: 'deepDivePrompt.js',
      cacheKey,
      provider,
      archetype: shareShotAnalysis.archetype,
      redFlags: shareShotAnalysis.redFlags,
      messageLength: message.length,
      systemPromptLength: ddSystem.length
    });
    
    console.log('🔧 Deep Dive using provider:', provider);
    const openAIModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
    const geminiModel = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-2.5-lite';

    let rawContent = '';
    if (provider === 'openai') {
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const body = {
        model: openAIModel,
        messages: [
          { role: 'system', content: ddSystem },
          { role: 'user', content: `Return JSON only. Do not include explanations.\n\nTEXTS:\n${message}` }
        ],
        temperature: 1.2,
        max_completion_tokens: 800,
        response_format: { type: 'json_object' }
      };
      console.log('🔧 OpenAI Deep Dive request:', { endpoint, model: openAIModel });
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 OpenAI Deep Dive API Error:', response.status, errorText);
        throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Standard chat completions format
      rawContent = data.choices?.[0]?.message?.content || '';
      console.log('🔧 OpenAI Deep Dive response length:', rawContent.length);
    } else {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: ddSystem + `\n\nTEXTS:\n${message}` }] }], generationConfig: { temperature: 1.2, maxOutputTokens: 800 } })
      });
      const data = await response.json();
      rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
    try { alignedDeepDive = JSON.parse(rawContent); } catch { const m = rawContent.match(/\{[\s\S]*\}/); if (m) alignedDeepDive = JSON.parse(m[0]); }
    
    // 🛡️ BANNED N-GRAM FILTER - Check for template leakage (less aggressive)
    const bannedNgrams = [
      "analysis in progress",
      "pattern continuation predicted", 
      "sage wisdom pending",
      "detected]",
      "pending]",
      "escalation likely",
      "measure anticipated",
      "[placeholder",
      "[template"
    ];
    
    const needsRegeneration = (text) => {
      const t = (text || '').toLowerCase();
      return bannedNgrams.some(n => t.includes(n));
    };
    
    // Check all sections for banned content - but don't null out completely
    if (alignedDeepDive && Object.values(alignedDeepDive).some(v => needsRegeneration(String(v)))) {
      console.warn('🚨 BANNED CONTENT DETECTED - Deep Dive contains template phrases');
      // Don't null out - instead clean the content
      if (alignedDeepDive.verdict?.act) {
        alignedDeepDive.verdict.act = alignedDeepDive.verdict.act.replace(/\[[^\]]+\]/g, '').trim() || "Mixed Signal Territory";
      }
    }
    
    // 🛡️ DEEP DIVE SANITIZATION - Check for template content
    const sanitizeDeepDive = (dd) => {
      if (!dd) return null;
      
      const BANNED_PATTERNS = /\[[^\]]+\]|analysis in progress|pattern continuation predicted|sage wisdom pending|vague promise detected|detected\]|pending\]|escalation likely|measure anticipated/i;
      
      // Check all text fields for banned patterns
      let hasTemplateContent = false;
      
      // Check verdict
      if (dd.verdict) {
        if (BANNED_PATTERNS.test(dd.verdict.act) || BANNED_PATTERNS.test(dd.verdict.subtext)) {
          hasTemplateContent = true;
        }
      }
      
      // Check receipts
      if (dd.receipts && Array.isArray(dd.receipts)) {
        dd.receipts.forEach(r => {
          if (BANNED_PATTERNS.test(r.quote) || BANNED_PATTERNS.test(r.pattern) || BANNED_PATTERNS.test(r.cost)) {
            hasTemplateContent = true;
          }
        });
      }
      
      // Check physics
      if (dd.physics) {
        if (BANNED_PATTERNS.test(dd.physics.you_bring) || BANNED_PATTERNS.test(dd.physics.they_exploit) || BANNED_PATTERNS.test(dd.physics.result)) {
          hasTemplateContent = true;
        }
      }
      
      // Check playbook
      if (dd.playbook) {
        if (BANNED_PATTERNS.test(dd.playbook.next_48h) || BANNED_PATTERNS.test(dd.playbook.next_week) || BANNED_PATTERNS.test(dd.playbook.trump_card)) {
          hasTemplateContent = true;
        }
      }
      
      // Check sage's seal
      if (BANNED_PATTERNS.test(dd.sages_seal)) {
        hasTemplateContent = true;
      }
      
      // If template content detected, return null
      if (hasTemplateContent) {
        console.warn('🚨 Template content detected in Deep Dive - rejecting response');
        return null;
      }
      
      return dd;
    };
    
    alignedDeepDive = sanitizeDeepDive(alignedDeepDive);
    
    // If sanitization failed, provide a minimal valid structure
    if (!alignedDeepDive) {
      console.log('🔄 Deep Dive failed - creating fallback structure based on main analysis');
      alignedDeepDive = {
        mode: "mirror",
        verdict: {
          act: shareShotAnalysis.archetype || "Communication Territory",
          subtext: `${shareShotAnalysis.redFlags || 0} red flags detected`
        },
        receipts: [
          {
            quote: "Pattern analysis in progress",
            pattern: "Communication Style",
            cost: "Clarity needed"
          }
        ],
        physics: {
          you_bring: "Genuine interest and questions",
          they_exploit: "Your patience and understanding", 
          result: "Mixed signals and confusion"
        },
        playbook: {
          next_48h: "Ask one direct question about intentions",
          next_week: "Notice if actions match their words",
          trump_card: "Calendar test - suggest specific plans"
        },
        sages_seal: shareShotAnalysis.confidenceRemark === 'TOXIC AF' 
          ? "Trust your gut. Red flags aren't confetti." 
          : "Actions over words. Every single time.",
        red_flag_tags: shareShotAnalysis.redFlagTags || [],
        metrics: {
          wastingTime: shareShotAnalysis.wastingTime || 0,
          actuallyIntoYou: shareShotAnalysis.actuallyIntoYou || 0,
          redFlags: shareShotAnalysis.redFlags || 0
        },
        next_move_script: shareShotAnalysis.redFlags > 5 
          ? "Say: 'I need consistency, not confusion.'" 
          : null
      };
    }
    
  } catch (e) {
    console.error('🚨 DEEP DIVE GENERATION FAILED:', e);
    console.error('Error details:', e.message);
    
    // Provide fallback structure even when API fails
    alignedDeepDive = {
      mode: "mirror",
      verdict: {
        act: shareShotAnalysis.archetype || "Communication Territory", 
        subtext: "Analysis incomplete - try again"
      },
      receipts: [
        {
          quote: "API connection issue",
          pattern: "Technical Difficulty", 
          cost: "Retry needed"
        }
      ],
      physics: {
        you_bring: "Patience during technical issues",
        they_exploit: "System limitations",
        result: "Temporary analysis unavailable"
      },
      playbook: {
        next_48h: "Refresh and try analysis again",
        next_week: "Check connection and retry",
        trump_card: "Manual pattern recognition"
      },
      sages_seal: "Technical hiccup. Your situation is still valid.",
      red_flag_tags: [],
      metrics: {
        wastingTime: 0,
        actuallyIntoYou: 0, 
        redFlags: 0
      },
      next_move_script: null
    };
  }
  
  console.log('🔍 FINAL DEEP DIVE RESULT:', alignedDeepDive);
  console.log('🔍 DEEP DIVE KEYS:', alignedDeepDive ? Object.keys(alignedDeepDive) : 'null/undefined');
  
  // Generate Immunity Training for premium users
  let immunityTraining = null;
  try {
    const immunityPrompt = (await import('@/lib/immunityPrompt')).immunityPrompt;
    const immunitySystem = immunityPrompt
      .replace('{archetype}', shareShotAnalysis.archetype)
      .replace('{message}', message)
      .replace('{redFlags}', shareShotAnalysis.redFlags)
      .replace('{confidenceRemark}', shareShotAnalysis.confidenceRemark);
    
    const provider = (import.meta.env.VITE_AI_PROVIDER || 'openai').toLowerCase();
    console.log('🛡️ Immunity Training using provider:', provider);
    const openAIModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
    const geminiModel = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-2.5-lite';

    let rawContent = '';
    if (provider === 'openai') {
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const body = {
        model: openAIModel,
        messages: [
          { role: 'system', content: immunitySystem },
          { role: 'user', content: `TEXTS:\n${message}` }
        ],
        temperature: 0.8,
        max_completion_tokens: 600,
        response_format: { type: 'json_object' }
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 Immunity Training API Error:', response.status, errorText);
        throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Standard chat completions format
      rawContent = data.choices?.[0]?.message?.content || '';
      console.log('🛡️ Immunity Training response length:', rawContent.length);
    } else {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ role: 'user', parts: [{ text: immunitySystem + `\n\nTEXTS:\n${message}` }] }], 
          generationConfig: { temperature: 0.8, maxOutputTokens: 600 } 
        })
      });
      const data = await response.json();
      rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
    
    try { 
      immunityTraining = JSON.parse(rawContent); 
    } catch { 
      const m = rawContent.match(/\{[\s\S]*\}/); 
      if (m) immunityTraining = JSON.parse(m[0]); 
    }
    
    // 🛡️ IMMUNITY TRAINING SANITIZATION
    const sanitizeImmunity = (it) => {
      if (!it) return null;
      
      const BANNED_PATTERNS = /\[[^\]]+\]|analysis in progress|pattern continuation predicted|sage wisdom pending|generic advice/i;
      
      ['redFlagDrills', 'patternBreakers', 'immunityShield', 'earlyWarnings', 'exitStrategy'].forEach(k => {
        if (!it[k] || BANNED_PATTERNS.test(it[k])) it[k] = null;
      });
      
      // Provide clean fallbacks with Sage's voice
      if (!it.redFlagDrills) it.redFlagDrills = "Bestie, watch for these moves - they're classic manipulation tactics designed to keep you guessing.";
      if (!it.patternBreakers) it.patternBreakers = "When you catch them pulling this, call it out directly. No more tiptoeing around their feelings.";
      if (!it.immunityShield) it.immunityShield = "Remember: confusion isn't chemistry. Clarity is your superpower.";
      if (!it.earlyWarnings) it.earlyWarnings = "Trust your gut when something feels off. That instinct is your best protection.";
      if (!it.exitStrategy) it.exitStrategy = "Your peace is premium. Protect it first, explain yourself never.";
      
      return it;
    };
    
    immunityTraining = sanitizeImmunity(immunityTraining);
    
    console.log('🛡️ IMMUNITY TRAINING GENERATED:', immunityTraining ? Object.keys(immunityTraining) : 'failed');
  } catch (e) {
    console.error('🚨 IMMUNITY TRAINING GENERATION FAILED:', e);
    immunityTraining = null;
  }
  
  // Merge deep dive red flag tags back into main result
  const finalResult = {
    ...shareShotAnalysis,
    deepDive: alignedDeepDive,
    immunityTraining: immunityTraining,
    isAligned: true
  };
  
  // If Deep Dive has red flag tags, merge them into the main result
  if (alignedDeepDive?.red_flag_tags && alignedDeepDive.red_flag_tags.length > 0) {
    finalResult.redFlagTags = alignedDeepDive.red_flag_tags;
  }
  
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

