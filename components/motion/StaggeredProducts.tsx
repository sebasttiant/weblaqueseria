"use client";

import { animate, createScope, stagger } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface StaggeredProductsProps {
  children: ReactNode;
  className?: string;
}

export function StaggeredProducts({ children, className }: StaggeredProductsProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scope.current = createScope({ root }).add(() => {
      animate("[data-product-card]", {
        opacity: [0, 1],
        y: reduceMotion ? 0 : [20, 0],
        duration: reduceMotion ? 0 : 650,
        delay: reduceMotion ? 0 : stagger(80),
        ease: "out(3)",
      });
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <div ref={root} className={cn("grid", className)}>
      {children}
    </div>
  );
}
