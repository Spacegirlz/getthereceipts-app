import { askSagePrompt } from './askSagePrompt';
import { FreeUsageService } from '@/lib/services/freeUsageService';

/**
 * Lightweight formatting cleanup for Sage responses
 * Handles the 8 formatting problems with minimal processing
 */
const cleanupSageResponse = (text) => {
  console.log('🔍 Cleanup input:', text);
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
  
  console.log('🔍 Cleanup output:', clean);
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
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
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
    // Emergency check
    const emergencyWords = ['kill myself', 'hurt myself', 'end it'];
    if (emergencyWords.some(word => question.toLowerCase().includes(word))) {
      return "Bestie, this is beyond my pay grade. Please call 988 (Crisis Lifeline) right now. I'm here for drama, not emergencies.";
    }

    // Use the professional prompt with dynamic values
    const systemPrompt = askSagePrompt
      .replace('{archetype}', receiptData.archetype || 'Unknown')
      .replace('{redFlags}', receiptData.redFlags || 0)
      .replace('{verdictSummary}', receiptData.verdict?.substring(0, 150) || '')
      .replace('{flagNumber}', '1'); // Just use first flag for now

    // Add the original analyzed conversation and chat history
    const originalConversation = receiptData.conversation ? 
      `\n\nORIGINAL ANALYZED CONVERSATION:\n${receiptData.conversation}` : '';
    
    const chatHistory = previousMessages.length > 0 ? 
      `\n\nRECENT CHAT WITH USER:\n${previousMessages.slice(-20).map(m => `${m.role}: ${m.content}`).join('\n')}` : '';
    
    const fullPrompt = systemPrompt + originalConversation + chatHistory;

    // Call OpenAI via proxy
    const response = await fetch('/api/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: fullPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 250, // Slightly higher for better responses
        temperature: 0.88, // Higher for more personality
        presence_penalty: 0.5, // Encourages varied language
        frequency_penalty: 0.3 // Reduces repetitive phrases
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const rawResponse = data.choices[0]?.message?.content || 'Sorry, I need a moment to think about that.';
    console.log('🔍 Raw Sage response:', rawResponse);
    const cleanedResponse = cleanupSageResponse(rawResponse);
    console.log('🔍 Cleaned Sage response:', cleanedResponse);
    return cleanedResponse;
  } catch (error) {
    console.error('Ask Sage error:', error);
    return "Bestie, my crystal ball is foggy right now. Try again in a sec! 🔮";
  }
}
