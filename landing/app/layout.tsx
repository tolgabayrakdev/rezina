import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bengaraj.com"),
  title: {
    default: "BenGaraj – İkinci El Araç Galerisi Yönetim Sistemi",
    template: "%s | BenGaraj",
  },
  description:
    "BenGaraj ile araç envanterinizi, müşterilerinizi ve satış sürecinizi kolayca yönetin. İkinci el araç galerileri için tamamen ücretsiz, modern yönetim platformu.",
  keywords: [
    "araç galerisi yönetim sistemi",
    "ikinci el araç takip programı",
    "galeri yönetim yazılımı",
    "araç envanter programı",
    "müşteri takip sistemi",
    "otomobil galerisi yazılımı",
    "araç satış takibi",
    "galeri crm",
  ],
  authors: [{ name: "BenGaraj" }],
  creator: "BenGaraj",
  openGraph: {
    title: "BenGaraj – İkinci El Araç Galerisi Yönetim Sistemi",
    description:
      "Araç envanterinizi, müşterilerinizi ve satış sürecinizi tek platformdan yönetin. Tamamen ücretsiz.",
    url: "https://bengaraj.com",
    siteName: "BenGaraj",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BenGaraj – İkinci El Araç Galerisi Yönetim Sistemi",
    description:
      "Araç envanterinizi, müşterilerinizi ve satış sürecinizi kolayca yönetin. Tamamen ücretsiz.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bengaraj.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BenGaraj",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "İkinci el araç galerileri için araç envanteri, müşteri takibi ve satış süreci yönetim sistemi.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
  },
  inLanguage: "tr",
  url: "https://bengaraj.com",
  featureList: [
    "Araç Envanteri Yönetimi",
    "Müşteri Takibi",
    "Satış Pipeline",
    "Çoklu Workspace",
    "Fotoğraf Yönetimi",
    "İlan Entegrasyonu",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
