import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用 Strict Mode，因为 PlayCanvas 的 addChild/removeChild 
  // 在快速 mount/unmount 循环中会破坏 entity 的组件状态
  // reactStrictMode: false,
};

export default nextConfig;
