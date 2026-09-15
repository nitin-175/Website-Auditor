import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";

function ResetPasswordForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete both password fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Password reset form:", formData);

    navigate("/login");
  };

  return (
    <div className="w-full max-w-[460px]">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#e86b5d]">
          <KeyRound size={21} strokeWidth={1.8} />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
          Account security
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#172033] sm:text-4xl">
          Reset your password.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#6a6963] sm:text-base">
          Create a new password for your AuditPro account.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#dedbd1] bg-white p-6 shadow-[0_14px_40px_rgba(23,32,51,0.06)] sm:p-8">
        {error && (
          <ErrorMessage
            message={error}
            className="mb-5"
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="flex items-start gap-2.5 rounded-xl bg-[#f7f6f0] p-3.5">
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-[#19a999]"
            />

            <p className="text-xs leading-5 text-[#77756e]">
              Make sure both password fields match before continuing.
            </p>
          </div>

          <Button
            type="submit"
            fullWidth
            size="large"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Reset Password
              <ArrowRight size={16} />
            </span>
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6a6963]">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-bold text-[#4f46e5] transition hover:text-[#3730a3]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordForm;