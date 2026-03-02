# 🦾 CyberMockup Pro (2026 Edition)

A high-performance **React Native Skia** engine for generating cinematic, cyberpunk-style marketing assets directly from your mobile device. This tool transforms standard app screenshots into 3D-perspective mockups with neon HUD elements and professional lighting.

---

## 🚀 Features

*   **3D Perspective Engine**: Uses `Matrix4` transformations to tilt device frames for a modern, non-flat aesthetic.
*   **Neon Bloom Lighting**: Layered `BlurMask` effects that simulate light emission from the device.
*   **Dynamic Typography**: Automatic text centering using Skia’s `measureText` for pixel-perfect alignment.
*   **Holographic HUD**: Cyber-grid background and glassmorphism overlays with `LinearGradient` reflections.
*   **Batch Export**: Automated loop that renders, snapshots, and saves high-res JPEGs to the system gallery via [Expo MediaLibrary](https://docs.expo.dev).


## 📦 Installation

Ensure you have an [Expo](https://expo.dev) project set up, then install the required graphics and file system dependencies:

## npx expo install @shopify/react-native-skia expo-file-system expo-media-library

## Use code with caution.

## 📂 Project Structure
To ensure the require() paths work correctly, organize your assets folder as follows:
text
├── assets/
│   ├── fonts/
│   │   ├── Inter-Black.ttf
│   │   └── Inter-Medium.ttf
│   └── screenshots/
│       ├── hero.png
│       ├── infra.png
│       └── finance.png
Use code with caution.

## 🛠️ Usage
1. Define your Marketing Set
Edit the MARKETING_SET constant to include your headlines, sub-headlines, and specific brand colors.
typescript
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

## Use code with caution.

## 2. Implementation
Import the MarketingExportManager into your main screen. The component renders off-screen (opacity 0) to allow for background processing without interrupting the UI.
tsx
import { MarketingExportManager } from './MarketingGenerator';
import { View, Button, Alert } from 'react-native';

## export default function App() {
  const { startExport, activeIdx, MarketingComponent } = MarketingExportManager({
    onComplete: () => Alert.alert("Success", "Assets are in your gallery!"),
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        title={activeIdx === -1 ? "Generate Assets" : `Processing Asset ${activeIdx + 1}...`} 
        onPress={startExport} 
        disabled={activeIdx !== -1}
      />
      
      {/* Renders the Skia Canvas invisibly during export */}
      {MarketingComponent}
    </View>
  );
}
## Use code with caution.

## 🎨 Customization
Tilt Angle: Modify rotateY(0.15) in the perspectiveMatrix to change the 3D skew.
Grid Density: Change the Array(20) loop in the background section to increase or decrease the cyber-grid lines.
Bloom Intensity: Adjust the BlurMask value (default 50) for a stronger or softer neon glow.

## ⚠️ Important Notes
Physical Devices: Use a physical iOS or Android device for the Expo FileSystem and MediaLibrary to work correctly.
Permissions: Ensure you have granted "Photos" access when prompted by the app.
Snapshot Timing: The export includes a 1000ms delay per asset to ensure the GPU has fully rendered the Skia canvas before the snapshot is taken.



