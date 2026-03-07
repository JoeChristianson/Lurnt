import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "@lurnt/ui/src/themes.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Lurnt",
  description: "Lurnt - Learn something new",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
