"use client";

export default function TermsSection() {
  const sections = [
    {
      id: "eligibility",
      title: "1. Eligibility Criteria",
      items: [
        { label: "Age Requirement", text: "Participants must be 18 years of age or above at the time of nomination." },
        { label: "Nationality and Residency", text: "24 categories are open exclusively to individuals of Indian nationality. One category is dedicated to international digital creators." },
        { label: "Platforms", text: "Content must be published on one or more of the following digital platforms: Instagram, YouTube, Twitter, LinkedIn, Facebook, ShareChat, Koo, Roposo, or Moj." },
        { label: "Language", text: "Content submission can be in English or any other Indian language." },
        { label: "Nomination Limits", text: "Creators can self-nominate in a maximum of three categories. Those nominating others can nominate in all 25 categories." }
      ]
    },
    {
      id: "nomination",
      title: "2. Nomination Process",
      items: [
        { label: "Self-Nomination", text: "Creators are allowed to nominate themselves. The nomination must include links to the content on the eligible platforms, a brief description of the content's impact, and any other supporting reasons as required by the nomination form." },
        { label: "Nomination Limits", text: "Creators can self-nominate in a maximum of three categories. Those nominating others can propose nominations across all 25 categories." },
        { label: "Submission Deadline", text: "All nominations must be submitted by the deadline specified in the schedule. Late submissions will not be considered." },
        { label: "Follower Count Consideration", text: "The number of followers or subscribers will be considered as of 31st July 2026." }
      ]
    },
    {
      id: "evaluation",
      title: "3. Evaluation and Selection Process",
      items: [
        { label: "Criteria", text: "Nominations will be evaluated based on creativity, impact, reach, innovation, sustainability, and alignment with the goals of the Award." },
        { label: "Jury Review", text: "A panel of domain experts from government, academia, media, and civil society will review final nominations. The Jury's decision will be final and binding." },
        { label: "Selection", text: "Winners for each category will be decided based on a combination of the Jury's evaluation and public votes." }
      ]
    },
    {
      id: "categories",
      title: "4. Award Categories and Prizes",
      items: [
        { label: "Awards Scope", text: "Awards will be presented across 25 distinct categories. In 24 of these categories, a single winner will be selected for each. However, the International Creator Award category would have three winners." }
      ]
    },
    {
      id: "compliance",
      title: "5. Code of Conduct and Compliance",
      items: [
        { label: "Conduct Standards", text: "All participants are expected to maintain the highest standards of professionalism, integrity, and ethical conduct throughout the nomination and evaluation process." },
        { label: "Content Compliance", text: "Content must comply with applicable laws, community guidelines, and must not infringe upon the intellectual property of third parties. Non-compliance will lead to immediate disqualification." },
        { label: "Final Decision", text: "The decisions of the Jury regarding eligibility, evaluation, and selection of winners shall be final, binding, and conclusive." }
      ]
    }
  ];

  return (
    <section id="terms" className="border-2 border-black bg-white p-6 sm:p-10 md:p-12 xl:p-16 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col gap-8 scroll-mt-24 my-8 md:my-16 lg:my-20 xl:my-28">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-black uppercase tracking-tight">
          Terms & Conditions
        </h2>
        <div className="h-2 w-32 xl:w-44 bg-[#4585F6] rounded-none"></div>
      </div>

      {/* Grid of Sections */}
      <div className="flex flex-col gap-8 text-left">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-4">
            
            {/* Section Header */}
            <h3 className="font-display font-black text-xl md:text-2xl xl:text-3xl uppercase text-zinc-950 tracking-wide border-b-2 border-black pb-2">
              {section.title}
            </h3>

            {/* Bullets List */}
            <ul className="flex flex-col gap-3 pl-4 md:pl-6 list-none">
              {section.items.map((item, idx) => (
                <li key={idx} className="relative text-sm sm:text-base xl:text-lg 2xl:text-xl text-zinc-700 font-medium leading-relaxed pl-6 xl:pl-8">
                  
                  {/* Custom Neo-Brutalist bullet square */}
                  <span className="absolute left-0 top-[7px] xl:top-[10px] w-2.5 h-2.5 xl:w-3 xl:h-3 bg-[#F3819F] border border-black rounded-sm shadow-[1px_1px_0px_rgba(0,0,0,1)]"></span>
                  
                  <strong className="text-zinc-950 font-extrabold uppercase text-xs sm:text-sm xl:text-base tracking-wide mr-1">
                    {item.label}:
                  </strong>{" "}
                  {item.text}
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

    </section>
  );
}
