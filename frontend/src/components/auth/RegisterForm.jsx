import {
  ArrowRight,
  CheckCircle2,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import authService from "../../services/authService";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      sessionStorage.setItem(
        "verificationEmail",
        formData.email
      );

      navigate("/verify-email");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-[460px]">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#e86b5d]">
          <UserRound size={21} strokeWidth={1.8} />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
          Get started
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#172033] sm:text-4xl">
          Create your account.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#6a6963] sm:text-base">
          Start auditing websites with clear scores,
          useful findings and practical recommendations.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#dedbd1] bg-white p-6 shadow-[0_14px_40px_rgba(23,32,51,0.06)] sm:p-8">
        {error && (
          <ErrorMessage
            message={error}
            className="mb-5"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
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
              Use at least 8 characters for your password.
            </p>
          </div>

          <p className="text-xs leading-5 text-[#96948d]">
            By creating an account, you agree to our Terms and
            Privacy Policy.
          </p>

          <Button
            type="submit"
            fullWidth
            size="large"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Create Account
              <ArrowRight size={16} />
            </span>
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6a6963]">
          Already have an account?{" "}
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

export default RegisterForm;