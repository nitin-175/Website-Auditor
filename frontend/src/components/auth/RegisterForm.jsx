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
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#7c3aed] to-[#db2777] text-white shadow-md">
          <span className="text-lg font-bold">A</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#181827]">
          Create Your Account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Start auditing websites with AuditPro.
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

          <p className="text-xs leading-5 text-gray-400">
            By creating an account, you agree to our Terms and
            Privacy Policy.
          </p>

          <Button
            type="submit"
            fullWidth
            size="large"
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;