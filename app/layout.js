import { Fresca, Unna } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

const fresca = Fresca({
  weight: "400",
  variable: "--font-fresca",
  subsets: ["latin"],
});

const unna = Unna({
  weight: ["400", "700"],
  variable: "--font-unna",
  subsets: ["latin"],
});

export const metadata = {
  title: "Polyglot AI",
  description: "Map your existing knowledge to new languages.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${fresca.variable} ${unna.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
