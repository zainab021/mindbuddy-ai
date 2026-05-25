import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MindSprint AI", template: "%s | MindSprint AI" },
  description: "AI-powered student learning platform — personalized study plans, flashcards, quizzes and analytics.",
  keywords: ["AI tutor", "study planner", "flashcards", "quiz", "learning analytics"],
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-dvh">
        {children}
      </body>
    </html>
  );
}
