import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server (Turbopack HMR + dev-only assets) respond to
  // requests from this LAN IP, so phone testing over Wi-Fi works the same
  // as localhost. Dev-only — has no effect on production builds/deploys.
  // If your machine's LAN IP changes (new network, router reassigns it),
  // update this to match, or check it with `ipconfig` on Windows.
  allowedDevOrigins: ["192.168.0.13"],
};

export default nextConfig;
