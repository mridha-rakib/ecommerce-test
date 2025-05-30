import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const lora = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | e-commerce",
    absolute: "e-commerce",
  },
  description: "The e-commerce app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lora.className}>
        <Navbar />
        <div className="min-h-[50vh]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
