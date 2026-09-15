import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setSubmitted(true);

    console.log("Password reset requested for:", email);
  };

  return (
    <div className="w-full max-w-[460px]">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef0ff] text-[#4f46e5]">
          <Mail size={21} strokeWidth={1.8} />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
          Account recovery
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#172033] sm:text-4xl">
          Forgot your password?
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#6a6963] sm:text-base">
          Enter your email and we'll send you a link to reset
          your password.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#dedbd1] bg-white p-6 shadow-[0_14px_40px_rgba(23,32,51,0.06)] sm:p-8">
        {error && (
          <ErrorMessage
            message={error}
            className="mb-5"
          />
        )}

        {submitted ? (
          <div className="rounded-2xl border border-[#d9eee9] bg-[#f1faf8] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e0f5f0] text-[#168f82]">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-[#172033]">
                  Check your email
                </p>

                <p className="mt-1 text-xs leading-5 text-[#5f706c]">
                  If an account exists for this email, you'll receive
                  password reset instructions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="large"
            >
              <span className="inline-flex items-center justify-center gap-2">
                Send Reset Link
                <ArrowRight size={16} />
              </span>
            </Button>
          </form>
        )}

        <div className="mt-7 border-t border-[#e6e3da] pt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#4f46e5] transition hover:text-[#3730a3]"
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;