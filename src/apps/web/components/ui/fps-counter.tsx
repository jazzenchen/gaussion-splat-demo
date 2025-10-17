"use client";

import { useApp } from "@playcanvas/react/hooks";
import { useEffect, useState } from "react";

export const FpsCounter = () => {
  const app = useApp();
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!app) return;

    const updateFps = () => {
      // Get FPS from PlayCanvas app stats
      const currentFps = Math.round(app.stats.frame.fps);
      setFps(currentFps);
    };

    // Update FPS every frame
    const handle = app.on("update", updateFps);

    return () => {
      if (handle) handle.off();
    };
  }, [app]);

  return (
    <div className="fixed top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg font-mono text-sm z-50">
      <div className="flex items-center gap-2">
        <span className="text-green-400 font-bold">FPS</span>
        <span className="text-xl font-bold tabular-nums">{fps}</span>
      </div>
    </div>
  );
};

