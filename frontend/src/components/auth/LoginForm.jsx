import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import ROUTES from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(formData);

      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error?.response?.data?.message ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px]">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef0ff] text-[#4f46e5]">
          <LockKeyhole size={21} strokeWidth={1.8} />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f46e5]">
          Welcome back
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#172033] sm:text-4xl">
          Sign in to AuditPro.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#6a6963] sm:text-base">
          Build a healthier web. A calmer way to understand what
          your site needs next.
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
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#4f46e5] transition hover:text-[#3730a3]"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="large"
            disabled={loading}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={16} />}
            </span>
          </Button>
        </form>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e3e0d7]" />

          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9b9991]">
            Secure access
          </span>

          <div className="h-px flex-1 bg-[#e3e0d7]" />
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[#e0eee9] bg-[#f3faf8] p-3.5">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-[#168f82]"
          />

          <p className="text-xs leading-5 text-[#5f706c]">
            Your account is protected with secure authentication.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#6a6963]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#4f46e5] transition hover:text-[#3730a3]"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;