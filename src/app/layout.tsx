import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalLeadReply | Text back local leads faster",
  description:
    "Simple lead text-back, review reply, and content tools for local service businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
