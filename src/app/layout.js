import { Inter } from "next/font/google";
import "./globals.css";
import { WaitlistProvider } from "@/context/WaitlistContext";
import { SessionProvider } from "@/context/SessionContext";

// Base URL used for absolute Open Graph links. Defaults to the local dev server.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: 'Todojan — Master Your Day, One Task at a Time',
  description: "The all-in-one productivity workspace with smart scheduling, gamified progress, and focus tools. Join the waitlist for early access.",
  // Use absolute URL for the base (Crucial for OG base pathing)
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    apple: '/apple-icon.png',      // Reference high-res square .png
  },
  openGraph: {
    title: 'Todojan — Master Your Day, One Task at a Time',
    description: "The all-in-one productivity workspace with smart scheduling, gamified progress, and focus tools. Join the waitlist for early access.",
    url: SITE_URL,
    siteName: 'Todojan',
    images: [
      {
        url: '/opengraph-image.png', // pointing to public/opengraph-image.png
        width: 1200,
        height: 630,
        alt: 'Todojan Platform Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Todojan — Master Your Day, One Task at a Time',
    description: "The all-in-one productivity workspace with smart scheduling, gamified progress, and focus tools. Join the waitlist for early access.",
    images: ['/opengraph-image.png'], // pointing to public/opengraph-image.png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-light`}>
        <SessionProvider>
          <WaitlistProvider>
            {children}
          </WaitlistProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
