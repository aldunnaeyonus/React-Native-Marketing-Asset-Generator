import {
  Canvas,
  Group,
  Image,
  ImageFormat,
  LinearGradient,
  RoundedRect,
  Shadow,
  Text,
  useCanvasRef,
  useFont,
  useImage,
  vec,
  Rect,
  BlurMask,
  Skia,
} from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, PixelRatio, View, TouchableOpacity, Text as RNText } from "react-native";

/** 
 * 1. CONFIGURATION 
 * Adjust these paths to match your folder structure exactly.
 */
export const CANVAS_W = 1290;
export const CANVAS_H = 2796;
const PD = PixelRatio.get();
const LOGICAL_W = CANVAS_W / PD;
const LOGICAL_H = CANVAS_H / PD;

// 3D Perspective Matrix
const perspectiveMatrix = Skia.Matrix4();
perspectiveMatrix.identity();
perspectiveMatrix.translate(CANVAS_W / 2, CANVAS_H / 2);
perspectiveMatrix.rotateY(0.15); 
perspectiveMatrix.rotateX(0.1);  
perspectiveMatrix.translate(-CANVAS_W / 2, -CANVAS_H / 2);

export const MARKETING_SET = [
  {
    id: "01_HERO",
    headline: "SCALE YOUR AI",
    sub: "The ultimate growth simulation.",
    screen: require("@/../assets/screenshots/hero.png"), // <-- ADD IMAGES HERE
    color: "#00FF66",
  },
  {
    id: "05_EQUITY",
    headline: "SERIES B FUNDING",
    sub: "Trade equity for liquidity.",
    screen: require("@/../assets/screenshots/finance.png"), // <-- ADD IMAGES HERE
    color: "#D000FF",
  },
];

/**
 * 2. ENHANCED COMPONENT
 * Includes Centered Text, Cyber-Grid, and 3D Wireframe
 */
export const MarketingMockup = ({ data, canvasRef }: { data: typeof MARKETING_SET[0]; canvasRef: any }) => {
  const img = useImage(data.screen);
  const fontH1 = useFont(require("@/../assets/fonts/Inter-Black.ttf"), 120);
  const fontBody = useFont(require("@/../assets/fonts/Inter-Medium.ttf"), 55);

  if (!img || !fontH1 || !fontBody) return null;

  const centerX = CANVAS_W / 2;
  const imgW = CANVAS_W * 0.75;
  const imgH = (img.height() / img.width()) * imgW;

  return (
    <Canvas ref={canvasRef} style={{ width: LOGICAL_W, height: LOGICAL_H }}>
      <Group transform={[{ scale: 1 / PD }]}>
        
        {/* BACKGROUND: Dark Space & Grid */}
        <Rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} color="#020205" />
        <Group opacity={0.15}>
          {[...Array(20)].map((_, i) => (
            <Rect key={i} x={0} y={i * 150} width={CANVAS_W} height={2} color={data.color} />
          ))}
        </Group>

        {/* TYPOGRAPHY: Perfectly Centered */}
        <Group>
          <Text 
            x={centerX - fontH1.measureText(data.headline).width / 2} 
            y={350} text={data.headline} font={fontH1} color="white" 
          />
          <Text 
            x={centerX - fontBody.measureText(data.sub).width / 2} 
            y={470} text={data.sub} font={fontBody} color={data.color} 
          >
            <BlurMask blur={10} style="outer" />
          </Text>
        </Group>

        {/* 3D WIREFRAME DEVICE */}
        <Group matrix={perspectiveMatrix}>
          {/* Neon Bloom Light behind phone */}
          <RoundedRect x={centerX-imgW/2-30} y={650-30} width={imgW+60} height={imgH+60} r={110} color={data.color}>
            <BlurMask blur={50} style="normal" />
          </RoundedRect>

          {/* Black Phone Shell */}
          <RoundedRect x={centerX-imgW/2-15} y={650-15} width={imgW+30} height={imgH+30} r={95} color="#000">
            <Shadow dx={0} dy={0} blur={20} color={data.color} inner />
          </RoundedRect>

          {/* Clipped App Screenshot */}
          <Group clip={{ x: centerX-imgW/2, y: 650, width: imgW, height: imgH, r: 80 }}>
            <Image image={img} x={centerX-imgW/2} y={650} width={imgW} height={imgH} fit="cover" />
            
            {/* Glossy Overlay */}
            <Rect x={centerX-imgW/2} y={650} width={imgW} height={imgH/2} opacity={0.15}>
               <LinearGradient start={vec(0, 650)} end={vec(0, 650+imgH/2)} colors={["white", "transparent"]} />
            </Rect>
          </Group>
        </Group>

      </Group>
    </Canvas>
  );
};

/**
 * 3. EXPORT MANAGER
 */
export const MarketingExportManager = ({ onComplete }: { onComplete: () => void }) => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const canvasRef = useCanvasRef();

  const startExport = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return Alert.alert("Error", "No gallery access.");

    for (let i = 0; i < MARKETING_SET.length; i++) {
      setActiveIdx(i);
      // Wait for Skia to render the frame
      await new Promise((r) => setTimeout(r, 1000));

      try {
        const image = canvasRef.current?.makeImageSnapshot();
        if (!image) throw new Error("Snapshot failed.");

        const base64Data = image.encodeToBase64(ImageFormat.JPEG, 100);
        const cacheDir = FileSystem.cacheDirectory ?? "";
        const dest = `${cacheDir}${MARKETING_SET[i].id}.jpg`;

        await FileSystem.writeAsStringAsync(dest, base64Data, { encoding: FileSystem.EncodingType.Base64 });
        await MediaLibrary.saveToLibraryAsync(dest);
      } catch (e) {
        console.error("Export Error:", e);
      }
    }
    setActiveIdx(-1);
    onComplete();
    Alert.alert("Complete", "All assets saved to Gallery!");
  };

  return {
    startExport,
    activeIdx,
    MarketingComponent: activeIdx !== -1 ? (
      <View style={{ position: 'absolute', opacity: 0 }}>
        <MarketingMockup data={MARKETING_SET[activeIdx]} canvasRef={canvasRef} />
      </View>
    ) : null,
  };
};
