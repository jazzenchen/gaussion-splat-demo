'use client';

import { useLayoutEffect, useRef, type FC } from 'react';
import {
  type Asset,
  type Entity as PcEntity,
  type EventHandle,
} from 'playcanvas';
import { type MotionValue } from 'motion/react';
import { useParent, useApp } from '@playcanvas/react/hooks';
import vertex from '@/components/shaders/splat-vertex.js';

interface GsplatProps {
  asset: Asset;
  swirl: MotionValue;
}

export const GSplat: FC<GsplatProps> = ({ asset, swirl }) => {
  const parent: PcEntity = useParent();
  const app = useApp();
  const assetRef = useRef<PcEntity | null>(null);
  // let localTime: number = 0;

  useLayoutEffect(() => {
    let handle: EventHandle;

    if (asset) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // assetRef.current = (asset.resource as any).instantiateRenderEntity({ vertex });
      parent.addChild(assetRef.current!);

      // handle = app.on('update', (dt: number) => {
      //   localTime += dt;
      //   const material = assetRef.current?.gsplat?.material;
      //   material?.setParameter('uTime', localTime);
      //   material?.setParameter('uSwirlAmount', swirl.get());
      // });
    }

    return () => {
      if (!assetRef.current) return;
      // if (handle) handle.off();
      parent.removeChild(assetRef.current);
    };
  }, [asset, parent]);

  return null;
};
