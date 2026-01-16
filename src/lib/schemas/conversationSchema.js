/**
 * CONVERSATION DATA CONTRACT
 * 
 * This schema defines the explicit contract for conversation data
 * that MUST be passed to Deep Dive analysis.
 * 
 * CRITICAL RULE: Deep Dive must always receive rawText + speakers.
 * processedText is only used for visualization or highlights.
 */

/**
 * @typedef {Object} ConversationPayload
 * @property {string} id - Unique identifier for this conversation
 * @property {"ocr" | "paste"} source - Source of the conversation data
 * @property {string} rawText - Untouched original text with <time> tags for timestamps (REQUIRED for Deep Dive)
 * @property {string} [processedText] - Normalized form (optional, for visualization only)
 * @property {Record<string, string>} speakers - Color name or detected name -> actual speaker name mapping
 *   Example: { "blue": "Piet", "grey": "Nanna" } or { "Me": "Piet", "Them": "Nanna" }
 * @property {Object} [ocrMeta] - OCR-specific metadata
 * @property {number} [ocrMeta.frameCount] - Number of screenshot frames processed
 * @property {string[]} [ocrMeta.detectedColors] - Colors detected in screenshots
 * @property {number} [ocrMeta.confidence] - OCR confidence score (0-1)
 * @property {Array<{text: string, color?: string, timestamp?: string}>} [textSpans] - Individual text spans with color/timestamp info (for OCR)
 */

/**
 * Validates and normalizes conversation data into the ConversationPayload format
 * 
 * @param {Object} data - Raw conversation data from input
 * @param {string} data.texts - Pasted text (if source is "paste")
 * @param {string[]} data.extractedTexts - OCR extracted text array (if source is "ocr")
 * @param {string} data.colorMapping - Color mapping string (e.g., "blue = Piet, grey = Nanna")
 * @param {string} data.userName - User's name
 * @param {string} data.otherName - Other person's name
 * @param {string} data.source - "ocr" or "paste"
 * @param {Object} [data.ocrMeta] - OCR metadata
 * @returns {ConversationPayload} Normalized conversation payload
 * @throws {Error} If required fields are missing
 */
export function normalizeConversationPayload(data) {
  const {
    texts = '',
    extractedTexts = [],
    colorMapping = '',
    colorNameOverrides = {}, // Saved overrides from localStorage
    detectedColors = [], // Detected colors for validation
    userName = '',
    otherName = '',
    source = 'paste',
    ocrMeta = {},
    skipValidation = false
  } = data;

  // Determine source if not explicitly provided
  const detectedSource = extractedTexts.length > 0 ? 'ocr' : 'paste';

  // Build rawText: untouched original
  let rawText = '';
  if (detectedSource === 'ocr') {
    // For OCR: combine all extracted texts with original formatting
    rawText = extractedTexts.join('\n\n');
  } else {
    // For paste: use texts as-is
    rawText = texts.trim();
  }

  if (!rawText || rawText.length === 0) {
    throw new Error('ConversationPayload requires rawText (either texts or extractedTexts)');
  }

  // Build speakers mapping
  const speakers = {};
  
  // ✅ PRIORITY 1: Use colorNameOverrides from localStorage (user-saved overrides)
  if (detectedSource === 'ocr' && colorNameOverrides && Object.keys(colorNameOverrides).length > 0) {
    Object.entries(colorNameOverrides).forEach(([color, name]) => {
      if (color && name && name.trim()) {
        speakers[color.toLowerCase()] = name.trim();
      }
    });
    console.log('✅ Using color-name overrides from localStorage:', speakers);
  }
  // ✅ PRIORITY 2: Parse colorMapping string if overrides not available
  else if (detectedSource === 'ocr' && colorMapping) {
    // Parse color mapping: "blue = Piet, grey = Nanna"
    const mappings = colorMapping.split(',').map(m => {
      const [color, name] = m.split('=').map(s => s.trim());
      return { color: color.toLowerCase(), name };
    });
    
    mappings.forEach(({ color, name }) => {
      if (color && name) {
        speakers[color] = name;
      }
    });
  }

  // Add explicit name mappings if provided
  if (userName) {
    // For OCR: map detected names to actual names
    // For paste: map common patterns
    if (detectedSource === 'ocr') {
      // Try to find which color/name maps to userName
      const userColor = Object.keys(speakers).find(color => speakers[color] === userName);
      if (!userColor) {
        // If no color mapping, use first available slot or "user"
        speakers['user'] = userName;
      }
    } else {
      // For paste: map common detected patterns
      speakers['Me'] = userName;
      speakers['You'] = userName;
    }
  }

  if (otherName) {
    if (detectedSource === 'ocr') {
      const otherColor = Object.keys(speakers).find(color => speakers[color] === otherName);
      if (!otherColor) {
        speakers['other'] = otherName;
      }
    } else {
      speakers['Them'] = otherName;
      speakers['Other'] = otherName;
    }
  }

  // Generate unique ID
  const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Build processedText (optional, for visualization)
  // This is a normalized version that can be used for display/highlights
  let processedText = rawText;
  if (detectedSource === 'ocr') {
    // For OCR: clean up common OCR artifacts
    processedText = rawText
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[^\S\n]+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Build OCR metadata if applicable
  const finalOcrMeta = detectedSource === 'ocr' ? {
    frameCount: extractedTexts.length,
    detectedColors: Object.keys(speakers).filter(k => !['user', 'other', 'Me', 'You', 'Them', 'Other'].includes(k)),
    confidence: ocrMeta.confidence || 0.85, // Default confidence
    ...ocrMeta
  } : undefined;

  // ✅ GUARDRAILS: Validate speaker mapping for OCR sources
  if (detectedSource === 'ocr' && !skipValidation) {
    const confidence = finalOcrMeta?.confidence || 0.85;
    const detectedColors = finalOcrMeta?.detectedColors || [];
    
    try {
      validateSpeakerMapping(speakers, confidence, detectedColors);
    } catch (error) {
      // Return payload with validation error flag
      return {
        id,
        source: detectedSource,
        rawText,
        processedText,
        speakers,
        ...(finalOcrMeta && { ocrMeta: finalOcrMeta }),
        validationError: error.message,
        requiresManualConfirmation: true
      };
    }
  }

  return {
    id,
    source: detectedSource,
    rawText, // CRITICAL: Always use rawText for Deep Dive
    processedText, // Optional: for visualization only
    speakers, // CRITICAL: Speaker mapping for Deep Dive
    ...(finalOcrMeta && { ocrMeta: finalOcrMeta })
  };
}

/**
 * STEP 2: Normalize conversation payload into flat string format
 * 
 * Converts payload into format: [SPEAKER: <Name>] <Message Text>
 * Preserves <time> tags from timestamps.
 * 
 * @param {ConversationPayload} payload - Conversation payload to normalize
 * @returns {string} Normalized conversation string with speaker attribution
 * 
 * @example
 * // Input payload with speakers: { "blue": "Alice", "grey": "Bob" }
 * // Output: "[SPEAKER: Alice] I can't believe you said that.\n[SPEAKER: Bob] I didn't mean it like that."
 */
export function normalizeConversation(payload) {
  if (!payload || !payload.rawText) {
    throw new Error('normalizeConversation requires a valid ConversationPayload with rawText');
  }

  const { rawText, speakers, source } = payload;
  
  // If no speaker mapping, return raw text with preserved <time> tags
  if (!speakers || Object.keys(speakers).length === 0) {
    return rawText;
  }

  // Split text into lines
  const lines = rawText.split('\n').filter(line => line.trim().length > 0);
  const normalizedLines = [];

  for (const line of lines) {
    let speakerName = null;
    let messageText = line.trim();

    if (source === 'ocr') {
      // For OCR: Try to match colors or patterns to speakers
      // Look for color indicators or try to infer from context
      for (const [identifier, name] of Object.entries(speakers)) {
        // Check if line contains color identifier or matches pattern
        if (messageText.toLowerCase().includes(identifier.toLowerCase())) {
          speakerName = name;
          // Remove color identifier from message
          messageText = messageText.replace(new RegExp(identifier, 'gi'), '').trim();
          break;
        }
      }

      // If no color match, try to detect speaker from common patterns
      if (!speakerName) {
        // Check for common speaker patterns: "Name:", "Name (time):", etc.
        const speakerPattern = /^([^:]+):\s*(.+)$/;
        const match = messageText.match(speakerPattern);
        if (match) {
          const detectedSpeaker = match[1].trim();
          messageText = match[2].trim();
          
          // Try to map detected speaker to actual name
          for (const [identifier, name] of Object.entries(speakers)) {
            if (detectedSpeaker.toLowerCase() === identifier.toLowerCase() || 
                detectedSpeaker.toLowerCase() === name.toLowerCase()) {
              speakerName = name;
              break;
            }
          }
          
          // If still no match, use detected speaker as-is
          if (!speakerName) {
            speakerName = detectedSpeaker;
          }
        }
      }
    } else {
      // For paste: Look for "Name:" pattern
      const speakerPattern = /^([^:]+):\s*(.+)$/;
      const match = messageText.match(speakerPattern);
      if (match) {
        const detectedSpeaker = match[1].trim();
        messageText = match[2].trim();
        
        // Map to actual name from speakers
        for (const [identifier, name] of Object.entries(speakers)) {
          if (detectedSpeaker.toLowerCase() === identifier.toLowerCase() || 
              detectedSpeaker.toLowerCase() === name.toLowerCase()) {
            speakerName = name;
            break;
          }
        }
        
        // If no match, use detected speaker or fallback
        if (!speakerName) {
          speakerName = speakers[detectedSpeaker] || detectedSpeaker;
        }
      }
    }

    // If we still don't have a speaker, try to infer from context
    // (alternating speakers, or use first available speaker)
    if (!speakerName && normalizedLines.length > 0) {
      // Try alternating pattern
      const lastSpeaker = normalizedLines[normalizedLines.length - 1].match(/\[SPEAKER:\s*([^\]]+)\]/)?.[1];
      if (lastSpeaker) {
        const speakerNames = Object.values(speakers);
        const lastIndex = speakerNames.indexOf(lastSpeaker);
        if (lastIndex >= 0 && speakerNames.length > 1) {
          speakerName = speakerNames[(lastIndex + 1) % speakerNames.length];
        }
      }
    }

    // Fallback: use first available speaker
    if (!speakerName) {
      const speakerNames = Object.values(speakers);
      speakerName = speakerNames[0] || 'Unknown';
    }

    // Format: [SPEAKER: <Name>] <Message Text>
    // Preserve <time> tags in message text
    const normalizedLine = `[SPEAKER: ${speakerName}] ${messageText}`;
    normalizedLines.push(normalizedLine);
  }

  return normalizedLines.join('\n');
}

/**
 * Formats conversation text with speaker attribution for Deep Dive
 * 
 * DEPRECATED: Use normalizeConversation() instead for the standard format.
 * This function is kept for backward compatibility.
 * 
 * @param {ConversationPayload} payload - Normalized conversation payload
 * @returns {string} Formatted conversation text with speaker names
 */
export function formatConversationForDeepDive(payload) {
  // Use the new normalizeConversation function for consistency
  return normalizeConversation(payload);
}

/**
 * Validates that a ConversationPayload has all required fields for Deep Dive
 * 
 * STRICT VALIDATION: Throws immediately on any failure - no fallbacks
 * 
 * @param {ConversationPayload} payload - Payload to validate
 * @throws {Error} If validation fails with "🚫 Deep Dive blocked:" prefix
 */
export function validateConversationPayload(payload) {
  if (!payload) {
    throw new Error('🚫 Deep Dive blocked: ConversationPayload is required');
  }

  if (!payload.id || typeof payload.id !== 'string') {
    throw new Error('🚫 Deep Dive blocked: ConversationPayload.id must be a non-empty string');
  }

  if (!['ocr', 'paste'].includes(payload.source)) {
    throw new Error('🚫 Deep Dive blocked: ConversationPayload.source must be "ocr" or "paste"');
  }

  // ✅ GUARDRAIL: Minimum conversation length
  const MIN_CONVERSATION_LENGTH = 300; // Minimum required for analysis
  if (!payload.rawText || typeof payload.rawText !== 'string' || payload.rawText.trim().length < MIN_CONVERSATION_LENGTH) {
    throw new Error(`🚫 Deep Dive blocked: Conversation too short or truncated (minimum ${MIN_CONVERSATION_LENGTH} characters, got ${payload.rawText?.trim().length || 0})`);
  }

  // ✅ GUARDRAIL: Must have speakers object
  if (!payload.speakers || typeof payload.speakers !== 'object') {
    throw new Error('🚫 Deep Dive blocked: ConversationPayload.speakers must be an object');
  }

  // ✅ GUARDRAIL: Must have at least 2 speakers
  const speakerKeys = Object.keys(payload.speakers);
  const uniqueSpeakers = new Set(Object.values(payload.speakers));
  if (speakerKeys.length < 2 || uniqueSpeakers.size < 2) {
    throw new Error('🚫 Deep Dive blocked: Need at least 2 speakers');
  }

  // ✅ GUARDRAIL: OCR confidence check
  if (payload.source === 'ocr') {
    const confidence = payload.ocrMeta?.confidence ?? 0;
    if (confidence < 0.8) {
      throw new Error(`🚫 Deep Dive blocked: OCR confidence < 0.8 (got ${(confidence * 100).toFixed(1)}%)`);
    }
  }

  // ✅ GUARDRAIL: Manual confirmation check
  if (payload.requiresManualConfirmation) {
    const errorMsg = payload.validationError || 'Manual speaker confirmation required';
    throw new Error(`🚫 Deep Dive blocked: ${errorMsg}`);
  }

  // ✅ GUARDRAIL: Validate speaker mapping for OCR sources
  if (payload.source === 'ocr') {
    const confidence = payload.ocrMeta?.confidence || 0.85;
    const detectedColors = payload.ocrMeta?.detectedColors || [];
    try {
      validateSpeakerMapping(payload.speakers, confidence, detectedColors);
    } catch (error) {
      // Re-throw with consistent prefix
      throw new Error(`🚫 Deep Dive blocked: ${error.message}`);
    }
  }
}

/**
 * Validates speaker mapping with guardrails
 * 
 * @param {Object} speakers - Speaker mapping object
 * @param {number} confidence - OCR confidence score (0-1)
 * @param {string[]} detectedColors - Array of detected colors
 * @throws {Error} If validation fails
 */
export function validateSpeakerMapping(speakers, confidence, detectedColors = []) {
  // Guardrail 1: Require at least 2 unique colors before auto-assigning names
  const uniqueColors = detectedColors.filter((c, i, arr) => arr.indexOf(c) === i);
  const colorKeys = Object.keys(speakers).filter(k => 
    !['user', 'other', 'Me', 'You', 'Them', 'Other'].includes(k)
  );
  
  if (uniqueColors.length < 2 && colorKeys.length < 2) {
    throw new Error('At least 2 unique colors required before auto-assigning names. Please manually edit names.');
  }

  // Guardrail 2: Check confidence threshold
  if (confidence < 0.8) {
    throw new Error(`Low speaker confidence (${(confidence * 100).toFixed(1)}%) — needs manual edit. Minimum required: 80%`);
  }

  // Guardrail 3: Require at least 2 speakers mapped
  const speakerNames = Object.values(speakers).filter((v, i, arr) => arr.indexOf(v) === i);
  if (speakerNames.length < 2) {
    throw new Error('At least 2 unique speakers must be mapped. Please manually edit names.');
  }
}

/**
 * STEP 1: Parse OCR from input images
 * 
 * Extracts all text spans, assigns colors, builds speakers.
 * NEVER strips timestamps; marks them with <time> tags instead.
 * 
 * Includes guardrails:
 * - Requires at least 2 unique colors
 * - Validates confidence >= 0.8
 * - Requires manual confirmation if guardrails fail
 * 
 * @param {File[]} inputImages - Array of image files to process
 * @param {string} [colorMapping] - Optional color mapping string (e.g., "blue = Piet, grey = Nanna")
 * @param {string} [userName] - Optional user's name
 * @param {string} [otherName] - Optional other person's name
 * @param {boolean} [skipValidation=false] - Skip validation (for manual confirmation flow)
 * @returns {Promise<ConversationPayload>} Conversation payload with OCR-extracted text
 * @throws {Error} If guardrails fail and skipValidation is false
 */
export async function parseOCR(inputImages, colorMapping = '', userName = '', otherName = '', skipValidation = false) {
  if (!inputImages || inputImages.length === 0) {
    throw new Error('parseOCR requires at least one image file');
  }

  // Import Tesseract dynamically (only when needed)
  const Tesseract = (await import('tesseract.js')).default;

  const textSpans = [];
  const detectedColors = [];
  let totalConfidence = 0;
  const frameCount = inputImages.length;

  // Process each image
  for (let i = 0; i < inputImages.length; i++) {
    const image = inputImages[i];
    
    try {
      // Run OCR on image
      const { data: { text, confidence } } = await Tesseract.recognize(image, 'eng', {
        tessedit_pageseg_mode: '6', // Uniform block of text
      });

      // Detect timestamps and mark them with <time> tags
      // Pattern: HH:MM, HH:MM AM/PM, MM/DD/YYYY, etc.
      const timestampPatterns = [
        /\b(\d{1,2}:\d{2}(?::\d{2})?(?:\s?(AM|PM|am|pm))?)\b/g, // Time: 9:30, 9:30 AM, 14:30
        /\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/g, // Date: 12/25/2024
        /\b((Mon|Tue|Wed|Thu|Fri|Sat|Sun)(day)?\s+\d{1,2}(?:st|nd|rd|th)?)\b/gi, // Day: Monday 25th
        /\b((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(uary|ch|il|y|e|ust|tember|ober|ember)?\s+\d{1,2})\b/gi, // Month: January 25
        /\b(\d{1,2}\.\d{1,2}\.\d{2,4})\b/g, // Date: 25.12.2024
      ];

      let processedText = text;
      timestampPatterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match) => {
          return `<time>${match}</time>`;
        });
      });

      // Try to detect colors from image (basic heuristic)
      // In a real implementation, you might use image processing libraries
      // For now, we'll rely on the colorMapping parameter
      
      textSpans.push({
        text: processedText,
        frameIndex: i,
        confidence: confidence || 0.85
      });

      totalConfidence += confidence || 0.85;

    } catch (error) {
      console.error(`Failed to process image ${i}:`, error);
      throw new Error(`OCR failed for image ${image.name}: ${error.message}`);
    }
  }

  // Combine all text spans with frame separators
  const rawText = textSpans.map((span, idx) => {
    return span.text;
  }).join('\n\n');

  // Build speakers mapping from colorMapping
  const speakers = {};
  
  if (colorMapping) {
    // Parse color mapping: "blue = Piet, grey = Nanna"
    const mappings = colorMapping.split(',').map(m => {
      const [color, name] = m.split('=').map(s => s.trim());
      return { color: color.toLowerCase(), name };
    });
    
    mappings.forEach(({ color, name }) => {
      if (color && name) {
        speakers[color] = name;
        detectedColors.push(color);
      }
    });
  }

  // Add explicit name mappings if provided
  if (userName) {
    // Find which color maps to userName, or use default
    const userColor = Object.keys(speakers).find(color => speakers[color] === userName);
    if (!userColor) {
      // If no color mapping, assign to first available color or "user"
      const firstColor = Object.keys(speakers)[0] || 'user';
      if (firstColor === 'user') {
        speakers['user'] = userName;
      } else {
        // Reassign first color to user
        speakers[firstColor] = userName;
      }
    }
  }

  if (otherName) {
    const otherColor = Object.keys(speakers).find(color => speakers[color] === otherName);
    if (!otherColor) {
      const secondColor = Object.keys(speakers)[1] || 'other';
      if (secondColor === 'other') {
        speakers['other'] = otherName;
      } else {
        speakers[secondColor] = otherName;
      }
    }
  }

  // Generate unique ID
  const id = `ocr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Build OCR metadata
  const finalConfidence = totalConfidence / frameCount;
  const ocrMeta = {
    frameCount,
    detectedColors,
    confidence: finalConfidence,
    textSpans
  };

  // ✅ GUARDRAILS: Validate speaker mapping before returning
  if (!skipValidation) {
    try {
      validateSpeakerMapping(speakers, finalConfidence, detectedColors);
    } catch (error) {
      // Store partial payload for manual editing
      const partialPayload = {
        id,
        source: 'ocr',
        rawText,
        speakers,
        ocrMeta,
        validationError: error.message,
        requiresManualConfirmation: true
      };
      
      // Re-throw with context
      throw new Error(`${error.message} Please manually edit names before proceeding.`);
    }
  }

  // Load and merge with stored mappings if available
  try {
    const { getSpeakerMapping, saveSpeakerMapping } = await import('./speakerStorage');
    const storedMapping = await getSpeakerMapping(id);
    
    if (storedMapping && Object.keys(storedMapping).length >= 2) {
      // Merge stored mapping with current (stored takes precedence)
      Object.assign(speakers, storedMapping);
      console.log('✅ Loaded stored speaker mapping for conversation:', id);
    } else {
      // Save current mapping if valid
      if (Object.keys(speakers).length >= 2) {
        await saveSpeakerMapping(id, speakers);
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to load/save speaker mapping:', error);
    // Continue without stored mapping
  }

  return {
    id,
    source: 'ocr',
    rawText, // Contains <time> tags for timestamps
    speakers,
    ocrMeta
  };
}

