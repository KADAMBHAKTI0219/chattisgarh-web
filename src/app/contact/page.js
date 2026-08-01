"use client";

import { useState } from "react";
import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaQuestionCircle,
  FaChevronDown,
  FaArrowLeft,
  FaHeadset
} from "react-icons/fa";

export default function ContactPage() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "Nomination Support",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        inquiryType: "Nomination Support",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  const faqs = [
    {
      q: "Is there any registration fee to participate in the Chhattisgarh Creator Awards?",
      a: "No. Participation is 100% free for all creators, influencers, and digital artists. No application or nomination fee is charged."
    },
    {
      q: "How can I check if my nomination has been successfully submitted?",
      a: "Upon completing the online nomination process, an instant registration ID is displayed and sent to your registered email & phone."
    },
    {
      q: "Can non-resident / NRI creators apply for the awards?",
      a: "Yes! International and non-resident creators who produce content celebrating Chhattisgarh's culture, heritage, or tourism are eligible under the NRI Creator tab."
    },
    {
      q: "Can I apply for more than one category?",
      a: "Yes, an individual creator or channel can submit entries across up to 3 relevant categories."
    },
    {
      q: "Who evaluates the entries?",
      a: "All submitted content is reviewed by an official jury panel comprising industry experts, digital leaders, and state cultural dignitaries."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-12 relative overflow-x-hidden animate-page-enter">

      {/* 1. Top Breadcrumb */}
      <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-[var(--primary)] font-inter font-bold text-xs sm:text-sm transition-colors group"
        >
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <span>Participate Now</span>
        </button>
      </div>

      {/* 2. Hero Heading */}
      <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("OFFICIAL CONTACT & HELPLINE")}
          title={t("WE'RE HERE TO")}
          highlightText={t("HELP YOU")}
          description={t("Have questions about nominations, categories, evaluation criteria, or event details? Reach out to our official state support team.")}
        />
      </div>

      {/* 3. Official Contact Info Cards (3 Columns) */}
      <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Helpline Phone */}
          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#C45A32]/10 text-[#C45A32] flex items-center justify-center font-bold text-xl shrink-0">
              <FaPhoneAlt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-400">
                Official Helpline
              </span>
              <h3 className="text-lg font-poppins font-bold text-zinc-950 mt-1">
                Toll-Free & Support
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Monday to Saturday (9:00 AM - 6:00 PM IST)
              </p>
            </div>
            <div className="flex flex-col gap-1 mt-2 text-sm font-inter font-bold text-[#C45A32]">
              <a href="tel:+917712234567" className="hover:underline">+91 (0771) 2234567</a>
              <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
            </div>
          </div>

          {/* Card 2: Email Support */}
          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 shadow-sm hover:shadow-md hover:border-[var(--secondary)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#21593D]/10 text-[#21593D] flex items-center justify-center font-bold text-xl shrink-0">
              <FaEnvelope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-400">
                Email Desk
              </span>
              <h3 className="text-lg font-poppins font-bold text-zinc-950 mt-1">
                Direct Inquiry Mail
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                We respond within 24 working hours.
              </p>
            </div>
            <div className="flex flex-col gap-1 mt-2 text-sm font-inter font-bold text-[#21593D]">
              <a href="mailto:support@chhattisgarhcreators.gov.in" className="hover:underline">
                support@chhattisgarhcreators.gov.in
              </a>
              <a href="mailto:info@cgawards.in" className="hover:underline">
                info@cgawards.in
              </a>
            </div>
          </div>

          {/* Card 3: Secretariat Headquarters */}
          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 shadow-sm hover:shadow-md hover:border-[#D4A534] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A534]/15 text-[#D4A534] flex items-center justify-center font-bold text-xl shrink-0">
              <FaMapMarkerAlt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-400">
                State Headquarters
              </span>
              <h3 className="text-lg font-poppins font-bold text-zinc-950 mt-1">
                Secretariat Directorate
              </h3>
              <p className="text-xs text-zinc-600 font-medium mt-2 leading-relaxed">
                Department of Culture & Information Technology, Mahanadi Bhawan, Mantralaya, Nawa Raipur, Atal Nagar, Chhattisgarh - 492002
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Main Section: Contact Form + Quick Guidance Sidebar */}
      <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm text-left">
            <div className="mb-6">
              <span className="text-xs font-inter font-extrabold uppercase tracking-widest text-[var(--primary)]">
                Online Inquiry Form
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Send Us A Message
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">
                Fill out the form below and our official coordinator will connect with you.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md">
                  <FaCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-zinc-900">
                  Message Sent Successfully!
                </h3>
                <p className="font-inter text-xs sm:text-sm text-zinc-600 max-w-md leading-relaxed">
                  Thank you for reaching out. Your inquiry has been logged in our support desk. A representative will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-inter font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full legal name"
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.fullName ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    />
                    {errors.fullName && (
                      <span className="text-red-500 text-[10px] font-bold">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.email ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-[10px] font-bold">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Mobile Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.phone ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-[10px] font-bold">{errors.phone}</span>
                    )}
                  </div>

                  {/* Inquiry Type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Inquiry Category
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Nomination Support">Nomination Support</option>
                      <option value="Award Category Inquiry">Award Category Inquiry</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Sponsorship & Partnership">Sponsorship & Partnership</option>
                      <option value="Media & Press">Media & Press</option>
                      <option value="Other Query">Other Query</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your question"
                    className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.subject ? "border-red-500 bg-red-50/20" : ""
                      }`}
                  />
                  {errors.subject && (
                    <span className="text-red-500 text-[10px] font-bold">{errors.subject}</span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                    Detailed Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your inquiry in detail..."
                    className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none ${errors.message ? "border-red-500 bg-red-50/20" : ""
                      }`}
                  />
                  {errors.message && (
                    <span className="text-red-500 text-[10px] font-bold">{errors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto self-start px-8 py-3.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2.5 disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <FaPaperPlane className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Right Column: FAQ Accordion & Quick Links (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">

            {/* Quick Helpline Callout Card */}
            <div className="bg-gradient-to-br from-[#2E5C31] to-[#1b3827] text-white rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-md relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white pointer-events-none">
                <FaHeadset className="w-44 h-44" />
              </div>
              <span className="text-[10px] font-inter font-bold uppercase tracking-widest text-amber-300">
                Instant Assistance
              </span>
              <h3 className="text-xl sm:text-2xl font-poppins font-extrabold text-white uppercase tracking-tight">
                Need Fast Guidance?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                If you encounter any difficulty while submitting your creator nomination, our official helpline is available to guide you step-by-step.
              </p>
              <button
                onClick={openModal}
                className="self-start px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer mt-2"
              >
                Open Nomination Form
              </button>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-zinc-950 font-poppins font-bold text-base sm:text-lg uppercase tracking-tight">
                <FaQuestionCircle className="w-4 h-4 text-[var(--primary)]" />
                <span>Frequently Asked Questions</span>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="border border-zinc-200/80 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 font-poppins font-bold text-xs sm:text-sm text-zinc-900 bg-zinc-50/50 hover:bg-zinc-100/80 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <FaChevronDown
                          className={`w-3 h-3 text-zinc-500 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--primary)]" : ""
                            }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 py-3 text-xs sm:text-sm text-zinc-600 font-inter leading-relaxed bg-white border-t border-zinc-200/60 animate-in fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
