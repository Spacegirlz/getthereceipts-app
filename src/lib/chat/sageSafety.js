export const SAGE_SAFETY_LAYER = {
  EXPLICIT_ALLOWS: [
    /cut (him|her|them|ties|contact) (off|out)/i,
    /toxic (relationship|ex|friend)/i,
    /grooming (his|her|their) (beard|hair|dog)/i,
  ],

  HARD_BLOCKS: [
    {
      trigger: (t) => /\b(kill myself|end it all|want to die|suicide|end my life|can't go on)\b/i.test(t),
      response: "Bestie, I need you to call 988 (Crisis Lifeline) right now. This is beyond relationship patterns  -  it's about keeping you safe. I care about you, but they’re trained for this. Please reach out. 💜"
    },
    {
      trigger: (t) => {
        const m = t.match(/(?:i'm|i am|im)\s*(\d+).{0,30}?(?:he's|she's|they're|he is|she is|they are)\s*(\d+)/i);
        if (!m) return false;
        const a = parseInt(m[1], 10), b = parseInt(m[2], 10);
        const younger = Math.min(a, b), older = Math.max(a, b);
        return Number.isFinite(younger) && Number.isFinite(older) && younger < 18 && older >= 18 && (older - younger) >= 3;
      },
      response: "Hey, I need to pause here. Age gaps with someone under 18 can be dangerous. If you’re feeling pressured or unsafe, talk to a trusted adult or reach RAINN (1‑800‑656‑4673). You deserve to feel safe."
    },
    {
      trigger: (t) => /\b(is hurting me|won't let me leave|locked me|hitting me|choking me)\b/i.test(t),
      response: "If you’re in immediate danger, call 911 or the Domestic Violence Hotline: 1‑800‑799‑7233. Your safety matters more than anything right now."
    }
  ],

  SOFT_REDIRECTS: [
    {
      trigger: (t) => /\b(hurt myself|cutting|self[-\s]?harm|urge to harm)\b/i.test(t),
      prefix: "Bestie, this sounds bigger than text analysis. If you’re struggling with self‑harm thoughts, Crisis Text Line (text HOME to 741741) has real humans who can sit with you. If you still want to talk about the relationship stuff, I’m here. "
    },
    {
      trigger: (t) => /\b(he|she|they)\s+(grabbed|pushed|threatened|controlled|tracked)\b/i.test(t),
      prefix: "I’m hearing controlling/violent vibes  -  that matters more than any pattern read. The DV Hotline (1‑800‑799‑7233) can help you think through options safely. "
    }
  ],
};

export function collectSafetyText(question, previousMessages) {
  const recent = (previousMessages || []).slice(-5).map(m => m?.content || '').join(' ');
  return `${question || ''} ${recent}`.trim();
}


