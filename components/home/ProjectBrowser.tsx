"use client";

import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";
import RecordCrate from "./RecordCrate";
import { useBandLayout, GAP } from "./useBandLayout";
import { TITLE_PX, SUBTITLE_PX, BODY_PX, TAG_PX } from "./typeScale";

// Filter pill styling, shared by all four filter groups (Industry, Tools,
// Team, Year) so the selected-state accent only has to be changed here.
// The accent hex is written out in full rather than interpolated from a
// variable — Tailwind scans source for complete class strings at build
// time, so a computed `bg-[${x}]` would never generate any CSS.
const PILL_BASE = "px-3 py-1 rounded-full text-sm border";
const PILL_SELECTED = "bg-[#f5a313] text-black border-[#f5a313]";
const PILL_IDLE = "border-white/30 text-white/70";
const pillClass = (selected: boolean) =>
  `${PILL_BASE} ${selected ? PILL_SELECTED : PILL_IDLE}`;

export default function ProjectBrowser() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState<string[]>([]);
  const [tool, setTool] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [year, setYear] = useState<number[]>([]);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const layout = useBandLayout();

  const industries = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.industries))),
    []
  );
  // Tools/software/processes is the one filter category expected to grow
  // long as more projects are added — same flex-wrap pill treatment as
  // Industry, which already scales to any number of options by wrapping to
  // more rows rather than needing a different widget.
  const tools = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tools))), []);
  const teams = useMemo(() => Array.from(new Set(projects.map((p) => p.team))), []);
  const years = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a),
    []
  );

  const filtersActive =
    search.trim() !== "" ||
    industry.length > 0 ||
    tool.length > 0 ||
    team.length > 0 ||
    year.length > 0;

  const matchedProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry =
      industry.length === 0 || industry.some((sel) => p.industries.includes(sel));
    const matchesTool = tool.length === 0 || tool.some((sel) => p.tools.includes(sel));
    const matchesTeam = team.length === 0 || team.includes(p.team);
    const matchesYear = year.length === 0 || year.includes(p.year);
    return matchesSearch && matchesIndustry && matchesTool && matchesTeam && matchesYear;
  });

  const matchedSlugs = new Set(matchedProjects.map((p) => p.slug));

  const toggleIndustry = (ind: string) =>
    setIndustry((prev) => (prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]));

  const toggleTool = (t: string) =>
    setTool((prev) => (prev.includes(t) ? prev.filter((v) => v !== t) : [...prev, t]));

  const toggleTeam = (t: string) =>
    setTeam((prev) => (prev.includes(t) ? prev.filter((v) => v !== t) : [...prev, t]));

  const toggleYear = (y: number) =>
    setYear((prev) => (prev.includes(y) ? prev.filter((v) => v !== y) : [...prev, y]));

  // In vertical mode the title band occupies a column on the left, so
  // gallery content starts GAP past it. In horizontal mode there's no band
  // column, but DJ controls are still fixed at that same left edge — on a
  // short viewport (why horizontal mode triggered in the first place) their
  // bottom-anchored column can reach high enough to sit level with this
  // page's own top content, so it still needs the same left clearance.
  // layout.left in horizontal mode is already computed as "past the
  // controls", so it doubles as the correct inset here with no extra math.
  const contentLeft = layout.mode === "vertical" ? layout.left + layout.width + GAP : layout.left;

  return (
    <div
      className="min-h-full pl-8 md:pl-16 pr-8 md:pr-16 pt-32 pb-16 bg-black"
      style={{ paddingLeft: contentLeft }}
    >
      {/* Horizontal mode means there wasn't room to run PageTitleBand as a
          fixed vertical column (e.g. a landscape phone) — PageTitleBand
          steps aside in that case since a fixed mid-screen band would
          collide with this page's own scrolling content, so the title is
          shown here instead, in-flow, where it just scrolls normally. */}
      {layout.mode === "horizontal" && (
        <p className="mb-12 text-3xl font-light tracking-widest text-white/90 uppercase">
          More Projects
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-12 min-w-0">
        {/* Sticky within Hero's overflow-y-auto section (the scroll
            container), so search/filters hold the same top-32 offset the
            page content starts at, at any scroll position. self-start is
            load-bearing: flex items stretch to the row's full height by
            default, and a full-height item has no room left to "stick".
            lg: only — in the stacked mobile layout it scrolls normally. */}
        <aside className="lg:w-56 flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-white/30 bg-transparent text-white placeholder-white/50 rounded-full px-4 py-2 text-sm"
          />

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-white/50">Industry</p>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => toggleIndustry(ind)}
                  className={pillClass(industry.includes(ind))}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-white/50">Tools &amp; Process</p>
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTool(t)}
                  className={pillClass(tool.includes(t))}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-white/50">Team</p>
            <div className="flex flex-wrap gap-2">
              {teams.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTeam(t)}
                  className={pillClass(team.includes(t))}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-white/50">Year</p>
            <div className="flex flex-wrap gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => toggleYear(y)}
                  className={pillClass(year.includes(y))}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col xl:flex-row gap-12">
          <div className="min-w-0 xl:basis-3/4">
            <RecordCrate
              projects={projects}
              pulledOutSlugs={matchedSlugs}
              pullActive={filtersActive}
              coverWidthClass={filtersActive ? "w-full sm:w-2/5" : "w-full xl:w-1/2"}
              onHoverChange={setHoveredProject}
            />
            {filtersActive && matchedProjects.length === 0 && (
              <p className="mt-4 text-zinc-400">No projects match your filters.</p>
            )}
          </div>

          {/* Same sticky treatment as the filters aside — pinned at the
              page's top-32 content line while the crate scrolls. */}
          <div className="hidden xl:block min-w-0 xl:basis-1/4 pt-8 xl:sticky xl:top-32 xl:self-start">
            {hoveredProject ? (
              <>
                <p className="font-medium text-white" style={{ fontSize: TITLE_PX }}>
                  {hoveredProject.title}
                </p>
                <p
                  className="mt-1 font-semibold text-white/80"
                  style={{ fontSize: SUBTITLE_PX }}
                >
                  {hoveredProject.subtitle}
                </p>
                <p
                  className="mt-2 text-zinc-400 leading-relaxed"
                  style={{ fontSize: BODY_PX }}
                >
                  {hoveredProject.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hoveredProject.industries.map((ind) => (
                    <span
                      key={ind}
                      className="px-2 py-0.5 rounded-full border border-white/30 text-white/70"
                      style={{ fontSize: TAG_PX }}
                    >
                      {ind}
                    </span>
                  ))}
                  <span
                    className="px-2 py-0.5 rounded-full border border-white/30 text-white/70"
                    style={{ fontSize: TAG_PX }}
                  >
                    {hoveredProject.team}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full border border-white/30 text-white/70"
                    style={{ fontSize: TAG_PX }}
                  >
                    {hoveredProject.year}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-500">Hover a project to preview it here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
