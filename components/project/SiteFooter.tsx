import Link from "next/link";
import { Col, Grid, GridSection } from "./Grid";
import { SPACE, type as t } from "./projectTokens";

const CONTACT = [
  { label: "Email", value: "SystynWorks@gmail.com", href: "mailto:SystynWorks@gmail.com" },
  { label: "LinkedIn", value: "in/tysonjiang", href: "https://www.linkedin.com/in/tysonjiang/" },
  { label: "Behance", value: "tysonjiang", href: "https://www.behance.net/tysonjiang" },
];

export default function SiteFooter() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--pp-rule)",
        marginTop: SPACE.section,
        paddingTop: SPACE.block,
        paddingBottom: SPACE.block,
      }}
    >
      <GridSection>
        <Col className="col-span-12 md:col-span-5">
          <p style={{ ...t.h2, color: "var(--pp-fg)" }}>Open to opportunities.</p>
          <Link
            href="/?view=contact"
            className="mt-4 inline-block underline underline-offset-4 transition-opacity hover:opacity-60"
            style={{ ...t.body, color: "var(--pp-fg)" }}
          >
            Get in touch
          </Link>
        </Col>

        <Col className="col-span-12 md:col-span-6 md:col-start-7">
          <Grid rowGap={SPACE.tight}>
            {CONTACT.map((c) => (
              <Col key={c.label} className="col-span-12 sm:col-span-4">
                <p style={{ ...t.label, color: "var(--pp-muted)" }}>{c.label}</p>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-1 inline-block break-all transition-opacity hover:opacity-60"
                  style={{ ...t.caption, color: "var(--pp-fg)" }}
                >
                  {c.value}
                </a>
              </Col>
            ))}
          </Grid>
        </Col>

        <Col className="col-span-12" style={{ marginTop: SPACE.block }}>
          <p style={{ ...t.label, color: "var(--pp-muted)" }}>
            © {new Date().getFullYear()} Tyson Jiang
          </p>
        </Col>
      </GridSection>
    </footer>
  );
}
