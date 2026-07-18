"use client";

import { useBandLayout, GAP } from "./useBandLayout";

export default function ContactPanel() {
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
          Contact
        </p>
      )}

      <div className="max-w-2xl">
        <p className="text-lg text-zinc-400 leading-relaxed mb-16">
          Open to new opportunities and collaborations — feel free to reach out.
        </p>

        <div className="pt-10 border-t border-white/10 flex flex-col gap-5 text-lg text-white">
          <a href="mailto:SystynWorks@gmail.com" className="hover:underline w-fit">
            SystynWorks@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/tysonjiang/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline w-fit"
          >
            LinkedIn
          </a>
          <a
            href="https://www.behance.net/tysonjiang"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline w-fit"
          >
            Behance
          </a>
        </div>
      </div>
    </div>
  );
}
