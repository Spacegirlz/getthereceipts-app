# 🚀 Native App Conversion LLM Guide
## Expert Multi-Role Prompt System for Capacitor + React Native App Development

**Purpose**: Complete guide for LLM assistants (Cursor AI, Claude, ChatGPT) to continue building the Get The Receipts native app conversion from web to iOS/Android using Capacitor.

---

## 🎯 **PROJECT CONTEXT**

### **Current State**
- ✅ **Web App**: Fully functional React + Vite app
- ✅ **Capacitor**: Installed and configured
- ✅ **Platforms**: iOS and Android projects created
- ✅ **Status**: Ready for native feature implementation
- ⏱️ **Timeline**: 48-hour MVP goal

### **Tech Stack**
- **Frontend**: React 18 + Vite
- **Native**: Capacitor 7
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (web) → React Native Reanimated (native)

### **Key Files & Directories**
```
getthereceipts-app-fixed/
├── src/                    # React web app (UNCHANGED)
├── capacitor.config.ts      # Capacitor configuration
├── ios/                    # iOS native project
├── android/                # Android native project
├── dist/                   # Built web app (synced to native)
└── package.json            # Dependencies (includes Capacitor)
```

---

## 👥 **EXPERT ROLES NEEDED**

### **Role 1: Senior Capacitor Developer**
**Expertise**: Capacitor, React, native mobile development

**Key Responsibilities**:
- Convert web features to native
- Integrate Capacitor plugins
- Handle platform-specific code
- Optimize for mobile performance

**Prompt Template**:
```
You are a senior Capacitor developer with 5+ years experience building 
hybrid mobile apps. You specialize in:
- Capacitor plugin integration
- React web-to-native conversion
- iOS and Android platform differences
- Mobile performance optimization
- Native API integration

PROJECT: Converting Get The Receipts web app to native iOS/Android apps.

CURRENT TASK: [Describe specific feature/conversion]

REQUIREMENTS:
- Use Capacitor plugins where appropriate
- Maintain web app functionality
- Optimize for mobile UX
- Handle platform differences
- Follow Capacitor best practices

Please provide the implementation with:
1. Code changes needed
2. Plugin installations required
3. Platform-specific considerations
4. Testing steps
```

---

### **Role 2: React Native Mobile UX Expert**
**Expertise**: Mobile UX, React Native patterns, native app design

**Key Responsibilities**:
- Mobile UI/UX adaptations
- Native navigation patterns
- Touch interactions
- Mobile-specific optimizations

**Prompt Template**:
```
You are a mobile UX expert specializing in React Native and Capacitor apps.
You understand:
- Native mobile design patterns
- iOS Human Interface Guidelines
- Material Design (Android)
- Touch interactions and gestures
- Mobile performance best practices

PROJECT: Get The Receipts native app - mobile UX optimization.

CURRENT TASK: [Describe UI/UX challenge]

REQUIREMENTS:
- Follow platform design guidelines
- Optimize for touch interactions
- Ensure mobile-friendly layouts
- Handle safe areas and notches
- Consider different screen sizes

Please provide:
1. UI/UX recommendations
2. Code implementation
3. Platform-specific adaptations
4. Testing considerations
```

---

### **Role 3: Native API Integration Specialist**
**Expertise**: Camera, file system, sharing, permissions, native APIs

**Key Responsibilities**:
- Native feature integration
- Permission handling
- Platform API usage
- Error handling for native features

**Prompt Template**:
```
You are a native mobile API integration specialist with deep knowledge of:
- iOS native APIs (Camera, Photos, Share Sheet, etc.)
- Android native APIs (Camera, Storage, Share, etc.)
- Capacitor plugin architecture
- Permission handling
- Error handling and edge cases

PROJECT: Get The Receipts - native feature integration.

CURRENT TASK: [Describe native feature to implement]

REQUIREMENTS:
- Use appropriate Capacitor plugins
- Handle permissions correctly
- Provide fallbacks for errors
- Optimize for performance
- Test on both platforms

Please provide:
1. Plugin setup instructions
2. Implementation code
3. Permission handling
4. Error handling
5. Testing steps
```

---

### **Role 4: Payment & IAP Specialist**
**Expertise**: In-App Purchases, Stripe, App Store, Google Play

**Key Responsibilities**:
- IAP implementation
- Payment flow optimization
- App Store compliance
- Receipt validation

**Prompt Template**:
```
You are a mobile payment and IAP specialist with expertise in:
- iOS In-App Purchases (StoreKit)
- Google Play Billing
- Stripe integration
- App Store/Play Store compliance
- Receipt validation
- Subscription management

PROJECT: Get The Receipts - payment system for native apps.

CURRENT TASK: [Describe payment feature]

REQUIREMENTS:
- App Store/Play Store compliant
- Handle subscriptions and one-time purchases
- Sync with existing Stripe system
- Provide good UX
- Handle errors gracefully

Please provide:
1. IAP setup instructions
2. Implementation code
3. App Store/Play Store configuration
4. Testing approach
5. Compliance considerations
```

---

### **Role 5: Performance & Optimization Expert**
**Expertise**: Mobile performance, bundle size, optimization

**Key Responsibilities**:
- Performance optimization
- Bundle size reduction
- Memory management
- Battery optimization

**Prompt Template**:
```
You are a mobile performance optimization expert specializing in:
- React/Capacitor app performance
- Bundle size optimization
- Memory management
- Battery usage optimization
- Native app performance tuning

PROJECT: Get The Receipts - performance optimization.

CURRENT TASK: [Describe performance issue]

REQUIREMENTS:
- Optimize app launch time
- Reduce bundle size
- Minimize memory usage
- Improve battery efficiency
- Maintain functionality

Please provide:
1. Performance analysis
2. Optimization strategies
3. Code changes needed
4. Measurement approach
5. Expected improvements
```

---

## 📋 **PROMPT TEMPLATES BY TASK TYPE**

### **Template 1: Feature Conversion (Web → Native)**

```
You are a senior Capacitor developer. I'm converting a web feature to 
work in a Capacitor native app.

WEB IMPLEMENTATION:
[Paste web code/component]

FEATURE: [Describe feature - e.g., "Image upload with camera"]

TASK: Convert this to use Capacitor native plugins while maintaining 
the same functionality.

REQUIREMENTS:
- Use appropriate Capacitor plugins (@capacitor/camera, etc.)
- Handle permissions correctly
- Provide good mobile UX
- Handle errors gracefully
- Test on both iOS and Android

CURRENT SETUP:
- Capacitor 7 installed
- React 18 + Vite
- Plugins available: camera, filesystem, share, browser, etc.

Please provide:
1. Plugin installation commands (if needed)
2. Converted code implementation
3. Permission handling
4. Error handling
5. Testing steps
```

---

### **Template 2: New Native Feature**

```
You are a native mobile API integration specialist. I need to add a new 
native feature to my Capacitor app.

FEATURE: [Describe feature - e.g., "Push notifications"]

CURRENT SETUP:
- Capacitor 7
- React 18
- iOS and Android platforms configured

REQUIREMENTS:
- Use Capacitor plugins where possible
- Handle iOS and Android differences
- Provide good UX
- Handle permissions
- Error handling

Please provide:
1. Plugin to install
2. Configuration needed
3. Implementation code
4. Platform-specific considerations
5. Testing approach
```

---

### **Template 3: Bug Fix / Issue Resolution**

```
You are a senior Capacitor troubleshooter. I'm experiencing an issue 
with my Capacitor native app.

ISSUE: [Describe the problem]

ERROR MESSAGE: [Paste error if any]

CONTEXT:
- Capacitor 7
- React 18 + Vite
- Platform: [iOS/Android/Both]
- Feature: [What feature is affected]

WHAT I'VE TRIED:
- [List attempts to fix]

REQUIREMENTS:
- Fix the issue
- Explain the root cause
- Prevent future occurrences
- Maintain web app functionality

Please provide:
1. Root cause analysis
2. Solution
3. Code changes needed
4. Prevention steps
5. Testing to verify fix
```

---

### **Template 4: Performance Optimization**

```
You are a mobile performance optimization expert. I need to optimize 
my Capacitor app.

ISSUE: [Describe performance problem - e.g., "Slow app launch", 
"Large bundle size", "Memory leaks"]

CURRENT METRICS:
- [If available: bundle size, launch time, memory usage, etc.]

CURRENT SETUP:
- Capacitor 7
- React 18 + Vite
- [List major dependencies]

REQUIREMENTS:
- Improve performance
- Maintain functionality
- Don't break existing features
- Provide measurable improvements

Please provide:
1. Performance analysis
2. Optimization strategies
3. Code changes needed
4. How to measure improvement
5. Expected results
```

---

### **Template 5: App Store Submission**

```
You are an App Store submission expert. I need to prepare my Capacitor 
app for App Store/Play Store submission.

APP DETAILS:
- Name: Get The Receipts
- Platform: [iOS/Android/Both]
- Current Status: [Beta/Ready for submission]

REQUIREMENTS:
- App Store/Play Store compliant
- All requirements met
- Assets prepared
- Privacy policy ready
- Age rating appropriate

Please provide:
1. Checklist of requirements
2. Assets needed (sizes, formats)
3. Configuration changes
4. Privacy policy requirements
5. Submission steps
```

---

## 🔧 **TECHNICAL REQUIREMENTS & CONTEXT**

### **Capacitor Configuration**

**File**: `capacitor.config.ts`
```typescript
{
  appId: 'com.getthereceipts.app',
  appName: 'Get The Receipts',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    Camera: { permissions: {...} },
    Keyboard: { resize: 'body', style: 'dark' }
  }
}
```

### **Installed Plugins**
- `@capacitor/core` - Core runtime
- `@capacitor/cli` - CLI tools
- `@capacitor/ios` - iOS platform
- `@capacitor/android` - Android platform
- `@capacitor/app` - App lifecycle
- `@capacitor/browser` - In-app browser
- `@capacitor/camera` - Camera & photos
- `@capacitor/filesystem` - File system
- `@capacitor/keyboard` - Keyboard handling
- `@capacitor/preferences` - Local storage
- `@capacitor/share` - Native share sheet
- `@capacitor/status-bar` - Status bar control
- `@capacitor/status-bar` - Status bar styling

### **Key Web Features to Convert**

1. **Image Upload** → Camera plugin
2. **File Download** → Filesystem plugin
3. **Web Share API** → Share plugin
4. **Stripe Checkout** → Browser plugin (for MVP)
5. **Local Storage** → Preferences plugin
6. **Keyboard Handling** → Keyboard plugin
7. **Status Bar** → Status Bar plugin

---

## 📱 **PLATFORM-SPECIFIC CONSIDERATIONS**

### **iOS Requirements**
- Minimum iOS 13.0
- Xcode required for building
- CocoaPods for dependencies
- App Store guidelines compliance
- Privacy permissions (camera, photos, etc.)
- Universal Links for deep linking

### **Android Requirements**
- Minimum Android 6.0 (API 23)
- Android Studio for building
- Gradle for dependencies
- Play Store policies compliance
- Runtime permissions
- App Links for deep linking

---

## 🎯 **48-HOUR MVP SCOPE**

### **Must Have (Core MVP)**
1. ✅ User authentication (Supabase - works as-is)
2. ✅ Text input for messages
3. ✅ AI analysis & receipt generation
4. ✅ Receipt display
5. ✅ Credit system
6. ✅ Basic navigation

### **Should Have (If Time)**
7. ⚠️ Camera/photo upload
8. ⚠️ Share receipt functionality
9. ⚠️ Web checkout for payments
10. ⚠️ View past receipts

### **Defer to Post-MVP**
- ❌ Native In-App Purchases
- ❌ Push notifications
- ❌ Deep linking
- ❌ Advanced OCR
- ❌ Offline support

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: Plugin Not Working**
**Symptoms**: Plugin import fails or doesn't work

**Solution**:
```bash
# Reinstall plugin
npm install @capacitor/[plugin-name]
npx cap sync
```

**Check**:
- Plugin installed in package.json
- Synced to native platforms
- Permissions configured
- Platform-specific setup done

---

### **Issue 2: Build Fails**
**Symptoms**: iOS/Android build fails

**Solution**:
```bash
# Clean and rebuild
npx cap sync
# iOS: cd ios/App && pod install
# Android: Let Gradle sync in Android Studio
```

**Check**:
- Node version (needs 20+)
- Platform tools installed (Xcode/Android Studio)
- Dependencies installed
- Configuration correct

---

### **Issue 3: Web App Breaks**
**Symptoms**: Web app doesn't work after changes

**Solution**:
- Capacitor should NOT affect web app
- Check if you modified `src/` files (you shouldn't need to)
- Revert any changes to web code
- Test web app separately: `npm run dev`

---

### **Issue 4: Permissions Not Requested**
**Symptoms**: Camera/photos don't work

**Solution**:
1. Check `capacitor.config.ts` has permission strings
2. Check platform-specific permission configs
3. Request permissions in code before using feature
4. Test on real device (simulators may not request)

---

## 📚 **ESSENTIAL CONTEXT FILES**

### **Files to Share with LLM**

1. **Project Structure**:
   - `package.json` - Dependencies
   - `capacitor.config.ts` - Capacitor config
   - `src/App.jsx` - Main app structure
   - `src/pages/` - Page components
   - `src/components/` - Reusable components

2. **Key Features**:
   - `src/pages/LuxeChatInputPage.jsx` - Main input page
   - `src/pages/ReceiptsCardPage.jsx` - Receipt display
   - `src/components/ImageUpload.jsx` - Image upload (needs conversion)
   - `src/hooks/useSocialExport.js` - Sharing (needs conversion)

3. **Configuration**:
   - `vite.config.js` - Build config
   - `capacitor.config.ts` - Native config
   - Environment variables (Supabase, Stripe, OpenAI)

---

## 🎨 **CODE PATTERNS & EXAMPLES**

### **Pattern 1: Camera Integration**

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    // Use image.dataUrl
    return image.dataUrl;
  } catch (error) {
    console.error('Camera error:', error);
    // Handle error
  }
};
```

---

### **Pattern 2: Share Functionality**

```typescript
import { Share } from '@capacitor/share';

const shareReceipt = async (receiptData) => {
  try {
    await Share.share({
      title: 'Sage Receipt',
      text: 'Check out this receipt',
      url: 'https://getthereceipts.com',
      dialogTitle: 'Share receipt'
    });
  } catch (error) {
    if (error.message !== 'Share canceled') {
      console.error('Share error:', error);
    }
  }
};
```

---

### **Pattern 3: In-App Browser (Payments)**

```typescript
import { Browser } from '@capacitor/browser';

const openCheckout = async (checkoutUrl) => {
  try {
    await Browser.open({
      url: checkoutUrl,
      toolbarColor: '#0F0F0F',
      presentationStyle: 'popover'
    });
    
    // Listen for browser close
    Browser.addListener('browserFinished', () => {
      // Handle payment completion
    });
  } catch (error) {
    console.error('Browser error:', error);
  }
};
```

---

### **Pattern 4: Platform Detection**

```typescript
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios', 'android', or 'web'

if (isNative) {
  // Use native features
} else {
  // Use web fallbacks
}
```

---

## 🔄 **DEVELOPMENT WORKFLOW**

### **Standard Workflow**

1. **Make changes to web app** (if needed)
2. **Build web app**: `npm run build`
3. **Sync to native**: `npx cap sync`
4. **Open in IDE**: `npx cap open ios` or `npx cap open android`
5. **Test on device/simulator**
6. **Iterate**

### **When to Sync**

- After installing new Capacitor plugins
- After modifying `capacitor.config.ts`
- After building web app (`npm run build`)
- After adding native code manually

---

## ✅ **TESTING CHECKLIST**

### **Before Each Feature**

- [ ] Plugin installed correctly
- [ ] Permissions configured
- [ ] Code implemented
- [ ] Error handling added
- [ ] Tested on iOS (simulator/device)
- [ ] Tested on Android (emulator/device)
- [ ] Web app still works

### **Before Submission**

- [ ] All features working
- [ ] No console errors
- [ ] Permissions working
- [ ] App Store assets ready
- [ ] Privacy policy updated
- [ ] Age rating appropriate
- [ ] IAP configured (if using)
- [ ] Deep linking working (if implemented)

---

## 🎯 **SUCCESS CRITERIA**

### **MVP Success**

- ✅ App installs on iOS
- ✅ App installs on Android
- ✅ User can sign up/login
- ✅ User can input text
- ✅ AI analysis works
- ✅ Receipt displays
- ✅ Credits system works
- ✅ Basic navigation works

### **Post-MVP Success**

- ✅ Camera/photo upload works
- ✅ Share functionality works
- ✅ Payments work (web checkout or IAP)
- ✅ Performance is good
- ✅ No major bugs
- ✅ Ready for App Store submission

---

## 🆘 **EMERGENCY PROMPTS**

### **If LLM Loses Context**

```
I'm working on converting a React web app to native iOS/Android apps 
using Capacitor.

PROJECT: Get The Receipts
- Web app: React 18 + Vite
- Native: Capacitor 7
- Status: Capacitor installed, platforms added, ready for feature conversion

CURRENT TASK: [Describe what you're working on]

KEY FILES:
- capacitor.config.ts - Capacitor configuration
- src/ - React web app (unchanged)
- ios/ - iOS native project
- android/ - Android native project

Please help me [describe specific task].
```

---

### **If Something Breaks**

```
I'm experiencing an issue with my Capacitor app conversion.

ISSUE: [Describe problem]
ERROR: [Paste error if any]
CONTEXT: [What were you doing when it broke?]

SETUP:
- Capacitor 7
- React 18 + Vite
- [Platform: iOS/Android/Both]

Please help me:
1. Diagnose the issue
2. Fix it
3. Prevent it from happening again
4. Verify the fix works
```

---

## 📖 **REFERENCE DOCUMENTATION**

### **Capacitor Docs**
- Main: https://capacitorjs.com/docs
- iOS: https://capacitorjs.com/docs/ios
- Android: https://capacitorjs.com/docs/android
- Plugins: https://capacitorjs.com/docs/plugins

### **Project-Specific Docs**
- `CAPACITOR_SETUP_COMPLETE.md` - Setup status
- `CAPACITOR_SAFETY_AND_ROLLBACK.md` - Safety guide
- `48_HOUR_MVP_CAPACITOR_PLAN.md` - MVP plan
- `NATIVE_APP_CONVERSION_ANALYSIS.md` - Full analysis

---

## 🎓 **LEARNING RESOURCES FOR LLM**

### **Key Concepts**

1. **Capacitor Architecture**:
   - Web app runs in WebView
   - Native plugins bridge to platform APIs
   - Single codebase for web + native

2. **Plugin System**:
   - Plugins provide native API access
   - Platform-specific implementations
   - JavaScript API for web code

3. **Build Process**:
   - Web app built with Vite
   - Synced to native projects
   - Native projects built with Xcode/Android Studio

4. **Development**:
   - Develop web app normally
   - Sync to native when needed
   - Test on real devices

---

## 🚀 **QUICK START FOR NEW LLM SESSION**

**Copy this prompt to start a new session:**

```
I'm converting a React web app to native iOS/Android apps using Capacitor.

PROJECT: Get The Receipts
- Web app: Fully functional React + Vite app
- Status: Capacitor 7 installed, iOS/Android platforms added
- Goal: 48-hour MVP with core features

TECH STACK:
- React 18 + Vite
- Capacitor 7
- Supabase (auth + database)
- Stripe (payments)
- OpenAI (AI analysis)

CURRENT STATE:
- ✅ Capacitor installed and configured
- ✅ iOS and Android platforms added
- ✅ Web app unchanged and working
- ⏳ Ready for native feature conversion

NEXT TASK: [Describe what needs to be done]

Please help me implement [specific feature] following Capacitor best 
practices and maintaining web app functionality.
```

---

## 📝 **NOTES FOR LLM ASSISTANT**

### **Important Reminders**

1. **Never modify `src/` files unnecessarily** - Web app must continue working
2. **Always test web app** - Verify `npm run dev` still works
3. **Use Capacitor plugins** - Don't try to access native APIs directly
4. **Handle both platforms** - iOS and Android may need different approaches
5. **Test on real devices** - Simulators don't catch all issues
6. **Sync after changes** - Run `npx cap sync` after plugin installs
7. **Check permissions** - Many features require permission requests
8. **Provide fallbacks** - Web app should work if native features fail

---

## 🎯 **FINAL CHECKLIST FOR LLM**

Before providing a solution, ensure:

- [ ] Solution uses Capacitor plugins (not direct native code)
- [ ] Works on both iOS and Android
- [ ] Handles errors gracefully
- [ ] Doesn't break web app
- [ ] Includes permission handling
- [ ] Provides testing steps
- [ ] Explains any platform differences
- [ ] Follows Capacitor best practices

---

**Last Updated**: January 2025  
**Status**: Ready for LLM-assisted development  
**Version**: 1.0

