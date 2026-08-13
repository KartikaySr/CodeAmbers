import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export function Button({ href, variant = "primary", icon, className, children, ...props }: ButtonProps) {
  const classes = cn(
    "group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-core/70",
    variant === "primary" && "bg-amber-core text-black shadow-amber hover:scale-[1.02] hover:bg-amber-300",
    variant === "secondary" && "border border-white/10 bg-white/[0.06] text-white backdrop-blur-xl hover:border-amber-core/40 hover:bg-white/[0.1]",
    variant === "ghost" && "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
    className
  );

  if (href) return <Link href={href} className={classes}>{icon}{children}</Link>;
  return <button className={classes} {...props}>{icon}{children}</button>;
}
