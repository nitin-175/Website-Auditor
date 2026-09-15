import {
  ArrowUpRight,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

function ResetPassword() {
  return (
    <AuthLayout>
      <section className="flex flex-1 items-center bg-[#f6f4ed] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-16">
          {/* Visual panel */}
          <div className="hidden lg:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
              Account security
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#172033] xl:text-5xl">
              Keep your account
              <span className="block text-[#65645f]">
                secure and ready.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#6a6963]">
              Choose a strong password and get back to your
              AuditPro workspace with confidence.
            </p>

            <div className="mt-9 rounded-[26px] border border-[#dedbd1] bg-white p-5 shadow-[0_18px_50px_rgba(23,32,51,0.07)]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0ed] text-[#e86b5d]">
                  <KeyRound size={19} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[#172033]">
                    Password security
                  </p>
                  <p className="mt-1 text-xs text-[#77756e]">
                    A strong password helps protect your audit data.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#fbfaf5] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6a6963]">
                    Password strength
                  </span>

                  <span className="text-xs font-extrabold text-[#168f82]">
                    Strong
                  </span>
                </div>

                <div className="mt-3 flex gap-1.5">
                  <span className="h-1.5 flex-1 rounded-full bg-[#19a999]" />
                  <span className="h-1.5 flex-1 rounded-full bg-[#19a999]" />
                  <span className="h-1.5 flex-1 rounded-full bg-[#19a999]" />
                  <span className="h-1.5 flex-1 rounded-full bg-[#19a999]" />
                  <span className="h-1.5 flex-1 rounded-full bg-[#e8e6df]" />
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  "Use at least 8 characters",
                  "Use a mix of letters and numbers",
                  "Avoid easily guessed passwords",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5"
                  >
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-[#19a999]"
                    />

                    <span className="text-xs text-[#6a6963]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#6a6963]">
              <ShieldCheck size={14} className="text-[#19a999]" />
              Protected account access
              <ArrowUpRight size={13} className="text-[#4f46e5]" />
            </div>
          </div>

          {/* Form */}
          <div className="w-full">
            <ResetPasswordForm />
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}

export default ResetPassword;