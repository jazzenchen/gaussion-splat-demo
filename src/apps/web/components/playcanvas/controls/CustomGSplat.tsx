"use client";

import { useLayoutEffect, useRef, type FC } from "react";
import {
  type Asset,
  type Entity,
  type EventHandle,
  Component,
  GSplatComponent,
} from "playcanvas";
import { type MotionValue } from "motion/react";
import { useParent, useApp } from "@playcanvas/react/hooks";
import vertex from "@/components/playcanvas/shaders/splat-vertex.js";

interface GsplatProps {
  asset: Asset;
  swirl: MotionValue;
  onLoad?: () => void; // 新增：加载完成回调
}

export const GSplat: FC<GsplatProps> = ({ asset, swirl, onLoad }) => {
  const parent: Entity = useParent();
  const app = useApp();
  const componentRef = useRef<Component | null>(null);
  const localTimeRef = useRef<number>(0);

  useLayoutEffect(() => {
    let handle: EventHandle;
    let cameraRef: Entity | null = null;

    if (parent) {
      // Only add the entity if it hasn't been added yet
      if (!componentRef.current) {
        componentRef.current = parent.addComponent("gsplat", {
          asset: asset,
        });

        const material = (componentRef.current as GSplatComponent)?.material;
        if (material) {
          material.getShaderChunks("glsl").set("gsplatVS", vertex);

          material.setParameter("uTime", localTimeRef.current);
          material.setParameter("uSwirlAmount", swirl.get());
          material.setParameter("uSpeed", 2); // 扩散速度
          material.setParameter("uSplatScale", 1); // 最终大小
          material.setParameter("uDelayTime", 5.0); // 延迟10秒（从GSplat加载完成后开始计算）
          material.setParameter("uTransitionDuration", 2.0); // 过渡1秒
          material.setParameter("view_position", [0, 0, 0]); // 初始值，会在update中更新

          // GSplat 组件创建完成，调用回调
          console.log("✅ GSplat 加载完成！");
          onLoad?.();
        }

        handle = app.on("update", (dt: number) => {
          localTimeRef.current += dt;
          const material = (componentRef.current as GSplatComponent)?.material;
          if (material) {
            material.setParameter("uTime", localTimeRef.current);
            material.setParameter("uSwirlAmount", swirl.get());

            // 在update循环中查找相机（只查找一次）
            if (!cameraRef) {
              cameraRef = app.root.findByName("Camera") as Entity;

              // 如果找到相机，更新view_position
              // 将相机的世界坐标转换到Splat的局部空间
              if (cameraRef) {
                const cameraWorldPos = cameraRef.getPosition();
                const splatWorldPos = parent.getPosition();

                // 相机相对于Splat的位置
                const relativePos = splatWorldPos.clone().sub(cameraWorldPos);

                material.setParameter("view_position", [
                  relativePos.x,
                  relativePos.y,
                  relativePos.z,
                ]);
              }
            }
          }
        });
      }
    }
    return () => {
      componentRef.current = null;
      parent.removeComponent("gsplat");
      if (handle) handle.off();
    };
  }, [asset, parent, app, swirl, onLoad]);

  return null;
};
