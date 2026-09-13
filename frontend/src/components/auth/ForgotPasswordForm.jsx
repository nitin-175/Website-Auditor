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
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
          <span className="text-lg">?</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#181827]">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Enter your email and we'll send you a link to reset
          your password.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[#eeeafd] bg-white p-6 shadow-lg shadow-[#7c3aed]/5 sm:p-8">
        {error && (
          <ErrorMessage
            message={error}
            className="mb-5"
          />
        )}

        {submitted ? (
          <div className="rounded-xl bg-emerald-50 p-4 text-center">
            <p className="text-sm font-semibold text-emerald-700">
              Check your email
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-600">
              If an account exists for this email, you'll receive
              password reset instructions.
            </p>
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
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;