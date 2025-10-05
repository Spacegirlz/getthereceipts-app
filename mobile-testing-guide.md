# Mobile Save/Share Testing Guide

## Method 1: Chrome DevTools Mobile Simulation

1. **Open Chrome DevTools** (F12)
2. **Click Device Toggle** (Ctrl+Shift+M or click device icon)
3. **Select Mobile Device** (iPhone 12, Pixel 5, etc.)
4. **Test Save/Share Functions**:
   - The Web Share API will be simulated
   - File downloads will behave like mobile
   - Canvas rendering will use mobile viewport

## Method 2: Local Network Testing

1. **Find your local IP**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Start dev server on network**:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

3. **Access from mobile device**:
   - Connect phone to same WiFi
   - Visit `http://YOUR_IP:5174`
   - Test save/share functionality

## Method 3: Debug Interface (Recommended)

Create a debug page that simulates mobile behavior and shows detailed logs.

## Method 4: Browser Extensions

- **User-Agent Switcher**: Changes browser to mobile user agent
- **Mobile Simulator**: More accurate mobile behavior simulation

## Method 5: ngrok Tunnel (Most Accurate)

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   ```

2. **Create tunnel**:
   ```bash
   ngrok http 5174
   ```

3. **Test on real mobile device** using the ngrok URL

