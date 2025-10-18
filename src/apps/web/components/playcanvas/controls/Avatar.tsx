import { Entity } from "@playcanvas/react";
import {
  Camera,
  Collision,
  Render,
  RigidBody,
  Script,
} from "@playcanvas/react/components";
import { useAsset } from "@playcanvas/react/hooks";
import { useRef, useEffect } from "react";

import { CharacterController } from "@/components/playcanvas/scripts/character-controller";
import { AvatarMovement } from "../scripts/avatar-movement";

import { CameraMovement } from "@/components/playcanvas/scripts/camera-movement";

export const Avatar = function () {
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

          animComponent.assignAnimation(animName, track, undefined, 1.0, true);
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
      rotation={[0, 180, 0]}
      position={[0, -0.9, -2]}
      scale={[1, 1, 1]}
    >
      <Entity>
        <Entity name="Camera" position={[0, 2, -3]} rotation={[0, 0, 0]}>
          <Camera fov={80} />
          <Entity name="RaycastEndPoint" />
          <Script script={CameraMovement} scriptName="cameraMovement" />
        </Entity>
      </Entity>


      <Render type="asset" asset={asset} />
      {/* <Script script={CharacterController} /> */}
      <Script script={AvatarMovement} />

      <Collision type="capsule" radius={0.35} height={1.8} />
      {/* <RigidBody type="dynamic" mass={0} friction={0.75} restitution={0.5} /> */}
    </Entity>
  );
};
