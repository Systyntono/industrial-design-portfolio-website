"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="px-8 py-6 text-sm text-zinc-500">
      <p>© {new Date().getFullYear()} Tyson Jiang. All rights reserved.</p>
    </footer>
  );
}