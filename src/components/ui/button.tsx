import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet" | "on-image";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-soft font-sans font-semibold whitespace-nowrap " +
  "transition-[background-color,color,border-color,transform] duration-200 ease-out " +
  "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  // Ink is the default primary. Gold is an accent, never a big flat fill.
  primary: "bg-ink text-on-ink hover:bg-[#2e241e]",
  secondary: "border border-ink/80 text-ink hover:bg-ink hover:text-on-ink",
  ghost: "text-ink hover:bg-sunk",
  quiet:
    "text-ink underline decoration-gold decoration-1 underline-offset-[6px] hover:decoration-2 px-0!",
  "on-image": "bg-on-ink text-ink hover:bg-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}

/** Circular icon-only button. Requires an accessible label. */
export function IconButton({
  label,
  className,
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "rounded-full text-ink hover:bg-sunk inline-flex size-11 items-center justify-center transition-colors duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
