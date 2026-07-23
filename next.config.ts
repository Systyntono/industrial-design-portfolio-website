import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build write somewhere other than .next, so you can
  // run `npm run build` to check for errors while `npm run dev` is still
  // running without the two clobbering each other's cache:
  //   BUILD_DIR=.next-build npm run build
  distDir: process.env.BUILD_DIR || ".next",
  // Lets the dev server (Turbopack HMR + dev-only assets) respond to
  // requests from this LAN IP, so phone testing over Wi-Fi works the same
  // as localhost. Dev-only — has no effect on production builds/deploys.
  // If your machine's LAN IP changes (new network, router reassigns it),
  // update this to match, or check it with `ipconfig` on Windows.
  allowedDevOrigins: ["192.168.1.26"],
  // The dev-mode indicator overlay defaults to the bottom-left corner,
  // which sits on top of DjControls' play/prev/next buttons (also fixed
  // bottom-left) and silently swallows taps there on narrow mobile
  // viewports — no JS error, since it's real UI intercepting the touch.
  // Disabled since Eruda now covers on-device debugging. Dev-only, no
  // effect on production builds.
  devIndicators: false,
  // About/Resume/Contact are now stages inside the homepage's sliding
  // gallery (Hero.tsx) instead of standalone pages — old links/bookmarks to
  // these paths land on that same gallery position via the ?view= param.
  async redirects() {
    return [
      { source: "/about", destination: "/?view=about", permanent: false },
      { source: "/resume", destination: "/?view=resume", permanent: false },
      { source: "/contact", destination: "/?view=contact", permanent: false },
    ];
  },
};

export default nextConfig;
