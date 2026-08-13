import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CodeAmbers | Fuel for Autonomous Engineering",
  description: "An AI engineering operating system for autonomous, collaborative software creation."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
