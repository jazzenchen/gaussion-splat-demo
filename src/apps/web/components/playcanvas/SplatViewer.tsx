import { GSplat as MySplat } from "./MyGSplat";
import { type Asset } from "playcanvas";
import { Entity } from "@playcanvas/react";
import { Camera, Script, GSplat } from "@playcanvas/react/components";
import { OrbitControls } from "@playcanvas/react/scripts";
import { useSplatAsset } from "@/components/hooks/use-gsplat-asset";
import { MotionValue } from "motion/react";
import PostEffects from "@/components/playcanvas/PostEffects";
import { CustomCameraControls } from "@/components/playcanvas/custom-camera-controls";

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
  fov = 60,
  swirl,
}: ViewerProps) {
  const { data: splat } = useSplatAsset(src);

  return (
    <Entity>
      <Entity position={[0, 1, 0]} rotation={[0, 0, 0]}>
        <Camera fov={fov} />
        {/* <OrbitControls distanceMin={3} distanceMax={5} /> */}
        {/* <PostEffects /> */}
        <Script script={CustomCameraControls} />
      </Entity>

      <Entity rotation={rotation} position={position}>
        <MySplat asset={splat as Asset} swirl={swirl} />
        {/* <GSplat asset={splat as Asset} /> */}
      </Entity>
    </Entity>
  );
}

export default SplatViewer;
