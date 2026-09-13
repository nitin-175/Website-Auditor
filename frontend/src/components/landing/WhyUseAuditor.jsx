import { CheckCircle2, Zap } from "lucide-react";

function WhyUseAuditor() {
  const points = [
    "See important website issues in one place",
    "Understand performance through clear scores and metrics",
    "Identify accessibility and SEO opportunities",
    "Get practical recommendations from audit findings",
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        {/* Visual */}
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#ede9fe] via-transparent to-[#fce7f3] blur-xl" />

          <div className="relative overflow-hidden rounded-3xl border border-[#eeeafd] bg-[#faf9ff] p-6 shadow-xl shadow-[#7c3aed]/5">
            {/* Fake audit preview */}
            <div className="rounded-2xl border border-[#eeeafd] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    Website Audit
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#181827]">
                    example.com
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-sm font-bold text-emerald-600">
                  92
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Performance", "94"],
                  ["Accessibility", "91"],
                  ["Best Practices", "93"],
                  ["SEO", "90"],
                ].map(([label, score]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-[#faf9ff] p-3"
                  >
                    <p className="text-[10px] leading-4 text-gray-400">
                      {label}
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#181827]">
                      {score}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eeeafd]">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#db2777]" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f3e8ff] px-3 py-1.5 text-xs font-semibold text-[#7c3aed]">
            <Zap size={14} />
            Built for clear insights
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#181827] sm:text-4xl">
            Turn Website Problems Into Actionable Improvements
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
            Instead of searching through complex audit output, get
            important findings presented in a clear and structured way.
          </p>

          <div className="mt-7 space-y-4">
            {points.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3"
              >
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />

                <p className="text-sm leading-6 text-gray-600">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUseAuditor;