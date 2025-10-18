import { Entity } from "@playcanvas/react";
import { Render, Script, Camera } from "@playcanvas/react/components";
import { Script as PcScript } from "playcanvas";

class Spinner extends PcScript {
  scriptName = "Spinner";
  t = 0;
  update(dt: number) {
    this.t += dt;
    // 旋转效果
    this.entity.setLocalEulerAngles(0, this.t * 100, 0);
    // 上下浮动效果
    this.entity.setLocalPosition(0, Math.sin(this.t * 2) * 0.3, 0);
  }
}

export const Loader = () => (
  <>
    {/* PlayCanvas 场景中的加载动画 */}
    <Entity>
      <Entity position={[0, 0, 5]}>
        <Camera />
      </Entity>
      <Entity>
        <Render type="torus" />
        <Script script={Spinner} />
      </Entity>
    </Entity>
    
    {/* HTML 覆盖层的加载文字 */}
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-white text-2xl font-semibold mb-2">加载中...</h2>
        <p className="text-white/60 text-sm">正在加载 Gaussian Splat 场景</p>
      </div>
    </div>
  </>
);
