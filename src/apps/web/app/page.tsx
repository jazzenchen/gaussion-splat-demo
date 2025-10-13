"use client";

import { useEffect, useState } from "react";
import { Keyboard, Mouse, Hand } from "lucide-react";
import Viewer from "@/components/playcanvas/viewer";

export default function Home() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if the device supports touch
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouchScreen);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <Viewer />
      
      {/* Controls Guide Overlay */}
      <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm text-white p-6 rounded-lg shadow-xl max-w-sm">
        <h3 className="text-lg font-semibold mb-4 text-white/90">控制说明</h3>
        
        {isTouchDevice ? (
          /* Touch Controls - Show on touch devices */
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hand className="w-5 h-5" />
              <span className="font-medium text-sm">触屏操作</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-xs">👆</span>
                <span className="text-white/80">单指滑动旋转视角</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-xs">🤏</span>
                <span className="text-white/80">双指捏合前进后退</span>
              </div>
            </div>
          </div>
        ) : (
          /* Keyboard & Mouse Controls - Show on desktop */
          <>
            {/* Keyboard Controls */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="w-5 h-5" />
                <span className="font-medium text-sm">键盘移动</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">W</kbd>
                  <span className="text-white/80">前进</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">S</kbd>
                  <span className="text-white/80">后退</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">A</kbd>
                  <span className="text-white/80">左移</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">D</kbd>
                  <span className="text-white/80">右移</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">Q</kbd>
                  <span className="text-white/80">下降</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">E</kbd>
                  <span className="text-white/80">上升</span>
                </div>
              </div>
            </div>

            {/* Mouse Controls */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mouse className="w-5 h-5" />
                <span className="font-medium text-sm">鼠标操作</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <kbd className="px-3 py-1 bg-white/20 rounded text-xs">左键</kbd>
                <span className="text-white/80">按住拖动以旋转视角</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
