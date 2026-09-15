import {
  ArrowRight,
  Check,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

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
    <section className="overflow-hidden bg-[#f6f4ed]">
      <div className="mx-auto grid min-h-[620px] w-full max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9d5c9] bg-[#fdfcf8] px-3.5 py-2 text-xs font-bold text-[#4f46e5]">
            <Sparkles size={14} />
            Website performance auditor
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-[#172033] sm:text-6xl lg:text-[68px]">
            Audit your
            <span className="block">website.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#65645f] sm:text-lg">
            Know what is hurting speed, accessibility and search.
            Get clear priorities, plain-English explanations, and
            a report you can act on.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-9 max-w-2xl"
          >
            <div className="flex flex-col gap-2 rounded-2xl border border-[#d8d5ca] bg-white p-2 shadow-[0_8px_30px_rgba(23,32,51,0.06)] sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Globe2
                  size={19}
                  className="shrink-0 text-[#6a6963]"
                />

                <input
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-[#172033] outline-none placeholder:text-[#a3a199]"
                  aria-label="Website URL"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4338ca]"
              >
                Run audit
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#6a6963]">
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-[#19a999]" />
              Real Lighthouse data
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-[#19a999]" />
              Mobile + Desktop
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-[#19a999]" />
              No guesswork
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[470px]">
          <div className="rounded-[28px] border border-[#d8d5ca] bg-white p-6 shadow-[0_16px_50px_rgba(23,32,51,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a8881]">
                  Site health
                </p>
                <p className="mt-1 text-sm font-bold text-[#172033]">
                  example.com
                </p>
              </div>

              <span className="rounded-full bg-[#e9f8f5] px-3 py-1.5 text-xs font-bold text-[#168f82]">
                Healthy
              </span>
            </div>

            <div className="mt-7 flex items-center gap-8">
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-[14px] border-[#e8e6df]">
                <div className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-t-[#19a999] border-r-[#19a999] rotate-[-25deg]" />

                <div className="text-center">
                  <p className="text-4xl font-extrabold tracking-tight text-[#172033]">
                    84
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#8a8881]">
                    Overall score
                  </p>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                {[
                  ["Performance", "88", "#4f46e5"],
                  ["Accessibility", "93", "#19a999"],
                  ["SEO", "96", "#4f46e5"],
                  ["Best practices", "79", "#d89b16"],
                ].map(([label, score, accent]) => (
                  <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold text-[#65645f]">
                        {label}
                      </span>

                      <span className="text-xs font-extrabold text-[#172033]">
                        {score}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e9e7df]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${score}%`,
                          backgroundColor: accent,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#e2dfd6] bg-[#f7f9ff] p-4">
                <p className="text-xs font-bold text-[#4f46e5]">
                  Speed
                </p>
                <p className="mt-1 text-[11px] text-[#77756e]">
                  Find bottlenecks
                </p>
              </div>

              <div className="rounded-xl border border-[#e2dfd6] bg-[#fff3f0] p-4">
                <p className="text-xs font-bold text-[#e86b5d]">
                  A11y
                </p>
                <p className="mt-1 text-[11px] text-[#77756e]">
                  Catch barriers
                </p>
              </div>

              <div className="rounded-xl border border-[#e2dfd6] bg-[#f7f9ff] p-4">
                <p className="text-xs font-bold text-[#4f46e5]">
                  SEO
                </p>
                <p className="mt-1 text-[11px] text-[#77756e]">
                  Improve discovery
                </p>
              </div>

              <div className="rounded-xl border border-[#e2dfd6] bg-[#eef9f6] p-4">
                <p className="text-xs font-bold text-[#168f82]">
                  Best practices
                </p>
                <p className="mt-1 text-[11px] text-[#77756e]">
                  Reduce technical risk
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-[#d8d5ca] bg-[#fff3f0] px-4 py-3 shadow-lg sm:block">
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-[#e86b5d]" />
              <span className="text-xs font-bold text-[#172033]">
                Clear priorities
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;