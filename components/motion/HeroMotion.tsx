"use client";

import { animate, createScope, stagger } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";

interface HeroMotionProps {
  children: ReactNode;
}

export function HeroMotion({ children }: HeroMotionProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scope.current = createScope({ root }).add(() => {
      animate("[data-hero-motion]", {
        opacity: [0, 1],
        y: reduceMotion ? 0 : [28, 0],
        duration: reduceMotion ? 0 : 800,
        delay: reduceMotion ? 0 : stagger(110),
        ease: "out(3)",
      });

      animate("[data-hero-float]", {
        y: reduceMotion ? 0 : [0, -12, 0],
        rotate: reduceMotion ? 0 : [-1, 1, -1],
        duration: reduceMotion ? 0 : 5200,
        loop: !reduceMotion,
        ease: "inOut(2)",
      });
    });

    return () => scope.current?.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}
