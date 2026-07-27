"use client";

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="w-full bg-[#070b19] border-t-4 border-[#6EC192] text-white sticky bottom-0 z-10">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 pt-12 pb-8 md:pt-16 xl:pt-20 xl:pb-12">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Column 1: Logo & Text */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/images/logo.jpeg" 
                alt="Digital Chhattisgarh Logo" 
                className="w-14 h-14 xl:w-16 xl:h-16 rounded-full border-2 border-[#6EC192] bg-white p-0.5 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-display font-black tracking-wide uppercase text-sm xl:text-base">
                Digital Chhattisgarh
              </span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm xl:text-base leading-relaxed max-w-sm">
              Content owned, updated and maintained by the Creator Awards Cell. This platform belongs to Digital Chhattisgarh, Government of Chhattisgarh. Designed, developed and hosted by the State Informatics Centre.
            </p>
          </div>

          {/* Column 2: Sections */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#6EC192]">
              Sections
            </h4>
            <ul className="flex flex-col gap-2.5 text-zinc-400 font-semibold text-sm xl:text-base">
              <li>
                <a href="#home" className="hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors duration-200">
                  Categories
                </a>
              </li>
              <li>
                <a href="#awards" className="hover:text-white transition-colors duration-200">
                  Awards
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Pages */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#6EC192]">
              Pages
            </h4>
            <ul className="flex flex-col gap-2.5 text-zinc-400 font-semibold text-sm xl:text-base">
              <li>
                <a href="#guidelines" className="hover:text-white transition-colors duration-200">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors duration-200">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors duration-200">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us & Download Apps */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#6EC192]">
              Follow Us
            </h4>
            
            {/* Social Icons row */}
            <div className="flex gap-2.5">
              {[
                { name: "x", path: "M2.0485 2h3.298l5.2447 7.0272L15.9181 2h2.034l-6.8515 7.966 8.0469 11.034h-3.328l-5.7437-7.6341L4.394 21H2.36l7.391-8.593L2.0485 2zm3.89 1.513l8.6083 11.839h1.498L7.4363 3.513H5.9385z" },
                { name: "fb", path: "M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1h-3A4.5 4.5 0 0 0 9 5.5V8z" },
                { name: "yt", path: "M19.61 5.01a2.5 2.5 0 0 0-1.76-1.78C16.29 2.8 10 2.8 10 2.8s-6.29 0-7.85.43A2.5 2.5 0 0 0 .39 5.01C0 6.6 0 10 0 10s0 3.4.39 4.99a2.5 2.5 0 0 0 1.76 1.78C3.71 17.2 10 17.2 10 17.2s6.29 0 7.85-.43a2.5 2.5 0 0 0 1.76-1.78C20 13.4 20 10 20 10s0-3.4-.39-4.99zM8 13.5V6.5L14 10L8 13.5z" },
                { name: "ig", path: "M10 2c2.4 0 2.7 0 3.7.1 2.3.1 3.5 1.3 3.6 3.6.1 1 .1 1.3.1 3.7s0 2.7-.1 3.7c-.1 2.3-1.3 3.5-3.6 3.6-1 .1-1.3.1-3.7.1s-2.7 0-3.7-.1c-2.3-.1-3.5-1.3-3.6-3.6C2.1 12.7 2 12.4 2 10s0-2.7.1-3.7c.1-2.3 1.3-3.5 3.6-3.6 1-.1 1.3-.1 3.7-.1m0-2C7.5 0 7.2 0 6.3.1 3.6.2 1.8 2 1.7 4.7c-.1.9-.1 1.2-.1 3.6s0 2.7.1 3.6c.1 2.7 2 4.5 4.7 4.6.9.1 1.2.1 3.6.1s2.7 0 3.6-.1c2.7-.1 4.5-2 4.6-4.7.1-.9.1-1.2.1-3.6s0-2.7-.1-3.6c-.1-2.7-2-4.5-4.7-4.6C12.8 0 12.5 0 10 0z M10 4.9A5.1 5.1 0 1 0 15.1 10 5.1 5.1 0 0 0 10 4.9zm0 8.2A3.1 3.1 0 1 1 13.1 10 3.1 3.1 0 0 1 10 13.1z M15.3 3.5a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z" },
                { name: "in", path: "M19 0H1C.4 0 0 .4 0 1v18c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1zM6 17H3V8h3v9zM4.5 6.5C3.7 6.5 3 5.8 3 5s.7-1.5 1.5-1.5S6 4.2 6 5s-.8 1.5-1.5 1.5zM17 17h-3v-5.5c0-1.3-.5-1.8-1.5-1.8-1.1 0-1.5.8-1.5 1.8V17H8V8h3v1.2c.4-.7 1.3-1.4 2.5-1.4 2.1 0 3.5 1.4 3.5 4.3V17z" }
              ].map((soc, i) => (
                <a 
                  key={i}
                  href={`#${soc.name}`} 
                  className="bg-zinc-800 hover:bg-[#6EC192] text-white hover:text-zinc-950 flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 rounded-full transition-all duration-200 shadow-sm"
                  aria-label={`Follow on ${soc.name}`}
                >
                  <svg className="w-4 h-4 xl:w-4.5 xl:h-4.5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d={soc.path} />
                  </svg>
                </a>
              ))}
            </div>

            {/* QR Code and App Download Badges */}
            <div className="flex items-center gap-4 mt-2">
              
              {/* White styled QR Code box */}
              <div className="bg-white p-1.5 rounded-xl w-20 h-20 xl:w-24 xl:h-24 shadow-md flex items-center justify-center shrink-0 border border-zinc-800 select-none">
                <svg className="w-16 h-16 xl:w-20 xl:h-20 text-zinc-950" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="30" height="30" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="13" width="14" height="14" fill="currentColor" />
                  
                  <rect x="65" y="5" width="30" height="30" stroke="currentColor" strokeWidth="6" />
                  <rect x="73" y="13" width="14" height="14" fill="currentColor" />
                  
                  <rect x="5" y="65" width="30" height="30" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="73" width="14" height="14" fill="currentColor" />
                  
                  {/* Decorative QR-like details */}
                  <rect x="45" y="5" width="8" height="20" fill="currentColor" />
                  <rect x="57" y="15" width="4" height="12" fill="currentColor" />
                  <rect x="45" y="35" width="15" height="8" fill="currentColor" />
                  
                  <rect x="80" y="45" width="15" height="10" fill="currentColor" />
                  <rect x="68" y="50" width="8" height="6" fill="currentColor" />
                  
                  <rect x="45" y="65" width="8" height="15" fill="currentColor" />
                  <rect x="57" y="75" width="15" height="8" fill="currentColor" />
                  <rect x="75" y="65" width="10" height="8" fill="currentColor" />
                  
                  <rect x="80" y="80" width="15" height="15" fill="currentColor" />
                  
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                </svg>
              </div>

              {/* Badges Container */}
              <div className="flex flex-col gap-2">
                
                {/* App Store */}
                <a 
                  href="#appstore" 
                  className="bg-black hover:bg-zinc-900 border border-zinc-800 rounded-lg py-1 px-2.5 flex items-center gap-2 w-32 h-[34px] xl:w-36 xl:h-[38px] transition-colors select-none"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.34-6.16-3.43-2.84-7.3-7.53-11.61-14.07-8.12-12.28-14.15-26.6-18.09-42.98-3.95-16.37-3.21-30.82 2.21-43.34 5.37-12.44 14.24-18.86 26.6-19.26 5.11 0 10.45 1.54 16.03 4.62 5.58 3.08 9.57 4.62 11.96 4.62 2.11 0 6.07-1.54 11.88-4.62 5.81-3.08 11.32-4.5 16.54-4.25 10.02.51 18.07 4.12 24.16 10.87-14.07 8.52-20.9 20.08-20.5 34.69.4 11.51 4.7 20.99 12.92 28.42 8.22 7.43 17.75 11.25 28.58 11.45.69.19 1.45.29 2.27.29 5.88 0 11.39-1.63 16.54-4.9m-24.63-108.9c0-9.82 3.49-18.59 10.47-26.31 7.21-8 15.93-12.18 26.15-12.54 1.01 10.36-2.58 19.34-10.77 26.96-7.85 7.62-16.71 11.53-25.85 11.89z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-tight leading-none">Download on the</span>
                    <span className="text-[10px] xl:text-[11px] text-white font-black leading-none">App Store</span>
                  </div>
                </a>
 
                {/* Google Play */}
                <a 
                  href="#playstore" 
                  className="bg-black hover:bg-zinc-900 border border-zinc-800 rounded-lg py-1 px-2.5 flex items-center gap-2 w-32 h-[34px] xl:w-36 xl:h-[38px] transition-colors select-none"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.28 7.29L1.92.35A1 1 0 0 0 .5 1.2v13.6a1 1 0 0 0 1.42.85l12.36-6.94a1 1 0 0 0 0-1.42zm-12.28 6V2.71L11.27 8z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-tight leading-none">GET IT ON</span>
                    <span className="text-[10px] xl:text-[11px] text-white font-black leading-none">Google Play</span>
                  </div>
                </a>
 
              </div>
 
            </div>
 
          </div>
 
        </div>
 
        {/* Bottom Section: Copyright & Scroll to Top */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-4 text-zinc-500 text-xs sm:text-sm xl:text-base font-semibold select-none gap-4">
          <p className="text-center md:text-left leading-relaxed">
            Copyright &copy; Digital Chhattisgarh 2026 &middot; Creator Awards Portal
          </p>
          
          {/* Scroll to Top Circle Button */}
          <button 
            onClick={handleScrollTop}
            className="w-10 h-10 xl:w-11 xl:h-11 bg-[#6EC192] hover:bg-[#5bb081] text-zinc-950 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer shadow-lg group shrink-0"
            aria-label="Scroll to top"
          >
            <svg 
              className="w-5 h-5 stroke-current stroke-[2.5]" 
              fill="none" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
 
      </div>
    </footer>
  );
}
