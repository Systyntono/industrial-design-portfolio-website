import Image from "next/image";
import { getImageMeta } from "@/lib/imageMeta";
import { resolveSrc } from "@/data/projectContent";
import type { Award, Overview } from "@/data/projectContent/types";
import type { Project } from "@/data/projects";
import { Col, Container, Grid } from "./Grid";
import { SPACE, type as t } from "./projectTokens";

const AWARD_HEIGHT = 44; // px — logos are normalised to this height

/** Award logos live in the project folder; an `awards/` subfolder works too. */
async function resolveAward(slug: string, award: Award) {
  const item = typeof award === "string" ? { src: award } : award;
  const url = resolveSrc(slug, item.src);
  const meta = url ? await getImageMeta(url) : null;
  return {
    url: meta ? url : null,
    alt: ("alt" in item && item.alt) || "Award",
    href: "href" in item ? item.href : undefined,
    width: meta ? (meta.width / meta.height) * AWARD_HEIGHT : AWARD_HEIGHT * 2,
    label: item.src,
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ ...t.label, color: "var(--pp-muted)" }}>{label}</dt>
      <dd className="mt-1" style={{ ...t.body, color: "var(--pp-fg)" }}>
        {value}
      </dd>
    </div>
  );
}

/**
 * The block directly under the hero — the one the scroll arrow targets.
 *
 * Most of the left column comes straight from data/projects.ts, so a
 * project's industries, tools, team and year are never typed twice.
 */
export default async function ProjectOverview({
  id,
  project,
  overview,
  title,
  subtitle,
}: {
  id: string;
  project: Project;
  overview?: Overview;
  title: string;
  subtitle?: string;
}) {
  const awards = await Promise.all(
    (overview?.awards ?? []).map((a) => resolveAward(project.slug, a))
  );

  const facts = [
    project.industries.length > 0 && {
      label: "Industry",
      value: project.industries.join(", "),
    },
    { label: "Year", value: String(project.year) },
    overview?.duration && { label: "Duration", value: overview.duration },
    { label: "Team", value: project.team },
    project.tools.length > 0 && { label: "Tools", value: project.tools.join(", ") },
    ...(overview?.facts ?? []),
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section style={{ paddingTop: SPACE.section }}>
      <Container>
        <div
          id={id}
          // The scroll anchor sits on the content, not on the padded section
          // — otherwise the arrow lands the reader on the section's top
          // padding, leaving the title a screenful below the header. The
          // extra 24px keeps the title off the header edge.
          style={{ scrollMarginTop: "calc(var(--pp-header-h) + 24px)" }}
        >
          <Grid rowGap={SPACE.section}>
            {/* Left — title and facts: 5 of 12 columns */}
            <Col className="col-span-12 md:col-span-5">
              <h1 style={{ ...t.h1, color: "var(--pp-fg)" }}>{title}</h1>
              {subtitle && (
                <p className="mt-2" style={{ ...t.lead, color: "var(--pp-muted)" }}>
                  {subtitle}
                </p>
              )}

              <dl
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1"
                style={{ gap: SPACE.tight, marginTop: SPACE.block }}
              >
                {facts.map((f) => (
                  <Fact key={f.label} label={f.label} value={f.value} />
                ))}
              </dl>
            </Col>

            {/* Right — issue, design, awards: 6 of 12, offset by one so it
                starts on column 7 and runs to the right edge. */}
            <Col className="col-span-12 md:col-span-6 md:col-start-7">
              <div className="flex flex-col" style={{ gap: SPACE.block }}>
                {overview?.issue && (
                  <div>
                    <h2 style={{ ...t.label, color: "var(--pp-muted)" }}>Issue</h2>
                    <p className="mt-3" style={{ ...t.lead, color: "var(--pp-fg)" }}>
                      {overview.issue}
                    </p>
                  </div>
                )}

                {overview?.design && (
                  <div>
                    <h2 style={{ ...t.label, color: "var(--pp-muted)" }}>Design</h2>
                    <p className="mt-3" style={{ ...t.lead, color: "var(--pp-fg)" }}>
                      {overview.design}
                    </p>
                  </div>
                )}

                {awards.length > 0 && (
                  <div>
                    <h2 style={{ ...t.label, color: "var(--pp-muted)" }}>Awards</h2>
                    <ul className="mt-4 flex flex-wrap items-center" style={{ gap: SPACE.block }}>
                      {awards.map((a, i) => {
                        const logo = a.url ? (
                          <Image
                            src={a.url}
                            alt={a.alt}
                            width={Math.round(a.width)}
                            height={AWARD_HEIGHT}
                            style={{ height: AWARD_HEIGHT, width: "auto" }}
                          />
                        ) : (
                          // Holds the row's shape before the logo is uploaded.
                          <span
                            className="flex items-center justify-center px-3"
                            style={{
                              height: AWARD_HEIGHT,
                              minWidth: AWARD_HEIGHT * 2,
                              border: "1px dashed var(--pp-rule)",
                              ...t.caption,
                              color: "var(--pp-muted)",
                            }}
                          >
                            {a.label}
                          </span>
                        );

                        return (
                          <li key={`${a.label}-${i}`}>
                            {a.href ? (
                              <a
                                href={a.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-opacity hover:opacity-60"
                              >
                                {logo}
                              </a>
                            ) : (
                              logo
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </Col>
          </Grid>
        </div>

        <hr style={{ borderColor: "var(--pp-rule)", marginTop: SPACE.section }} />
      </Container>
    </section>
  );
}
