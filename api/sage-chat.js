import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Server-side env var
});

// Sage prompt for Ask Sage functionality
const askSagePrompt = `You are Sage, the brutally honest relationship pattern-reader. You just analyzed someone's conversation and now they're asking follow-up questions.

# YOUR PERSONALITY
You're the wine-drunk bestie who's seen this 47 times, calls out patterns without mercy, but protects your friend fiercely. You validate their gut FIRST, then give hard truths. You make them laugh while dropping bombs.

# VOICE DNA (KEEP THIS ENERGY)
- 70% savage, 30% supportive
- Screenshot-bait one-liners are welcome (but no lists/markdown)
- Formula: Drag → Decode → Soft slap of truth → Tiny uplift
- Superpower: pattern recognition in relationship behaviors
- Limitation: you only see texts, not the full story
- Always reuse the user's key terms at least once so they feel deeply heard.
- Proactively answer the thought they'll have next (e.g., start a line with "you're probably thinking...").

# RESPONSE FORMAT
- Keep responses 1-4 sentences max
- Match their energy (if they're upset, be more supportive; if they're testing, be more savage)
- Use their actual names from the conversation
- Reference the archetype and red flags from the original analysis

# CONTEXT
- Archetype: {archetype}
- Red Flags Found: {redFlags}
- Verdict Summary: {verdictSummary}
- Flag Number: {flagNumber}

Respond as Sage with brutal honesty and pattern recognition.`;

// Lightweight server-side cleanup to ensure consistent spacing in production
const cleanupSageResponse = (text = '') => {
  let clean = text;
  // Normalize em dashes to hyphens
  clean = clean.replace(/\u2014/g, ' - ');
  // If there are no blank lines, insert one every 2 sentences (split on ., !, ?)
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  if (sentences.length >= 2 && !clean.includes('\n\n')) {
    clean = sentences
      .map((s, i) => {
        const needsBreak = (i + 1) % 2 === 0 && i < sentences.length - 1;
        return s + (needsBreak ? '\n\n' : ' ');
      })
      .join('')
      .trim();
  }
  // Normalize whitespace and ensure paragraphs render
  clean = clean
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n(?!\n)/g, '\n\n')
    .trim();
  return clean;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, receiptData, previousMessages = [] } = req.body;

    if (!question || !receiptData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Emergency check
    const emergencyWords = ['kill myself', 'hurt myself', 'end it'];
    if (emergencyWords.some(word => question.toLowerCase().includes(word))) {
      return res.json({ 
        response: "Bestie, this is beyond my pay grade. Please call 988 (Crisis Lifeline) right now. I'm here for drama, not emergencies."
      });
    }

    // Use the full prompt
    const systemPrompt = askSagePrompt
      .replace('{archetype}', receiptData.archetype || 'Unknown')
      .replace('{redFlags}', receiptData.redFlags || 0)
      .replace('{verdictSummary}', receiptData.verdict?.substring(0, 150) || '')
      .replace('{flagNumber}', '1'); // Just use first flag for now

    // ✅ FIX: Add original analyzed conversation (check multiple possible locations)
    const originalConversation = receiptData.conversation || receiptData.originalMessage || receiptData.message || '';
    const conversationBlock = originalConversation ? 
      `\n\nORIGINAL ANALYZED CONVERSATION:\n${originalConversation}` : '';
    
    // ✅ ENHANCEMENT: Build additional context block
    const additionalContext = [];
    
    // Core analysis fields (from lines 265-267 in prompt)
    if (receiptData?.archetype) {
      additionalContext.push(`Archetype: ${receiptData.archetype}`);
    }
    if (typeof receiptData?.redFlags !== 'undefined') {
      additionalContext.push(`Red Flags: ${receiptData.redFlags}/10`);
    }
    if (receiptData?.verdict) {
      additionalContext.push(`Pattern: ${receiptData.verdict.substring(0, 150)}`);
    }
    
    // Additional context fields
    if (receiptData?.redFlagChips && receiptData.redFlagChips.length > 0) {
      additionalContext.push(`Red Flags Identified: ${receiptData.redFlagChips.slice(0, 5).join(', ')}`);
    } else if (receiptData?.redFlagTags && receiptData.redFlagTags.length > 0) {
      additionalContext.push(`Red Flags Identified: ${receiptData.redFlagTags.slice(0, 5).join(', ')}`);
    }
    if (receiptData?.background) {
      additionalContext.push(`Background Context: ${receiptData.background}`);
    }
    if (receiptData?.relationshipType) {
      additionalContext.push(`Relationship Type: ${receiptData.relationshipType}`);
    }
    if (receiptData?.userName) {
      additionalContext.push(`User Name: ${receiptData.userName}`);
    }
    if (receiptData?.otherName) {
      additionalContext.push(`Other Name: ${receiptData.otherName}`);
    }
    
    const contextBlock = additionalContext.length > 0 ? `\n\nADDITIONAL CONTEXT:\n${additionalContext.join('\n')}` : '';
    
    // ✅ FIX: Add chat history with more context
    const chatHistory = previousMessages.length > 0 ? 
      `\n\nRECENT CHAT WITH USER:\n${previousMessages.slice(-20).map(m => `${m.role}: ${m.content}`).join('\n')}` : '';

    const fullPrompt = systemPrompt + contextBlock + conversationBlock + chatHistory;
    
    // Debug logging
    console.log('🔍 api/sage-chat - Prompt check:', {
      hasOriginalConversation: !!originalConversation,
      originalConversationLength: originalConversation?.length || 0,
      hasChatHistory: !!chatHistory,
      chatHistoryLength: chatHistory?.length || 0,
      fullPromptLength: fullPrompt.length
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullPrompt },
        { role: 'user', content: question }
      ],
      max_tokens: 250,
      temperature: 0.88,
      presence_penalty: 0.5,
      frequency_penalty: 0.3
    });

    const raw = completion.choices[0].message.content;
    const cleaned = cleanupSageResponse(raw);
    return res.json({ response: cleaned });

  } catch (error) {
    console.error('Ask Sage API error:', error);
    return res.status(500).json({
      response: "Bestie, my crystal ball is foggy right now. Try again in a sec! 🔮"
    });
  }
}