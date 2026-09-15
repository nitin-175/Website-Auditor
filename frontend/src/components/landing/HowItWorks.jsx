import { FileSearch, Globe2, LineChart } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Globe2,
      title: "Enter a URL",
      description:
        "Enter the website you want to analyze.",
    },
    {
      number: "02",
      icon: FileSearch,
      title: "Run the audit",
      description:
        "The audit engine analyzes your site across the key quality categories.",
    },
    {
      number: "03",
      icon: LineChart,
      title: "Understand the results",
      description:
        "Review scores, Core Web Vitals, issues and recommendations in one report.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-[#f6f4ed] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[#172033] sm:text-4xl">
            From URL to useful insights.
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#6a6963] sm:text-base">
            A simple workflow that turns a website into a prioritized
            action plan.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative border-t-2 border-[#d8d5ca] pt-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold tracking-[0.16em] text-[#a09e96]">
                    {step.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172033] text-white">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-extrabold text-[#172033]">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#6a6963]">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;