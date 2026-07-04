import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 觀察 | AI Observer",
  description: "深度追蹤人工智慧模型、醫療 AI 與旅遊科技最新動態",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
