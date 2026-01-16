# **Get The Receipts — Foolproof Directions**

## **Outcome**

Deep Dive only runs on a validated, normalized, speaker-attributed transcript. If validation fails, execution stops loud. No fallbacks. No "processedMessage." No silent paths.

---

## **0) Non-negotiables**

1. Single entry point to Deep Dive: `runDeepDive(conversationPayload, shareShotAnalysis, cleanContext)`.

2. Single source of truth for text: `normalizedTranscript = normalizeConversation(conversationPayload)`.

3. Guardrails block before any API work.

4. No `Promise.allSettled` around Deep Dive. Use `Promise.all` so any error aborts.

5. No Playbook or "advancedResults" fallback if Deep Dive fails. Surface error to UI.

---

## **1) Remove every bad path (one-time cleanup)**

Run these searches from repo root. Zero hits after you fix.

```shell
# 1. No stale variables get into Deep Dive
rg -n "processedMessage" | rg -v "Truth Receipt|Immunity"
rg -n "TEXTS:\\n\\$\\{message\\}"
rg -n "shortenedText|summarizedText"

# 2. No allSettled around Deep Dive
rg -n "Promise\\.allSettled\\(.*runDeepDive"

# 3. No silent fallbacks for Deep Dive
rg -n "sanitizeDeepDive|synthesize.*Deep Dive|fallback.*Deep Dive"
```

Delete or rewrite any matching blocks. Deep Dive must not reference these.

---

## **2) Contract and validation (in `conversationSchema.js`)**

The `validateConversationPayload` function enforces:

- ✅ Minimum 500 characters in `rawText`
- ✅ At least 2 speakers mapped
- ✅ OCR confidence >= 0.8 (if source is 'ocr')
- ✅ No `requiresManualConfirmation` flag
- ✅ All required fields present

**All validation errors throw with prefix: `🚫 Deep Dive blocked:`**

---

## **3) Normalizer (in `conversationSchema.js`)**

`normalizeConversation(payload)`:
- Splits `rawText` into lines
- Preserves `<time>` tags
- Formats as `[SPEAKER: <Name>] <Message Text>`
- Throws if normalization produces empty transcript

---

## **4) Deep Dive call wrapper (standalone function in `runDeepDive.js`)**

**Single entry point:** `src/lib/analysis/runDeepDive.js`

```javascript
export async function runDeepDive(conversationPayload, shareShotAnalysis, cleanContext) {
  // 1. Validate payload (throws on failure)
  validateConversationPayload(conversationPayload);
  
  // 2. Normalize transcript once
  const normalizedTranscript = normalizeConversation(conversationPayload);
  
  // 3. Build prompt with normalized transcript
  const userContent = `ORIGINAL ANALYZED CONVERSATION:\n${normalizedTranscript}\n\nReturn JSON only.`;
  
  // 4. Make API call
  
  // 5. Evidence gate: >=2 receipts with quotes
  if (!Array.isArray(obj.receipts) || obj.receipts.length < 2 || 
      obj.receipts.some(r => !r?.quote)) {
    throw new Error('🚫 Deep Dive blocked: Missing receipts');
  }
  
  return obj; // No sanitization - return raw result
}
```

---

## **5) Single execution route (in `advancedAnalysis.js`)**

```javascript
// ✅ Use Promise.all - if Deep Dive throws, stop execution
const { runDeepDive } = await import('./runDeepDive');
const runDeepDiveWrapper = async () => {
  return await runDeepDive(conversationPayload, shareShotAnalysis, cleanContext);
};

try {
  const [deepResult, immResult] = await Promise.all([
    runDeepDiveWrapper(), 
    runImmunity()
  ]);
  alignedDeepDive = deepResult;
  immunityTraining = immResult;
} catch (error) {
  // ✅ Re-throw all errors - no fallback
  throw error;
}
```

**Never use `Promise.allSettled` around Deep Dive.**

---

## **6) UI gate in `LuxeChatInputPage.jsx`**

Before calling any analysis:

```javascript
// Pre-validate payload before calling generateAlignedResults
try {
  const testPayload = normalizeConversationPayload(normalizedData);
  
  if (testPayload.requiresManualConfirmation || testPayload.validationError) {
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Speaker Mapping Required",
      description: testPayload.validationError || "Please verify that at least 2 speakers are correctly identified.",
    });
    return; // Stop here - don't call analysis
  }
} catch (preValidationError) {
  // Still allow backend validation, but log warning
  console.warn('⚠️ Pre-validation check failed:', preValidationError);
}
```

---

## **7) Kill all Deep Dive fallbacks**

✅ **DONE:** Removed `sanitizeDeepDive` function completely.

✅ **DONE:** No fallback generation when Deep Dive fails.

✅ **DONE:** Errors throw immediately - no error status objects.

---

## **8) Repo safety nets**

### **A) Pre-commit hook (`.husky/pre-commit`)** - OPTIONAL

```shell
#!/bin/sh
npx tsx ./scripts/guardrails.ts || { echo "Guardrails failed"; exit 1; }
```

### **B) `scripts/guardrails.ts`** - OPTIONAL

```ts
import { execSync } from "node:child_process";
function fail(msg:string){ console.error("GUARDRAIL:", msg); process.exit(1); }

const bad = execSync(`rg -n "processedMessage|TEXTS:\\\\n\\$\\{message\\}|Promise\\.allSettled\\(.*runDeepDive|sanitizeDeepDive|fallback" || true`).toString();
if (bad.trim()) fail("Forbidden pattern(s) present:\n" + bad);

console.log("Guardrails OK");
```

### **C) ESLint rule snippet (`.eslintrc.cjs`)** - OPTIONAL

```javascript
module.exports = {
  rules: {
    "no-restricted-syntax": [
      "error",
      { selector: "CallExpression[callee.object.name='Promise'][callee.property.name='allSettled']", message: "Do not use allSettled around Deep Dive" }
    ]
  }
}
```

---

## **9) Tests you must pass**

### **Unit: Validation blocks hard**

```javascript
test("blocks low OCR confidence", () => {
  const p = { 
    id:"1", 
    source:"ocr", 
    rawText:"x".repeat(600), 
    speakers:{a:"Alice",b:"Bob"}, 
    ocrMeta:{confidence:0.6} 
  };
  expect(()=>validateConversationPayload(p)).toThrow(/blocked/i);
});
```

### **Unit: Normalizer returns speaker-prefixed lines**

Check that output contains `[SPEAKER:` and no timestamp-only lines.

### **Integration: Three canary payloads**

1. `requiresManualConfirmation: true` → UI toast and no network call.

2. `< 2 speakers` → error thrown before model call.

3. `ocrMeta.confidence = 0.75` → error thrown before model call.

### **Happy path**

OCR confidence 0.9, 2 speakers, 1k+ tokens rawText. Assert:

* Prompt contains `ORIGINAL ANALYZED CONVERSATION:` and `[SPEAKER:`.

* Model output includes `receipts` with at least two quotes.

---

## **10) Logging and observability**

Add a hard prefix for forensic logs:

* On entry to `runDeepDive`: `console.info("[DD] start", { id: payload.id })`

* On guardrail block: `console.warn("[DD] guardrail", message)`

* On success: `console.info("[DD] success", { receiptCount: obj.receipts?.length })`

Set up a simple counter in your analytics to alert if guardrail blocks spike.

---

## **11) Dev checklist (paste in PR template)**

```
- [ ] No references to processedMessage in Deep Dive code paths
- [ ] No Promise.allSettled around Deep Dive
- [ ] Guardrails throw before API setup
- [ ] Deep Dive prompt uses normalizedTranscript only
- [ ] Evidence gate enforces >=2 receipts with quotes
- [ ] UI blocks when requiresManualConfirmation or OCR < 0.8
- [ ] All tests in section 9 pass
- [ ] Guardrails script passes on pre-commit (if implemented)
```

---

## **12) One-screen sanity for the team**

* If OCR is messy, we stop.

* If names are not confirmed, we stop.

* If input is too short, we stop.

* Deep Dive never runs on "processedMessage."

* If Deep Dive fails, we show an error. We do not "make something up."

Do these twelve sections exactly. If anything still slips, it is either a new code path or someone disabled the guardrails. The repo checks above make both unlikely.

