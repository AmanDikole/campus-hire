import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // ✅ Import this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusHire - Placement Portal",
  description: "Connect students with top companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* ✅ Add the Toaster here. 'richColors' makes success green and error red. */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}