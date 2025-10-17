"use client";

import { Application, Entity } from "@playcanvas/react";
import {
  Camera,
  GSplat,
  Render,
  Script,
  Collision,
  RigidBody,
  Light,
} from "@playcanvas/react/components";
import {
  useSplat,
  useAsset,
  useMaterial,
  useApp,
} from "@playcanvas/react/hooks";
import { CustomCameraControls } from "./custom-camera-controls";
import { CharacterController } from "./character-controller";
import { useEffect, useRef, useState } from "react";
import * as pc from "playcanvas";

function ToyCat() {
  const { asset, loading } = useSplat("school_big/meta.json");

  // 只在完全加载后才渲染，避免 GSplat 属性变化警告
  if (loading || !asset) return null;

  return (
    <Entity position={[-1, 0, 1]} rotation={[90, 90, 180]}>
      <GSplat asset={asset} />
    </Entity>
  );
}

function MeshModel() {
  const { asset, loading } = useAsset("/mesh.glb", "container");
  const entityRef = useRef<pc.Entity | null>(null);

  // 创建绿色材质
  const greenMaterial = useMaterial({
    diffuse: "lime", // 绿色
    emissive: "#00ff00", // 发光绿色
    emissiveIntensity: 0.3, // 发光强度
    metalness: 0, // 非金属
    gloss: 0.4, // 光泽度
    useLighting: true, // 使用光照
  });

  // 当 asset 加载完成后，应用材质和添加碰撞
  useEffect(() => {
    // 只在 loading 完成且资源准备好时执行
    if (loading || !entityRef.current || !greenMaterial || !asset?.resource) {
      console.log("⏳ 等待加载完成... loading:", loading);
      return;
    }

    console.log("✅ Asset 加载完成！开始应用材质和物理组件");

    console.log("📦 Asset 信息:", {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      loaded: asset.loaded,
      resource: asset.resource ? "已加载" : "未加载",
    });

    const pcEntity = entityRef.current as unknown as pc.Entity;

    const applyMaterialRecursively = (entity: pc.Entity) => {
      const renderComponent = entity.findComponent(
        "render"
      ) as pc.RenderComponent | null;
      if (renderComponent?.meshInstances) {
        renderComponent.meshInstances.forEach((mi: pc.MeshInstance) => {
          mi.material = greenMaterial;
          mi.renderStyle = pc.RENDERSTYLE_WIREFRAME;
        });
      }
      entity.children.forEach((child) => {
        if (child instanceof pc.Entity) {
          applyMaterialRecursively(child);
        }
      });
    };

    // 添加物理组件到所有有 mesh 的子实体
    const addPhysicsToChildren = (entity: pc.Entity) => {
      entity.children.forEach((child) => {
        if (child instanceof pc.Entity) {
          const renderComp = child.render;

          if (
            renderComp &&
            renderComp.meshInstances &&
            renderComp.meshInstances.length > 0
          ) {
            console.log("找到 mesh 子实体，添加物理组件");

            if (!child.collision) {
              child.addComponent("collision", { type: "mesh" });
              console.log("✅ Collision 已添加");
            }

            if (!child.rigidbody) {
              child.addComponent("rigidbody", {
                type: "static",
                friction: 0.5,
              });
              console.log("✅ RigidBody 已添加");
            }
          }

          // 递归处理子实体
          addPhysicsToChildren(child);
        }
      });
    };

    // 延迟一下确保 Container 完全实例化
    const timer = setTimeout(() => {
      console.log("应用材质和物理组件，子实体数:", pcEntity.children.length);
      applyMaterialRecursively(pcEntity);
      addPhysicsToChildren(pcEntity);
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, asset, greenMaterial]);

  if (!asset || !greenMaterial) return null;

  const id = 2;

  return (
    <Entity ref={entityRef} position={[-1, 0, 1]} rotation={[90, 90, 180]}>
      <Render type="asset" asset={asset} />
      <Collision type="mesh" asset={id} />
      <RigidBody type="static" />
    </Entity>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DroppingCube() {
  return (
    <Entity position={[19, 1, -38]}>
      <Render type="box" />
      <Collision type="box" halfExtents={[0.5, 0.5, 0.5]} />
      <RigidBody type="dynamic" mass={1} friction={0.5} restitution={0.5} />
    </Entity>
  );
}

function ControllableCharacter() {
  const { asset, loading } = useAsset("/Xbot.glb", "container");
  const entityRef = useRef<pc.Entity | null>(null);

  // 设置动画
  useEffect(() => {
    if (loading || !entityRef.current || !asset?.resource) {
      return;
    }

    const pcEntity = entityRef.current as pc.Entity;

    // 延迟确保子实体已创建
    const timer = setTimeout(() => {
      // 添加 anim 组件
      if (!pcEntity.anim) {
        pcEntity.addComponent("anim", {
          activate: true,
        });
      }

      const animComponent = pcEntity.anim;
      if (!animComponent) {
        console.error("❌ Anim 组件创建失败");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resource = asset.resource as any;
      const animations = resource.animations;

      if (animations && animations.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        animations.forEach((anim: any) => {
          const track = anim.resources[0];
          if (!track) return;

          const animName = track.name;
          const targetAnims = ["idle", "walk", "run"];

          if (!targetAnims.includes(animName)) return;

          animComponent.assignAnimation(
            animName,
            track,
            undefined,
            1.0,
            true
          );
        });

        // 默认播放 idle 动画
        pcEntity.anim?.baseLayer?.transition("idle");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [loading, asset]);

  if (loading || !asset) {
    return null;
  }

  return (
    <Entity
      ref={entityRef}
      position={[18, -2.8, -38]}
      rotation={[0, 180, 0]}
      scale={[1, 1, 1]}
    >
      <Render type="asset" asset={asset} />
      <Script script={CharacterController} />
    </Entity>
  );
}

function AmbientLight() {
  const app = useApp();

  useEffect(() => {
    if (app) {
      app.scene.ambientLight = new pc.Color(1, 1, 1); // 白色环境光
    }
  }, [app]);

  return null;
}

function CameraInfo({
  cameraRef,
}: {
  cameraRef: React.RefObject<pc.Entity | null>;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (cameraRef.current) {
        const pos = cameraRef.current.getPosition();
        const rot = cameraRef.current.getEulerAngles();
        setPosition({ x: pos.x, y: pos.y, z: pos.z });
        setRotation({ x: rot.x, y: rot.y, z: rot.z });
      }
    }, 100); // 每100ms更新一次

    return () => clearInterval(interval);
  }, [cameraRef]);

  return (
    <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl font-mono text-sm">
      <div className="mb-2 font-semibold text-white/90">相机信息</div>
      <div className="space-y-1">
        <div className="text-green-400">
          位置: ({position.x.toFixed(2)}, {position.y.toFixed(2)},{" "}
          {position.z.toFixed(2)})
        </div>
        <div className="text-blue-400">
          旋转: ({rotation.x.toFixed(2)}°, {rotation.y.toFixed(2)}°,{" "}
          {rotation.z.toFixed(2)}°)
        </div>
      </div>
    </div>
  );
}

function ControlsInfo() {
  return (
    <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl font-mono text-sm">
      <div className="mb-2 font-semibold text-white/90">操作说明</div>
      <div className="space-y-2">
        <div className="text-yellow-400">
          <div className="font-semibold mb-1">角色控制：</div>
          <div className="pl-2 space-y-0.5">
            <div>↑ ↓ ← → : 移动角色</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const cameraRef = useRef<pc.Entity | null>(null);

  // 让相机在初始化时看向角色
  useEffect(() => {
    if (cameraRef.current) {
      const avatarPosition = new pc.Vec3(18, -2.8, -38);
      cameraRef.current.lookAt(avatarPosition);
    }
  }, []);

  return (
    <>
      <Application
        graphicsDeviceOptions={{ antialias: false }}
        usePhysics={true}
      >
        <AmbientLight />
        <Entity ref={cameraRef} name="Camera" position={[30, 10, -50]} rotation={[-45, 60, -179]}>
          <Camera />
          <Script script={CustomCameraControls} />
        </Entity>
        <Entity rotation={[45, 45, 0]}>
          <Light type="directional" castShadows />
        </Entity>
        <ToyCat />
        <MeshModel />
        <ControllableCharacter />
        {/* <DroppingCube /> */}
      </Application>
      <ControlsInfo />
      <CameraInfo cameraRef={cameraRef} />
    </>
  );
}
