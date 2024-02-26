import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrompterWave",
  description: "A Web App by Darion George",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
        <head />
        <body>
            {/*<ThemeProvider>*/}
              {children}
            {/*</ThemeProvider>*/}
          </body>
    </html>
  );
}
