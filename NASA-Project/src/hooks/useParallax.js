import { useEffect } from "react";

// الطبقات بتتحرك مع الماوس بسرعات مختلفة (السرعات في الـ CSS عن طريق --mx و --my)
export function useParallax() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const root = document.documentElement;
    let frame = 0;

    function handleMouseMove(e) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty(
          "--mx",
          (e.clientX / window.innerWidth - 0.5) * 2,
        );
        root.style.setProperty(
          "--my",
          (e.clientY / window.innerHeight - 0.5) * 2,
        );
      });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, []);
}
