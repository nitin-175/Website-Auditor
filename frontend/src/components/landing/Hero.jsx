import { ArrowRight, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

function Hero() {
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!url.trim()) {
      return;
    }

    console.log("Audit requested for:", url);
  };

  return (
    <section className="relative overflow-hidden bg-[#faf9ff]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#ddd6fe]/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#fbcfe8]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Small label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e9ddff] bg-white px-4 py-2 text-xs font-semibold text-[#7c3aed] shadow-sm">
            <Sparkles size={14} />

            <span>Website Performance & Accessibility Auditor</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#181827] sm:text-5xl lg:text-6xl">
            Audit Any Website
            <span className="block bg-gradient-to-r from-[#7c3aed] to-[#db2777] bg-clip-text text-transparent">
              in Seconds
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            Analyze website performance, accessibility, SEO and best
            practices with a detailed audit powered by Lighthouse.
          </p>

          {/* URL Audit Form */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-9 max-w-2xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e5def5] bg-white p-2 shadow-lg shadow-[#7c3aed]/5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Globe2
                  size={20}
                  className="shrink-0 text-[#8b5cf6]"
                />

                <input
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-[#181827] outline-none placeholder:text-gray-400"
                  aria-label="Website URL"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#db2777] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Audit Website
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Trust points */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck
                size={15}
                className="text-emerald-500"
              />
              Performance analysis
            </span>

            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck
                size={15}
                className="text-emerald-500"
              />
              Accessibility checks
            </span>

            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck
                size={15}
                className="text-emerald-500"
              />
              SEO insights
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;