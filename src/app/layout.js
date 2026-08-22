import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ParticipateModalProvider } from "@/context/ParticipateModalContext";
import { LanguageProvider } from "@/context/LanguageContext";
import LayoutWrapper from "@/layouts/LayoutWrapper";

export const metadata = {
  title: "State Creator & Influencer Awards 2026",
  description: "Official web portal for the State Creator & Influencer Awards 2026",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="stylesheet" href="/assets/fonts/inter.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F0] text-zinc-900 font-sans w-full max-w-full">
        
        {/* WCAG Skip to Content Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#F87C22] text-white border-2 border-black px-4 py-2 font-bold z-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none"
        >
          Skip to content
        </a>

        <AuthProvider>
          <LanguageProvider>
            <ParticipateModalProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ParticipateModalProvider>
          </LanguageProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
