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

export default function ResumePanel() {
  const layout = useBandLayout();
  const contentLeft = layout.mode === "vertical" ? layout.left + layout.width + GAP : layout.left;

  return (
    <div
      className="min-h-full pl-8 md:pl-16 pr-8 md:pr-16 pt-32 pb-24 bg-black"
      style={{ paddingLeft: contentLeft }}
    >
      <div className="max-w-3xl">
        {/* Always-on page heading — doubles as the horizontal-mode fallback
            for PageTitleBand (which steps aside on short viewports where a
            fixed mid-screen band would collide with scrolling content). */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">Resume</h1>
          <a
            href="/resume.pdf"
            download
            className="px-4 py-2 rounded-full border border-white/30 text-sm text-white/80"
          >
            Download PDF
          </a>
        </div>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-5">Education</h2>
          <p className="text-lg text-white">
            Bachelor of Industrial Design — Carleton University
          </p>
          <p className="mt-1 text-zinc-400">Expected Graduation: June 2029</p>
        </section>

        <section className="mt-16 pt-10 border-t border-white/10">
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
        </section>

        <section className="mt-16 pt-10 border-t border-white/10">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-5">Experience</h2>
          <p className="text-zinc-400 leading-relaxed">Add your work history here.</p>
        </section>
      </div>
    </div>
  );
}
