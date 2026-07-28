"use client";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Aarav Sahu",
      role: "Raipur Tech Creator",
      quote: "The Chhattisgarh Creator Awards is a massive milestone for us. It gives local regional creators a national platform to showcase our rich culture, tech, and innovations.",
      bg: "bg-white text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Bastar Travel Vlogger",
      quote: "Nominating my channel for these awards was incredibly seamless! Highlighting the beauty of Chitrakote Waterfalls and Bastar's heritage has finally found the recognition it deserves.",
      bg: "bg-[#F3819F] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Devendra Dewangan",
      role: "Folk Art & Music Creator",
      quote: "This is a proud moment for our state's traditional artists. Bringing Chhattisgarhi folk music, dances, and art to the digital screen is now celebrated by the government itself!",
      bg: "bg-[#F8D053] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Karan Verma",
      role: "Bilaspur Food Critic",
      quote: "Local food creators are finally getting the spotlight. The support from the state administration shows their commitment to building a thriving digital economy in Chhattisgarh.",
      bg: "bg-[#6EC192] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Neha Patel",
      role: "Fashion & Handloom Influencer",
      quote: "Promoting our traditional Kosa silk and local weavers on social media has been my passion. This platform motivates emerging creators like me to keep designing and telling stories.",
      bg: "bg-[#4585F6] text-white",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Amit Mandavi",
      role: "Educational Content Creator",
      quote: "Educating youth in our regional languages through short videos has been a journey. This initiative validates our effort to make digital literacy accessible to every village in Chhattisgarh.",
      bg: "bg-[#c3b6f2] text-zinc-950",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <section 
      id="testimonials" 
      className="w-screen left-1/2 -translate-x-1/2 bg-[#FAF7F0] text-zinc-950 py-8 md:py-16 lg:py-20 flex flex-col items-center gap-8 md:gap-10 scroll-mt-24 select-none relative border-y-4 border-black overflow-hidden z-10 my-6 md:my-10"
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
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#BE2079]">
          The Community
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black uppercase text-zinc-950 leading-tight">
          What Creators <span className="text-[#F87C22]">Are Saying</span>
        </h2>
        <div className="h-1.5 w-32 bg-[#BE2079] rounded-none mt-1"></div>
        <p className="text-zinc-600 font-semibold text-sm xl:text-base mt-3">
          Hover over any card to pause the scrolling marquee and read their stories.
        </p>
      </div>

      {/* 2. AUTOMATIC INFINITE SCROLLING MARQUEE */}
      <div className="w-full relative overflow-hidden py-4 mt-2">
        {/* Double-render list for seamless infinite loop */}
        <div className="animate-marquee-testimonials gap-6">
          {[...testimonials, ...testimonials].map((test, idx) => (
            <div
              key={`${test.id}-${idx}`}
              className="w-[260px] h-[340px] sm:w-[310px] sm:h-[370px] xl:w-[350px] xl:h-[410px] 2xl:w-[390px] 2xl:h-[450px] shrink-0 p-6 sm:p-8 xl:p-10 flex flex-col justify-between rounded-none border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] text-left hover:scale-[1.01] hover:-translate-y-1 transition-all duration-200 bg-white"
            >
              {/* Quote */}
              <p className="font-sans font-semibold text-sm sm:text-base xl:text-lg 2xl:text-xl leading-relaxed text-zinc-900">
                &ldquo;{test.quote}&rdquo;
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 mt-4 border-t border-zinc-200/40 pt-4">
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="w-10 h-10 xl:w-12 xl:h-12 rounded-none border border-black object-cover" 
                />
                <div className="flex flex-col">
                  <span className="font-sans font-black text-sm xl:text-base text-zinc-950">{test.name}</span>
                  <span className="font-sans font-bold text-xs xl:text-sm opacity-60 text-zinc-500">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
