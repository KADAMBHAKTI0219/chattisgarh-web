// "use client";

// import { FaAward, FaHandshake, FaTv, FaCertificate } from "react-icons/fa";
// import { useLanguage } from "@/context/LanguageContext";
// import Heading from "@/components/common/Heading";

// export default function WhyParticipateSection() {
//   const { t } = useLanguage();

//   const benefits = [
//     {
//       title: "Gain Recognition",
//       desc: "Showcase your talent on the biggest state-level platform. Get noticed by leaders, media outlets, and millions of viewers.",
//       icon: FaAward,
//       color: "#F87C22",
//       gradient: "from-[#F87C22]/10 to-[#F87C22]/0",
//       hoverBg: "hover:bg-[#F87C22]/5"
//     },
//     {
//       title: "Build Your Network",
//       desc: "Connect with top creators, digital marketing brands, startup founders, and experts. Unlock collaborations and agency partnerships.",
//       icon: FaHandshake,
//       color: "#4585F6",
//       gradient: "from-[#4585F6]/10 to-[#4585F6]/0",
//       hoverBg: "hover:bg-[#4585F6]/5"
//     },
//     {
//       title: "Media Coverage",
//       desc: "Get featured across premium digital news outlets, leading print publications, television features, and high-impact live broadcasts.",
//       icon: FaTv,
//       color: "#00A3A3",
//       gradient: "from-[#00A3A3]/10 to-[#00A3A3]/0",
//       hoverBg: "hover:bg-[#00A3A3]/5"
//     },
//     {
//       title: "Official Certificate",
//       desc: "Every nominated creator receives an official certificate of participation from the State Government, recognizing their digital impact.",
//       icon: FaCertificate,
//       color: "#D97706",
//       gradient: "from-[#D97706]/10 to-[#D97706]/0",
//       hoverBg: "hover:bg-[#D97706]/5"
//     }
//   ];

//   return (
//     <section
//       id="why-participate"
//       className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 overflow-visible"
//     >

//       {/* Centered Heading Component */}
//       <Heading
//         badge={t("Why Participate")}
//         title={t("WHY")}
//         highlightText={t("PARTICIPATE?")}
//         className="mb-14"
//       />

//       {/* Grid of 4 cards styled in a premium, modern rounded format */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible">
//         {benefits.map((benefit, idx) => {
//           const IconComponent = benefit.icon;

//           return (
//             <div
//               key={idx}
//               className="reveal-child relative border border-zinc-200 bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5 sm:gap-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left overflow-hidden group cursor-pointer"
//             >

//               {/* Backglow gradient overlay on hover */}
//               <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

//               {/* Large Colored Icon Badge */}
//               <div
//                 className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300"
//                 style={{ backgroundColor: `${benefit.color}15`, color: benefit.color }}
//               >
//                 <IconComponent className="w-8 h-8" />
//               </div>

//               {/* Title & Description */}
//               <div className="flex flex-col gap-2 relative z-10">
//                 <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight leading-none transition-colors" style={{ color: benefit.color }}>
//                   {t(benefit.title)}
//                 </h3>
//                 <p className="text-zinc-700 font-bold text-xs sm:text-sm leading-relaxed">
//                   {t(benefit.desc)}
//                 </p>
//               </div>

//             </div>
//           );
//         })}
//       </div>

//       {/* Tagline and bottom CTA */}
//       <div className="mt-16 sm:mt-20 flex flex-col items-center gap-6 text-center max-w-4xl mx-auto overflow-hidden">
//         <div className="h-[4px] w-full bg-gradient-to-r from-[#BE2079] to-[#E64C8A] rounded-full"></div>

//         <h4 className="font-display font-bold text-base sm:text-lg md:text-xl xl:text-2xl uppercase tracking-normal text-zinc-900 leading-snug px-4">
//           {t("CELEBRATE YOUR JOURNEY WITH THE BIGGEST CREATOR COMMUNITY OF THE STATE.")}
//         </h4>
//       </div>

//     </section>
//   );
// }
