import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Northstar Portfolio — Invest with clarity", template: "%s | Northstar Portfolio" },
  description: "Live market intelligence, personal watchlists and portfolio analytics in one focused workspace.",
  applicationName: "Northstar Portfolio",
  openGraph: {
    type: "website",
    title: "Northstar Portfolio — Invest with clarity",
    description: "Live markets, personal watchlists and portfolio analytics in one focused workspace.",
    siteName: "Northstar Portfolio",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Northstar Portfolio dashboard preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northstar Portfolio — Invest with clarity",
    description: "Live markets, personal watchlists and portfolio analytics in one focused workspace.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('northstar-theme')||localStorage.getItem('marketcap-theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
