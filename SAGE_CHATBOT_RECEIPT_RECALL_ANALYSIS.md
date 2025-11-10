# 🔍 Sage Chatbot Receipt Recall Analysis

## Problem Statement
The Sage chatbot does not seem to recall any information from the Receipts (original conversation analysis). Users ask questions about their analyzed conversation, but Sage doesn't reference the original messages or analysis details.

---

## Root Cause Analysis

### Issue #1: Conversation Field Not Included in System Prompt (CRITICAL)

**Location:** `src/lib/chat/askSage.js` (lines 115-122, 136-137)

**Problem:**
- The code builds `fullPrompt` with the original conversation:
  ```javascript
  const originalConversation = receiptData.conversation ? 
    `\n\nORIGINAL ANALYZED CONVERSATION:\n${receiptData.conversation}` : '';
  const fullPrompt = systemPrompt + originalConversation + chatHistory;
  ```
- **BUT** when sending to OpenAI API, it only sends `systemPrompt` (without the conversation):
  ```javascript
  messages: [
    { role: 'system', content: systemPrompt },  // ❌ Missing originalConversation!
    { role: 'user', content: useLite ? contextualQuestion : question }
  ]
  ```

**Impact:** The AI never receives the original conversation text, so it can't reference specific messages or patterns.

---

### Issue #2: Production API Endpoint Missing Conversation (CRITICAL)

**Location:** `api/sage-chat.js` (lines 82-89)

**Problem:**
- The production API endpoint only uses minimal receipt data:
  ```javascript
  const systemPrompt = askSagePrompt
    .replace('{archetype}', receiptData.archetype || 'Unknown')
    .replace('{redFlags}', receiptData.redFlags || 0)
    .replace('{verdictSummary}', receiptData.verdict?.substring(0, 150) || '')
    .replace('{flagNumber}', '1');
  ```
- **The original conversation text is NEVER included in the prompt.**

**Impact:** In production, Sage has no access to the original conversation at all.

---

### Issue #3: Conversation Field May Not Be Passed Through

**Location:** `src/lib/analysis/advancedAnalysis.js` (line 1808)

**Status:** ✅ The `conversation` field IS added to `finalResult` in `generateAlignedResults`:
```javascript
let finalResult = {
  ...shareShotAnalysis,
  conversation: cleanContext.conversation,  // ✅ This exists
  // ...
};
```

**However:** Need to verify that this field survives through:
1. `ReceiptsCardPage.jsx` → receives `analysis` from location.state
2. `TabbedReceiptInterface.jsx` → passes `analysis` as `receiptData` to `AskSageChat`
3. `AskSageSimple.jsx` → receives `receiptData` prop

**Potential Issue:** If the analysis is loaded from database (not from location.state), the `conversation` field might not be stored/retrieved.

---

### Issue #4: Limited Context in Prompt

**Location:** `src/lib/chat/askSagePrompt.js` and `askSagePromptLite.js`

**Current Context Provided:**
- Archetype name
- Red flags count
- Verdict summary (first 120-150 chars)

**Missing Context:**
- Full original conversation text
- Specific red flag details
- Pattern analysis details
- User's question/context notes
- Relationship type
- Background information

**Impact:** Even if conversation is included, Sage doesn't have enough context to provide detailed, specific responses.

---

## Data Flow Verification Needed

### Path 1: Fresh Analysis (from `/new-receipt`)
```
LuxeChatInputPage.jsx
  → navigate('/receipts', { state: { analysis: analysisResult } })
  → ReceiptsCardPage.jsx (receives from location.state)
  → TabbedReceiptInterface.jsx (receives as `analysis` prop)
  → AskSageChat (receives as `receiptData` prop)
```

**Question:** Does `analysisResult` from `generateAlignedResults` include `conversation`? ✅ YES (line 1808)

### Path 2: Saved Receipt (from database)
```
ReceiptsCardPage.jsx
  → Loads from database via receiptId
  → Sets receiptData state
  → TabbedReceiptInterface.jsx
  → AskSageChat
```

**Question:** Is `conversation` field stored in database? **UNKNOWN** - Need to check `receiptService.js`

---

## Recommended Fixes

### Fix #1: Include Conversation in System Prompt (Local Development)
**File:** `src/lib/chat/askSage.js` (line 136)

**Change:**
```javascript
// BEFORE:
messages: [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: useLite ? contextualQuestion : question }
]

// AFTER:
messages: [
  { role: 'system', content: fullPrompt },  // ✅ Use fullPrompt with conversation
  { role: 'user', content: useLite ? contextualQuestion : question }
]
```

---

### Fix #2: Include Conversation in Production API
**File:** `api/sage-chat.js` (lines 82-89)

**Change:**
```javascript
// BEFORE:
const systemPrompt = askSagePrompt
  .replace('{archetype}', receiptData.archetype || 'Unknown')
  .replace('{redFlags}', receiptData.redFlags || 0)
  .replace('{verdictSummary}', receiptData.verdict?.substring(0, 150) || '')
  .replace('{flagNumber}', '1');

const fullPrompt = systemPrompt + '\n\nRECENT CONVERSATION:\n' + 
  previousMessages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n');

// AFTER:
const systemPrompt = askSagePrompt
  .replace('{archetype}', receiptData.archetype || 'Unknown')
  .replace('{redFlags}', receiptData.redFlags || 0)
  .replace('{verdictSummary}', receiptData.verdict?.substring(0, 150) || '')
  .replace('{flagNumber}', '1');

// ✅ Add original conversation
const originalConversation = receiptData.conversation ? 
  `\n\nORIGINAL ANALYZED CONVERSATION:\n${receiptData.conversation}` : '';

const fullPrompt = systemPrompt + originalConversation + '\n\nRECENT CONVERSATION:\n' + 
  previousMessages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n');
```

**Then use `fullPrompt` in the API call:**
```javascript
messages: [
  { role: 'system', content: fullPrompt },  // ✅ Include conversation
  { role: 'user', content: question }
]
```

---

### Fix #3: Enhance Prompt with More Context
**File:** `src/lib/chat/askSagePrompt.js` and `askSagePromptLite.js`

**Add to prompt template:**
- Full original conversation (already being added, just need to ensure it's sent)
- Specific red flag details (from `receiptData.redFlagChips` or `receiptData.redFlagTags`)
- User's background/context notes (from `receiptData.background`)
- Relationship type (from `receiptData.relationshipType`)

**Example enhancement:**
```javascript
const contextBlock = `
ORIGINAL CONVERSATION:
${receiptData.conversation || 'Not available'}

RELATIONSHIP CONTEXT:
- Type: ${receiptData.relationshipType || 'Unknown'}
- Background: ${receiptData.background || 'None provided'}

RED FLAGS IDENTIFIED:
${receiptData.redFlagChips?.join(', ') || receiptData.redFlagTags?.join(', ') || 'None'}

ANALYSIS SUMMARY:
- Archetype: ${receiptData.archetype}
- Red Flags: ${receiptData.redFlags}/10
- Verdict: ${receiptData.verdict}
`;
```

---

### Fix #4: Verify Database Storage
**File:** `src/lib/services/receiptService.js`

**Check:**
- Is `conversation` field stored when saving receipts?
- Is `conversation` field retrieved when loading receipts?

**If not stored:** Add `conversation` to database schema and save/retrieve logic.

---

## Testing Plan

### Test 1: Verify Conversation Field Exists
1. Create a new receipt from `/new-receipt`
2. Open browser console
3. In `AskSageSimple.jsx`, add: `console.log('receiptData:', receiptData)`
4. Verify `receiptData.conversation` exists and contains the original conversation

### Test 2: Verify Conversation in API Call
1. In `askSage.js`, add logging:
   ```javascript
   console.log('Full prompt being sent:', fullPrompt);
   console.log('Original conversation included:', !!originalConversation);
   ```
2. Check browser console to see if conversation is in the prompt

### Test 3: Test Production API
1. Deploy to production
2. Check server logs for `/api/sage-chat` requests
3. Verify `receiptData.conversation` is in the request body
4. Verify it's included in the system prompt sent to OpenAI

### Test 4: Test Chatbot Responses
1. Ask Sage: "What did they say about [specific topic from conversation]?"
2. Sage should reference specific messages from the original conversation
3. If not, the conversation is not being included in the prompt

---

## Priority Order

1. **CRITICAL:** Fix #1 - Include conversation in local development system prompt
2. **CRITICAL:** Fix #2 - Include conversation in production API system prompt
3. **HIGH:** Fix #4 - Verify database storage/retrieval of conversation field
4. **MEDIUM:** Fix #3 - Enhance prompt with additional context (red flags, background, etc.)

---

## Notes

- The conversation field IS being created in `generateAlignedResults` (line 1808)
- The main issue is that it's not being included in the actual API calls to OpenAI
- Both local development and production paths need fixes
- The prompt templates (`askSagePrompt.js` and `askSagePromptLite.js`) don't explicitly mention using the original conversation, but they should reference it when relevant

---

## Next Steps

1. **Verify** that `receiptData.conversation` exists when `AskSageChat` receives it
2. **Fix** the system prompt to include the conversation in both local and production paths
3. **Test** that Sage can now reference specific messages from the original conversation
4. **Enhance** the prompt with additional context for more detailed responses

