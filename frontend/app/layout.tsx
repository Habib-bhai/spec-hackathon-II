import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/Components";
import { Providers } from "@/lib/api/providers";

/**
 * Poppins Font - Premium Typography
 * Feature: 005-frontend-redesign
 * Per FR-002: Modern sans-serif font (Poppins) for premium feel
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow - Organize Your Life, One Task at a Time",
  description:
    "Experience the future of productivity with our intuitive task management system. Built for those who dream big and execute bigger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
