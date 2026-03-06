import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoBlog - AI 네이버 블로그 자동 포스팅",
  description: "AI가 자동으로 네이버 블로그 글을 생성하고 예약 발행합니다",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
