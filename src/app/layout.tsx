import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";
import ThemeRegistry from "@/components/ThemeRegistry"; // Import the new ThemeRegistry

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wygrzeb Search", // Example title
  description: "Comprehensive search application", // Example description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <SearchProvider>
            {children}
          </SearchProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
