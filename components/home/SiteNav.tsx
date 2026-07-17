import Link from "next/link";

type SiteNavProps = {
  variant?: "onPhoto" | "onLight";
  onLogoClick?: () => void;
};

export default function SiteNav({ variant = "onPhoto", onLogoClick }: SiteNavProps) {
  const textColor = variant === "onPhoto" ? "text-white" : "text-zinc-900";

  return (
    <>
      <Link
        href="/"
        id="site-logo"
        onClick={
          onLogoClick
            ? (e) => {
                e.preventDefault();
                onLogoClick();
              }
            : undefined
        }
        className={`fixed top-6 left-8 md:left-16 w-20 flex justify-between whitespace-nowrap text-sm font-semibold z-30 ${textColor}`}
      >
        <span>Tyson</span>
        <span>Jiang</span>
      </Link>

      <div className={`fixed top-6 right-8 md:right-16 flex gap-6 z-30 ${textColor}`}>
        <Link href="/?view=grid">Work</Link>
        <Link href="/about">About</Link>
        <Link href="/resume">Resume</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </>
  );
}
