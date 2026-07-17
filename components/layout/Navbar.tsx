"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <Link href="/" className="font-semibold">
        Tyson Jiang
      </Link>
      <div className="flex gap-6">
  <Link href="/?view=grid">Work</Link>
  <Link href="/about">About</Link>
  <Link href="/resume">Resume</Link>
  <Link href="/contact">Contact</Link>
</div>
    </nav>
  );
}