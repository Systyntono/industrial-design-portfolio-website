import Link from "next/link";
import { BODY_PX, CAPTION_PX, H3_PX } from "./projectScale";

const CONTACT = [
  { label: "Email", value: "SystynWorks@gmail.com", href: "mailto:SystynWorks@gmail.com" },
  { label: "LinkedIn", value: "in/tysonjiang", href: "https://www.linkedin.com/in/tysonjiang/" },
  { label: "Behance", value: "tysonjiang", href: "https://www.behance.net/tysonjiang" },
];

export default function SiteFooter() {
  return (
    <footer
      className="mt-32 border-t"
      style={{ borderColor: "var(--pp-rule)" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p
              className="font-medium tracking-tight"
              style={{ fontSize: H3_PX, color: "var(--pp-fg)" }}
            >
              Open to opportunities.
            </p>
            <Link
              href="/?view=contact"
              className="mt-4 inline-block underline underline-offset-4 transition-opacity hover:opacity-60"
              style={{ fontSize: BODY_PX, color: "var(--pp-fg)" }}
            >
              Get in touch
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3 md:justify-items-end">
            {CONTACT.map((c) => (
              <li key={c.label}>
                <p
                  className="uppercase tracking-[0.14em]"
                  style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
                >
                  {c.label}
                </p>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-1 inline-block transition-opacity hover:opacity-60"
                  style={{ fontSize: CAPTION_PX, color: "var(--pp-fg)" }}
                >
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="mt-16"
          style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
        >
          © {new Date().getFullYear()} Tyson Jiang
        </p>
      </div>
    </footer>
  );
}
