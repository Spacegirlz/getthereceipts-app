import type { CapacitorConfig } from '@capacitor/cli';

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
