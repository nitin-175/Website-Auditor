import {
  CheckCircle2,
  LoaderCircle,
  MailCheck,
  XCircle,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import AuthLayout from "../../components/layout/AuthLayout";
import authService from "../../services/authService";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(
    token ? "verifying" : "invalid"
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  const content = {
    verifying: {
      icon: LoaderCircle,
      iconClass: "bg-[#eef0ff] text-[#4f46e5]",
      label: "Verification in progress",
      title: "Checking your email.",
      message:
        "We're verifying your email address. This should only take a moment.",
    },

    success: {
      icon: MailCheck,
      iconClass: "bg-[#eaf8f5] text-[#168f82]",
      label: "Email verified",
      title: "You're all set.",
      message:
        "Your email has been verified. You can now sign in to your AuditPro account.",
    },

    invalid: {
      icon: XCircle,
      iconClass: "bg-[#fff0ed] text-[#e86b5d]",
      label: "Verification failed",
      title: "This link isn't valid.",
      message:
        "This verification link is invalid or has expired. Please request a new verification email.",
    },
  }[status];

  const Icon = content.icon;

  return (
    <AuthLayout>
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-8">
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${content.iconClass}`}
            >
              <Icon
                size={21}
                strokeWidth={1.8}
                className={
                  status === "verifying"
                    ? "animate-spin"
                    : undefined
                }
              />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
              {content.label}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#172033] sm:text-4xl">
              {content.title}
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#6a6963] sm:text-base">
              {content.message}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#dedbd1] bg-white p-6 text-center shadow-[0_14px_40px_rgba(23,32,51,0.06)] sm:p-8">
            {status === "verifying" && (
              <div className="rounded-2xl border border-[#e0e2f5] bg-[#f7f8ff] p-5">
                <p className="text-sm font-bold text-[#172033]">
                  Please wait
                </p>

                <p className="mt-1 text-xs leading-5 text-[#77756e]">
                  Do not close this page while verification is in progress.
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="rounded-2xl border border-[#d9eee9] bg-[#f1faf8] p-5">
                <CheckCircle2
                  size={25}
                  className="mx-auto text-[#168f82]"
                />

                <p className="mt-3 text-sm font-extrabold text-[#172033]">
                  Email successfully verified
                </p>

                <p className="mt-1 text-xs leading-5 text-[#5f706c]">
                  Your AuditPro account is ready to use.
                </p>
              </div>
            )}

            {status === "invalid" && (
              <div className="rounded-2xl border border-[#f1ddd8] bg-[#fff7f5] p-5">
                <XCircle
                  size={25}
                  className="mx-auto text-[#e86b5d]"
                />

                <p className="mt-3 text-sm font-extrabold text-[#172033]">
                  Verification link unavailable
                </p>

                <p className="mt-1 text-xs leading-5 text-[#77756e]">
                  The link may have expired or already been used.
                </p>
              </div>
            )}

            {status !== "verifying" && (
              <Link
                to="/login"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#4f46e5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4338ca]"
              >
                Continue to sign in
              </Link>
            )}
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}

export default VerifyEmail;