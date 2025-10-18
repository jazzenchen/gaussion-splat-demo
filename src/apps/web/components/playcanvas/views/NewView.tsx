import { Application } from "@playcanvas/react";
import {
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO,
  Color,
  Keyboard,
} from "playcanvas";
import { Suspense, useState, useEffect } from "react";
import SplatViewer from "@/components/playcanvas/controls/SplatViewer";
import { Loader } from "@/components/playcanvas/controls/Loader";
import { Leva, useControls } from "leva";
import { useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { FpsCounter } from "@/components/ui/fps-counter";
import { Entity } from "@playcanvas/react";
import { Environment, Light } from "@playcanvas/react/components";
import { useApp } from "@playcanvas/react/hooks";

type Splat = {
  name: string;
  fov: number;
  src: string;
  rotation: [number, number, number];
  position: [number, number, number];
};

const splatData: Splat = {
  name: "school_big",
  src: "/school/meta.json",
  position: [2, 0, -15],
  rotation: [90, 247, 180],
  fov: 60,
};

// 初始化输入设备的组件
function InputDeviceInitializer() {
  const app = useApp();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (app && app.graphicsDevice.canvas) {
      // 初始化键盘
      if (!app.keyboard) {
        app.keyboard = new Keyboard(window);
        console.log('✅ 键盘设备已初始化');
      }
    }
  }, [app]);

  return null;
}

export const NewView = () => {
  // No swirly animation initially
  const [on, setOn] = useState(0);
  const swirl = useSpring(on);

  // 环境光照控制
  const lighting = useControls("环境光照", {
    ambientColor: { value: "#ffffff", label: "环境光颜色" },
    ambientIntensity: {
      value: 10000,
      min: 0,
      max: 50000,
      step: 1000,
      label: "环境光强度",
    },
    enableDirectionalLight: { value: true, label: "启用方向光" },
    directionalLightColor: { value: "#ffffff", label: "方向光颜色" },
    directionalLightIntensity: {
      value: 1,
      min: 0,
      max: 5,
      step: 0.1,
      label: "方向光强度",
    },
    castShadows: { value: true, label: "投射阴影" },
  });

  // Toggle the swirl value on click
  const onSwirlToggle = () => {
    setOn(on ? 0 : 1);
    swirl.set(on ? 0 : 1);
  };

  // 转换环境光颜色
  const ambientColor = new Color(
    parseInt(lighting.ambientColor.slice(1, 3), 16) / 255,
    parseInt(lighting.ambientColor.slice(3, 5), 16) / 255,
    parseInt(lighting.ambientColor.slice(5, 7), 16) / 255
  );

  return (
    <>
      <div
        className="absolute top-0 left-0"
        onMouseMove={(e) => e.stopPropagation()}
      >
        <Leva collapsed />
      </div>
      <div className="absolute bottom-0 right-0">
        <Button onClick={onSwirlToggle}>Toggle Swirl</Button>
      </div>
      <Application
        fillMode={FILLMODE_FILL_WINDOW}
        resolutionMode={RESOLUTION_AUTO}
        graphicsDeviceOptions={{ antialias: false }}
        usePhysics={true}
      >
        <InputDeviceInitializer />
        <Suspense fallback={<Loader />}>
          {/* 环境光照 */}
          <Entity>
              <Environment
                ambientLight={ambientColor}
                ambientLuminance={lighting.ambientIntensity}
              />
            </Entity>

            {/* 方向光 - 可通过控制面板开关 */}
            {lighting.enableDirectionalLight && (
              <Entity rotation={[45, 45, 0]}>
                <Light
                  type="directional"
                  color={lighting.directionalLightColor}
                  intensity={lighting.directionalLightIntensity}
                  castShadows={lighting.castShadows}
                />
              </Entity>
            )}

            {/* 场景内容 */}
            <SplatViewer {...splatData} swirl={swirl} />
            <FpsCounter />
          </Suspense>
        </Application>
    </>
  );
};