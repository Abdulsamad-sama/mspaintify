import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "$IMGN — Community Token & AI Image Generator",
  description: "Generate AI images in any genre. Community token. Not financial advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
