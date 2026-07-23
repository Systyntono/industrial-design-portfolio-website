import Link from "next/link";
import { LAYOUT, SPACE, type as t } from "./projectTokens";

const CONTACT = [
  { label: "Email", value: "SystynWorks@gmail.com", href: "mailto:SystynWorks@gmail.com" },
  { label: "LinkedIn", value: "in/tysonjiang", href: "https://www.linkedin.com/in/tysonjiang/" },
  { label: "Behance", value: "tysonjiang", href: "https://www.behance.net/tysonjiang" },
];

export default function SiteFooter() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--pp-rule)", marginTop: SPACE.section }}
    >
      <div className="mx-auto w-full"
        style={{ maxWidth: LAYOUT.contentMax, paddingLeft: SPACE.pagePad, paddingRight: SPACE.pagePad, paddingTop: SPACE.block, paddingBottom: SPACE.block }}>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p
              className="font-medium tracking-tight"
              style={{ ...t.h2, color: "var(--pp-fg)" }}
            >
              Open to opportunities.
            </p>
            <Link
              href="/?view=contact"
              className="mt-4 inline-block underline underline-offset-4 transition-opacity hover:opacity-60"
              style={{ ...t.body, color: "var(--pp-fg)" }}
            >
              Get in touch
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3 md:justify-items-end">
            {CONTACT.map((c) => (
              <li key={c.label}>
                <p
                  className="uppercase tracking-[0.14em]"
                  style={{ ...t.label, color: "var(--pp-muted)" }}
                >
                  {c.label}
                </p>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-1 inline-block transition-opacity hover:opacity-60"
                  style={{ ...t.caption, color: "var(--pp-fg)" }}
                >
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="mt-16"
          style={{ ...t.label, color: "var(--pp-muted)" }}
        >
          © {new Date().getFullYear()} Tyson Jiang
        </p>
      </div>
    </footer>
  );
}
