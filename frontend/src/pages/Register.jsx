import {
  ArrowUpRight,
  CheckCircle2,
  Gauge,
  LineChart,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

function Register() {
  return (
    <AuthLayout>
      <section className="flex flex-1 items-center bg-[#f6f4ed] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-16">
          {/* Visual panel */}
          <div className="hidden lg:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
              Start auditing
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#172033] xl:text-5xl">
              Better websites start
              <span className="block text-[#65645f]">
                with better insights.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#6a6963]">
              Create your AuditPro account and turn website problems
              into a clear, prioritized action plan.
            </p>

            <div className="mt-9 rounded-[26px] border border-[#dedbd1] bg-white p-5 shadow-[0_18px_50px_rgba(23,32,51,0.07)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#96948d]">
                    Audit overview
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-[#172033]">
                    example.com
                  </p>
                </div>

                <div className="rounded-full bg-[#eef0ff] px-3 py-1.5 text-xs font-bold text-[#4f46e5]">
                  92 / 100
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Performance", "94", Gauge, "bg-[#eef0ff]", "text-[#4f46e5]"],
                  ["Accessibility", "91", CheckCircle2, "bg-[#eef9f6]", "text-[#168f82]"],
                  ["Best Practices", "93", ShieldCheck, "bg-[#fff3f0]", "text-[#e86b5d]"],
                  ["SEO", "90", LineChart, "bg-[#fff8e8]", "text-[#b27a0b]"],
                ].map(([label, score, Icon, background, text]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#e5e2d9] bg-[#fbfaf5] p-4"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${background} ${text}`}>
                      <Icon size={16} />
                    </div>

                    <p className="mt-3 text-[10px] font-semibold text-[#96948d]">
                      {label}
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-[#172033]">
                      {score}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e8e6df]">
                <div className="h-full w-[92%] rounded-full bg-[#19a999]" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#6a6963]">
              <span className="h-2 w-2 rounded-full bg-[#19a999]" />
              Mobile + Desktop audits
              <ArrowUpRight size={13} className="text-[#4f46e5]" />
            </div>
          </div>

          {/* Form */}
          <div className="w-full">
            <RegisterForm />
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}

export default Register;