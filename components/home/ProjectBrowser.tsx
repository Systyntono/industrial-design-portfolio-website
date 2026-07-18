"use client";

import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";
import RecordCrate from "./RecordCrate";
import { useBandLayout, GAP } from "./useBandLayout";

export default function ProjectBrowser() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState<string[]>([]);
  const [year, setYear] = useState<number[]>([]);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const layout = useBandLayout();

  const industries = useMemo(() => Array.from(new Set(projects.map((p) => p.industry))), []);
  const years = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a),
    []
  );

  const filtersActive = search.trim() !== "" || industry.length > 0 || year.length > 0;

  const matchedProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industry.length === 0 || industry.includes(p.industry);
    const matchesYear = year.length === 0 || year.includes(p.year);
    return matchesSearch && matchesIndustry && matchesYear;
  });

  const matchedSlugs = new Set(matchedProjects.map((p) => p.slug));

  const toggleIndustry = (ind: string) =>
    setIndustry((prev) => (prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]));

  const toggleYear = (y: number) =>
    setYear((prev) => (prev.includes(y) ? prev.filter((v) => v !== y) : [...prev, y]));

  // In vertical mode the title band occupies a column on the left, so
  // gallery content starts GAP past it. In horizontal mode that column is
  // free again, so fall back to the same left inset SiteNav uses.
  const contentLeft =
    layout.mode === "vertical" ? layout.left + layout.width + GAP : undefined;

  return (
    <div
      className="min-h-full pl-8 md:pl-16 pr-8 md:pr-16 pt-32 pb-16 bg-black"
      style={{ paddingLeft: contentLeft }}
    >
      <div className="flex flex-col lg:flex-row gap-12 min-w-0">
        <aside className="lg:w-56 flex-shrink-0 flex flex-col gap-6">
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
                  className={`px-3 py-1 rounded-full text-sm border ${
                    industry.includes(ind)
                      ? "bg-white text-black border-white"
                      : "border-white/30 text-white/70"
                  }`}
                >
                  {ind}
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
                  className={`px-3 py-1 rounded-full text-sm border ${
                    year.includes(y)
                      ? "bg-white text-black border-white"
                      : "border-white/30 text-white/70"
                  }`}
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

          <div className="hidden xl:block min-w-0 xl:basis-1/4 pt-8">
            {hoveredProject ? (
              <>
                <p className="text-xl font-medium text-white">{hoveredProject.title}</p>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Add a short project description here.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full border border-white/30 text-xs text-white/70">
                    {hoveredProject.industry}
                  </span>
                  <span className="px-2 py-0.5 rounded-full border border-white/30 text-xs text-white/70">
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
