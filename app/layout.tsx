import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // ✅ Import the Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusHire | Industrial Placement Portal",
  description: "Streamlined recruitment for students and TPOs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {/* ✅ The Toaster must be placed here to be visible across all pages */}
        <Toaster position="top-center" richColors closeButton />
        
        {children}
      </body>
    </html>
  );
}