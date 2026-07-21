import type { Metadata } from "next";
import { Theme } from "@astryxdesign/core/theme";
import { project3Theme } from "../project3";

import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";
import "../project3.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astryx Next App",
  description: "A minimal Next.js project wired up with Astryx."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme theme={project3Theme} mode="system">
          {children}
        </Theme>
      </body>
    </html>
  );
}
