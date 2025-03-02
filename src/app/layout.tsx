import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${CMS_NAME} - スタートアップ・Web開発・AI情報メディア`,
  description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
  keywords: ["スタートアップ", "ホームページ", "Web開発", "AI", "テックブログ", "Futene", "東大発"],
  metadataBase: new URL('https://futene-tech-lab.vercel.app'),
  openGraph: {
    title: `${CMS_NAME} - スタートアップ・Web開発・AI情報メディア`,
    description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
    url: 'https://futene-tech-lab.vercel.app',
    siteName: CMS_NAME,
    images: [HOME_OG_IMAGE_URL],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CMS_NAME} - スタートアップ・Web開発・AI情報メディア`,
    description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
    images: [HOME_OG_IMAGE_URL],
  },
  alternates: {
    canonical: 'https://futene-tech-lab.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
      </head>
      <body
        className={cn(inter.className, "bg-white text-gray-800")}
      >
        <Header />
        <div className="min-h-screen pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
