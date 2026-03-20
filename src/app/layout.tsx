import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BTCFlow - Bitcoin DeFi on Stacks",
  description: "One-click Bitcoin DeFi. No Stacks wallet. No bridge confusion. No friction.",
  icons: {
    icon: "/btcflow_logo.png",
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
      className={`${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0D0F14] text-[#F0F2F7]">
        {children}
      </body>
    </html>
  );
}
