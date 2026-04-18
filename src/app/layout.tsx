import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptSure — AI Reliability Platform",
  description:
    "Test and de-risk AI features before shipping. Simulate, evaluate, and monitor AI outputs at scale.",
  keywords: ["AI testing", "LLM evaluation", "AI reliability", "prompt testing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
