"use client";
import { useEffect } from "react";

export function CursorGlow() {
  useEffect(() => {
    const update = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--cx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cy", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", update, { passive: true });
    return () => window.removeEventListener("mousemove", update);
  }, []);

  return (
    <div
      className="cursor-glow pointer-events-none fixed inset-0 z-0 transition-[background] duration-200"
      aria-hidden
    />
  );
}
