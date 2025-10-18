"use client";

import { Entity } from "@playcanvas/react";
import { Render } from "@playcanvas/react/components";
import { useAsset } from "@playcanvas/react/hooks";
import { useEffect, useRef, useState } from "react";
import * as pc from "playcanvas";

interface AnimatedCharacterProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  autoSwitchInterval?: number; // 自动切换动画的间隔（毫秒）
  enableAutoSwitch?: boolean; // 是否启用自动切换动画
}

export function AnimatedCharacter({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 180, 0],
  scale = [1, 1, 1],
  autoSwitchInterval = 3000,
  enableAutoSwitch = false,
}: AnimatedCharacterProps) {
  const { asset, loading } = useAsset(modelPath, "container");
  const entityRef = useRef<pc.Entity | null>(null);
  const [currentAnimIndex, setCurrentAnimIndex] = useState(0);
  const [animationNames, setAnimationNames] = useState<string[]>([]);

  // 加载完成后设置动画
  useEffect(() => {
    if (loading || !entityRef.current) {
      console.log("⏳ 等待动画资源...", { loading });
      return;
    }
    if (!asset?.resource) {
      console.log("❌ 资源未准备好");
      return;
    }

    console.log("🎬 动画资源已就绪，开始设置");

    const pcEntity = entityRef.current as unknown as pc.Entity;

    // 延迟确保子实体已创建
    const timer = setTimeout(() => {
      console.log("开始查找 render 实体，子实体数:", pcEntity.children.length);

      // 添加 anim 组件
      if (!pcEntity.anim) {
        console.log("添加 anim 组件...");
        pcEntity.addComponent("anim", {
          activate: true,
        });
      }

      const animComponent = pcEntity.anim;
      if (!animComponent) {
        console.error("❌ Anim 组件创建失败");
        return;
      }

      console.log("✅ Anim 组件已就绪");

      // 获取所有动画
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resource = asset.resource as any;
      const animations = resource.animations;

      if (animations && animations.length > 0) {
        const names: string[] = [];

        console.log(`发现 ${animations.length} 个 Anim`);

        // 每个 AnimTrack 本身就包含名称和动画数据
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        animations.forEach((anim: any, index: number) => {
          const track = anim.resources[0];
          if (!track) {
            return;
          }

          const animName = track.name;
          const targetAnims = ["idle", "walk", "run"];

          if (!targetAnims.includes(animName)) {
            return;
          }
          
          names.push(animName);
          console.log(`✅ 提取动画 [${index}]: "${animName}"`);

          animComponent.assignAnimation(
            animName,
            track,
            undefined, // layerName (使用默认层)
            1.0, // speed
            true // loop
          );
        });

        setAnimationNames(names);
        console.log("📋 所有可用动画:", names);

        pcEntity.anim?.baseLayer?.transition(names[0]);
      } else {
        console.error("❌ 未找到任何动画");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [loading, asset]);

  // 切换动画（仅在启用自动切换时）
  useEffect(() => {
    if (!enableAutoSwitch) return;
    if (loading || !entityRef.current || animationNames.length === 0) return;

    const pcEntity = entityRef.current as pc.Entity;

    const anim = pcEntity.findComponent("anim") as pc.AnimComponent;
    if (!anim) {
      console.error("❌ anim 组件不存在");
      return;
    }

    const baseLayer = anim.baseLayer;
    if (!baseLayer) {
      console.error("❌ baseLayer 不存在");
      return;
    }
    const animName = animationNames[currentAnimIndex];
    console.log(
      `🔄 切换动画到 [${currentAnimIndex}/${animationNames.length}]:`,
      animName
    );

    baseLayer.transition(animName, 0.2);

    // 自动切换到下一个动画
    const interval = setInterval(() => {
      setCurrentAnimIndex((prev) => {
        const nextIndex = (prev + 1) % animationNames.length;
        console.log("⏰ 定时切换动画，从", prev, "到", nextIndex);
        return nextIndex;
      });
    }, autoSwitchInterval);

    return () => {
      clearInterval(interval);
    };
  }, [currentAnimIndex, loading, animationNames, asset, autoSwitchInterval, enableAutoSwitch]);

  if (loading || !asset) {
    console.log("⏳ 资源加载中...", { loading });
    return null;
  }

  return (
    <Entity
      ref={entityRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <Render type="asset" asset={asset} />
    </Entity>
  );
}
