import "./globals.css";
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
          <div className="relative z-20 bg-[#FAF7F0] min-h-screen shadow-[0_15px_30px_rgba(0,0,0,0.15)] pb-1">
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
