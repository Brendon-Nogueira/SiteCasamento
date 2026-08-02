import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Franciele & Brendon — Nosso Casamento",
  description:
    "Celebre conosco o casamento de Franciele e Brendon. 22 de Maio de 2027. Cerimônia religiosa e recepção em Paraisópolis - MG.",
  keywords: [
    "casamento",
    "Franciele",
    "Brendon",
    "wedding",
    "Paraisópolis",
    "convite digital",
  ],
  openGraph: {
    title: "Franciele & Brendon — Nosso Casamento",
    description:
      "Celebre conosco o casamento de Franciele e Brendon. 22 de Maio de 2027.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
