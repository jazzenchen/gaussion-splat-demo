import { GSplat as MySplat } from "./CustomGSplat";
import { type Asset } from "playcanvas";
import { Entity } from "@playcanvas/react";

import { useSplatAsset } from "@/components/playcanvas/hooks/use-gsplat-asset";
import { MotionValue } from "motion/react";
import { CustomCameraControls } from "@/components/playcanvas/scripts/custom-camera-controls";
import { Avatar } from "@/components/playcanvas/controls/Avatar";
import { useState } from "react";
import { OrbitControls } from "@playcanvas/react/scripts";


type Splat = {
  src: string;
  fov: number;
  swirl: MotionValue;
  rotation: [number, number, number];
  position: [number, number, number];
};

type ViewerProps = Splat;

function SplatViewer({
  src,
  position,
  rotation,
  swirl,
}: ViewerProps) {
  const { data: splat } = useSplatAsset(src);

  // 追踪 GSplat 是否加载完成
  const [splatLoaded, setSplatLoaded] = useState(false);

  const handleSplatLoad = () => {
    console.log("🎉 SplatViewer: GSplat 加载完成，现在可以加载 Avatar 了");
    setSplatLoaded(true);
  };

  return (
    <Entity>

      {/* <Entity position={[0, 0, -1]}>
        <Render type="box" material={material} />
      </Entity> */}

      <Entity rotation={rotation} position={position}>
        <MySplat
          asset={splat as Asset}
          swirl={swirl}
          onLoad={handleSplatLoad}
        />
        {/* <GSplat asset={splat as Asset} /> */}
      </Entity>

      {/* <MeshModel /> */}
      {/* 只有在 GSplat 加载完成后才渲染 Avatar */}
      {splatLoaded && <Avatar />}
    </Entity>
  );
}

export default SplatViewer;
