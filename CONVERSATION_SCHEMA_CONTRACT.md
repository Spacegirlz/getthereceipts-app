# Conversation Data Schema Contract

## Overview

This document defines the **explicit data contract** for conversation data that MUST be passed to Deep Dive analysis. This contract guarantees that Deep Dive always receives full, clean, speaker-attributed conversation text, regardless of whether the source was OCR or pasted text.

## Schema Definition

```javascript
interface ConversationPayload {
  id: string;                    // Unique identifier for this conversation
  source: "ocr" | "paste";       // Source of the conversation data
  rawText: string;               // Untouched original text (REQUIRED for Deep Dive)
  processedText?: string;        // Normalized form (optional, for visualization only)
  speakers: Record<string, string>; // Color name or detected name -> actual speaker name mapping
  ocrMeta?: {                    // OCR-specific metadata (optional)
    frameCount: number;          // Number of screenshot frames processed
    detectedColors: string[];     // Colors detected in screenshots
    confidence: number;           // OCR confidence score (0-1)
  };
}
```

## Critical Rules

### ✅ Rule 1: Deep Dive Always Receives `rawText + speakers`

**Deep Dive MUST always receive:**
- `rawText`: The untouched original text
- `speakers`: Speaker attribution mapping

**Deep Dive MUST NOT receive:**
- `processedText` (this is only for visualization/highlights)

### ✅ Rule 2: Speaker Attribution

The `speakers` object maps identifiers to actual names:

**For OCR (screenshots):**
```javascript
{
  "blue": "Piet",      // Color -> Name
  "grey": "Nanna"     // Color -> Name
}
```

**For Paste (text input):**
```javascript
{
  "Me": "Piet",        // Pattern -> Name
  "Them": "Nanna"     // Pattern -> Name
}
```

### ✅ Rule 3: Source Detection

- `source: "ocr"` when `extractedTexts.length > 0`
- `source: "paste"` when text is pasted directly

## Implementation

### Normalization Function

```javascript
import { normalizeConversationPayload, validateConversationPayload } from '@/lib/schemas/conversationSchema';

const payload = normalizeConversationPayload({
  texts: message,
  extractedTexts: context?.extractedTexts || [],
  colorMapping: context?.colorMapping || '',
  userName: context?.userName || '',
  otherName: context?.otherName || '',
  source: context?.extractedTexts?.length > 0 ? 'ocr' : 'paste',
  ocrMeta: context?.ocrMeta || {}
});

validateConversationPayload(payload);
```

### Formatting for Deep Dive

```javascript
import { formatConversationForDeepDive } from '@/lib/schemas/conversationSchema';

const formattedConversation = formatConversationForDeepDive(payload);
// This applies speaker attribution to the rawText
```

## Usage in Code

### In `generateAlignedResults` (advancedAnalysis.js)

1. **Normalize** conversation data at the start:
```javascript
const conversationPayload = normalizeConversationPayload({
  texts: message,
  extractedTexts: context?.extractedTexts || [],
  colorMapping: context?.colorMapping || '',
  userName: context?.userName || '',
  otherName: context?.otherName || '',
  source: context?.extractedTexts?.length > 0 ? 'ocr' : 'paste',
  ocrMeta: context?.ocrMeta || {}
});
```

2. **Format** conversation for Deep Dive:
```javascript
const formattedConversation = formatConversationForDeepDive(conversationPayload);
```

3. **Use** formatted conversation in Deep Dive API call:
```javascript
const body = {
  model: openAIModel,
  messages: [
    { role: 'system', content: deepDiveSystemPrompt },
    { role: 'user', content: `Return JSON only. Do not include explanations.\n\nTEXTS:\n${formattedConversation}` }
  ],
  // ...
};
```

## Validation

The schema includes validation that ensures:
- `id` is a non-empty string
- `source` is either "ocr" or "paste"
- `rawText` is a non-empty string
- `speakers` is an object

If validation fails, an error is thrown with a descriptive message.

## Benefits

1. **Consistency**: Deep Dive always receives the same format, regardless of input source
2. **Speaker Attribution**: Color mappings and name detections are properly applied
3. **Traceability**: Each conversation has a unique ID for debugging
4. **Type Safety**: Explicit contract prevents data format errors
5. **Maintainability**: Single source of truth for conversation data structure

## Migration Notes

- All conversation data flows through `normalizeConversationPayload()` before Deep Dive
- The `formatConversationForDeepDive()` function applies speaker attribution
- Both OCR and paste sources follow the same contract
- Fallback handling ensures backward compatibility

## Files

- **Schema Definition**: `src/lib/schemas/conversationSchema.js`
- **Usage**: `src/lib/analysis/advancedAnalysis.js` (in `generateAlignedResults`)
- **Documentation**: This file

