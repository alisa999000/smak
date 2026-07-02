import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Смачная — меню CRM",
  description: "Номенклатура, недельное меню, выгрузка на сайт и в агрегаторы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} min-h-screen antialiased`}>{children}</body>
    </html>
  );
}
