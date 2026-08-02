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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
