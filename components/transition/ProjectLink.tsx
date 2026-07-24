"use client";

import Link from "next/link";
import { useDropTransition } from "./DropTransition";

/**
 * A link to a project page that plays the paint-drop transition on click.
 *
 * `heroUrl` is the image the drop shows — pass the project's cover so the
 * porthole lands on the same picture the destination hero opens with.
 *
 * Falls back to a normal link on modified clicks (new tab, etc.) and when
 * motion is reduced, so it never gets in the way of expected browser
 * behaviour.
 */
export default function ProjectLink({
  href,
  heroUrl,
  className,
  children,
  ...rest
}: {
  href: string;
  heroUrl: string | null;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "onClick">) {
  const { go } = useDropTransition();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        // Let the browser handle new-tab / modified clicks normally.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href, heroUrl);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
