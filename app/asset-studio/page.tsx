"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CameraScene from "@/components/lazy-scene";
function Studio() {
  const q = useSearchParams();
  return (
    <div style={{ width: 800, height: 650, background: "#171a1f" }}>
      <CameraScene kind={q.get("kind") || "bullet"} asset />
    </div>
  );
}
export default function Page() {
  return (
    <Suspense>
      <Studio />
    </Suspense>
  );
}
