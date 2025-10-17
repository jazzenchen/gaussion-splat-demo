import { Application } from "@playcanvas/react";
import { FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from "playcanvas";
import { Suspense, useState } from "react";
import SplatViewer from "@/components/playcanvas/SplatViewer";
import { Loader } from "@/components/playcanvas/Loader";
import { Leva } from "leva";
import { useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { FpsCounter } from "@/components/ui/fps-counter";

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

export const NewView = () => {
  // No swirly animation initially
  const [on, setOn] = useState(0);
  const swirl = useSpring(on);

  // Toggle the swirl value on click
  const onSwirlToggle = () => {
    setOn(on ? 0 : 1);
    swirl.set(on ? 0 : 1);
  };

  return (
    <div>
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
        // fillMode={FILLMODE_FILL_WINDOW}
        // resolutionMode={RESOLUTION_AUTO}
        graphicsDeviceOptions={{ antialias: false }}
        usePhysics={true}
      >
        <Suspense fallback={<Loader />}>
          <SplatViewer {...splatData} swirl={swirl} />
          <FpsCounter />
        </Suspense>
      </Application>
    </div>
  );
};
