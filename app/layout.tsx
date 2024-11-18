import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Layout from "@/components/layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Wartezeiten Global",
  description: "Eine Webseite um Global alle Theme Parks und deren Wartezeiten anzusehen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}