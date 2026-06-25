import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer";
}

/**
 * Responsive max-width wrapper with consistent horizontal padding.
 */
export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Component>
  );
}
