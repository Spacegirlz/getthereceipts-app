import { askSagePrompt } from './askSagePrompt';
import { askSagePromptLite } from './askSagePromptLite';
import { FreeUsageService } from '@/lib/services/freeUsageService';
import { SAGE_SAFETY_LAYER, collectSafetyText } from './sageSafety';

/**
 * Lightweight formatting cleanup for Sage responses
 * Handles the 8 formatting problems with minimal processing
 */
const cleanupSageResponse = (text) => {
  let clean = text;
  // Normalize CRLF to LF to keep newline handling consistent across platforms
  clean = clean.replace(/\r\n?/g, '\n');
  
  // 1. Replace em dashes with hyphens (Problem 7)
  clean = clean.replace(/\u2014/g, ' - '); // use unicode escape for reliability
  
  // 2. Safety: Soften dangerous absolutes (Problem 4)
  const dangerousPhrases = [
    [/you should (leave|break up with|dump) (them|him|her)/gi, 'consider if this relationship works for you'],
    [/they don't (love|care about) you/gi, "their actions aren't showing care"],
    [/they('re| are) (a )?narcissist/gi, "I'm seeing narcissistic patterns"],
    [/this is toxic/gi, 'these behaviors are concerning'],
  ];
  
  for (const [pattern, replacement] of dangerousPhrases) {
    clean = clean.replace(pattern, replacement);
  }
  
  // 3. Remove therapy-speak openings (Problem 3)
  const badStarts = ['I understand how you feel', 'Your feelings are valid', "That's a valid"];
  for (const bad of badStarts) {
    if (clean.startsWith(bad)) {
      clean = 'Bestie, ' + clean.substring(bad.length);
    }
  }
  
  // 4. Ensure proper spacing (Problem 1)
  // Add line breaks every 2-3 sentences for better readability
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  if (sentences.length >= 4) {
    // Add line break every 2-3 sentences for readability
    clean = sentences.map((s, i) => {
      const needsBreak = (i + 1) % 2 === 0 && i < sentences.length - 1;
      return s + (needsBreak ? '\n\n' : ' ');
    }).join('').trim();
  }
  
  // 5. Clean up multiple spaces (but never collapse newlines) and excessive line breaks
  clean = clean
    // Collapse multiple spaces/tabs only; preserve \n
    .replace(/[^\S\n]{2,}/g, ' ')
    // Normalize 3+ consecutive newlines down to exactly 2 for readable paragraphs
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return clean;
};

export async function askSage(question, receiptData, previousMessages = [], opts = {}) {
  try {
    // Client-side daily chat cap for Free users (5/day, UTC)
    if (opts?.userId && !opts?.isPremium && !opts?.isTrial) {
      const chatCheck = FreeUsageService.checkAndIncrementDailyChat(opts.userId);
      if (!chatCheck.allowed) {
        return 'Daily chat limit reached for Free accounts. Upgrade to continue, or try again after midnight (UTC).';
      }
    }
    // Try API endpoint first (for production)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
      try {
        const response = await fetch('/api/sage-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, receiptData, previousMessages, userId: opts.userId, deviceId: opts.deviceId, receiptId: receiptData?.id })
        });
        
        if (response.ok) {
          const data = await response.json();
          const cleanedResponse = cleanupSageResponse(data.response);
          return cleanedResponse;
        }
      } catch (apiError) {
        console.log('API endpoint failed, using direct OpenAI call');
      }
    }

  // Fallback to direct OpenAI call (for local development)
  // Layered safety checks
  const safetyText = collectSafetyText(question, previousMessages);
  const allowed = SAGE_SAFETY_LAYER.EXPLICIT_ALLOWS.some(rx => rx.test(safetyText));
  if (!allowed) {
    for (const rule of SAGE_SAFETY_LAYER.HARD_BLOCKS) {
      if (rule.trigger(safetyText)) {
        return rule.response;
      }
    }
  }

    // Build compact, personality-first prompt (+ keep legacy as fallback)
    const useLite = true; // core switch per user request
    const otherName = receiptData?.otherName || 'them';
    const systemPromptFilled = (useLite ? askSagePromptLite : askSagePrompt)
      .replace('{otherName}', otherName)
      .replace('{archetype}', receiptData.archetype || 'Unknown')
      .replace('{redFlags}', receiptData.redFlags || 0)
      .replace('{verdictSummary}', (receiptData.verdict || '').substring(0, 120));

    const recentChat = previousMessages.slice(-6).map(m => {
      const role = m.role === 'user' ? 'Them' : 'You';
      return `${role}: ${m.content}`;
    }).join('\n');

    const contextualQuestion = recentChat
      ? `Recent conversation:\n${recentChat}\n\nThem: ${question}\n\nRespond as Sage (1-4 sentences, match energy).`
      : `Them: ${question}\n\nRespond as Sage (1-4 sentences).`;
    const systemPrompt = systemPromptFilled;

    // Add the original analyzed conversation and chat history
    const originalConversation = receiptData.conversation ? 
      `\n\nORIGINAL ANALYZED CONVERSATION:\n${receiptData.conversation}` : '';
    
    const chatHistory = previousMessages.length > 0 ? 
      `\n\nRECENT CHAT WITH USER:\n${previousMessages.slice(-20).map(m => `${m.role}: ${m.content}`).join('\n')}` : '';
    
    const fullPrompt = systemPrompt + originalConversation + chatHistory;

    // For local development only, use direct OpenAI call
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))) {
      // Direct OpenAI call for local development
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: useLite ? contextualQuestion : question }
          ],
          temperature: 0.88,
          max_tokens: 250,
          presence_penalty: 0.5,
          frequency_penalty: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rawResponse = data.choices[0]?.message?.content || 'Sorry, I need a moment to think about that.';
      let cleanedResponse = cleanupSageResponse(rawResponse);
      return cleanedResponse;
    } else {
      // Production: Call OpenAI via proxy
      const response = await fetch('/api/sage-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: useLite ? contextualQuestion : question,
          receiptData: { conversation: receiptData?.conversation || '' },
          previousMessages: previousMessages
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rawResponse = data.response || 'Sorry, I need a moment to think about that.';
      let cleanedResponse = cleanupSageResponse(rawResponse);
      // Soft redirects (prepend without blocking)
      if (!allowed) {
        for (const rule of SAGE_SAFETY_LAYER.SOFT_REDIRECTS) {
          if (rule.trigger(safetyText)) { cleanedResponse = rule.prefix + cleanedResponse; break; }
        }
      }
      return cleanedResponse;
    }
  } catch (error) {
    console.error('Ask Sage error:', error);
    return "Bestie, my crystal ball is foggy right now. Try again in a sec! 🔮";
  }
}
