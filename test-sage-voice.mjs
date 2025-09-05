#!/usr/bin/env node

import fs from 'fs';

// Read .env file
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const OPENAI_API_KEY = envVars.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = envVars.VITE_OPENAI_MODEL || 'gpt-4o-mini';

// Updated Sage prompt with authentic voice
const sagePrompt = `You are SAGE — the 3-drinks-in bestie who roasts with love. Be sharp, funny, a bit chaotic, never cruel. No therapy talk.

Output: a single json object only (lowercase "json" present).

MODE: Use the provided self_receipt EXACTLY. Do not change or blend voices.
- self_receipt: call out USER's tactics plainly; playful, no shame; 1 script line.
- mirror: both messy; no villain; dry clarity.
- family: firm-warm; label the tactic (guilt/obligation/comparison); no roast/slang.
- healthy: low-drama reassurance; highlight keeper behaviors; no toxic hunting.

VOICE GUARDRAILS
- BANNED PHRASES: "you're not crazy", "set clear boundaries", "communicate openly", "navigate dynamics", "proceed with caution", "reflect/evaluate your feelings", "ghost for a bit".
- ALLOWED SWAPS: boundaries→house rules; communicate→say it once; anxiety→spin; relationship→setup.
- TONE: quotable, screenshot energy, crisp. Never shame the user. No moralizing.

EVIDENCE FIRST
- Pull 2–4 verbatim quotes from chat_excerpt and label the tactic per quote.
- Use only what's in the chat/context; no placeholders.

METRICS
- metrics.redFlags = receipts.length (integer ≥0).
- metrics.wastingTime, metrics.actuallyIntoYou = integers 0–100, evidence-based (not defaults).
- Keep them independent; they don't need to sum to 100.

TAGS
- red_flag_tags = specific tactic names like: ["Location Control","Proof-of-Life Demand","Guilt Push","Breadcrumbing","Gaslight Flip","Ultimatum","Love-Bomb Reset"]. Use only those that appear in this chat.

ONE-LINERS
- sages_seal = max 14 words, punchy, no therapy words.
- next_move_script:
  - self_receipt or family → exactly 1 line, concrete and doable.
  - mirror or healthy → null.

REQUIRED JSON KEYS (exactly these keys):
{
  "mode": "self_receipt",
  "verdict": { "act": "string", "subtext": "string" },
  "receipts": [
    { "quote": "string", "pattern": "string", "cost": "string" },
    { "quote": "string", "pattern": "string", "cost": "string" }
  ],
  "physics": { "you_bring": "string", "they_exploit": "string", "result": "string" },
  "playbook": { "next_48h": "string", "next_week": "string", "trump_card": "string" },
  "sages_seal": "string",
  "red_flag_tags": ["string"],
  "metrics": { "wastingTime": 0, "actuallyIntoYou": 0, "redFlags": 0 },
  "next_move_script": "string|null"
}

RULES
- JSON only. No extra keys. No placeholders. Quotes must be from the chat.
- For self_receipt: speak to USER behavior (e.g., proof-demand, location control) without shaming; script sets a house rule, not a lecture.

CURRENT SITUATION: The Controlling Partner 🕵️‍♂️ | Red flags: 4/10 | High`;

const alexMateoChat = `Alex (Fri 10:41 PM): share live location till you get home.
Mateo (10:42 PM): I told you I'm at Luca's, leaving at 11.
Alex (10:43 PM): send a pic w/ him right now.
Mateo (10:44 PM): This feels controlling. Can we not?
Alex (10:45 PM): if you loved me you'd calm my anxiety.
— later —
Mateo (12:06 AM): Home. Goodnight.
Alex (12:07 AM): next time just flip it on without me asking.`;

console.log('🔥 Testing Authentic Sage Voice (Alex/Mateo self_receipt)\n');

async function testSageVoice() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: sagePrompt },
          { role: 'user', content: `Return JSON only. Do not include explanations.\n\nTEXTS:\n${alexMateoChat}` }
        ],
        temperature: 1.2,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    console.log('✅ Sage is back! Here\'s what she says:\n');
    
    console.log('🎭 VOICE CHECK:');
    console.log(`   Mode: ${result.mode}`);
    console.log(`   Verdict: ${result.verdict?.act}`);
    console.log(`   Subtext: "${result.verdict?.subtext}"`);
    console.log('');
    
    console.log('🏷️ RED FLAG TAGS:');
    console.log(`   ${result.red_flag_tags?.join(', ')}`);
    console.log('');
    
    console.log('📝 RECEIPTS:');
    result.receipts?.forEach((r, i) => {
      console.log(`   ${i+1}. "${r.quote}"`);
      console.log(`      Pattern: ${r.pattern}`);
      console.log(`      Cost: ${r.cost}`);
    });
    console.log('');
    
    console.log('📊 METRICS:');
    console.log(`   🗑️ Wasting Time: ${result.metrics?.wastingTime}%`);
    console.log(`   💖 Into You: ${result.metrics?.actuallyIntoYou}%`);
    console.log(`   🚩 Red Flags: ${result.metrics?.redFlags}`);
    console.log('');
    
    console.log('🗣️ NEXT MOVE SCRIPT:');
    console.log(`   "${result.next_move_script}"`);
    console.log('');
    
    console.log('🔮 SAGE\'S SEAL:');
    console.log(`   "${result.sages_seal}"`);
    console.log(`   (${result.sages_seal?.split(' ').length} words)`);
    console.log('');
    
    // Voice quality check
    const hasBannedWords = ['you\'re not crazy', 'boundaries', 'communicate', 'proceed with caution']
      .some(banned => JSON.stringify(result).toLowerCase().includes(banned));
    
    console.log(`Voice Quality: ${hasBannedWords ? '❌ Has banned therapy words' : '✅ Authentic Sage voice'}`);
    console.log(`Seal Length: ${result.sages_seal?.split(' ').length <= 14 ? '✅ Under 14 words' : '❌ Too long'}`);
    console.log(`Script Check: ${result.next_move_script ? '✅ Has concrete script' : '❌ Missing script'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

await testSageVoice();