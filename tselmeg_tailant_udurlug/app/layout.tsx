import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tselmeg Report Day",
  description: "Tselmeg Digital International School тайлант өдөрлөгийн платформ"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
