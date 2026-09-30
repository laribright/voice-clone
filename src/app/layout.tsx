import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MainNavigation } from "@/components/layout/main-navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoiceDirector AI",
  description:
    "Create characters, clone voices and generate expressive voiceovers with AI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-background font-sans text-foreground antialiased",
        )}
      >
        <MainNavigation />
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
