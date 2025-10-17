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
import vertex from '@/components/shaders/splat-vertex.js';

interface GsplatProps {
  asset: Asset;
  swirl: MotionValue;
}

export const GSplat: FC<GsplatProps> = ({ asset, swirl }) => {
  const parent: Entity = useParent();
  const app = useApp();
  const componentRef = useRef<Component | null>(null);
  const localTimeRef = useRef<number>(0);

  useLayoutEffect(() => {
    let handle: EventHandle;

    if (parent) {
      // Only add the entity if it hasn't been added yet
      if (!componentRef.current) {
        componentRef.current = parent.addComponent("gsplat", {
          asset: asset,
        });

        const material = (componentRef.current as GSplatComponent)?.material;
        if (material) {
          material.getShaderChunks("glsl").set("gsplatVS", vertex);
        }

        handle = app.on("update", (dt: number) => {
          localTimeRef.current += dt;
          const material = (componentRef.current as GSplatComponent)?.material;
          if (material) {
            material.setParameter("uTime", localTimeRef.current);
            material.setParameter("uSwirlAmount", swirl.get());
          }
        });
      }
    }
    return () => {
      componentRef.current = null;
      parent.removeComponent("gsplat");
      if (handle) handle.off();
    };
  }, [asset, parent, app, swirl]);

  return null;
};
