"use client";

import { useState } from "react";

export default function TestimonialsSection() {
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Joseph Fletcher",
      role: "Design Leader",
      quote: "UX India opened with a resounding quote of 'The future belongs to India'... India is showing the way for UX globally, and UX India captures that better than any other conference.",
      bg: "bg-white text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Saraswathi Viswanathan",
      role: "Attendee",
      quote: "UXINDIA2025 delivered the perfect spark — deep insights, real stories and future-ready design thinking workshops. Energizing, insightful and unforgettable.",
      bg: "bg-[#c3b6f2] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Srinivasu",
      role: "Accessibility Advocate",
      quote: "Great to see UX India has grown over the years with meaningful conversations. One of the very few mainstream conferences that has included accessibility with real prominence.",
      bg: "bg-[#F8D053] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Ronak Jogeshwar",
      role: "Educator",
      quote: "UX India is where educators and practitioners come together to shape the future of design education. The conversations here inspire new ways of teaching and learning design.",
      bg: "bg-[#6EC192] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Bryce Johnson",
      role: "Principal Inclusive Designer",
      quote: "Inclusive design isn't just a feature — it's a mindset. UX India understands this deeply, and the community here is truly committed to designing for everyone.",
      bg: "bg-[#4585F6] text-white",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Neha Saraswat",
      role: "Product Designer",
      quote: "As a product designer, this event gave me the tools and perspectives to think bigger. The workshops and talks are incredibly inspiring, and immediately applicable.",
      bg: "bg-[#F3819F] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <section 
      id="testimonials" 
      className="w-screen left-1/2 -translate-x-1/2 bg-zinc-950 text-white py-8 md:py-20 lg:py-28 flex flex-col items-center gap-10 scroll-mt-24 select-none relative border-y-4 border-black overflow-hidden z-10 my-6 md:my-10"
    >
      {/* Inline styles for CSS keyframe animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-testimonials {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-testimonials {
          display: flex;
          width: max-content;
          animation: marquee-testimonials 30s linear infinite;
        }
        .animate-marquee-testimonials:hover {
          animation-play-state: paused;
        }
      ` }} />

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl xl:max-w-4xl px-6">
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#F87C22]">
          The Community
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif text-white font-normal leading-tight">
          From the people <span className="text-[#F87C22] italic font-medium">who were there.</span>
        </h2>
        <p className="text-zinc-500 font-semibold text-sm xl:text-base mt-1 transition-all">
          {isMarqueeActive 
            ? "Hover to pause • Click a card to stack them back." 
            : "Click the deck to reveal all cards."}
        </p>
      </div>

      {/* Conditional Rendering: Stacked Deck vs Horizontal Marquee */}
      {!isMarqueeActive ? (
        
        /* 1. STACKED DECK STATE */
        <div 
          onClick={() => setIsMarqueeActive(true)}
          className="relative w-[300px] h-[380px] sm:w-[340px] sm:h-[420px] xl:w-[380px] xl:h-[460px] 2xl:w-[420px] 2xl:h-[500px] cursor-pointer mt-6 flex items-center justify-center group"
        >
          {testimonials.map((test, idx) => {
            let rotation = "rotate-[0deg]";
            let translate = "translate-x-0 translate-y-0";
            let zIndex = "z-0";

            if (idx === 0) { // Top card
              rotation = "rotate-[-1deg]";
              zIndex = "z-50";
            } else if (idx === 1) {
              rotation = "rotate-[4deg]";
              translate = "translate-x-[6px] translate-y-[-2px]";
              zIndex = "z-40";
            } else if (idx === 2) {
              rotation = "rotate-[-2deg]";
              translate = "translate-x-[-4px] translate-y-[2px]";
              zIndex = "z-30";
            } else if (idx === 3) {
              rotation = "rotate-[3deg]";
              translate = "translate-x-[4px] translate-y-[-6px]";
              zIndex = "z-20";
            } else if (idx === 4) {
              rotation = "rotate-[-4deg]";
              translate = "translate-x-[-8px] translate-y-[4px]";
              zIndex = "z-10";
            } else { // Bottom card
              rotation = "rotate-[6deg]";
              translate = "translate-x-3 translate-y-3";
              zIndex = "z-0";
            }

            return (
              <div
                key={test.id}
                className={`absolute inset-0 w-full h-full p-6 sm:p-8 xl:p-10 flex flex-col justify-between rounded-3xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.15)] text-left transition-all duration-300 origin-center ${test.bg} ${rotation} ${translate} ${zIndex} group-hover:scale-[1.02]`}
              >
                {/* Quote */}
                <p className="font-sans font-semibold text-sm sm:text-base xl:text-lg 2xl:text-xl leading-relaxed line-clamp-6">
                  &ldquo;{test.quote}&rdquo;
                </p>
                
                {/* Author Info */}
                <div className="flex items-center gap-3 mt-4 border-t border-zinc-200/50 pt-4">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border border-black object-cover" 
                  />
                  <div className="flex flex-col">
                    <span className="font-sans font-black text-sm xl:text-base">{test.name}</span>
                    <span className="font-sans font-bold text-xs xl:text-sm text-zinc-500">{test.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      ) : (

        /* 2. INFINITE SCROLLING MARQUEE STATE */
        <div 
          onClick={() => setIsMarqueeActive(false)}
          className="w-full relative overflow-hidden py-4 cursor-pointer mt-4"
        >
          {/* Double-render list for seamless infinite loop */}
          <div className="animate-marquee-testimonials gap-6">
            {[...testimonials, ...testimonials].map((test, idx) => (
              <div
                key={`${test.id}-${idx}`}
                className={`w-[260px] h-[340px] sm:w-[310px] sm:h-[370px] xl:w-[350px] xl:h-[410px] 2xl:w-[390px] 2xl:h-[450px] shrink-0 p-6 sm:p-8 xl:p-10 flex flex-col justify-between rounded-3xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] text-left hover:scale-[1.01] hover:-translate-y-1 transition-all duration-200 ${test.bg}`}
              >
                {/* Quote */}
                <p className="font-sans font-semibold text-sm sm:text-base xl:text-lg 2xl:text-xl leading-relaxed">
                  &ldquo;{test.quote}&rdquo;
                </p>
                
                {/* Author Info */}
                <div className="flex items-center gap-3 mt-4 border-t border-zinc-200/40 pt-4">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border border-black object-cover" 
                  />
                  <div className="flex flex-col">
                    <span className="font-sans font-black text-sm xl:text-base">{test.name}</span>
                    <span className="font-sans font-bold text-xs xl:text-sm opacity-60">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      )}

    </section>
  );
}
