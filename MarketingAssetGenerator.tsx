import {
  Canvas, Group, Image, ImageFormat, LinearGradient, RoundedRect, 
  Shadow, Text, useCanvasRef, useFont, useImage, vec, Rect, 
  BlurMask, Skia
} from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, PixelRatio } from "react-native";

// Perspective Matrix for "Wow Factor" 3D Tilt
const perspectiveMatrix = Skia.Matrix4();
perspectiveMatrix.identity();
perspectiveMatrix.translate(CANVAS_W / 2, CANVAS_H / 2);
perspectiveMatrix.rotateY(0.15); 
perspectiveMatrix.rotateX(0.1);  
perspectiveMatrix.translate(-CANVAS_W / 2, -CANVAS_H / 2);

export const MarketingMockup = ({ data, canvasRef }: { data: any, canvasRef: any }) => {
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
        {/* Cinematic BG & Cyber-Grid */}
        <Rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} color="#020205" />
        <Group opacity={0.2}>
          {[...Array(15)].map((_, i) => (
            <Rect key={i} x={0} y={i * 200} width={CANVAS_W} height={2} color={data.color} />
          ))}
        </Group>

        {/* Centered Typography */}
        <Text 
          x={centerX - fontH1.measureText(data.headline).width / 2} 
          y={320} text={data.headline} font={fontH1} color="white" 
        />
        <Text 
          x={centerX - fontBody.measureText(data.sub).width / 2} 
          y={440} text={data.sub} font={fontBody} color={data.color} 
        >
          <BlurMask blur={8} style="outer" />
        </Text>

        {/* 3D Wireframe Phone Shell */}
        <Group matrix={perspectiveMatrix}>
          {/* Neon Bloom Light */}
          <RoundedRect x={centerX-imgW/2-20} y={600} width={imgW+40} height={imgH+40} r={100} color={data.color}>
            <BlurMask blur={60} style="normal" />
          </RoundedRect>

          {/* Screenshot with Clipped Corners */}
          <Group clip={{ x: centerX-imgW/2, y: 620, width: imgW, height: imgH, r: 70 }}>
            <Image image={img} x={centerX-imgW/2} y={620} width={imgW} height={imgH} fit="cover" />
            {/* Screen Glass Reflection */}
            <Rect x={centerX-imgW/2} y={620} width={imgW} height={imgH/2} opacity={0.1}>
              <LinearGradient start={vec(0, 620)} end={vec(0, 620+imgH/2)} colors={["white", "transparent"]} />
            </Rect>
          </Group>
        </Group>
      </Group>
    </Canvas>
  );
};
