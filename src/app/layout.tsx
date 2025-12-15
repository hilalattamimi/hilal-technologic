import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hilaltechnologic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hilal Technologic - IT Solutions & Software Development Indonesia",
    template: "%s | Hilal Technologic",
  },
  description: "Hilal Technologic adalah perusahaan IT Solutions terkemuka di Indonesia. Kami menyediakan jasa pembuatan website, aplikasi mobile, software custom, UI/UX design, dan konsultasi IT untuk membantu bisnis Anda berkembang di era digital.",
  keywords: [
    "IT Solutions Indonesia",
    "Software Development Indonesia", 
    "Jasa Pembuatan Website",
    "Jasa Pembuatan Aplikasi Mobile",
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Custom Software",
    "IT Consulting",
    "Digital Transformation",
    "Hilal Technologic",
    "Perusahaan IT Indonesia",
  ],
  authors: [{ name: "Hilal Technologic", url: siteUrl }],
  creator: "Hilal Technologic",
  publisher: "Hilal Technologic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "id-ID": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Hilal Technologic",
    title: "Hilal Technologic - IT Solutions & Software Development Indonesia",
    description: "Transforming ideas into digital reality. Jasa pembuatan website, aplikasi mobile, dan software custom terbaik di Indonesia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hilal Technologic - IT Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hilal Technologic - IT Solutions & Software Development",
    description: "Transforming ideas into digital reality. Jasa IT Solutions terbaik di Indonesia.",
    images: ["/og-image.png"],
    creator: "@hilaltechnologic",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Organization Schema for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hilal Technologic",
  "url": "https://hilaltechnologic.com",
  "logo": "https://hilaltechnologic.com/logo.png",
  "description": "Perusahaan IT Solutions terkemuka di Indonesia yang menyediakan jasa pembuatan website, aplikasi mobile, dan software custom.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ID",
    "addressLocality": "Indonesia"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Indonesian", "English"]
  },
  "sameAs": [
    "https://www.facebook.com/hilaltechnologic",
    "https://www.instagram.com/hilaltechnologic",
    "https://www.linkedin.com/company/hilaltechnologic",
    "https://twitter.com/hilaltechnologic"
  ]
};

// Website Schema for SEO
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Hilal Technologic",
  "url": "https://hilaltechnologic.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://hilaltechnologic.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
