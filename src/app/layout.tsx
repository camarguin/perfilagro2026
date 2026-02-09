import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://perfilagro.com.br"),
  title: "Perfil Agro - Recrutamento e Seleção no Agronegócio",
  description: "Conecte-se aos melhores talentos do agronegócio. A Perfil Agro é especializada em recrutamento, seleção e gestão de pessoas para o setor agropecuário.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://perfilagro.com.br",
    title: "Perfil Agro - Especialistas em Pessoas no Agro",
    description: "Recrutamento, seleção e consultoria de RH para o agronegócio.",
    images: [
      {
        url: "/PerfilAgroLogo.png",
        width: 1200,
        height: 630,
        alt: "Perfil Agro Logo",
      },
    ],
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
