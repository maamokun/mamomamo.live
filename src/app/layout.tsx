import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const keifont = localFont({
  src: "../fonts/keifont.ttf",
  variable: "--font-keifont",
});

export const metadata: Metadata = {
  title: "まもまもうぇぶ",
  description: "柑橘系VTuberまもまもの公式カスサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${keifont.className} antialiased`}>{children}</body>
    </html>
  );
}
