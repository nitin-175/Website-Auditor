import { CheckCircle2, Zap } from "lucide-react";

function WhyUseAuditor() {
  const points = [
    "See important website issues in one place",
    "Understand performance through clear scores and metrics",
    "Identify accessibility and SEO opportunities",
    "Get practical recommendations from audit findings",
  ];

  return (
    <section className="border-t border-[#dedbd1] bg-white py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[#dedbd1] bg-[#fbfaf5] p-5 shadow-[0_14px_40px_rgba(23,32,51,0.06)]">
          <div className="rounded-2xl border border-[#dedbd1] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#96948d]">
                  Website audit
                </p>

                <p className="mt-1 text-sm font-extrabold text-[#172033]">
                  example.com
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf8f5] text-sm font-extrabold text-[#168f82]">
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
                  className="rounded-xl bg-[#f7f6f0] p-3"
                >
                  <p className="text-[10px] leading-4 text-[#96948d]">
                    {label}
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-[#172033]">
                    {score}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8e6df]">
              <div className="h-full w-[92%] rounded-full bg-[#19a999]" />
            </div>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef0ff] px-3 py-1.5 text-xs font-bold text-[#4f46e5]">
            <Zap size={14} />
            Built for clear insights
          </div>

          <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-[-0.03em] text-[#172033] sm:text-4xl">
            Turn website problems into actionable improvements.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6a6963] sm:text-base">
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
                  className="mt-0.5 shrink-0 text-[#19a999]"
                />

                <p className="text-sm leading-6 text-[#4f4e49]">
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