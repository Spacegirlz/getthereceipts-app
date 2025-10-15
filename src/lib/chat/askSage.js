import OpenAI from 'openai';
import { askSagePrompt } from './askSagePrompt';
import { supabase } from '@/lib/database/customSupabaseClient';

// Initialize OpenAI with browser compatibility for local development
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - will use API endpoint in production
});

/**
 * Lightweight formatting cleanup for Sage responses
 * Handles the 8 formatting problems with minimal processing
 */
const cleanupSageResponse = (text) => {
  let clean = text;
  
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
  // Add line breaks every 2 sentences if none exist. Split on ., !, ?
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  if (sentences.length >= 2 && !clean.includes('\n\n')) {
    // Add line break every 2 sentences for readability
    clean = sentences.map((s, i) => {
      const needsBreak = (i + 1) % 2 === 0 && i < sentences.length - 1;
      return s + '.' + (needsBreak ? '\n\n' : ' ');
    }).join('').trim();
  }
  
  // 5. Clean up multiple spaces and excessive line breaks
  clean = clean
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    // normalize single newlines to double to keep paragraphs readable
    .replace(/\n(?!\n)/g, '\n\n')
    .trim();
  
  return clean;
};

export async function askSage(question, receiptData, previousMessages = [], opts = {}) {
  try {
    // Database daily chat cap for Free users (5/day, UTC)
    if (opts?.userId && !opts?.isPremium) {
      const { data: canChat, error } = await supabase.rpc('consume_daily_chat', {
        user_uuid: opts.userId
      });
      
      if (error) {
        console.error('Error checking daily chat limit:', error);
        return 'Error checking chat limit. Please try again.';
      }
      
      if (!canChat) {
        return 'Daily chat limit reached for Free accounts. Upgrade for unlimited chat.';
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

    // Add conversation history
    const fullPrompt = systemPrompt + '\n\nRECENT CONVERSATION:\n' + 
      previousMessages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n');

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullPrompt },
        { role: 'user', content: question }
      ],
      max_tokens: 250, // Slightly higher for better responses
      temperature: 0.88, // Higher for more personality
      presence_penalty: 0.5, // Encourages varied language
      frequency_penalty: 0.3 // Reduces repetitive phrases
    });

    const rawResponse = completion.choices[0].message.content;
    const cleanedResponse = cleanupSageResponse(rawResponse);
    return cleanedResponse;
  } catch (error) {
    console.error('Ask Sage error:', error);
    return "Bestie, my crystal ball is foggy right now. Try again in a sec! 🔮";
  }
}
