import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowLabel() {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}
