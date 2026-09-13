import { ArrowRight, FileSearch, Globe2, LineChart } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Globe2,
      title: "Enter a URL",
      description:
        "Enter the website you want to analyze in the audit field.",
    },
    {
      number: "02",
      icon: FileSearch,
      title: "Run the Audit",
      description:
        "Our audit engine analyzes the website across multiple quality categories.",
    },
    {
      number: "03",
      icon: LineChart,
      title: "Understand the Results",
      description:
        "Review scores, Core Web Vitals, issues and recommendations in one report.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-[#faf9ff] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b5cf6]">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#181827] sm:text-4xl">
            From URL to Insights
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
            Get useful website insights through a simple audit workflow.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative text-center"
              >
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+60px)] right-[calc(-50%+60px)] top-8 hidden h-px bg-[#ddd6fe] md:block" />
                )}

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#db2777] text-white shadow-lg shadow-[#7c3aed]/15">
                  <Icon size={25} />
                </div>

                <p className="mt-5 text-xs font-bold tracking-widest text-[#a78bfa]">
                  {step.number}
                </p>

                <h3 className="mt-2 text-lg font-bold text-[#181827]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;