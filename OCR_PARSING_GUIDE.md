# OCR Parsing & Conversation Normalization Guide

## Overview

This guide documents the **two-step process** for handling OCR and conversation normalization. These steps are **discrete and must not be merged or skipped**.

## Step 1: Parse OCR (`parseOCR`)

**Purpose:** Extract text from images, assign colors, build speakers mapping, preserve timestamps.

**Function:** `parseOCR(inputImages, colorMapping, userName, otherName)`

### What It Does

1. **Extracts text** from input images using Tesseract OCR
2. **Detects timestamps** and marks them with `<time>` tags (NEVER strips them)
3. **Assigns colors** from colorMapping parameter
4. **Builds speakers** mapping (color → name)
5. **Returns** `ConversationPayload` with `rawText` containing `<time>` tags

### Timestamp Preservation

Timestamps are **never stripped**. They are marked with `<time>` tags:

```javascript
// Before: "9:30 AM I can't believe you said that."
// After:  "<time>9:30 AM</time> I can't believe you said that."
```

**Supported timestamp patterns:**
- Time: `9:30`, `9:30 AM`, `14:30`
- Date: `12/25/2024`, `25.12.2024`
- Day: `Monday 25th`, `Mon 25`
- Month: `January 25`, `Jan 25`

### Example Usage

```javascript
import { parseOCR } from '@/lib/schemas/conversationSchema';

const images = [file1, file2]; // File objects
const colorMapping = "blue = Alice, grey = Bob";
const userName = "Alice";
const otherName = "Bob";

const payload = await parseOCR(images, colorMapping, userName, otherName);
// Returns: {
//   id: "ocr_1234567890_abc123",
//   source: "ocr",
//   rawText: "<time>9:30 AM</time> I can't believe...",
//   speakers: { "blue": "Alice", "grey": "Bob" },
//   ocrMeta: { frameCount: 2, detectedColors: ["blue", "grey"], ... }
// }
```

## Step 2: Normalize Conversation (`normalizeConversation`)

**Purpose:** Convert `ConversationPayload` into flat string format with speaker attribution.

**Function:** `normalizeConversation(payload)`

### What It Does

1. **Takes** a `ConversationPayload` (from `parseOCR` or `normalizeConversationPayload`)
2. **Applies speaker attribution** using the `speakers` mapping
3. **Formats** each line as: `[SPEAKER: <Name>] <Message Text>`
4. **Preserves** `<time>` tags in message text
5. **Returns** normalized string

### Output Format

```
[SPEAKER: Alice] I can't believe you said that.
[SPEAKER: Bob] I didn't mean it like that.
[SPEAKER: Alice] <time>9:30 AM</time> What do you mean?
```

### Example Usage

```javascript
import { normalizeConversation } from '@/lib/schemas/conversationSchema';

const normalized = normalizeConversation(payload);
// Returns: "[SPEAKER: Alice] I can't believe you said that.\n[SPEAKER: Bob] I didn't mean it like that."
```

## Complete Flow

### For OCR (Screenshots)

```javascript
// Step 1: Parse OCR
const payload = await parseOCR(
  imageFiles,
  "blue = Alice, grey = Bob",
  "Alice",
  "Bob"
);

// Step 2: Normalize for Deep Dive
const normalized = normalizeConversation(payload);
// Deep Dive receives: "[SPEAKER: Alice] <time>9:30 AM</time> Message..."
```

### For Paste (Text Input)

```javascript
// Step 1: Normalize payload (no OCR needed)
const payload = normalizeConversationPayload({
  texts: "Alice: I can't believe...\nBob: I didn't mean...",
  userName: "Alice",
  otherName: "Bob",
  source: "paste"
});

// Step 2: Normalize for Deep Dive
const normalized = normalizeConversation(payload);
// Deep Dive receives: "[SPEAKER: Alice] I can't believe...\n[SPEAKER: Bob] I didn't mean..."
```

## Critical Rules

### ✅ DO

1. **Always use both steps** - Never skip `normalizeConversation`
2. **Preserve timestamps** - Use `<time>` tags, never strip
3. **Apply speaker attribution** - Use `speakers` mapping from payload
4. **Keep steps separate** - Don't merge parsing and normalization

### ❌ DON'T

1. **Don't strip timestamps** - Always mark with `<time>` tags
2. **Don't skip normalization** - Deep Dive needs `[SPEAKER: <Name>]` format
3. **Don't merge steps** - Keep `parseOCR` and `normalizeConversation` separate
4. **Don't modify rawText** - Only `normalizeConversation` should format it

## Integration with Deep Dive

The normalized conversation string is passed directly to Deep Dive:

```javascript
// In advancedAnalysis.js
const normalized = normalizeConversation(conversationPayload);

const body = {
  model: openAIModel,
  messages: [
    { role: 'system', content: deepDiveSystemPrompt },
    { role: 'user', content: `Return JSON only. Do not include explanations.\n\nTEXTS:\n${normalized}` }
  ],
  // ...
};
```

## Files

- **Schema & Functions**: `src/lib/schemas/conversationSchema.js`
- **Usage**: `src/lib/analysis/advancedAnalysis.js`
- **Documentation**: This file

