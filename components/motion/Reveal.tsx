"use client";

import { animate, createScope } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scope.current = createScope({ root }).add(() => {
      if (!root.current) return;

      animate(root.current, {
        opacity: [0, 1],
        y: reduceMotion ? 0 : [24, 0],
        duration: reduceMotion ? 0 : 700,
        delay: reduceMotion ? 0 : delay,
        ease: "out(3)",
      });
    });

    return () => scope.current?.revert();
  }, [delay]);

  return <div ref={root} className={className}>{children}</div>;
}
