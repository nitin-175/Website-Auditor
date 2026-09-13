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

    // Temporary UI flow.
    navigate("/login");
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
          <span className="text-lg">🔒</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#181827]">
          Reset Password
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Create a new password for your AuditPro account.
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
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            fullWidth
            size="large"
          >
            Reset Password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
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

export default ResetPasswordForm;