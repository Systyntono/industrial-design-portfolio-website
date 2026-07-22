"use client";

import Link from "next/link";
import { useBandLayout, GAP } from "./useBandLayout";
import {
  education,
  resumeMeta,
  sections,
  skillGroups,
  type ResumeEntry,
} from "@/data/resume";

// The page is a scannable index, not a second copy of the PDF. Entries show
// their heading row plus at most one line; the detailed bullets live in
// data/resume.ts for the PDF, and project detail lives in the case studies,
// which show the work far better than a bullet describing it can.

function HeadingRow({ entry }: { entry: ResumeEntry }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <h3 className="text-white">
        <span className="font-medium">{entry.title}</span>
        {entry.meta && <span className="text-zinc-400"> — {entry.meta}</span>}
      </h3>
      <p className="text-sm text-white/50 whitespace-nowrap">{entry.dates}</p>
    </div>
  );
}

function Entry({ entry }: { entry: ResumeEntry }) {
  const body = (
    <>
      <HeadingRow entry={entry} />
      {entry.role && <p className="mt-1 text-sm text-zinc-400">{entry.role}</p>}
      {entry.highlight && (
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{entry.highlight}</p>
      )}
    </>
  );

  // Projects with a case study become the link to it — the page should push
  // readers into the work rather than describing it again.
  if (entry.slug) {
    return (
      <Link
        href={`/work/${entry.slug}`}
        className="group block transition-opacity hover:opacity-70"
      >
        {body}
        <p className="mt-2 text-sm text-white/50">
          View case study{" "}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </p>
      </Link>
    );
  }

  return <div>{body}</div>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs uppercase tracking-widest text-white/50 mb-6">{children}</h2>;
}

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
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">Resume</h1>
          <a
            href="/resume.pdf"
            download
            className="px-4 py-2 rounded-full border border-white/30 text-sm text-white/80 transition-colors hover:bg-white hover:text-black"
          >
            Download PDF
          </a>
        </div>

        <p className="text-white leading-relaxed">{resumeMeta.availability}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
          <span>{resumeMeta.location}</span>
          <span aria-hidden className="text-white/25">
            /
          </span>
          <a href={`mailto:${resumeMeta.email}`} className="hover:text-white">
            {resumeMeta.email}
          </a>
          {resumeMeta.links.map((l) => (
            <span key={l.label} className="flex items-center gap-x-3">
              <span aria-hidden className="text-white/25">
                /
              </span>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {l.label}
              </a>
            </span>
          ))}
        </div>

        <section className="mt-14 pt-10 border-t border-white/10">
          <SectionHeading>Education</SectionHeading>
          <Entry entry={education} />
        </section>

        <section className="mt-14 pt-10 border-t border-white/10">
          <SectionHeading>Technical Skills</SectionHeading>
          <dl className="flex flex-col gap-5">
            {skillGroups.map((g) => (
              <div key={g.label}>
                <dt className="text-white">{g.label}</dt>
                <dd className="mt-1 text-sm text-zinc-400 leading-relaxed">{g.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        {sections.map((section) => (
          <section key={section.heading} className="mt-14 pt-10 border-t border-white/10">
            <SectionHeading>{section.heading}</SectionHeading>
            <div className="flex flex-col gap-8">
              {section.entries.map((entry) => (
                <Entry key={entry.title} entry={entry} />
              ))}
            </div>
          </section>
        ))}

        <p className="mt-14 pt-10 border-t border-white/10 text-sm text-zinc-400">
          Full detail — including project bullets and coursework — is in the{" "}
          <a href="/resume.pdf" download className="text-white underline underline-offset-4">
            PDF
          </a>
          .
        </p>
      </div>
    </div>
  );
}
