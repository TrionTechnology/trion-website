import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trion Creation Sdn Bhd - Custom Software Development Malaysia",
    template: "%s | Trion Creation Sdn Bhd",
  },
  description: "Leading software development company in Malaysia specializing in custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services.",
  keywords: [
    "software development Malaysia",
    "custom software company",
    "Odoo ERP Malaysia",
    "Flutter app development",
    "AI chatbot Malaysia",
    "IoT integration",
    "cloud devops Malaysia",
  ],
  authors: [{ name: "Trion Creation Sdn Bhd" }],
  creator: "Trion Creation Sdn Bhd",
  publisher: "Trion Creation Sdn Bhd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: "/",
    title: "Trion Creation Sdn Bhd - Custom Software Development Malaysia",
    description: "Leading software development company in Malaysia specializing in custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services.",
    siteName: "Trion Creation Sdn Bhd",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trion Creation Sdn Bhd - Custom Software Development Malaysia",
    description: "Leading software development company in Malaysia specializing in custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}