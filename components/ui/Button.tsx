import { cn } from "@/lib/utils/cn";

const BUTTON_VARIANT = {
  PRIMARY: "primary",
  OUTLINE: "outline",
  GHOST: "ghost",
} as const;

type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];

const BUTTON_SIZE = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-cheese text-charcoal hover:bg-cheese-deep focus-visible:ring-cheese-deep",
  outline:
    "border border-brown/40 text-charcoal hover:bg-cream-100 focus-visible:ring-brown",
  ghost: "text-charcoal hover:bg-cream-100 focus-visible:ring-brown",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-13 px-7 text-lg",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:pointer-events-none disabled:opacity-50";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

type ButtonLinkProps = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & {
    href: string;
  };

export function Button({
  variant = BUTTON_VARIANT.PRIMARY,
  size = BUTTON_SIZE.MD,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Anchor styled as a button — for navigation and external CTAs.
 */
export function ButtonLink({
  variant = BUTTON_VARIANT.PRIMARY,
  size = BUTTON_SIZE.MD,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
