import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MSPAINTIFY — AI Image Generator for Crypto Tokens",
    template: "%s | MSPAINTIFY"
  },
  description: "Transform your crypto token images into hilarious MS Paint-style masterpieces using AI. Generate unique, meme-worthy token art instantly. Community-driven token with Telegram, Discord, and Twitter integration.",
  keywords: [
    "crypto token",
    "AI image generator",
    "MS Paint art",
    "meme generator",
    "token art",
    "crypto memes",
    "blockchain art",
    "NFT generator",
    "funny images",
    "crypto community"
  ],
  authors: [{ name: "MSPAINTIFY Team" }],
  creator: "MSPAINTIFY",
  publisher: "MSPAINTIFY",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'MSPAINTIFY — AI Image Generator for Crypto Tokens',
    description: 'Transform your crypto token images into hilarious MS Paint-style masterpieces using AI. Generate unique, meme-worthy token art instantly.',
    siteName: 'MSPAINTIFY',
    images: [
      {
        url: '/brush.png',
        width: 1200,
        height: 630,
        alt: 'MSPAINTIFY - AI MS Paint Image Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSPAINTIFY — AI Image Generator for Crypto Tokens',
    description: 'Transform your crypto token images into hilarious MS Paint-style masterpieces using AI.',
    images: ['/brush.png'],
    creator: '@mspaintify',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/brush.png" sizes="any" />
        <link rel="icon" href="/brush.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "MSPAINTIFY",
              "description": "AI-powered image generator that transforms crypto token images into hilarious MS Paint-style art",
              "url": process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              "applicationCategory": "Utility",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "MSPAINTIFY Team"
              },
              "featureList": [
                "AI Image Generation",
                "MS Paint Style Transformation",
                "Crypto Token Art",
                "Community Features",
                "Instant Download"
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
