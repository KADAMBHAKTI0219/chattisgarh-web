import "./globals.css";
import Image from "next/image";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import { ParticipateModalProvider } from "@/context/ParticipateModalContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ParticipateModal from "@/components/shared/ParticipateModal";

export const metadata = {
  title: "State Creator & Influencer Awards 2026",
  description: "Official web portal for the State Creator & Influencer Awards 2026",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="stylesheet" href="/assets/fonts/inter.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F0] text-zinc-900 font-sans overflow-x-hidden w-full max-w-full">
        
        {/* WCAG Skip to Content Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#F87C22] text-white border-2 border-black px-4 py-2 font-bold z-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none"
        >
          Skip to content
        </a>

        <LanguageProvider>
          <ParticipateModalProvider>
            {/* Parallax Content Wrapper: sits on top of sticky footer with higher z-index and shadow */}
            <div className="relative lg:z-20 bg-[#FAF7F0] bg-tribal-watermark min-h-screen lg:shadow-[0_15px_30px_rgba(0,0,0,0.15)] pb-1 overflow-x-clip">
              {/* Subtle giant Chhattisgarh Map logo watermark (Direction B) */}
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none select-none opacity-[0.012] -z-10">
                <Image
                  src="/assets/images/logoChattisgarh.png"
                  alt="State Watermark Map"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <Navbar />
              <main id="main-content" className="flex-1">
                {children}
              </main>
            </div>

            {/* Parallax sticky reveal footer */}
            <Footer />

            {/* Global Participate modal */}
            <ParticipateModal />
          </ParticipateModalProvider>
        </LanguageProvider>

      </body>
    </html>
  );
}
