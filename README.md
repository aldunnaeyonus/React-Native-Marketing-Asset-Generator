# 🦾 CyberMockup Pro (2026 Edition)

A high-performance **React Native Skia** engine for generating cinematic, cyberpunk-style marketing assets directly from your mobile device. This tool transforms standard app screenshots into 3D-perspective mockups with neon HUD elements and professional lighting.

---

## 🚀 Features

*   **3D Perspective Engine**: Uses `Matrix4` transformations to tilt device frames for a modern, non-flat aesthetic.
*   **Neon Bloom Lighting**: Layered `BlurMask` effects that simulate light emission from the device.
*   **Dynamic Typography**: Automatic text centering using Skia’s `measureText` for pixel-perfect alignment.
*   **Holographic HUD**: Cyber-grid background and glassmorphism overlays with `LinearGradient` reflections.
*   **Batch Export**: Automated loop that renders, snapshots, and saves high-res JPEGs to the system gallery.

---

## 📦 Installation

Ensure you have an [Expo](https://expo.dev) project set up, then install the required graphics and file system dependencies using the [Expo CLI](https://docs.expo.dev):

```bash
npx expo install @shopify/react-native-skia expo-file-system expo-media-library

├── assets/
│   ├── fonts/
│   │   ├── Inter-Black.ttf
│   │   └── Inter-Medium.ttf
│   └── screenshots/
│       ├── hero.png
│       ├── infra.png
│       └── finance.png


export const MARKETING_SET = [
  {
    id: "01_HERO",
    headline: "SCALE YOUR AI",
    sub: "The ultimate growth simulation.",
    screen: require("./assets/screenshots/hero.png"),
    color: "#00FF66", // Neon Green
  },
  // Add more assets...
];

import { MarketingExportManager } from './MarketingGenerator';
import { View, Button, Alert } from 'react-native';

export default function App() {
  const { startExport, activeIdx, MarketingComponent } = MarketingExportManager({
    onComplete: () => Alert.alert("Success", "Assets are in your gallery!"),
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button 
        title={activeIdx === -1 ? "Generate Assets" : `Processing ${activeIdx + 1}...`} 
        onPress={startExport} 
      />
      {/* Renders the Skia Canvas invisibly during export */}
      {MarketingComponent}
    </View>
  );
}
