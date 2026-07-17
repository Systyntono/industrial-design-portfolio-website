import { Suspense } from "react";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main>
      <Suspense fallback={null}>
        <Hero />
      </Suspense>
    </main>
  );
}
