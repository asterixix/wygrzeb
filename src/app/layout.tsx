import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SearchProvider } from "@/context/SearchContext";
import "./globals.css";
import ThemeToggle from '@/components/layout/ThemeToggle';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wygrzeb",
  description: "Inteligentna wyszukiwarka informacji",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.className}>
        <SearchProvider>
          <ThemeToggle />
          <main>{children}</main>
        </SearchProvider>
      </body>
    </html>
  );
}
