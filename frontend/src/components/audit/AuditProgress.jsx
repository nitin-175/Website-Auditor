import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

function AuditProgress({ url, device }) {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Preparing audit",
      description: "Preparing the website for analysis.",
    },
    {
      id: 2,
      title: "Analyzing performance",
      description: "Measuring loading and performance metrics.",
    },
    {
      id: 3,
      title: "Checking accessibility",
      description: "Checking accessibility best practices.",
    },
    {
      id: 4,
      title: "Analyzing SEO",
      description: "Checking search engine optimization factors.",
    },
    {
      id: 5,
      title: "Generating report",
      description: "Preparing your audit results.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((previous) => {
        if (previous >= steps.length) return previous;
        return previous + 1;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="rounded-2xl border border-[#e7e5df] bg-white p-5 shadow-sm sm:p-7">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2ff] text-[#4f46e5]">
          <LoaderCircle
            size={25}
            className="animate-spin"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#172033]">
          Auditing Your Website
        </h2>

        <p className="mx-auto mt-2 max-w-lg truncate text-sm text-[#6b7280]">
          {url}
        </p>

        <p className="mt-1 text-xs capitalize text-[#9ca3af]">
          {device} audit
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#e9e7df]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#19a999] transition-all duration-700"
            style={{
              width: `${Math.min(
                (currentStep / steps.length) * 100,
                100
              )}%`,
            }}
          />
        </div>

        <div className="space-y-4">
          {steps.map((step) => {
            const completed = currentStep > step.id;
            const active = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {completed ? (
                    <CheckCircle2
                      size={20}
                      className="text-[#19a999]"
                    />
                  ) : active ? (
                    <LoaderCircle
                      size={20}
                      className="animate-spin text-[#4f46e5]"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="text-[#d4d1c8]"
                    />
                  )}
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      completed || active
                        ? "text-[#172033]"
                        : "text-[#a3a19a]"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p
                    className={`mt-0.5 text-xs ${
                      active
                        ? "text-[#6b7280]"
                        : "text-[#aaa8a1]"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AuditProgress;