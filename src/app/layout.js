import "./globals.css";
import Image from "next/image";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import { ParticipateModalProvider } from "@/context/ParticipateModalContext";
import ParticipateModal from "@/components/shared/ParticipateModal";

export const metadata = {
  title: "Chhattisgarh Awards & Web",
  description: "Official web portal for Chhattisgarh Awards",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F0] text-zinc-900 font-sans">
        
        <ParticipateModalProvider>
          {/* Parallax Content Wrapper: sits on top of sticky footer with higher z-index and shadow */}
          <div className="relative lg:z-20 bg-[#FAF7F0] bg-tribal-watermark min-h-screen lg:shadow-[0_15px_30px_rgba(0,0,0,0.15)] pb-1 overflow-hidden">
            {/* Subtle giant Chhattisgarh Map logo watermark (Direction B) */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none select-none opacity-[0.012] -z-10">
              <Image
                src="/assets/images/logoChattisgarh.png"
                alt="Chhattisgarh Watermark Map"
                fill
                priority
                className="object-contain"
              />
            </div>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>

          {/* Parallax sticky reveal footer */}
          <Footer />

          {/* Global Participate modal */}
          <ParticipateModal />
        </ParticipateModalProvider>

      </body>
    </html>
  );
}
