# Speaker Mapping Guardrails

## Overview

Guardrails ensure that Deep Dive only runs when speaker mapping is reliable. These checks prevent incorrect analysis due to poor color detection or low confidence.

## Guardrails

### 1. Minimum 2 Unique Colors

**Rule:** At least 2 unique colors must be detected before auto-assigning names.

**Implementation:**
```javascript
if (uniqueColors.length < 2 && colorKeys.length < 2) {
  throw new Error('At least 2 unique colors required before auto-assigning names. Please manually edit names.');
}
```

**Why:** Single color detection is unreliable. We need at least 2 speakers to distinguish between them.

### 2. Confidence Threshold (80%)

**Rule:** OCR confidence must be >= 0.8 (80%) before proceeding.

**Implementation:**
```javascript
if (confidence < 0.8) {
  throw new Error(`Low speaker confidence (${(confidence * 100).toFixed(1)}%) — needs manual edit. Minimum required: 80%`);
}
```

**Why:** Low confidence indicates poor OCR quality, which leads to incorrect speaker attribution.

### 3. Minimum 2 Speakers Mapped

**Rule:** At least 2 unique speakers must be mapped.

**Implementation:**
```javascript
const speakerNames = Object.values(speakers).filter((v, i, arr) => arr.indexOf(v) === i);
if (speakerNames.length < 2) {
  throw new Error('At least 2 unique speakers must be mapped. Please manually edit names.');
}
```

**Why:** Conversations require at least 2 participants. Single speaker mapping is invalid.

## Persistent Storage

Speaker mappings are stored in `conversationSpeakers.json` (localStorage in browser) for reuse:

```javascript
import { saveSpeakerMapping, getSpeakerMapping } from '@/lib/schemas/speakerStorage';

// Save mapping
await saveSpeakerMapping(conversationId, { "blue": "Alice", "grey": "Bob" });

// Load mapping
const mapping = await getSpeakerMapping(conversationId);
```

## Flow

### Normal Flow (Passes Guardrails)

1. User uploads screenshots
2. OCR extracts text and detects colors
3. `parseOCR()` validates guardrails
4. If passes: Save mapping, proceed to Deep Dive
5. If fails: Set `requiresManualConfirmation: true`, show error

### Manual Confirmation Flow (Guardrails Fail)

1. User uploads screenshots
2. OCR extracts text (low confidence or < 2 colors)
3. `parseOCR()` throws validation error
4. Payload marked with `requiresManualConfirmation: true`
5. User manually edits names
6. User resubmits with `skipValidation: true`
7. Deep Dive proceeds

## Deep Dive Blocking

Deep Dive is **blocked** if:

1. `conversationPayload.requiresManualConfirmation === true`
2. `conversationPayload.validationError` exists
3. OCR confidence < 0.8
4. < 2 unique colors detected
5. < 2 speakers mapped

**Error Message:**
```
🚫 Deep Dive blocked: [validation error message]
```

## Usage

### In `parseOCR()`

```javascript
import { parseOCR, validateSpeakerMapping } from '@/lib/schemas/conversationSchema';

try {
  const payload = await parseOCR(images, colorMapping, userName, otherName);
  // Guardrails passed - proceed
} catch (error) {
  // Guardrails failed - require manual confirmation
  console.error(error.message);
  // Show UI for manual name editing
}
```

### In `normalizeConversationPayload()`

```javascript
const payload = normalizeConversationPayload({
  texts,
  extractedTexts,
  colorMapping,
  userName,
  otherName,
  ocrMeta: { confidence: 0.75 } // Low confidence
});

if (payload.requiresManualConfirmation) {
  // Show error and require manual editing
  console.error(payload.validationError);
}
```

### In Deep Dive

```javascript
// Guardrails checked automatically before Deep Dive
if (conversationPayload.requiresManualConfirmation) {
  throw new Error(`🚫 Deep Dive blocked: ${conversationPayload.validationError}`);
}
```

## Files

- **Validation**: `src/lib/schemas/conversationSchema.js` (`validateSpeakerMapping`)
- **Storage**: `src/lib/schemas/speakerStorage.js`
- **Usage**: `src/lib/analysis/advancedAnalysis.js` (Deep Dive blocking)
- **Documentation**: This file

