"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import ParticipateModal from "@/components/shared/ParticipateModal";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"].some((path) =>
    pathname?.startsWith(path)
  );

  const hideHeaderFooter = mounted && (isDashboard || isAuth);

  if (hideHeaderFooter) {
    return (
      <div id="main-content-wrapper" className="min-h-screen bg-[#F8F6F0] w-full">
        <main id="main-content" className="min-h-screen w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div id="main-content-wrapper" className="min-h-screen bg-[#FAF7F0] bg-tribal-watermark flex flex-col w-full max-w-[100vw] [overflow-x:clip] relative">
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
      {!hideHeaderFooter && <Navbar />}
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      {!hideHeaderFooter && (
        <>
          <Footer />
          <ParticipateModal />
        </>
      )}
    </div>
  );
}

