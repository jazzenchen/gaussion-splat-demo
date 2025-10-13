"use client";

import { Application, Entity } from "@playcanvas/react";
import { Camera, GSplat, Render, Script } from "@playcanvas/react/components";
import { useSplat, useAsset, useMaterial } from "@playcanvas/react/hooks";
import { CustomCameraControls } from "./custom-camera-controls";
import { useEffect, useRef } from "react";
import * as pc from "playcanvas";

function ToyCat() {
  const { asset } = useSplat("school/meta.json");
  if (!asset) return null;

  return (
    <Entity position={[-1, 0, 1]} rotation={[90, 90, 180]}>
      <GSplat asset={asset} />
    </Entity>
  );
}

function MeshModel() {
  const { asset } = useAsset("/mesh.glb", "container");
  const entityRef = useRef<pc.Entity | null>(null);
  
  // 创建绿色材质
  const greenMaterial = useMaterial({ 
    diffuse: "lime",           // 绿色
    emissive: "#00ff00",       // 发光绿色
    emissiveIntensity: 0.3,    // 发光强度
    metalness: 0,              // 非金属
    gloss: 0.4,                // 光泽度
    useLighting: true          // 使用光照
  });

  // 在资源加载并实例化后立即应用材质和线框模式
  useEffect(() => {
    if (!entityRef.current || !greenMaterial || !asset?.resource) return;

    const applyMaterialRecursively = (entity: pc.Entity) => {
      const renderComponent = entity.findComponent('render') as pc.RenderComponent | null;
      if (renderComponent?.meshInstances) {
        renderComponent.meshInstances.forEach((mi: pc.MeshInstance) => {
          mi.material = greenMaterial;
          mi.renderStyle = pc.RENDERSTYLE_WIREFRAME; // 设置线框模式
        });
      }
      entity.children.forEach(child => {
        if (child instanceof pc.Entity) {
          applyMaterialRecursively(child);
        }
      });
    };

    // 需要延迟一下，等待 Container 组件实例化完成
    const applyMaterial = () => {
      const pcEntity = entityRef.current as unknown as pc.Entity;
      applyMaterialRecursively(pcEntity);
    };

    // 立即尝试应用
    applyMaterial();
    
    // 也在下一帧再次尝试，确保 Container 已完成实例化
    const timer = setTimeout(applyMaterial, 10);
    
    return () => clearTimeout(timer);
  }, [asset?.resource, greenMaterial]);

  if (!asset || !greenMaterial) return null;

  return (
    <Entity ref={entityRef} position={[-1, 0, 1]} rotation={[90, 90, 180]}>
      <Render type="asset" asset={asset} />
    </Entity>
  );
}

export default function App() {
  return (
    <Application graphicsDeviceOptions={{ antialias: false }}>
      <Entity name="Camera" position={[18, 0, -35]}>
        <Camera />
        <Script script={CustomCameraControls} />
      </Entity>
      <ToyCat />
      <MeshModel />
    </Application>
  );
}
