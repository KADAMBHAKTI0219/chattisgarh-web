"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import ParticipateModal from "@/components/shared/ParticipateModal";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"].some(path => pathname?.startsWith(path));

  if (isDashboard || isAuth) {
    return (
      <main id="main-content" className="min-h-screen bg-[#F8F6F0] w-full">
        {children}
      </main>
    );
  }

  return (
    <>
      {/* Parallax Content Wrapper */}
      <div className="relative lg:z-20 bg-[#FAF7F0] bg-tribal-watermark min-h-screen lg:shadow-[0_15px_30px_rgba(0,0,0,0.15)] pb-1 w-full max-w-[100vw] overflow-x-hidden">
        {/* Subtle giant Chhattisgarh Map logo watermark */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none select-none opacity-[0.012] -z-10">
          <Image
            src="/assets/images/logoChattisgarh.png"
            alt="State Watermark Map"
            fill
            priority
            loading="eager"
            sizes="800px"
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
    </>
  );
}
