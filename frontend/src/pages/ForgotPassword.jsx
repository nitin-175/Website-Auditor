import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <AuthLayout>
      <section className="flex flex-1 items-center bg-[#f6f4ed] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-16">
          {/* Visual panel */}
          <div className="hidden lg:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
              Account recovery
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#172033] xl:text-5xl">
              Get back to
              <span className="block text-[#65645f]">
                your website insights.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#6a6963]">
              Reset your password securely and continue reviewing
              your website performance and audit history.
            </p>

            <div className="mt-9 rounded-[26px] border border-[#dedbd1] bg-white p-5 shadow-[0_18px_50px_rgba(23,32,51,0.07)]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5]">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[#172033]">
                    Secure password recovery
                  </p>
                  <p className="mt-1 text-xs text-[#77756e]">
                    We'll send instructions to your email.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Enter the email linked to your account",
                  "Check your inbox for reset instructions",
                  "Create a new secure password",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-[#fbfaf5] p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf8f5] text-xs font-extrabold text-[#168f82]">
                      {index + 1}
                    </span>

                    <span className="text-xs font-semibold text-[#6a6963]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#6a6963]">
              <ShieldCheck size={14} className="text-[#19a999]" />
              Your account remains protected
              <ArrowUpRight size={13} className="text-[#4f46e5]" />
            </div>
          </div>

          {/* Form */}
          <div className="w-full">
            <ForgotPasswordForm />
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}

export default ForgotPassword;