# ⚡ Capacitor Setup Guide - 48 Hour MVP
## Adding Capacitor to Existing Get The Receipts Project

---

## 🚨 **IMPORTANT: Node.js Version Issue**

You have Node.js v18.20.8, but Capacitor requires >=20.0.0

**Fix this first:**

### **Option A: Use nvm (Recommended)**
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 20
nvm install 20
nvm use 20

# Verify
node --version  # Should show v20.x.x
```

### **Option B: Update Node Directly**
Download Node 20+ from nodejs.org

---

## 📋 **Step-by-Step Setup**

### **Step 1: Navigate to Your Project**
```bash
cd "/Users/pietmarie/NEW 17th Sept getthereceipts-app-fixed"
```

### **Step 2: Install Capacitor**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
```

### **Step 3: Initialize Capacitor**
```bash
npx cap init "Get The Receipts" "com.getthereceipts.app"
```

**When prompted:**
- **App name**: `Get The Receipts`
- **App ID**: `com.getthereceipts.app`
- **Web dir**: `dist` (this is where Vite builds)

### **Step 4: Install Required Plugins**
```bash
npm install @capacitor/status-bar
npm install @capacitor/safe-area
npm install @capacitor/keyboard
npm install @capacitor/app
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/share
npm install @capacitor/preferences
npm install @capacitor/browser
```

### **Step 5: Build Your Web App**
```bash
npm run build
```

### **Step 6: Add Native Platforms**
```bash
npx cap add ios
npx cap add android
```

### **Step 7: Sync to Native**
```bash
npx cap sync
```

### **Step 8: Open in Native IDEs**
```bash
# For iOS (opens Xcode)
npx cap open ios

# For Android (opens Android Studio)
npx cap open android
```

---

## ⚙️ **Capacitor Configuration**

After `npx cap init`, edit `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.getthereceipts.app',
  appName: 'Get The Receipts',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: {
        photos: 'Allow Get The Receipts to access your photos',
        camera: 'Allow Get The Receipts to access your camera'
      }
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;
```

---

## 🎯 **Quick Setup Script**

Run this in your project directory:

```bash
# Make sure you're in the project directory
cd "/Users/pietmarie/NEW 17th Sept getthereceipts-app-fixed"

# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Install plugins
npm install @capacitor/status-bar @capacitor/safe-area @capacitor/keyboard @capacitor/app @capacitor/camera @capacitor/filesystem @capacitor/share @capacitor/preferences @capacitor/browser

# Initialize (will prompt for app name and ID)
npx cap init

# Build web app
npm run build

# Add platforms
npx cap add ios
npx cap add android

# Sync
npx cap sync
```

---

## ⚠️ **If You Already Started Creating New App**

If you're in the middle of creating a new Capacitor app in your home directory:

1. **Cancel it** (Ctrl+C) or let it finish
2. **Navigate to your existing project**:
   ```bash
   cd "/Users/pietmarie/NEW 17th Sept getthereceipts-app-fixed"
   ```
3. **Follow the steps above** to add Capacitor to your existing project

---

## 🚀 **Next Steps After Setup**

1. Test on device/simulator
2. Add native features (camera, share, etc.)
3. Configure payments
4. Polish UI for mobile
5. Build for App Store

---

**Last Updated**: January 2025

