# Anonymous/Observational Mode Implementation

## 🎯 **Problem Solved:**

**Original Issue:** The system assumed a clear USER vs OTHER dynamic, causing:
- guy1/guy2 conversations being analyzed as "Your Gaslighter" 
- Wrong pronouns ("Girl" for guys in anonymous chats)
- Inappropriate "bestie" addressing for screenshot analysis
- Sexual assault descriptions getting entertainment analysis instead of crisis resources

## ✅ **Solution Implemented:**

### **1. Automatic Anonymous Detection**
**File:** `src/pages/ChatInputPage.jsx`

**Detection Patterns:**
```javascript
const anonymousPatterns = [
  /guy\s*\d+:/i,          // guy1:, guy2:
  /person\s*[a-z]:/i,     // person a:, person b:
  /anon\s*\d+:/i,         // anon1:, anon2:
  /user\s*\d+:/i,         // user1:, user2:
  /friend\s*\d+:/i,       // friend1:, friend2:
  /\[redacted\]/i,        // [redacted] names
  /participant\s*\d+:/i,  // participant1:
  /speaker\s*[a-z]:/i,    // speaker a:, speaker b:
  /^[a-z]\s*:/im,         // single letter names: a:, b:
];
```

**Auto-Detection Logic:**
- Detects patterns when user pastes text
- Auto-switches to anonymous mode if no names provided
- Shows warning: "⚠️ Auto-detected: This looks like an anonymous conversation"

### **2. UI Mode Toggle**
**Location:** Between "The Cast" and "The Tea" sections

```jsx
<div className="bg-black/30 p-4 rounded-xl border border-white/10">
  <p className="text-stone-300 text-sm mb-3">
    Is this your conversation or are you analyzing someone else's?
  </p>
  <div className="flex gap-3">
    <button onClick={() => setAnalysisMode('personal')}>
      My Conversation
    </button>
    <button onClick={() => setAnalysisMode('anonymous')}>
      Observing Others
    </button>
  </div>
</div>
```

### **3. Context-Aware Message Generation**
**Personal Mode:**
```
USER: Alex (they/them)
OTHER: Taylor (she/her)
RELATIONSHIP: dating
```

**Anonymous Mode:**
```
ANALYSIS MODE: OBSERVATIONAL
TYPE: Anonymous/Third-party conversation
PARTICIPANTS: guy1, guy2
```

### **4. Adaptive Prompt Instructions**
**All 3 prompts updated with:**

```javascript
ANONYMOUS MODE DETECTION:
- If analysis_mode === 'anonymous' or is_anonymous === true:
  * DO NOT address anyone directly as "bestie" or "you"
  * Analyze objectively like a third-party observer
  * Use "Person A is showing..." instead of "You're experiencing..."
  * Frame advice as "They should..." not "You should..."

ADAPTIVE RESPONSE MODES:
1. PERSONAL MODE:
   - "Bestie, they're playing games with you"
   - Direct address to USER
   - Protective energy for USER

2. ANONYMOUS/OBSERVATIONAL MODE:
   - "This conversation shows toxic patterns"
   - Third-person analysis
   - "Guy1 is manipulating Guy2"
   - NO "bestie" or direct address
```

### **5. Enhanced Safety Detection**
**Context-Aware Safety Responses:**

**Personal Mode Safety:**
```json
{
  "verdict": {
    "act": "Emergency Support Needed",
    "subtext": "This describes sexual assault. This isn't drama - it's danger."
  },
  "realTea": "What you're describing isn't a relationship issue - it's a crime..."
}
```

**Anonymous Mode Safety:**
```json
{
  "verdict": {
    "act": "Sexual Assault Detected", 
    "subtext": "This conversation describes sexual assault. This isn't drama - it's criminal behavior."
  },
  "realTea": "What you're witnessing isn't relationship drama - it's evidence of assault. This should be reported to authorities..."
}
```

### **6. Component-Specific Adaptations**

**Truth Receipt:**
- ❌ OLD: "THE VERDICT: Mixed signals are confusing you"
- ✅ NEW: "THE VERDICT: Guy1 is sending mixed signals to Guy2"

**Tea (Deep Dive):**
- ❌ OLD: "Bestie, they're playing games with you"  
- ✅ NEW: "This conversation shows Guy1 playing games with Guy2"

**Immunity Training:**
- ❌ OLD: "Understanding Your Gaslighter" + "bestie" language
- ✅ NEW: "Gaslighter Pattern Analysis" + observational language

## 🧪 **Test Cases Covered:**

### **Critical Safety Test:**
```
Input: guy1/guy2 sexual assault conversation
Expected: Safety override with observational language
Actual: ✅ "Sexual Assault Detected" + crisis resources
```

### **Anonymous Pattern Detection:**
```
guy1:, guy2: → ✅ Anonymous mode
person a:, person b: → ✅ Anonymous mode  
friend1:, friend2: → ✅ Anonymous mode
Alex:, Taylor: → ✅ Personal mode (with names)
```

### **Pronoun/Address Issues Fixed:**
```
❌ guy1/guy2 → "Girl" + "bestie" 
✅ guy1/guy2 → "Guy1" + "This conversation shows"
```

## 📁 **Files Modified:**

1. **`src/pages/ChatInputPage.jsx`**
   - Added anonymous mode detection
   - Added UI toggle
   - Updated message generation
   - Updated analysis context

2. **`src/lib/prompts/brutalPrompt.js`**
   - Added anonymous mode instructions
   - Added adaptive response modes

3. **`src/lib/prompts/deepDivePrompt.js`**
   - Added anonymous mode instructions
   - Added participant detection

4. **`src/lib/prompts/immunityPrompt.js`**
   - Added immunity training adaptations
   - Added observational content handling

5. **`src/lib/analysis/advancedAnalysis.js`**
   - Updated safety response generation
   - Added context-aware safety responses

6. **Test Files:**
   - `test-anonymous-mode.js` - Comprehensive test suite
   - `ANONYMOUS_MODE_IMPLEMENTATION.md` - This documentation

## 🎯 **Key Success Metrics:**

✅ **No more gender/pronoun confusion** (guy1 → "Girl")
✅ **No inappropriate "bestie" addressing** for anonymous content  
✅ **Accurate framing** (observation vs personal advice)
✅ **Proper safety handling** for witnessed vs experienced assault
✅ **Auto-detection** with manual override option
✅ **Maintains Sage's personality** while adapting context

## 🚀 **Use Cases Now Supported:**

- **Screenshots from Reddit/social media**
- **Overheard conversations between friends**
- **Group chat dynamics you're observing**  
- **Content shared "for analysis only"**
- **Multi-party conversations without clear victim/perpetrator**
- **Safety situations where user is witness, not victim**

## 🔧 **Before vs After:**

### **Original Failing Example:**
```
Input: guy1/guy2 assault conversation
Output: "Marco, you're not crazy for wanting more from Lena" 
Problem: Wrong names, wrong framing, missed safety issue
```

### **Fixed Output:**
```
Input: guy1/guy2 assault conversation  
Output: "Sexual Assault Detected - This conversation describes criminal behavior"
Result: ✅ Correct safety detection + appropriate resources
```

**This implementation completely resolves the guy1/guy2 → Girl/Bestie confusion and ensures appropriate handling of all conversation types.**