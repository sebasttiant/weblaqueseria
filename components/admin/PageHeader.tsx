import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
}

/**
 * Consistent admin page heading with an optional primary action link.
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1
          className="text-2xl font-semibold text-charcoal"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-brown/70">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex h-10 items-center justify-center rounded-full bg-cheese px-4 text-sm font-medium text-charcoal transition-colors hover:bg-cheese-deep"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
