/**
 * STANDALONE DEEP DIVE FUNCTION
 * 
 * Single entry point for Deep Dive analysis.
 * Follows strict guardrails: validates payload, normalizes transcript once, throws on any failure.
 * 
 * @param {Object} conversationPayload - Validated ConversationPayload from conversationSchema
 * @param {Object} shareShotAnalysis - Main analysis result (archetype, redFlags, etc.)
 * @param {Object} cleanContext - Context with userName, otherName, etc.
 * @returns {Promise<Object>} Deep Dive analysis result
 * @throws {Error} If guardrails fail or evidence is missing
 */

import { validateConversationPayload } from '../schemas/conversationSchema';
import { normalizeConversation } from '../schemas/conversationSchema';
import { deepDivePrompt } from '../prompts/deepDivePrompt';

/**
 * STEP 1: Hard-validate receipts against the transcript
 * Ensures all receipt quotes actually exist in the normalized transcript
 */
function quoteInTranscript(quote, transcript) {
  const clean = s =>
    s.toLowerCase()
     .replace(/[""''""]/g, '')
     .replace(/\s+/g, ' ')
     .trim();

  const q = clean(quote);
  const t = clean(transcript);
  return q.length > 0 && t.includes(q);
}

function enforceEvidenceFromTranscript(dd, normalizedTranscript) {
  if (!dd || !Array.isArray(dd.receipts)) return dd;

  const validReceipts = dd.receipts.filter(r =>
    r.quote && quoteInTranscript(r.quote, normalizedTranscript)
  );

  // If we lose everything, Deep Dive is invalid
  if (validReceipts.length === 0) {
    throw new Error('🚫 Deep Dive blocked: No valid receipts found in transcript');
  }

  dd.receipts = validReceipts;
  return dd;
}

/**
 * STEP 2: Enforce pronouns - replace incorrect pronouns with user-specified ones
 * Handles both he/him/his and she/her/hers, mapping to the configured otherPronoun
 */
function enforcePronouns(dd, otherPronoun = 'they') {
  // Extract base pronoun (e.g., 'they' from 'they/them')
  const basePronoun = otherPronoun.split('/')[0].toLowerCase();
  
  // Determine object and possessive forms
  const objectForm = basePronoun === 'they' ? 'them' : basePronoun;
  const possessiveForm = basePronoun === 'they' ? 'their' : `${basePronoun}'s`;
  
  // Map all incorrect pronouns (masculine and feminine) to correct ones
  const map = {
    // Masculine pronouns
    he: basePronoun,
    him: objectForm,
    his: possessiveForm,
    // Feminine pronouns
    she: basePronoun,
    her: objectForm, // 'her' can be object or possessive, but we'll handle possessive separately
    hers: possessiveForm === 'their' ? 'theirs' : possessiveForm
  };

  let json = JSON.stringify(dd);
  
  // Replace all incorrect pronouns
  for (const [wrong, right] of Object.entries(map)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    json = json.replace(regex, right);
  }
  
  // Special handling for possessive "her" (as in "her book") vs object "her" (as in "to her")
  // We'll replace possessive "her" (followed by a noun) with the possessive form
  // This is tricky, so we'll do a simple replacement of "her " followed by lowercase letter
  if (basePronoun !== 'she') {
    const possessiveHerRegex = /\bher\s+([a-z])/gi;
    json = json.replace(possessiveHerRegex, (match, letter) => {
      return `${possessiveForm} ${letter}`;
    });
  }
  
  return JSON.parse(json);
}

export async function runDeepDive(conversationPayload, shareShotAnalysis, cleanContext) {
  console.info('[DD] start', { id: conversationPayload.id, source: conversationPayload.source });
  
  // ✅ HARD-BLOCK: Guardrails MUST be enforced BEFORE any API call setup
  try {
    validateConversationPayload(conversationPayload);
  } catch (validationError) {
    console.warn('[DD] guardrail', validationError.message);
    throw validationError; // Re-throw immediately - no fallback
  }

  // ✅ SINGLE SOURCE OF TRUTH: Compute normalized transcript once at the top
  let normalizedTranscript = null;
  try {
    normalizedTranscript = normalizeConversation(conversationPayload);
    if (!normalizedTranscript || normalizedTranscript.trim().length === 0) {
      throw new Error('🚫 Deep Dive blocked: Normalization produced empty transcript');
    }
  } catch (normalizeError) {
    console.warn('[DD] guardrail', normalizeError.message);
    throw normalizeError;
  }

  // ✅ LOG PAYLOAD METRICS FOR QA
  const payloadLength = conversationPayload.rawText?.length || 0;
  const speakerCount = Object.keys(conversationPayload.speakers || {}).length;
  console.log('📊 Deep Dive Payload Metrics:', {
    payloadLength,
    speakerCount,
    source: conversationPayload.source,
    hasRawText: !!conversationPayload.rawText,
    normalizedLength: normalizedTranscript.length
  });

  // Extract speaker names and pronouns from payload for prompt substitution
  const speakers = conversationPayload.speakers || {};
  const contextualUserName = cleanContext.userName || 
                             speakers['user'] || 
                             speakers['Me'] || 
                             speakers['You'] || 
                             'You';
  const contextualOtherName = cleanContext.otherName || 
                              speakers['other'] || 
                              speakers['Them'] || 
                              speakers['Other'] || 
                              'they';
  const contextualOtherPronoun = cleanContext.otherPronouns || cleanContext.otherPronoun || 'they/them';

  console.log('🔍 Deep Dive using normalized transcript:', {
    originalLength: conversationPayload.rawText.length,
    normalizedLength: normalizedTranscript.length,
    speakers: { user: contextualUserName, other: contextualOtherName },
    pronouns: { other: contextualOtherPronoun },
    source: conversationPayload.source
  });

  // Build system prompt
  const deepDiveSystemPrompt = deepDivePrompt(
    shareShotAnalysis.archetype, 
    normalizedTranscript, 
    shareShotAnalysis.redFlags, 
    shareShotAnalysis.confidenceRemark
  )
    .replace(/\{userName\}/g, contextualUserName)
    .replace(/\{otherName\}/g, contextualOtherName)
    .replace(/\{otherPronoun\}/g, contextualOtherPronoun);

  // Build user content with normalized transcript
  const userContent = `ORIGINAL ANALYZED CONVERSATION:\n${normalizedTranscript}\n\nReturn JSON only. Do not include explanations.`;

  // API setup
  const apiKeys = [
    import.meta.env.VITE_OPENAI_API_KEY, 
    import.meta.env.VITE_OPENAI_API_KEY_BACKUP1, 
    import.meta.env.VITE_GOOGLE_API_KEY_BACKUP2
  ].filter(key => key && key.trim());
  
  const currentKey = apiKeys[0]?.replace(/\s/g, '');
  const provider = currentKey?.startsWith('AIza') ? 'google' : 'openai';
  const openAIModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const geminiModel = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-2.5-lite';
  
  const cacheKey = `deepDiveV4:${shareShotAnalysis.archetype}:${encodeURIComponent(normalizedTranscript.slice(0,100))}`;
  console.info('🔍 DEEP DIVE TELEMETRY:', { 
    promptVersion: 'deepDiveV4', 
    usedPromptId: 'deepDivePrompt.js', 
    cacheKey, 
    provider, 
    archetype: shareShotAnalysis.archetype, 
    redFlags: shareShotAnalysis.redFlags, 
    messageLength: normalizedTranscript.length, 
    systemPromptLength: deepDiveSystemPrompt.length, 
    payloadId: conversationPayload.id, 
    source: conversationPayload.source 
  });

  // Make API call
  const deepDiveTimeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Deep Dive timeout after 25 seconds')), 25000)
  );
  
  let rawContent = '';
  try {
    if (provider === 'openai') {
      const endpoint = '/api/chat/completions';
      const body = { 
        model: openAIModel, 
        messages: [
          { role: 'system', content: deepDiveSystemPrompt }, 
          { role: 'user', content: userContent }
        ], 
        temperature: 0.2, // Lower temp for consistency
        max_completion_tokens: 2200, // Generous tokens
        response_format: { type: 'json_object' } 
      };
      console.log('🔧 OpenAI Deep Dive request:', { endpoint, model: openAIModel });
      
      // Simple API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentKey}`,
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
        
        const data = await Promise.race([response.json(), deepDiveTimeout]);
        rawContent = data.choices?.[0]?.message?.content || '';
        console.log('🔧 OpenAI Deep Dive response length:', rawContent.length);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError' || error.message?.includes('timeout')) {
          throw new Error('🚫 Deep Dive blocked: Request timed out');
        }
        throw error;
      }
    } else {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${currentKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(geminiEndpoint, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          contents: [{ 
            role: 'user', 
            parts: [{ text: deepDiveSystemPrompt + `\n\n${userContent}` }] 
          }], 
          generationConfig: { 
            temperature: 0.2, 
            maxOutputTokens: 2200 
          } 
        }), 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    if (!rawContent) {
      throw new Error('🚫 Deep Dive blocked: Empty response from API');
    }

    // Parse JSON response
    let alignedDeepDive = null;
    try {
      alignedDeepDive = JSON.parse(rawContent);
    } catch (parseError) {
      // Try to extract JSON from response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          alignedDeepDive = JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error('🚫 Deep Dive blocked: Invalid JSON response');
        }
      } else {
        throw new Error('🚫 Deep Dive blocked: No JSON found in response');
      }
    }

    // ✅ EVIDENCE GATE: Must have >=2 receipts with quotes
    if (!Array.isArray(alignedDeepDive.receipts) || 
        alignedDeepDive.receipts.length < 2 || 
        alignedDeepDive.receipts.some(r => !r?.quote || typeof r.quote !== 'string')) {
      console.error('🚫 OCR_PARSE_FAIL: Missing receipts - evidence gate failed');
      throw new Error('🚫 Deep Dive blocked: Missing receipts (need at least 2 with quotes)');
    }

    // ✅ STEP 4: Log BEFORE filtering (to see what AI generated)
    const receiptsBeforeFilter = alignedDeepDive.receipts.length;
    const firstQuoteBefore = alignedDeepDive.receipts[0]?.quote?.substring(0, 100) || 'N/A';
    const secondQuoteBefore = alignedDeepDive.receipts[1]?.quote?.substring(0, 100) || 'N/A';
    console.log('📊 BEFORE FILTERING - Receipts from AI:', receiptsBeforeFilter);
    console.log('📊 BEFORE FILTERING - First Quote:', firstQuoteBefore);
    console.log('📊 BEFORE FILTERING - Second Quote:', secondQuoteBefore);
    console.log('📊 Normalized Transcript Length:', normalizedTranscript.length);

    // ✅ STEP 1: Hard-validate receipts against the transcript
    // This will filter out any quotes that don't exist in the transcript
    alignedDeepDive = enforceEvidenceFromTranscript(alignedDeepDive, normalizedTranscript);

    // ✅ STEP 4: Log AFTER filtering (to see what was removed)
    const receiptsAfterFilter = alignedDeepDive.receipts.length;
    const filteredOut = receiptsBeforeFilter - receiptsAfterFilter;
    if (filteredOut > 0) {
      console.warn(`⚠️ FILTERED OUT ${filteredOut} invalid receipt(s) that don't exist in transcript`);
    }
    console.log('📊 AFTER FILTERING - Valid Receipts:', receiptsAfterFilter);
    const firstQuoteAfter = alignedDeepDive.receipts[0]?.quote?.substring(0, 100) || 'N/A';
    const secondQuoteAfter = alignedDeepDive.receipts[1]?.quote?.substring(0, 100) || 'N/A';
    console.log('📊 AFTER FILTERING - First Quote:', firstQuoteAfter);
    if (receiptsAfterFilter > 1) {
      console.log('📊 AFTER FILTERING - Second Quote:', secondQuoteAfter);
    }

    // ✅ STEP 2: Enforce pronouns (final post-processing)
    const otherPronoun = cleanContext.otherPronouns || cleanContext.otherPronoun || 'they/them';
    console.log('📊 Enforcing pronouns:', otherPronoun);
    alignedDeepDive = enforcePronouns(alignedDeepDive, otherPronoun);

    // ✅ STEP 4: Final success log
    console.info('[DD] success', { 
      receiptCount: receiptsAfterFilter,
      transcriptLength: normalizedTranscript.length,
      filteredOut: filteredOut,
      firstQuote: firstQuoteAfter.substring(0, 50)
    });

    return alignedDeepDive;

  } catch (error) {
    // ✅ SIMPLE ERROR HANDLING: Re-throw all errors - no fallback generation
    if (error.message?.includes('🚫 Deep Dive blocked') || 
        error.message?.includes('OCR_PARSE_FAIL') ||
        error.message?.includes('timeout')) {
      console.warn('[DD] guardrail', error.message);
      throw error;
    }
    
    // For unexpected errors, wrap and throw
    console.error('🚨 DEEP DIVE GENERATION FAILED:', error);
    throw new Error(`🚫 Deep Dive blocked: ${error.message || 'Unexpected error during analysis'}`);
  }
}

