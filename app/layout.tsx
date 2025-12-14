import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/lib/movement/wallet-adapter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATG-M | Autonomous Treasury Guardian",
  description: "AI-powered autonomous treasury management built natively on Movement L1 using Move",
  icons: {
    icon: '/atglogo.png',
    shortcut: '/atglogo.png',
    apple: '/atglogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

