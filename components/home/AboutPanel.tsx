"use client";

import { useBandLayout, GAP } from "./useBandLayout";

const SKILLS = [
  "SolidWorks",
  "Plasticity",
  "Keyshot",
  "Fabrication",
  "Carpentry",
  "Sketching",
  "Vizcom",
  "Rapid Prototyping",
  "TouchDesigner",
];

export default function AboutPanel() {
  const layout = useBandLayout();
  const contentLeft = layout.mode === "vertical" ? layout.left + layout.width + GAP : layout.left;

  return (
    <div
      className="min-h-full pl-8 md:pl-16 pr-8 md:pr-16 pt-32 pb-24 bg-black"
      style={{ paddingLeft: contentLeft }}
    >
      {/* Horizontal mode means there wasn't room to run PageTitleBand as a
          fixed vertical column (e.g. a landscape phone) — PageTitleBand
          steps aside in that case since a fixed mid-screen band would
          collide with this page's own scrolling content, so the title is
          shown here instead, in-flow, where it just scrolls normally. */}
      {layout.mode === "horizontal" && (
        <p className="mb-12 text-3xl font-light tracking-widest text-white/90 uppercase">
          About
        </p>
      )}

      <div className="max-w-3xl">
        <div className="flex flex-col gap-6 text-lg text-zinc-400 leading-relaxed">
          <p>
            I&apos;m an industrial designer focused on human-centered products and design for
            manufacturing. Currently based in Uxbridge and Ottawa, I work across furniture,
            medical devices, consumer products, branding and digital products.
          </p>
          <p>
            My process starts with research, sketching, rigourous prototyping for form and CMF,
            moving through rapid prototyping and iteration to get to a final form that&apos;s both
            manufacturable and genuinely nice to use.
          </p>
        </div>

        <p className="mt-8 text-sm uppercase tracking-widest text-white/60">
          Open to opportunities
        </p>

        <div className="mt-10 pt-10 border-t border-white/10">
          <p className="text-white">Bachelors of Industrial Design</p>
          <p className="mt-1 text-zinc-400">Carleton University</p>
          <p className="mt-1 text-zinc-400">Expected Graduation: June 2029</p>
        </div>

        <div className="mt-16 pt-10 border-t border-white/10">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-5">
            Skills &amp; Tools
          </h2>
          <ul className="flex flex-wrap gap-3">
            {SKILLS.map((tool) => (
              <li
                key={tool}
                className="px-3 py-1 rounded-full border border-white/30 text-sm text-white/70"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
