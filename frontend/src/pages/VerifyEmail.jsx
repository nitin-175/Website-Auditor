import { useEffect, useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { Link, useSearchParams } from "react-router-dom";
import authService from "../services/authService";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] =
    useState(token ? "verifying" : "idle");
  const [email, setEmail] = useState(
    () => sessionStorage.getItem("verificationEmail") || ""
  );
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    authService.verifyEmail(token)
      .then(() => setVerificationStatus("success"))
      .catch(() => setVerificationStatus("invalid"));
  }, [token]);

  const handleResend = async () => {
    if (!email.trim()) {
      setMessage("Enter the email used to register first.");
      return;
    }

    setIsSending(true);
    setMessage("");

    try {
      await authService.resendVerification(email);
      setMessage("A new verification email has been sent.");
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          "Unable to resend the verification email."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AuthLayout>
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-md rounded-2xl border border-[#eeeafd] bg-white p-6 shadow-lg shadow-[#7c3aed]/5 sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e8ff] text-2xl">
            ✉️
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#181827]">
              {verificationStatus === "success"
                ? "Email Verified"
                : verificationStatus === "invalid"
                  ? "Verification Failed"
                  : "Verify Your Email"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {verificationStatus === "verifying"
                ? "Verifying your email address..."
                : verificationStatus === "success"
                  ? "Your email has been verified. You can now sign in."
                  : verificationStatus === "invalid"
                    ? "This verification link is invalid or has expired."
                    : "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."}
            </p>
          </div>

          {verificationStatus !== "success" && (
            <>
              {!token && (
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email used to register"
                  className="mt-6 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7c3aed]"
                />
              )}

              <button
                type="button"
                onClick={handleResend}
                disabled={isSending || verificationStatus === "verifying"}
                className="mt-7 w-full rounded-lg bg-linear-to-r from-[#7c3aed] to-[#db2777] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {isSending ? "Sending..." : "Resend Verification Email"}
              </button>
            </>
          )}

          {message && (
            <p className="mt-3 text-center text-sm text-gray-500">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            {verificationStatus === "success"
              ? "Continue to "
              : "Already verified? "}
            <Link
              to="/login"
              className="font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}

export default VerifyEmail;