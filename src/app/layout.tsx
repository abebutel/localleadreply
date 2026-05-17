import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://localleadreply.com"),
  title: "LocalLeadReply | Text back local leads faster",
  description:
    "LocalLeadReply helps local service businesses text back new leads quickly, organize follow-ups, and recover more quote requests.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LocalLeadReply | Text back local leads faster",
    description:
      "Instant lead text-back and simple follow-up tools for local service businesses.",
    url: "https://localleadreply.com",
    siteName: "LocalLeadReply",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalLeadReply | Text back local leads faster",
    description:
      "Instant lead text-back and simple follow-up tools for local service businesses.",
  },
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
