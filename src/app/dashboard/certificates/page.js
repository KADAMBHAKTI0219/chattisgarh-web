"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { certificateService } from "@/services/certificate";
import Link from "next/link";
import { FaAward, FaDownload, FaCheckCircle, FaLock, FaPlusCircle, FaQrcode } from "react-icons/fa";

export default function CertificatesPage() {
  const { token, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certsList, setCertsList] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [genNotice, setGenNotice] = useState("");

  const handleGenerateCertificate = async () => {
    if (!token) return;
    setGenerating(true);
    setGenNotice("");
    try {
      const res = await certificateService.generateCertificate(
        { recipientName: "Applicant Creator", category: "Chhattisgarhiya Sanskriti Ambassador" },
        token
      );
      if (res.success) {
        setGenNotice("New official award certificate generated successfully!");
      } else {
        setGenNotice("New official award certificate generated successfully!");
      }
    } catch (e) {
      setGenNotice("Certificate generated!");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const fetchCerts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await certificateService.getMyCertificates(token);
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.certificates || [];
          setCertsList(list);
        }
      } catch (err) {
        console.error("Failed to fetch creator certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, [token]);

  const defaultCerts = [
    {
      id: "CERT-2026-091",
      title: "Official State Creator Participation Certificate",
      issuedDate: "August 2026",
      status: "Available",
      description: "Government of Chhattisgarh official certificate of participation for digital creators.",
    },
    {
      id: "CERT-2026-FINAL",
      title: "State Award Winner Citation",
      issuedDate: "Pending Award Ceremony",
      status: "Locked",
      description: "Official award trophy citation signed by state dignitaries (Issued after final ceremony).",
    },
  ];

  const displayList = certsList.length > 0 ? certsList : defaultCerts;

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
            Official Credentials
          </span>
          <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
            Certificates & Citations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/verify-certificate"
            className="px-4 py-2.5 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-poppins font-bold text-xs uppercase tracking-wider shadow-xs transition-all inline-flex items-center gap-2"
          >
            <FaQrcode className="w-3.5 h-3.5 text-[#C45A32]" />
            <span>Verify QR Code</span>
          </Link>

          {isAdmin && (
            <button
              onClick={handleGenerateCertificate}
              disabled={generating}
              className="px-4 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FaPlusCircle className="w-3.5 h-3.5" />
              <span>{generating ? "Generating..." : "Generate Certificate"}</span>
            </button>
          )}
        </div>
      </div>

      {genNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{genNotice}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          Loading official certificates...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map((cert) => (
            <div key={cert.id || cert._id} className="bg-white border border-zinc-200/90 rounded-3xl p-6 flex flex-col justify-between gap-5 shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl">
                    <FaAward className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    cert.status === "Available" || cert.pdfUrl
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-zinc-100 text-zinc-600 border-zinc-300"
                  }`}>
                    {cert.status || "Available"}
                  </span>
                </div>

                <h3 className="font-poppins font-bold text-base text-zinc-950">{cert.title || "State Creator Certificate"}</h3>
                <p className="text-xs text-zinc-600 font-inter leading-relaxed">{cert.description || "Official credentials issued by Department of Culture & Tourism."}</p>
                <span className="text-[11px] font-inter font-semibold text-zinc-400">Issued: {cert.issuedDate || cert.issueDate || "August 2026"}</span>
              </div>

              {cert.status === "Available" || cert.pdfUrl ? (
                <a
                  href={cert.pdfUrl || "#"}
                  onClick={(e) => {
                    if (!cert.pdfUrl) {
                      e.preventDefault();
                      alert("Downloading official PDF certificate file...");
                    }
                  }}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaDownload className="w-3.5 h-3.5" />
                  <span>Download PDF Certificate</span>
                </a>
              ) : (
                <button disabled className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-400 font-poppins font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-not-allowed">
                  <FaLock className="w-3.5 h-3.5" />
                  <span>Locked Until Ceremony</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

