import {
  ArrowUpRight,
  Gauge,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout>
      <section className="flex flex-1 items-center bg-[#f6f4ed] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-16">
          {/* Visual panel */}
          <div className="hidden lg:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
              Welcome back
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#172033] xl:text-5xl">
              Build a healthier web.
              <span className="block text-[#65645f]">
                One clear audit at a time.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#6a6963]">
              A calmer way to understand what your website needs
              next, with clear scores and practical recommendations.
            </p>

            <div className="mt-9 rounded-[26px] border border-[#dedbd1] bg-white p-5 shadow-[0_18px_50px_rgba(23,32,51,0.07)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#96948d]">
                    Latest audit
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-[#172033]">
                    example.com
                  </p>
                </div>

                <span className="rounded-full bg-[#eaf8f5] px-3 py-1.5 text-xs font-bold text-[#168f82]">
                  Healthy
                </span>
              </div>

              <div className="mt-6 grid grid-cols-[150px_1fr] items-center gap-6">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-[#e8e6df]">
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-[#19a999] border-r-[#19a999] rotate-[-25deg]" />

                  <div className="text-center">
                    <p className="text-4xl font-extrabold tracking-tight text-[#172033]">
                      84
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#96948d]">
                      Overall
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Performance", "88", "bg-[#4f46e5]"],
                    ["Accessibility", "93", "bg-[#19a999]"],
                    ["SEO", "96", "bg-[#4f46e5]"],
                    ["Best practices", "79", "bg-[#d89b16]"],
                  ].map(([label, score, bar]) => (
                    <div key={label}>
                      <div className="mb-1.5 flex justify-between">
                        <span className="text-[11px] font-semibold text-[#6a6963]">
                          {label}
                        </span>
                        <span className="text-xs font-extrabold text-[#172033]">
                          {score}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-[#e9e7df]">
                        <div
                          className={`h-full rounded-full ${bar}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#f7f9ff] p-3">
                  <Gauge size={16} className="text-[#4f46e5]" />
                  <p className="mt-2 text-[10px] font-bold text-[#77756e]">
                    Speed
                  </p>
                </div>

                <div className="rounded-xl bg-[#eef9f6] p-3">
                  <ShieldCheck size={16} className="text-[#168f82]" />
                  <p className="mt-2 text-[10px] font-bold text-[#77756e]">
                    Security
                  </p>
                </div>

                <div className="rounded-xl bg-[#fff3f0] p-3">
                  <SearchCheck size={16} className="text-[#e86b5d]" />
                  <p className="mt-2 text-[10px] font-bold text-[#77756e]">
                    SEO
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#6a6963]">
              <span className="h-2 w-2 rounded-full bg-[#19a999]" />
              Real Lighthouse-powered insights
              <ArrowUpRight size={13} className="text-[#4f46e5]" />
            </div>
          </div>

          {/* Form */}
          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}

export default Login;