import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSPAINTIFY — Token, Generate paint like images with AI",
  description: "Generate Paint-like AI images . Community token.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
