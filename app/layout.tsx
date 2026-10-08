import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "杨子豪｜购物袋里的设计作品集",
    description: "打开一只莓粉色购物袋，浏览杨子豪的视觉设计、AI 创意、品牌与商业设计作品。",
    keywords: ["杨子豪", "视觉设计师", "AI设计师", "品牌设计师", "作品集"],
    authors: [{ name: "杨子豪" }],
    openGraph: {
      title: "杨子豪｜购物袋里的设计作品集",
      description: "购物袋里的作品集：品牌、AI 视觉、包装与商业设计项目。",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "杨子豪个人设计作品集" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "杨子豪｜购物袋里的设计作品集",
      description: "购物袋里的作品集：视觉设计师、AI 设计师、品牌设计师杨子豪。",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
