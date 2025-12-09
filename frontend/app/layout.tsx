import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreHydration } from "@/components/StoreHydration";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Revuu - Portfolio para Profissionais",
  description: "Crie seu portfolio profissional em minutos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreHydration>{children}</StoreHydration>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
