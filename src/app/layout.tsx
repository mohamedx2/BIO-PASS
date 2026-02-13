import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bio-Pass | L'Identité Numérique Éphémère",
  description: "Secure, privacy-first digital identity system designed to generate temporary, self-destructing identity proofs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
