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
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#7c3aed] to-[#db2777] text-white shadow-md">
          <span className="text-lg font-bold">A</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#181827]">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue to your AuditPro account.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[#eeeafd] bg-white p-6 shadow-lg shadow-[#7c3aed]/5 sm:p-8">
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
                className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
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
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#eeeafd]" />

          <span className="text-xs text-gray-400">
            OR
          </span>

          <div className="h-px flex-1 bg-[#eeeafd]" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;