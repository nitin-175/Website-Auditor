import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";
import userService from "../../services/userService";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setSaving(true);

      await userService.changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (requestError) {
      const status = requestError?.response?.status;

      if (status === 401) {
        setError("Current password is incorrect.");
      } else {
        setError(
          requestError?.response?.data?.message ||
            requestError?.response?.data ||
            "Unable to change your password."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#dedbd1] bg-white shadow-sm">
      <div className="border-b border-[#dedbd1] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5]">
            <KeyRound size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#172033]">
              Change Password
            </h2>

            <p className="mt-1 text-xs text-[#8a8881]">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <Input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Enter current password"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-[#f3c7c1] bg-[#fff3f1] p-3 text-xs font-medium text-[#c94f43]">
            {error}
          </div>
        )}

        {message && (
          <div className="flex items-start gap-2 rounded-xl bg-[#edf9f7] p-3 text-xs text-[#137d73]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="border-t border-[#dedbd1] pt-5">
          <Button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ChangePassword;